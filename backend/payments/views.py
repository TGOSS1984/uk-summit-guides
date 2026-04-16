import stripe
from django.conf import settings
from django.http import HttpResponse
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from bookings.models import Booking
from .models import Payment
from .serializers import CreateCheckoutSessionSerializer

stripe.api_key = settings.STRIPE_SECRET_KEY


class CreateCheckoutSessionAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        if not settings.STRIPE_SECRET_KEY:
            return Response(
                {"detail": "Stripe secret key is not configured."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        serializer = CreateCheckoutSessionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        booking_id = serializer.validated_data["booking_id"]

        try:
            booking = Booking.objects.select_related(
                "scheduled_tour",
                "scheduled_tour__route",
            ).get(id=booking_id, user=request.user)
        except Booking.DoesNotExist:
            return Response(
                {"detail": "Booking not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        if booking.status == Booking.Status.CANCELLED:
            return Response(
                {"detail": "Cancelled bookings cannot be paid."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        payment, _ = Payment.objects.get_or_create(
            booking=booking,
            defaults={
                "amount": booking.total_price,
                "currency": "GBP",
                "status": Payment.Status.PENDING,
            },
        )

        try:
            session = stripe.checkout.Session.create(
                mode="payment",
                client_reference_id=booking.booking_reference,
                metadata={
                    "booking_id": str(booking.id),
                    "booking_reference": booking.booking_reference,
                    "payment_id": str(payment.id),
                },
                line_items=[
                    {
                        "price_data": {
                            "currency": "gbp",
                            "product_data": {
                                "name": booking.scheduled_tour.route.name,
                                "description": (
                                    f"{booking.scheduled_tour.date} "
                                    f"{booking.scheduled_tour.start_time} · "
                                    f"Party size {booking.party_size}"
                                ),
                            },
                            "unit_amount": int(booking.total_price * 100),
                        },
                        "quantity": 1,
                    }
                ],
                success_url=(
                    f"{settings.FRONTEND_BASE_URL}/payment-success"
                    "?session_id={CHECKOUT_SESSION_ID}"
                ),
                cancel_url=f"{settings.FRONTEND_BASE_URL}/payment-cancelled",
            )
        except stripe.error.StripeError as exc:
            return Response(
                {"detail": f"Stripe error: {str(exc)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        except Exception as exc:
            return Response(
                {"detail": f"Unexpected payment error: {str(exc)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        payment.stripe_checkout_session_id = session.id
        payment.save(update_fields=["stripe_checkout_session_id"])

        return Response(
            {
                "checkout_url": session.url,
                "session_id": session.id,
                "booking_reference": booking.booking_reference,
            },
            status=status.HTTP_200_OK,
        )


class CheckoutSessionDetailAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, session_id):
        if not settings.STRIPE_SECRET_KEY:
            return Response(
                {"detail": "Stripe secret key is not configured."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        try:
            payment = Payment.objects.select_related(
                "booking",
                "booking__user",
                "booking__scheduled_tour",
                "booking__scheduled_tour__route",
                "booking__scheduled_tour__route__region",
            ).get(
                stripe_checkout_session_id=session_id,
                booking__user=request.user,
            )
        except Payment.DoesNotExist:
            return Response(
                {"detail": "Checkout session not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        try:
            session = stripe.checkout.Session.retrieve(session_id)
        except stripe.error.StripeError as exc:
            return Response(
                {"detail": f"Stripe error: {str(exc)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        return Response(
            {
                "session_id": session.id,
                "payment_status": session.payment_status,
                "booking_reference": payment.booking.booking_reference,
                "amount_total": session.amount_total,
                "currency": session.currency,
                "route_name": payment.booking.scheduled_tour.route.name,
                "route_region": payment.booking.scheduled_tour.route.region.name,
                "tour_date": payment.booking.scheduled_tour.date,
                "tour_time": payment.booking.scheduled_tour.start_time,
            },
            status=status.HTTP_200_OK,
        )


class StripeWebhookAPIView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        if not settings.STRIPE_WEBHOOK_SECRET:
            return Response(
                {"detail": "Stripe webhook secret is not configured."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        payload = request.body
        sig_header = request.META.get("HTTP_STRIPE_SIGNATURE", "")

        try:
            event = stripe.Webhook.construct_event(
                payload=payload,
                sig_header=sig_header,
                secret=settings.STRIPE_WEBHOOK_SECRET,
            )
        except ValueError:
            return HttpResponse(status=400)
        except stripe.error.SignatureVerificationError:
            return HttpResponse(status=400)

        if event["type"] == "checkout.session.completed":
            session = event["data"]["object"]
            session_id = session.get("id")

            try:
                payment = Payment.objects.select_related("booking").get(
                    stripe_checkout_session_id=session_id
                )
            except Payment.DoesNotExist:
                return HttpResponse(status=200)

            payment.status = Payment.Status.PAID
            payment.stripe_payment_intent_id = session.get("payment_intent", "") or ""
            if session.get("amount_total") is not None:
                payment.amount = session["amount_total"] / 100
            payment.save(
                update_fields=[
                    "status",
                    "stripe_payment_intent_id",
                    "amount",
                ]
            )

            booking = payment.booking
            if booking.status == Booking.Status.PENDING:
                booking.status = Booking.Status.CONFIRMED
                booking.save(update_fields=["status"])

        return HttpResponse(status=200)