from datetime import date, time
from decimal import Decimal
from unittest.mock import Mock, patch

from django.contrib.auth import get_user_model
from django.test import override_settings
from rest_framework import status
from rest_framework.test import APITestCase

from bookings.models import Booking, ScheduledTour
from payments.models import Payment
from routes_app.models import Guide, Region, Route


@override_settings(
    EMAIL_BACKEND="django.core.mail.backends.locmem.EmailBackend",
    STRIPE_SECRET_KEY="sk_test_dummy",
    STRIPE_WEBHOOK_SECRET="whsec_dummy",
)
class BookingPaymentFlowTests(APITestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(
            username="testuser",
            email="test@example.com",
            password="TestPassword123",
            first_name="Test",
            last_name="User",
        )

        self.region = Region.objects.create(
            name="Scotland",
            slug="scotland",
            description="Scottish mountain routes.",
        )

        self.guide = Guide.objects.create(
            first_name="Alex",
            last_name="Guide",
            slug="alex-guide",
            active=True,
        )

        self.route = Route.objects.create(
            name="Ben Nevis via CMD Arête",
            slug="ben-nevis-via-cmd-arete",
            region=self.region,
            summary="A classic Scottish ridge route.",
            description="A longer mountain day with exposed ridge terrain.",
            difficulty=Route.Difficulty.ADVANCED,
            distance_km=Decimal("17.5"),
            duration_hours=Decimal("8.0"),
            mountain_height_m=1345,
            elevation_gain_m=1506,
            active=True,
        )

        self.scheduled_tour = ScheduledTour.objects.create(
            route=self.route,
            guide=self.guide,
            date=date(2026, 5, 12),
            season=ScheduledTour.Season.SUMMER,
            start_time=time(6, 0),
            price_pp=Decimal("145.00"),
            max_group_size=3,
            status=ScheduledTour.Status.OPEN,
        )

        self.booking_payload = {
            "scheduled_tour_id": self.scheduled_tour.id,
            "party_size": 1,
            "contact_name": "Test User",
            "contact_email": "test@example.com",
            "contact_phone": "07123456789",
            "emergency_contact": "Emergency Contact",
            "notes": "Test booking notes.",
        }

    def test_booking_requires_login(self):
        response = self.client.post("/api/bookings/", self.booking_payload, format="json")

        self.assertIn(
            response.status_code,
            [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN],
        )

    def test_authenticated_user_can_create_booking(self):
        self.client.force_authenticate(user=self.user)

        response = self.client.post("/api/bookings/", self.booking_payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Booking.objects.count(), 1)

        booking = Booking.objects.first()
        self.assertEqual(booking.user, self.user)
        self.assertEqual(booking.status, Booking.Status.PENDING)
        self.assertEqual(booking.total_price, Decimal("145.00"))

    def test_booking_appears_in_my_bookings(self):
        self.client.force_authenticate(user=self.user)

        create_response = self.client.post(
            "/api/bookings/",
            self.booking_payload,
            format="json",
        )

        self.assertEqual(create_response.status_code, status.HTTP_201_CREATED)

        list_response = self.client.get("/api/my-bookings/")

        self.assertEqual(list_response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(list_response.data), 1)
        self.assertEqual(
            list_response.data[0]["booking_reference"],
            create_response.data["booking_reference"],
        )

    @patch("payments.views.stripe.Webhook.construct_event")
    def test_stripe_webhook_marks_payment_as_paid_and_booking_confirmed(
        self,
        mock_construct_event,
    ):
        booking = Booking.objects.create(
            user=self.user,
            scheduled_tour=self.scheduled_tour,
            party_size=1,
            contact_name="Test User",
            contact_email="test@example.com",
            contact_phone="07123456789",
            emergency_contact="Emergency Contact",
            total_price=Decimal("145.00"),
        )

        payment = Payment.objects.create(
            booking=booking,
            amount=Decimal("145.00"),
            currency="GBP",
            status=Payment.Status.PENDING,
            stripe_checkout_session_id="cs_test_123",
        )

        mock_construct_event.return_value = {
            "type": "checkout.session.completed",
            "data": {
                "object": {
                    "id": "cs_test_123",
                    "payment_intent": "pi_test_123",
                    "amount_total": 14500,
                }
            },
        }

        response = self.client.post(
            "/api/payments/webhook/",
            data=b"{}",
            content_type="application/json",
            HTTP_STRIPE_SIGNATURE="test_signature",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        payment.refresh_from_db()
        booking.refresh_from_db()

        self.assertEqual(payment.status, Payment.Status.PAID)
        self.assertEqual(payment.stripe_payment_intent_id, "pi_test_123")
        self.assertEqual(payment.amount, Decimal("145"))
        self.assertIsNotNone(payment.paid_at)
        self.assertEqual(booking.status, Booking.Status.CONFIRMED)

    @patch("bookings.views.stripe.Refund.create")
    def test_paid_booking_can_be_cancelled_and_sets_refund_pending(
        self,
        mock_refund_create,
    ):
        self.client.force_authenticate(user=self.user)

        booking = Booking.objects.create(
            user=self.user,
            scheduled_tour=self.scheduled_tour,
            party_size=1,
            contact_name="Test User",
            contact_email="test@example.com",
            contact_phone="07123456789",
            emergency_contact="Emergency Contact",
            status=Booking.Status.CONFIRMED,
            total_price=Decimal("145.00"),
        )

        Payment.objects.create(
            booking=booking,
            amount=Decimal("145.00"),
            currency="GBP",
            status=Payment.Status.PAID,
            stripe_payment_intent_id="pi_test_123",
        )

        mock_refund_create.return_value = Mock(id="re_test_123")

        response = self.client.patch(f"/api/my-bookings/{booking.id}/cancel/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        booking.refresh_from_db()
        booking.payment.refresh_from_db()

        self.assertEqual(booking.status, Booking.Status.CANCELLED)
        self.assertEqual(booking.payment.status, Payment.Status.REFUND_PENDING)
        self.assertEqual(booking.payment.stripe_refund_id, "re_test_123")