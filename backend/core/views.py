from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(["GET"])
def health_check(request):
    return Response(
        {
            "status": "ok",
            "service": "uk-summit-guides-api",
        }
    )


@api_view(["GET"])
def session_debug(request):
    return Response(
        {
            "authenticated": request.user.is_authenticated,
            "username": request.user.username if request.user.is_authenticated else None,
            "user_id": request.user.id if request.user.is_authenticated else None,
        }
    )