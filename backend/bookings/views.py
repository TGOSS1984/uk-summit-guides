from rest_framework import generics, status
from rest_framework.response import Response

from .models import ScheduledTour
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

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        booking = serializer.save()

        output_serializer = BookingDetailSerializer(booking)
        headers = self.get_success_headers(output_serializer.data)
        return Response(
            output_serializer.data,
            status=status.HTTP_201_CREATED,
            headers=headers,
        )