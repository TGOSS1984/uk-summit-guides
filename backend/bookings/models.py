import uuid
from decimal import Decimal

from django.conf import settings
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models

from routes_app.models import Guide, Route


class ScheduledTour(models.Model):
    class Season(models.TextChoices):
        WINTER = "winter", "Winter"
        SUMMER = "summer", "Summer"

    class Status(models.TextChoices):
        DRAFT = "draft", "Draft"
        OPEN = "open", "Open"
        FULL = "full", "Full"
        CANCELLED = "cancelled", "Cancelled"

    route = models.ForeignKey(
        Route,
        on_delete=models.CASCADE,
        related_name="scheduled_tours",
    )
    guide = models.ForeignKey(
        Guide,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="scheduled_tours",
    )
    date = models.DateField()
    season = models.CharField(max_length=20, choices=Season.choices)
    start_time = models.TimeField()
    price_pp = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        validators=[MinValueValidator(Decimal("0.00"))],
    )
    max_group_size = models.PositiveSmallIntegerField(
        default=3,
        validators=[MinValueValidator(1), MaxValueValidator(12)],
    )
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.OPEN,
    )

    class Meta:
        ordering = ["date", "start_time"]
        unique_together = ("route", "date", "start_time")

    def __str__(self) -> str:
        return f"{self.route.name} - {self.date} {self.start_time}"

    @property
    def booked_spaces(self) -> int:
        return sum(
            self.bookings.filter(
                status__in=[
                    Booking.Status.PENDING,
                    Booking.Status.CONFIRMED,
                ]
            ).values_list("party_size", flat=True)
        )

    @property
    def spaces_remaining(self) -> int:
        return max(self.max_group_size - self.booked_spaces, 0)


class Booking(models.Model):
    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        CONFIRMED = "confirmed", "Confirmed"
        CANCELLED = "cancelled", "Cancelled"
        AMENDED = "amended", "Amended"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="bookings",
    )
    scheduled_tour = models.ForeignKey(
        ScheduledTour,
        on_delete=models.CASCADE,
        related_name="bookings",
    )
    booking_reference = models.CharField(
        max_length=20,
        unique=True,
        blank=True,
    )
    party_size = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(3)]
    )
    contact_name = models.CharField(max_length=160)
    contact_email = models.EmailField()
    contact_phone = models.CharField(max_length=50)
    emergency_contact = models.CharField(max_length=160, blank=True)
    notes = models.TextField(blank=True)
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
    )
    total_price = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        validators=[MinValueValidator(Decimal("0.00"))],
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def save(self, *args, **kwargs):
        if not self.booking_reference:
            self.booking_reference = uuid.uuid4().hex[:10].upper()
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return f"{self.booking_reference} - {self.contact_name}"