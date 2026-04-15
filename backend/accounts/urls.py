from django.urls import path

from .views import csrf_view, login_view, logout_view, me_view, register_view

urlpatterns = [
    path("auth/csrf/", csrf_view, name="auth-csrf"),
    path("auth/register/", register_view, name="auth-register"),
    path("auth/login/", login_view, name="auth-login"),
    path("auth/logout/", logout_view, name="auth-logout"),
    path("auth/me/", me_view, name="auth-me"),
]