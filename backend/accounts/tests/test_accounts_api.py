from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase


class AccountsAPITests(APITestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(
            username="existinguser",
            email="existing@example.com",
            password="TestPassword123",
            first_name="Existing",
            last_name="User",
        )

    def test_register_returns_user_and_token(self):
        payload = {
            "username": "newuser",
            "email": "new@example.com",
            "first_name": "New",
            "last_name": "User",
            "password": "TestPassword123",
            "password_confirm": "TestPassword123",
        }

        response = self.client.post("/api/auth/register/", payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["username"], "newuser")
        self.assertIn("token", response.data)
        self.assertTrue(response.data["token"])

    def test_register_rejects_password_mismatch(self):
        payload = {
            "username": "newuser",
            "email": "new@example.com",
            "first_name": "New",
            "last_name": "User",
            "password": "TestPassword123",
            "password_confirm": "DifferentPassword123",
        }

        response = self.client.post("/api/auth/register/", payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("password_confirm", response.data)

    def test_login_returns_user_and_token(self):
        payload = {
            "username": "existinguser",
            "password": "TestPassword123",
        }

        response = self.client.post("/api/auth/login/", payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["username"], "existinguser")
        self.assertIn("token", response.data)
        self.assertTrue(response.data["token"])

    def test_invalid_login_fails(self):
        payload = {
            "username": "existinguser",
            "password": "WrongPassword123",
        }

        response = self.client.post("/api/auth/login/", payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["detail"], "Invalid username or password.")

    def test_me_requires_authentication(self):
        response = self.client.get("/api/auth/me/")

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_me_returns_authenticated_user(self):
        self.client.force_authenticate(user=self.user)

        response = self.client.get("/api/auth/me/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["username"], "existinguser")

    def test_logout_returns_success(self):
        self.client.force_authenticate(user=self.user)

        response = self.client.post("/api/auth/logout/", {}, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["detail"], "Logged out successfully.")