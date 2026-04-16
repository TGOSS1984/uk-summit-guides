from django.urls import path

from .views import (
    BookingAmendAPIView,
    BookingArchiveAPIView,
    BookingCancelAPIView,
    BookingCreateAPIView,
    BookingListAPIView,
    ScheduledTourListAPIView,
)

urlpatterns = [
    path("scheduled-tours/", ScheduledTourListAPIView.as_view(), name="scheduled-tour-list"),
    path("bookings/", BookingCreateAPIView.as_view(), name="booking-create"),
    path("my-bookings/", BookingListAPIView.as_view(), name="booking-list"),
    path("my-bookings/<int:pk>/amend/", BookingAmendAPIView.as_view(), name="booking-amend"),
    path("my-bookings/<int:pk>/cancel/", BookingCancelAPIView.as_view(), name="booking-cancel"),
    path("my-bookings/<int:pk>/archive/", BookingArchiveAPIView.as_view(), name="booking-archive"),
]