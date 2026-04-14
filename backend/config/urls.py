from django.contrib import admin
from django.urls import include, path
from rest_framework.response import Response
from rest_framework.decorators import api_view


@api_view(["GET"])
def api_root(request):
    return Response(
        {
            "name": "uk-summit-guides-api",
            "status": "ok",
            "endpoints": {
                "health": "/api/health/",
            },
        }
    )


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", api_root, name="api-root"),
    path("api/", include("core.urls")),
]