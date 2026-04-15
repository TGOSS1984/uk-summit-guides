from django.urls import path

from .views import BookingCreateAPIView, BookingListAPIView, ScheduledTourListAPIView

urlpatterns = [
    path("scheduled-tours/", ScheduledTourListAPIView.as_view(), name="scheduled-tour-list"),
    path("bookings/", BookingCreateAPIView.as_view(), name="booking-create"),
    path("my-bookings/", BookingListAPIView.as_view(), name="booking-list"),
]