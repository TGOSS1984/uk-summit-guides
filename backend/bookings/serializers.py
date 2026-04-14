from rest_framework import serializers

from routes_app.serializers import GuideSerializer, RouteListSerializer
from .models import ScheduledTour


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