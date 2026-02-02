from django.contrib import admin
from .models import Station, Line
# Register your models here.

admin.site.register(Station)
admin.site.register(Line)
admin.site.register(LineStop)
admin.site.register(Departure)
admin.site.register(FavouriteLine)
