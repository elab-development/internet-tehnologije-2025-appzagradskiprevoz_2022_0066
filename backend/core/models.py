from django.db import models
from django.contrib.auth.models import User

class Station(models.Model):
    name = models.CharField(max_length=100)
    latitude = models.FloatField()
    longitude = models.FloatField()

    def __str__(self):
        return self.name
    
class Line(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    color = models.CharField(max_length=20, blank = True)

    def __str__(self):
        return self.name
    
class LineStop(models.Model):
    line = models.ForeignKey(Line, on_delete=models.CASCADE)
    station = models.ForeignKey(Station, on_delete=models.CASCADE)
    order = models.IntegerField()

    class Meta:
        constraints=[
            models.UniqueConstraint(fields=["line", "order"], name = "unique_order_per_line"),
            models.UniqueConstraint(fields=["line", "station"], name = "unique_station_per_line"),
        ]

    def __str__(self):
        return f"{self.line.name} - {self.station.name}"
    
class Departure(models.Model):
    line = models.ForeignKey(Line, on_delete=models.CASCADE)
    station = models.ForeignKey(Station, on_delete=models.CASCADE, null=True, blank=True)
    time = models.TimeField()
    is_weekend = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.line.name} - {self.time}"
    
class FavoriteRoute(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="favorite_routes")
    name = models.CharField(max_length=120)
    from_text = models.CharField(max_length=200)
    to_text = models.CharField(max_length=200)

    from_lat = models.FloatField()
    from_lon = models.FloatField()
    to_lat = models.FloatField()
    to_lon = models.FloatField()

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user.username} - {self.name}"

class TrafficNotice(models.Model):
    line = models.ForeignKey(Line, on_delete=models.CASCADE, related_name="notices")
    title = models.CharField(max_length=100)
    description = models.TextField()
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    is_active = models.BooleanField(default= True)

    def __str__(self):
        return f"{self.line.name} - {self.title}"

class RouteHistory(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="route_history")

    from_text = models.CharField(max_length=255)
    to_text = models.CharField(max_length=255)

    from_lat = models.FloatField()
    from_lon = models.FloatField()
    to_lat = models.FloatField()
    to_lon = models.FloatField()

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user_id}: {self.from_text} -> {self.to_text}"