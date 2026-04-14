from rest_framework import generics

from .models import Guide, Region, Route
from .serializers import (
    GuideSerializer,
    RegionSerializer,
    RouteDetailSerializer,
    RouteListSerializer,
)


class RegionListAPIView(generics.ListAPIView):
    queryset = Region.objects.all()
    serializer_class = RegionSerializer


class GuideListAPIView(generics.ListAPIView):
    queryset = Guide.objects.filter(active=True)
    serializer_class = GuideSerializer


class RouteListAPIView(generics.ListAPIView):
    serializer_class = RouteListSerializer

    def get_queryset(self):
        queryset = (
            Route.objects.select_related("region")
            .filter(active=True)
            .order_by("name")
        )

        region_slug = self.request.query_params.get("region")
        difficulty = self.request.query_params.get("difficulty")
        featured = self.request.query_params.get("featured")

        if region_slug:
            queryset = queryset.filter(region__slug=region_slug)

        if difficulty:
            queryset = queryset.filter(difficulty=difficulty)

        if featured is not None:
            featured_normalized = featured.lower()
            if featured_normalized in {"true", "1", "yes"}:
                queryset = queryset.filter(is_featured=True)
            elif featured_normalized in {"false", "0", "no"}:
                queryset = queryset.filter(is_featured=False)

        return queryset


class RouteDetailAPIView(generics.RetrieveAPIView):
    queryset = Route.objects.select_related("region").filter(active=True)
    serializer_class = RouteDetailSerializer
    lookup_field = "slug"