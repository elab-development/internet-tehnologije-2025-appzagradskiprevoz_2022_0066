from django.core.management.base import BaseCommand
from core.models import Station, Line, LineStop


STATIONS = [
    {"id": 1, "name": "Autokomanda", "latitude": 44.7902, "longitude": 20.4690},
    {"id": 2, "name": "Slavija", "latitude": 44.8029, "longitude": 20.4662},
    {"id": 3, "name": "Vukov Spomenik", "latitude": 44.8055, "longitude": 20.4779},
    {"id": 4, "name": "Tašmajdan", "latitude": 44.8080, "longitude": 20.4691},
    {"id": 5, "name": "Skupština", "latitude": 44.8117, "longitude": 20.4658},
    {"id": 6, "name": "Terazije", "latitude": 44.8126, "longitude": 20.4612},
    {"id": 7, "name": "Trg Republike", "latitude": 44.8167, "longitude": 20.4600},
    {"id": 8, "name": "Zeleni Venac", "latitude": 44.8141, "longitude": 20.4562},
    {"id": 9, "name": "Savamala", "latitude": 44.8128, "longitude": 20.4524},
    {"id": 10, "name": "Kalemegdan", "latitude": 44.8209, "longitude": 20.4541},
    {"id": 11, "name": "Beograđanka", "latitude": 44.8072, "longitude": 20.4640},
    {"id": 12, "name": "Mostar", "latitude": 44.7986, "longitude": 20.4485},
    {"id": 13, "name": "Brankov Most", "latitude": 44.8149, "longitude": 20.4509},
    {"id": 14, "name": "Studentski Trg", "latitude": 44.8183, "longitude": 20.4582},
]


LINES = [
    {
        "id": 2,
        "name": "31",
        "description": "Autokomanda - Trg Republike",
        "color": "blue",
        "stops": [1, 2, 11, 6, 7],
    },
    {
        "id": 3,
        "name": "26",
        "description": "Vukov Spomenik - Kalemegdan",
        "color": "red",
        "stops": [3, 4, 5, 7, 14, 10],
    },
    {
        "id": 4,
        "name": "E2",
        "description": "Mostar - Studentski Trg",
        "color": "green",
        "stops": [12, 9, 8, 13, 14],
    },
]


class Command(BaseCommand):
    help = "Seed initial transport data (stations, lines, linestops). Safe to re-run."

    def add_arguments(self, parser):
        parser.add_argument(
            "--reset",
            action="store_true",
            help="Delete existing stations/lines/linestops first.",
        )

    def handle(self, *args, **opts):

        if opts["reset"]:
            LineStop.objects.all().delete()
            Line.objects.all().delete()
            Station.objects.all().delete()

            self.stdout.write(
                self.style.WARNING(
                    "Deleted existing Station/Line/LineStop rows."
                )
            )

        for s in STATIONS:
            Station.objects.update_or_create(
                id=s["id"],
                defaults={
                    "name": s["name"],
                    "latitude": s["latitude"],
                    "longitude": s["longitude"],
                },
            )

        for l in LINES:
            line, _ = Line.objects.update_or_create(
                id=l["id"],
                defaults={
                    "name": l["name"],
                    "description": l["description"],
                    "color": l["color"],
                },
            )

            LineStop.objects.filter(line=line).delete()

            for idx, sid in enumerate(l["stops"], start=1):
                station = Station.objects.get(id=sid)

                LineStop.objects.create(
                    line=line,
                    station=station,
                    order=idx,
                )

        self.stdout.write(
            self.style.SUCCESS("Seed finished.")
        )

        self.stdout.write(
            f"Stations: {Station.objects.count()}, "
            f"Lines: {Line.objects.count()}, "
            f"LineStops: {LineStop.objects.count()}"
        )