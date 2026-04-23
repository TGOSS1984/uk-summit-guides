import os
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

import django  # noqa: E402
from django.core.serializers import serialize  # noqa: E402

django.setup()

from bookings.models import ScheduledTour  # noqa: E402
from routes_app.models import Guide, Region, Route  # noqa: E402

FIXTURES_DIR = BASE_DIR / "fixtures"
FIXTURES_DIR.mkdir(exist_ok=True)

EXPORTS = [
    (Region.objects.all().order_by("pk"), FIXTURES_DIR / "regions.json"),
    (Guide.objects.all().order_by("pk"), FIXTURES_DIR / "guides.json"),
    (Route.objects.all().order_by("pk"), FIXTURES_DIR / "routes.json"),
    (
        ScheduledTour.objects.select_related("route", "guide").all().order_by("pk"),
        FIXTURES_DIR / "scheduled_tours.json",
    ),
]


def export_queryset(queryset, output_path: Path) -> None:
    json_text = serialize("json", queryset, indent=2)
    output_path.write_text(json_text, encoding="utf-8", newline="\n")
    print(f"Exported {queryset.model._meta.label} -> {output_path}")


def main() -> None:
    for queryset, output_path in EXPORTS:
        export_queryset(queryset, output_path)


if __name__ == "__main__":
    main()