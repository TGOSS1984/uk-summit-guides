from django.contrib import admin
from django.urls import include, path
from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(["GET"])
def api_root(request):
    return Response(
        {
            "name": "uk-summit-guides-api",
            "status": "ok",
            "endpoints": {
                "health": "/api/health/",
                "regions": "/api/regions/",
                "guides": "/api/guides/",
                "routes": "/api/routes/",
                "scheduled_tours": "/api/scheduled-tours/",
                "bookings": "/api/bookings/",
            },
        }
    )


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", api_root, name="api-root"),
    path("api/", include("core.urls")),
    path("api/", include("routes_app.urls")),
    path("api/", include("bookings.urls")),
]