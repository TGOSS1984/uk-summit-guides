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

    def test_booking_blocks_over_capacity_party_size(self):
        self.client.force_authenticate(user=self.user)

        Booking.objects.create(
            user=self.user,
            scheduled_tour=self.scheduled_tour,
            party_size=2,
            contact_name="Existing User",
            contact_email="existing@example.com",
            contact_phone="07111111111",
            total_price=Decimal("290.00"),
        )

        payload = {
            **self.booking_payload,
            "party_size": 2,
        }

        response = self.client.post("/api/bookings/", payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("party_size", response.data)

    def test_user_cannot_see_another_users_booking(self):
        other_user = get_user_model().objects.create_user(
            username="otheruser",
            email="other@example.com",
            password="TestPassword123",
        )

        Booking.objects.create(
            user=other_user,
            scheduled_tour=self.scheduled_tour,
            party_size=1,
            contact_name="Other User",
            contact_email="other@example.com",
            contact_phone="07111111111",
            total_price=Decimal("145.00"),
        )

        self.client.force_authenticate(user=self.user)

        response = self.client.get("/api/my-bookings/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)

    def test_pending_booking_party_size_can_be_amended(self):
        self.client.force_authenticate(user=self.user)

        booking = Booking.objects.create(
            user=self.user,
            scheduled_tour=self.scheduled_tour,
            party_size=1,
            contact_name="Test User",
            contact_email="test@example.com",
            contact_phone="07123456789",
            total_price=Decimal("145.00"),
        )

        response = self.client.patch(
            f"/api/my-bookings/{booking.id}/amend/",
            {"party_size": 2},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        booking.refresh_from_db()
        self.assertEqual(booking.party_size, 2)
        self.assertEqual(booking.total_price, Decimal("290.00"))
        self.assertEqual(booking.status, Booking.Status.AMENDED)

    def test_paid_booking_party_size_cannot_be_amended(self):
        self.client.force_authenticate(user=self.user)

        booking = Booking.objects.create(
            user=self.user,
            scheduled_tour=self.scheduled_tour,
            party_size=1,
            contact_name="Test User",
            contact_email="test@example.com",
            contact_phone="07123456789",
            total_price=Decimal("145.00"),
        )

        Payment.objects.create(
            booking=booking,
            amount=Decimal("145.00"),
            currency="GBP",
            status=Payment.Status.PAID,
            stripe_payment_intent_id="pi_test_123",
        )

        response = self.client.patch(
            f"/api/my-bookings/{booking.id}/amend/",
            {"party_size": 2},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("party_size", response.data)

    def test_only_cancelled_booking_can_be_archived(self):
        self.client.force_authenticate(user=self.user)

        booking = Booking.objects.create(
            user=self.user,
            scheduled_tour=self.scheduled_tour,
            party_size=1,
            contact_name="Test User",
            contact_email="test@example.com",
            contact_phone="07123456789",
            total_price=Decimal("145.00"),
        )

        response = self.client.patch(f"/api/my-bookings/{booking.id}/archive/")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIsNone(booking.archived_at)

    def test_cancelled_booking_can_be_archived(self):
        self.client.force_authenticate(user=self.user)

        booking = Booking.objects.create(
            user=self.user,
            scheduled_tour=self.scheduled_tour,
            party_size=1,
            contact_name="Test User",
            contact_email="test@example.com",
            contact_phone="07123456789",
            status=Booking.Status.CANCELLED,
            total_price=Decimal("145.00"),
        )

        response = self.client.patch(f"/api/my-bookings/{booking.id}/archive/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        booking.refresh_from_db()
        self.assertIsNotNone(booking.archived_at)

    def test_paid_booking_cannot_create_new_checkout_session(self):
        self.client.force_authenticate(user=self.user)

        booking = Booking.objects.create(
            user=self.user,
            scheduled_tour=self.scheduled_tour,
            party_size=1,
            contact_name="Test User",
            contact_email="test@example.com",
            contact_phone="07123456789",
            status=Booking.Status.CONFIRMED,
            total_price=Decimal("145.00"),
        )

        Payment.objects.create(
            booking=booking,
            amount=Decimal("145.00"),
            currency="GBP",
            status=Payment.Status.PAID,
            stripe_checkout_session_id="cs_test_123",
            stripe_payment_intent_id="pi_test_123",
        )

        response = self.client.post(
            "/api/payments/create-checkout-session/",
            {"booking_id": booking.id},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["detail"], "This booking has already been paid.")

    @patch("payments.views.stripe.Webhook.construct_event")
    def test_refund_updated_webhook_marks_payment_as_refunded(
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
            status=Booking.Status.CANCELLED,
            total_price=Decimal("145.00"),
        )

        payment = Payment.objects.create(
            booking=booking,
            amount=Decimal("145.00"),
            currency="GBP",
            status=Payment.Status.REFUND_PENDING,
            stripe_payment_intent_id="pi_test_123",
            stripe_refund_id="re_test_123",
        )

        mock_construct_event.return_value = {
            "type": "refund.updated",
            "data": {
                "object": {
                    "id": "re_test_123",
                    "payment_intent": "pi_test_123",
                    "status": "succeeded",
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
        self.assertEqual(payment.status, Payment.Status.REFUNDED)
        self.assertIsNotNone(payment.refunded_at)

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