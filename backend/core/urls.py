from django.urls import path

from .views import health_check, session_debug

urlpatterns = [
    path("health/", health_check, name="health-check"),
    path("session-debug/", session_debug, name="session-debug"),
]