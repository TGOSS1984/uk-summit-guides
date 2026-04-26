from decimal import Decimal

from rest_framework import status
from rest_framework.test import APITestCase

from routes_app.models import Region, Route


class RoutesAPITests(APITestCase):
    def setUp(self):
        self.scotland = Region.objects.create(
            name="Scotland",
            slug="scotland",
            description="Scottish mountain routes.",
        )
        self.wales = Region.objects.create(
            name="Wales",
            slug="wales",
            description="Welsh mountain routes.",
        )

        self.active_route = Route.objects.create(
            name="Ben Nevis via CMD Arête",
            slug="ben-nevis-via-cmd-arete",
            region=self.scotland,
            summary="A classic ridge route.",
            description="A long and exposed mountain day.",
            difficulty=Route.Difficulty.ADVANCED,
            distance_km=Decimal("17.5"),
            duration_hours=Decimal("8.0"),
            mountain_height_m=1345,
            elevation_gain_m=1506,
            active=True,
        )

        self.wales_route = Route.objects.create(
            name="Tryfan North Ridge",
            slug="tryfan-north-ridge",
            region=self.wales,
            summary="A hands-on scramble.",
            description="A classic Snowdonia route.",
            difficulty=Route.Difficulty.HARD,
            distance_km=Decimal("6.5"),
            duration_hours=Decimal("5.0"),
            mountain_height_m=918,
            elevation_gain_m=700,
            active=True,
        )

        Route.objects.create(
            name="Hidden Test Route",
            slug="hidden-test-route",
            region=self.scotland,
            summary="Inactive route.",
            description="This route should not appear.",
            difficulty=Route.Difficulty.MODERATE,
            distance_km=Decimal("4.0"),
            duration_hours=Decimal("2.0"),
            mountain_height_m=500,
            elevation_gain_m=300,
            active=False,
        )

    def test_regions_list_returns_regions(self):
        response = self.client.get("/api/regions/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_routes_list_only_returns_active_routes(self):
        response = self.client.get("/api/routes/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

        route_slugs = {route["slug"] for route in response.data}
        self.assertIn("ben-nevis-via-cmd-arete", route_slugs)
        self.assertIn("tryfan-north-ridge", route_slugs)
        self.assertNotIn("hidden-test-route", route_slugs)

    def test_routes_can_filter_by_region(self):
        response = self.client.get("/api/routes/?region=scotland")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["slug"], "ben-nevis-via-cmd-arete")

    def test_routes_can_filter_by_difficulty(self):
        response = self.client.get("/api/routes/?difficulty=hard")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["slug"], "tryfan-north-ridge")

    def test_route_detail_returns_route_by_slug(self):
        response = self.client.get("/api/routes/ben-nevis-via-cmd-arete/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["name"], "Ben Nevis via CMD Arête")
        self.assertEqual(response.data["region"]["slug"], "scotland")

    def test_inactive_route_detail_returns_404(self):
        response = self.client.get("/api/routes/hidden-test-route/")

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)