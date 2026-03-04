from django.test import TestCase
from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase


class APISmokeTests(APITestCase):
    def test_health_endpoint(self):
        url = reverse("health")  # maps to /api/health/
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.json(), {"status": "ok"})

    def test_register_and_login(self):
        # REGISTER
        register_url = reverse("register")  # /api/auth/register/
        payload = {"email": "test@example.com", "password": "StrongPass123!"}
        resp = self.client.post(register_url, payload, format="json")
        self.assertEqual(resp.status_code, 201)
        self.assertIn("token", resp.data)

        # LOGIN
        login_url = reverse("login")  # /api/auth/login/
        resp2 = self.client.post(login_url, payload, format="json")
        self.assertEqual(resp2.status_code, 200)
        self.assertIn("token", resp2.data)

    def test_favorite_routes_requires_auth(self):
        # Unauthenticated request should be rejected (Token auth)
        url = reverse("favorite-routes-list")  # /api/favorite-routes/
        resp = self.client.get(url)
        self.assertIn(resp.status_code, [401, 403])

        # Authenticated request should be allowed (even if empty list)
        user = User.objects.create_user(username="u@e.com", email="u@e.com", password="StrongPass123!")
        token, _ = Token.objects.get_or_create(user=user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {token.key}")

        resp2 = self.client.get(url)
        self.assertEqual(resp2.status_code, 200)