from django.contrib import admin

from .models import Guide, Region, Route


@admin.register(Region)
class RegionAdmin(admin.ModelAdmin):
    list_display = ("name", "slug")
    search_fields = ("name",)
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Guide)
class GuideAdmin(admin.ModelAdmin):
    list_display = ("first_name", "last_name", "active")
    list_filter = ("active",)
    search_fields = ("first_name", "last_name")
    prepopulated_fields = {"slug": ("first_name", "last_name")}


@admin.register(Route)
class RouteAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "region",
        "difficulty",
        "distance_km",
        "duration_hours",
        "is_featured",
        "active",
    )
    list_filter = ("region", "difficulty", "is_featured", "active")
    search_fields = ("name", "summary", "description")
    prepopulated_fields = {"slug": ("name",)}