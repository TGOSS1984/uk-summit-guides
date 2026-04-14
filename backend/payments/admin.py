from django.contrib import admin

from .models import Payment


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = (
        "booking",
        "amount",
        "currency",
        "status",
        "paid_at",
    )
    list_filter = ("status", "currency")
    search_fields = (
        "booking__booking_reference",
        "stripe_payment_intent_id",
        "stripe_checkout_session_id",
    )