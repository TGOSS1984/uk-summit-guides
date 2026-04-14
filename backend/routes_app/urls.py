from django.urls import path

from .views import (
    GuideListAPIView,
    RegionListAPIView,
    RouteDetailAPIView,
    RouteListAPIView,
)

urlpatterns = [
    path("regions/", RegionListAPIView.as_view(), name="region-list"),
    path("guides/", GuideListAPIView.as_view(), name="guide-list"),
    path("routes/", RouteListAPIView.as_view(), name="route-list"),
    path("routes/<slug:slug>/", RouteDetailAPIView.as_view(), name="route-detail"),
]