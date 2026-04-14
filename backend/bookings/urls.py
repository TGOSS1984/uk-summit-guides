from django.urls import path

from .views import ScheduledTourListAPIView

urlpatterns = [
    path("scheduled-tours/", ScheduledTourListAPIView.as_view(), name="scheduled-tour-list"),
]