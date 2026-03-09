from django.contrib import admin
from .models import Station, Line, LineStop, Departure, FavoriteRoute, TrafficNotice

admin.site.register(Station)
admin.site.register(Line)
admin.site.register(LineStop)
admin.site.register(Departure)
admin.site.register(FavoriteRoute)
admin.site.register(TrafficNotice)
