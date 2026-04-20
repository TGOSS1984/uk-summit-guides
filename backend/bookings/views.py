import stripe
from django.conf import settings
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from payments.models import Payment
from .cancel_email_utils import (
    send_booking_cancelled_email,
    send_booking_cancelled_notification_email_to_admin,
)
from .email_utils import (
    send_booking_confirmation_email,
    send_booking_notification_email_to_admin,
)
from .models import Booking, ScheduledTour
from .serializers import (
    BookingAmendSerializer,
    BookingCreateSerializer,
    BookingDetailSerializer,
    ScheduledTourSerializer,
)

stripe.api_key = settings.STRIPE_SECRET_KEY


class ScheduledTourListAPIView(generics.ListAPIView):
    serializer_class = ScheduledTourSerializer

    def get_queryset(self):
        queryset = (
            ScheduledTour.objects.select_related("route", "route__region", "guide")
            .filter(status=ScheduledTour.Status.OPEN)
            .order_by("date", "start_time")
        )

        route_slug = self.request.query_params.get("route")
        season = self.request.query_params.get("season")
        date_value = self.request.query_params.get("date")

        if route_slug:
            queryset = queryset.filter(route__slug=route_slug)

        if season:
            queryset = queryset.filter(season=season)

        if date_value:
            queryset = queryset.filter(date=date_value)

        return queryset


class BookingCreateAPIView(generics.CreateAPIView):
    serializer_class = BookingCreateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(
            data=request.data,
            context={"request": request},
        )
        serializer.is_valid(raise_exception=True)
        booking = serializer.save()

        send_booking_confirmation_email(booking)
        send_booking_notification_email_to_admin(booking)

        output_serializer = BookingDetailSerializer(booking)
        headers = self.get_success_headers(output_serializer.data)
        return Response(
            output_serializer.data,
            status=status.HTTP_201_CREATED,
            headers=headers,
        )


class BookingListAPIView(generics.ListAPIView):
    serializer_class = BookingDetailSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        include_archived = (
            self.request.query_params.get("archived", "false").lower() == "true"
        )

        queryset = (
            Booking.objects.select_related(
                "scheduled_tour",
                "scheduled_tour__route",
                "scheduled_tour__route__region",
                "scheduled_tour__guide",
                "payment",
            )
            .filter(user=self.request.user)
            .order_by("-created_at")
        )

        if not include_archived:
            queryset = queryset.filter(archived_at__isnull=True)

        return queryset


class BookingAmendAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk):
        try:
            booking = Booking.objects.select_related(
                "scheduled_tour",
                "scheduled_tour__route",
                "scheduled_tour__route__region",
                "payment",
            ).get(pk=pk, user=request.user)
        except Booking.DoesNotExist:
            return Response(
                {"detail": "Booking not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = BookingAmendSerializer(
            booking,
            data=request.data,
            partial=True,
        )
        serializer.is_valid(raise_exception=True)
        booking = serializer.save()

        output_serializer = BookingDetailSerializer(booking)
        return Response(output_serializer.data, status=status.HTTP_200_OK)


class BookingCancelAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk):
        try:
            booking = Booking.objects.select_related(
                "scheduled_tour",
                "scheduled_tour__route",
                "scheduled_tour__route__region",
                "payment",
            ).get(pk=pk, user=request.user)
        except Booking.DoesNotExist:
            return Response(
                {"detail": "Booking not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        if booking.status == Booking.Status.CANCELLED:
            return Response(
                {"detail": "This booking has already been cancelled."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        payment = getattr(booking, "payment", None)

        if payment and payment.status == Payment.Status.PAID:
            if not settings.STRIPE_SECRET_KEY:
                return Response(
                    {"detail": "Stripe secret key is not configured."},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )

            if not payment.stripe_payment_intent_id:
                return Response(
                    {
                        "detail": (
                            "This paid booking cannot be refunded because no payment intent was stored."
                        )
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            try:
                refund = stripe.Refund.create(
                    payment_intent=payment.stripe_payment_intent_id,
                    metadata={
                        "booking_id": str(booking.id),
                        "booking_reference": booking.booking_reference,
                        "payment_id": str(payment.id),
                    },
                )
            except stripe.error.StripeError as exc:
                return Response(
                    {"detail": f"Stripe refund error: {str(exc)}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )

            payment.status = Payment.Status.REFUND_PENDING
            payment.stripe_refund_id = refund.id
            payment.save(update_fields=["status", "stripe_refund_id"])

        booking.status = Booking.Status.CANCELLED
        booking.save(update_fields=["status"])

        send_booking_cancelled_email(booking)
        send_booking_cancelled_notification_email_to_admin(booking)

        serializer = BookingDetailSerializer(booking)
        return Response(serializer.data, status=status.HTTP_200_OK)


class BookingArchiveAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk):
        try:
            booking = Booking.objects.get(pk=pk, user=request.user)
        except Booking.DoesNotExist:
            return Response(
                {"detail": "Booking not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        if booking.status != Booking.Status.CANCELLED:
            return Response(
                {"detail": "Only cancelled bookings can be archived."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if booking.archived_at is not None:
            return Response(
                {"detail": "This booking is already archived."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        booking.archive()
        serializer = BookingDetailSerializer(booking)
        return Response(serializer.data, status=status.HTTP_200_OK)