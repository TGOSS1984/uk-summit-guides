from django.contrib import admin

from .models import Booking, ScheduledTour


@admin.register(ScheduledTour)
class ScheduledTourAdmin(admin.ModelAdmin):
    list_display = (
        "route",
        "date",
        "start_time",
        "season",
        "guide",
        "max_group_size",
        "status",
        "spaces_remaining",
    )
    list_filter = ("season", "status", "date")
    search_fields = ("route__name", "guide__first_name", "guide__last_name")


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = (
        "booking_reference",
        "contact_name",
        "scheduled_tour",
        "party_size",
        "status",
        "total_price",
        "created_at",
    )
    list_filter = ("status", "created_at")
    search_fields = (
        "booking_reference",
        "contact_name",
        "contact_email",
        "scheduled_tour__route__name",
    )