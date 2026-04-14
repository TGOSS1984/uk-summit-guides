from rest_framework import generics

from .models import ScheduledTour
from .serializers import ScheduledTourSerializer


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