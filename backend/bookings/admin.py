from django.contrib import admin
from django.db.models import Count, Sum
from django.utils.html import format_html

from payments.models import Payment
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
        "booked_spaces",
        "spaces_remaining",
        "status",
    )
    list_filter = ("season", "status", "date", "route__region")
    search_fields = ("route__name", "guide__first_name", "guide__last_name")
    list_select_related = ("route", "route__region", "guide")
    date_hierarchy = "date"
    ordering = ("date", "start_time")

    def get_queryset(self, request):
        return super().get_queryset(request).select_related(
            "route",
            "route__region",
            "guide",
        )


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    change_list_template = "admin/booking_change_list.html"
    list_display = (
        "booking_reference",
        "contact_name",
        "route_name",
        "tour_date",
        "party_size",
        "status_badge",
        "payment_status",
        "total_price",
        "archived_at",
        "created_at",
    )
    list_filter = (
        "status",
        "payment__status",
        "scheduled_tour__season",
        "scheduled_tour__route__region",
        "created_at",
        "archived_at",
    )
    search_fields = (
        "booking_reference",
        "contact_name",
        "contact_email",
        "scheduled_tour__route__name",
        "payment__stripe_payment_intent_id",
        "payment__stripe_checkout_session_id",
    )
    list_select_related = (
        "scheduled_tour",
        "scheduled_tour__route",
        "scheduled_tour__route__region",
        "payment",
    )
    date_hierarchy = "created_at"
    readonly_fields = ("booking_reference", "created_at", "archived_at")
    ordering = ("-created_at",)

    fieldsets = (
        (
            "Booking details",
            {
                "fields": (
                    "booking_reference",
                    "user",
                    "scheduled_tour",
                    "party_size",
                    "status",
                    "total_price",
                )
            },
        ),
        (
            "Customer details",
            {
                "fields": (
                    "contact_name",
                    "contact_email",
                    "contact_phone",
                    "emergency_contact",
                    "notes",
                )
            },
        ),
        (
            "Timestamps",
            {
                "fields": (
                    "created_at",
                    "archived_at",
                )
            },
        ),
    )

    actions = ("mark_as_cancelled",)

    def get_queryset(self, request):
        return super().get_queryset(request).select_related(
            "scheduled_tour",
            "scheduled_tour__route",
            "scheduled_tour__route__region",
            "payment",
        )

    @admin.display(description="Route")
    def route_name(self, obj):
        return obj.scheduled_tour.route.name

    @admin.display(description="Tour date", ordering="scheduled_tour__date")
    def tour_date(self, obj):
        return obj.scheduled_tour.date

    @admin.display(description="Payment")
    def payment_status(self, obj):
        payment = getattr(obj, "payment", None)

        if not payment:
            return format_html(
                '<span style="color:#999;">No payment</span>'
            )

        colours = {
            Payment.Status.PENDING: "#b7791f",
            Payment.Status.PAID: "#2f855a",
            Payment.Status.REFUND_PENDING: "#805ad5",
            Payment.Status.REFUNDED: "#3182ce",
            Payment.Status.FAILED: "#c53030",
        }

        colour = colours.get(payment.status, "#718096")

        return format_html(
            '<strong style="color:{};">{}</strong>',
            colour,
            payment.get_status_display(),
        )

    @admin.display(description="Status", ordering="status")
    def status_badge(self, obj):
        colours = {
            Booking.Status.PENDING: "#b7791f",
            Booking.Status.CONFIRMED: "#2f855a",
            Booking.Status.CANCELLED: "#c53030",
            Booking.Status.AMENDED: "#3182ce",
        }

        colour = colours.get(obj.status, "#718096")

        return format_html(
            '<strong style="color:{};">{}</strong>',
            colour,
            obj.get_status_display(),
        )

    @admin.action(description="Mark selected bookings as cancelled")
    def mark_as_cancelled(self, request, queryset):
        updated = queryset.exclude(status=Booking.Status.CANCELLED).update(
            status=Booking.Status.CANCELLED
        )
        self.message_user(request, f"{updated} booking(s) marked as cancelled.")

    def changelist_view(self, request, extra_context=None):
        response = super().changelist_view(request, extra_context=extra_context)

        try:
            queryset = response.context_data["cl"].queryset
        except (AttributeError, KeyError):
            return response

        totals = queryset.aggregate(
            booking_count=Count("id"),
            total_revenue=Sum("total_price"),
        )

        paid_revenue = queryset.filter(
            payment__status=Payment.Status.PAID
        ).aggregate(
            total=Sum("total_price")
        )["total"]

        response.context_data["summary"] = {
            "booking_count": totals["booking_count"] or 0,
            "total_revenue": totals["total_revenue"] or 0,
            "paid_revenue": paid_revenue or 0,
        }

        return response