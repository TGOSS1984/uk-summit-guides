from django.urls import path

from .views import CreateCheckoutSessionAPIView

urlpatterns = [
    path(
        "payments/create-checkout-session/",
        CreateCheckoutSessionAPIView.as_view(),
        name="payments-create-checkout-session",
    ),
]