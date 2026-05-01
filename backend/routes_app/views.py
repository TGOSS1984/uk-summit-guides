import json
from urllib.error import URLError
from urllib.request import urlopen

from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView

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

class RouteWeatherAPIView(APIView):
    def get(self, request, slug):
        try:
            route = Route.objects.select_related("region").get(
                slug=slug,
                active=True,
            )
        except Route.DoesNotExist:
            return Response(
                {"detail": "Route not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        if route.map_center_lat is None or route.map_center_lng is None:
            return Response(
                {"detail": "Weather location is not available for this route."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        latitude = float(route.map_center_lat)
        longitude = float(route.map_center_lng)

        url = (
            "https://api.open-meteo.com/v1/forecast"
            f"?latitude={latitude}"
            f"&longitude={longitude}"
            "&daily=weather_code,temperature_2m_max,temperature_2m_min,"
            "precipitation_probability_max,wind_speed_10m_max"
            "&timezone=Europe%2FLondon"
            "&forecast_days=7"
        )

        try:
            with urlopen(url, timeout=8) as response:
                data = json.loads(response.read().decode("utf-8"))
        except (URLError, TimeoutError, json.JSONDecodeError):
            return Response(
                {"detail": "Unable to load mountain weather right now."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        daily = data.get("daily", {})

        forecast = []
        dates = daily.get("time", [])

        for index, date_value in enumerate(dates):
            forecast.append(
                {
                    "date": date_value,
                    "weather_code": daily.get("weather_code", [None])[index],
                    "temperature_max": daily.get("temperature_2m_max", [None])[index],
                    "temperature_min": daily.get("temperature_2m_min", [None])[index],
                    "precipitation_probability": daily.get(
                        "precipitation_probability_max",
                        [None],
                    )[index],
                    "wind_speed_max": daily.get("wind_speed_10m_max", [None])[index],
                }
            )

        return Response(
            {
                "route": route.name,
                "region": route.region.name,
                "latitude": latitude,
                "longitude": longitude,
                "source": "Open-Meteo",
                "forecast": forecast,
            }
        )