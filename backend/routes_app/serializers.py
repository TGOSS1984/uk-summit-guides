from rest_framework import serializers

from .models import Guide, Region, Route


class RegionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Region
        fields = [
            "id",
            "name",
            "slug",
            "description",
        ]


class GuideSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = Guide
        fields = [
            "id",
            "first_name",
            "last_name",
            "full_name",
            "slug",
            "bio",
            "profile_image",
            "qualifications",
            "active",
        ]

    def get_full_name(self, obj: Guide) -> str:
        return f"{obj.first_name} {obj.last_name}"


class RouteListSerializer(serializers.ModelSerializer):
    region = RegionSerializer(read_only=True)

    class Meta:
        model = Route
        fields = [
            "id",
            "name",
            "slug",
            "region",
            "summary",
            "difficulty",
            "distance_km",
            "duration_hours",
            "mountain_height_m",
            "elevation_gain_m",
            "card_image",
            "gpx_file",
            "map_center_lat",
            "map_center_lng",
            "map_zoom",
            "is_featured",
            "active",
        ]


class RouteDetailSerializer(serializers.ModelSerializer):
    region = RegionSerializer(read_only=True)

    class Meta:
        model = Route
        fields = [
            "id",
            "name",
            "slug",
            "region",
            "summary",
            "description",
            "difficulty",
            "distance_km",
            "duration_hours",
            "mountain_height_m",
            "elevation_gain_m",
            "hero_image",
            "card_image",
            "map_embed",
            "gpx_file",
            "map_center_lat",
            "map_center_lng",
            "map_zoom",
            "is_featured",
            "active",
        ]