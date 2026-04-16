import stripe
from django.conf import settings
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