from decimal import Decimal

from rest_framework import serializers

from routes_app.serializers import GuideSerializer, RouteListSerializer
from .models import Booking, ScheduledTour


class ScheduledTourSerializer(serializers.ModelSerializer):
    route = RouteListSerializer(read_only=True)
    guide = GuideSerializer(read_only=True)
    spaces_remaining = serializers.IntegerField(read_only=True)
    booked_spaces = serializers.IntegerField(read_only=True)

    class Meta:
        model = ScheduledTour
        fields = [
            "id",
            "route",
            "guide",
            "date",
            "season",
            "start_time",
            "price_pp",
            "max_group_size",
            "status",
            "booked_spaces",
            "spaces_remaining",
        ]


class BookingCreateSerializer(serializers.ModelSerializer):
    scheduled_tour_id = serializers.PrimaryKeyRelatedField(
        queryset=ScheduledTour.objects.filter(status=ScheduledTour.Status.OPEN),
        source="scheduled_tour",
        write_only=True,
    )

    class Meta:
        model = Booking
        fields = [
            "scheduled_tour_id",
            "party_size",
            "contact_name",
            "contact_email",
            "contact_phone",
            "emergency_contact",
            "notes",
        ]

    def validate_party_size(self, value):
        if value < 1 or value > 3:
            raise serializers.ValidationError(
                "Party size must be between 1 and 3."
            )
        return value

    def validate(self, attrs):
        scheduled_tour = attrs["scheduled_tour"]
        party_size = attrs["party_size"]

        if scheduled_tour.status != ScheduledTour.Status.OPEN:
            raise serializers.ValidationError(
                {"scheduled_tour_id": "This tour is not open for booking."}
            )

        if party_size > scheduled_tour.spaces_remaining:
            raise serializers.ValidationError(
                {
                    "party_size": (
                        f"Only {scheduled_tour.spaces_remaining} space(s) remain "
                        "for this departure."
                    )
                }
            )

        return attrs

    def create(self, validated_data):
        scheduled_tour = validated_data["scheduled_tour"]
        party_size = validated_data["party_size"]
        price_pp = scheduled_tour.price_pp
        total_price = Decimal(price_pp) * party_size

        user = None
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            user = request.user

        booking = Booking.objects.create(
            user=user,
            scheduled_tour=scheduled_tour,
            party_size=party_size,
            contact_name=validated_data["contact_name"],
            contact_email=validated_data["contact_email"],
            contact_phone=validated_data["contact_phone"],
            emergency_contact=validated_data.get("emergency_contact", ""),
            notes=validated_data.get("notes", ""),
            total_price=total_price,
        )
        return booking


class BookingDetailSerializer(serializers.ModelSerializer):
    scheduled_tour = ScheduledTourSerializer(read_only=True)
    payment_status = serializers.SerializerMethodField()
    payment_id = serializers.SerializerMethodField()
    is_archived = serializers.SerializerMethodField()

    class Meta:
        model = Booking
        fields = [
            "id",
            "booking_reference",
            "scheduled_tour",
            "party_size",
            "contact_name",
            "contact_email",
            "contact_phone",
            "emergency_contact",
            "notes",
            "status",
            "total_price",
            "created_at",
            "payment_status",
            "payment_id",
            "is_archived",
        ]

    def get_payment_status(self, obj):
        if hasattr(obj, "payment"):
            return obj.payment.status
        return None

    def get_payment_id(self, obj):
        if hasattr(obj, "payment"):
            return obj.payment.id
        return None

    def get_is_archived(self, obj):
        return obj.archived_at is not None