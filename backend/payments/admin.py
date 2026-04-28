from django.contrib import admin
from django.utils.html import format_html

from .models import Payment


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = (
        "booking_reference",
        "customer_name",
        "amount",
        "currency",
        "status_badge",
        "stripe_payment_intent_id",
        "stripe_refund_id",
        "paid_at",
        "refunded_at",
    )
    list_filter = ("status", "currency", "paid_at", "refunded_at")
    search_fields = (
        "booking__booking_reference",
        "booking__contact_name",
        "booking__contact_email",
        "stripe_payment_intent_id",
        "stripe_checkout_session_id",
        "stripe_refund_id",
    )
    list_select_related = ("booking",)
    readonly_fields = (
        "booking",
        "stripe_payment_intent_id",
        "stripe_checkout_session_id",
        "stripe_refund_id",
        "paid_at",
        "refunded_at",
    )
    ordering = ("-id",)

    @admin.display(description="Booking")
    def booking_reference(self, obj):
        return obj.booking.booking_reference

    @admin.display(description="Customer")
    def customer_name(self, obj):
        return obj.booking.contact_name

    @admin.display(description="Status", ordering="status")
    def status_badge(self, obj):
        colours = {
            Payment.Status.PENDING: "#b7791f",
            Payment.Status.PAID: "#2f855a",
            Payment.Status.REFUND_PENDING: "#805ad5",
            Payment.Status.REFUNDED: "#3182ce",
            Payment.Status.FAILED: "#c53030",
        }

        colour = colours.get(obj.status, "#718096")

        return format_html(
            '<strong style="color:{};">{}</strong>',
            colour,
            obj.get_status_display(),
        )