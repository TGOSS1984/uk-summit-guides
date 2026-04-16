from decimal import Decimal

from django.core.validators import MinValueValidator
from django.db import models
from django.utils import timezone

from bookings.models import Booking


class Payment(models.Model):
    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        PAID = "paid", "Paid"
        REFUND_PENDING = "refund_pending", "Refund Pending"
        REFUNDED = "refunded", "Refunded"
        FAILED = "failed", "Failed"

    booking = models.OneToOneField(
        Booking,
        on_delete=models.CASCADE,
        related_name="payment",
    )
    stripe_payment_intent_id = models.CharField(max_length=255, blank=True)
    stripe_checkout_session_id = models.CharField(max_length=255, blank=True)
    stripe_refund_id = models.CharField(max_length=255, blank=True)
    amount = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        validators=[MinValueValidator(Decimal("0.00"))],
    )
    currency = models.CharField(max_length=10, default="GBP")
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
    )
    paid_at = models.DateTimeField(null=True, blank=True)
    refunded_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["-id"]

    def mark_paid(self):
        self.status = self.Status.PAID
        if not self.paid_at:
            self.paid_at = timezone.now()
        self.save(
            update_fields=[
                "status",
                "paid_at",
            ]
        )

    def mark_refunded(self):
        self.status = self.Status.REFUNDED
        if not self.refunded_at:
            self.refunded_at = timezone.now()
        self.save(
            update_fields=[
                "status",
                "refunded_at",
            ]
        )

    def __str__(self) -> str:
        return f"Payment for {self.booking.booking_reference}"