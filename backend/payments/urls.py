from django.urls import path

from .views import (
    CheckoutSessionDetailAPIView,
    CreateCheckoutSessionAPIView,
    StripeWebhookAPIView,
)

urlpatterns = [
    path(
        "payments/create-checkout-session/",
        CreateCheckoutSessionAPIView.as_view(),
        name="payments-create-checkout-session",
    ),
    path(
        "payments/checkout-session/<str:session_id>/",
        CheckoutSessionDetailAPIView.as_view(),
        name="payments-checkout-session-detail",
    ),
    path(
        "payments/webhook/",
        StripeWebhookAPIView.as_view(),
        name="payments-webhook",
    ),
]