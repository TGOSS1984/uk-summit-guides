from django.urls import path

from .views import BookingCreateAPIView, ScheduledTourListAPIView

urlpatterns = [
    path("scheduled-tours/", ScheduledTourListAPIView.as_view(), name="scheduled-tour-list"),
    path("bookings/", BookingCreateAPIView.as_view(), name="booking-create"),
]