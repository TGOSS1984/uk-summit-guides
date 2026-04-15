from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Booking, ScheduledTour
from .serializers import (
    BookingCreateSerializer,
    BookingDetailSerializer,
    ScheduledTourSerializer,
)


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
        return (
            Booking.objects.select_related(
                "scheduled_tour",
                "scheduled_tour__route",
                "scheduled_tour__route__region",
                "scheduled_tour__guide",
            )
            .filter(user=self.request.user)
            .order_by("-created_at")
        )


class BookingCancelAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk):
        try:
            booking = Booking.objects.select_related(
                "scheduled_tour",
                "scheduled_tour__route",
                "scheduled_tour__route__region",
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

        if booking.status not in [Booking.Status.PENDING, Booking.Status.CONFIRMED]:
            return Response(
                {"detail": "This booking cannot be cancelled."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        booking.status = Booking.Status.CANCELLED
        booking.save(update_fields=["status"])

        serializer = BookingDetailSerializer(booking)
        return Response(serializer.data, status=status.HTTP_200_OK)