from django.core.management.base import BaseCommand
from core.models import Station, Line, LineStop

STATIONS = [
    {"id": 1, "name": "Autokomanda", "latitude": 44.7894, "longitude": 20.4690},
    {"id": 2, "name": "Slavija", "latitude": 44.8027, "longitude": 20.4660},  # ⚠ ispravio lon (ti si imao grešku)
    {"id": 3, "name": "Vukov Spomenik", "latitude": 44.8045, "longitude": 20.4764},
    {"id": 4, "name": "Tašmajdan", "latitude": 44.8076, "longitude": 20.4782},
    {"id": 5, "name": "Skupština", "latitude": 44.8101, "longitude": 20.4693},
    {"id": 6, "name": "Terazije", "latitude": 44.8149, "longitude": 20.4612},
    {"id": 7, "name": "Trg Republike", "latitude": 44.8169, "longitude": 20.4602},
    {"id": 8, "name": "Zeleni Venac", "latitude": 44.8154, "longitude": 20.4567},
    {"id": 9, "name": "Savamala", "latitude": 44.8125, "longitude": 20.4510},
    {"id": 10, "name": "Kalemegdan", "latitude": 44.8231, "longitude": 20.4509},
    {"id": 11, "name": "Beograđanka", "latitude": 44.8049, "longitude": 20.4630},
    {"id": 12, "name": "Mostar", "latitude": 44.8031, "longitude": 20.4477},
    {"id": 13, "name": "Brankov Most", "latitude": 44.8161, "longitude": 20.4544},
    {"id": 14, "name": "Studentski Trg", "latitude": 44.8206, "longitude": 20.4572},
]

LINES = [
    {"id": 2, "name": "31", "description": "Autokomanda - Trg Republike", "color": "blue",
     "stops": [1, 2, 11, 6, 7]},
    {"id": 3, "name": "26", "description": "Vukov Spomenik - Kalemegdan", "color": "red",
     "stops": [3, 4, 5, 7, 14, 10]},
    {"id": 4, "name": "E2", "description": "Mostar - Studentski Trg", "color": "green",
     "stops": [12, 9, 8, 13, 14]},
]

class Command(BaseCommand):
    help = "Seed initial transport data (stations, lines, linestops). Safe to re-run."

    def add_arguments(self, parser):
        parser.add_argument("--reset", action="store_true", help="Delete existing stations/lines/linestops first.")

    def handle(self, *args, **opts):
        if opts["reset"]:
            LineStop.objects.all().delete()
            Line.objects.all().delete()
            Station.objects.all().delete()
            self.stdout.write(self.style.WARNING("Deleted existing Station/Line/LineStop rows."))

        # Stations
        for s in STATIONS:
            Station.objects.update_or_create(
                id=s["id"],
                defaults={
                    "name": s["name"],
                    "latitude": s["latitude"],
                    "longitude": s["longitude"],
                }
            )

        # Lines + LineStops
        for l in LINES:
            line, _ = Line.objects.update_or_create(
                id=l["id"],
                defaults={
                    "name": l["name"],
                    "description": l["description"],
                    "color": l["color"],
                }
            )
            LineStop.objects.filter(line=line).delete()
            for idx, sid in enumerate(l["stops"], start=1):
                station = Station.objects.get(id=sid)
                LineStop.objects.create(line=line, station=station, order=idx)

        self.stdout.write(self.style.SUCCESS("Seed finished."))
        self.stdout.write(f"Stations: {Station.objects.count()}, Lines: {Line.objects.count()}, LineStops: {LineStop.objects.count()}")