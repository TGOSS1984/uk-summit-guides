from django.test import override_settings
from rest_framework import status
from rest_framework.test import APITestCase

from contact.models import ContactMessage


@override_settings(EMAIL_BACKEND="django.core.mail.backends.locmem.EmailBackend")
class ContactAPITests(APITestCase):
    def test_contact_form_creates_message(self):
        payload = {
            "name": "Test User",
            "email": "test@example.com",
            "subject": "Route enquiry",
            "message": "I would like to ask about a winter route.",
        }

        response = self.client.post("/api/contact/", payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(ContactMessage.objects.count(), 1)

        message = ContactMessage.objects.first()
        self.assertEqual(message.name, "Test User")
        self.assertEqual(message.email, "test@example.com")
        self.assertEqual(message.subject, "Route enquiry")

    def test_contact_form_requires_email(self):
        payload = {
            "name": "Test User",
            "subject": "Route enquiry",
            "message": "Missing email.",
        }

        response = self.client.post("/api/contact/", payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("email", response.data)

    def test_contact_form_requires_message(self):
        payload = {
            "name": "Test User",
            "email": "test@example.com",
            "subject": "Route enquiry",
        }

        response = self.client.post("/api/contact/", payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("message", response.data)