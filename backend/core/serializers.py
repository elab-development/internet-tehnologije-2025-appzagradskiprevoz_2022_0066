from rest_framework import serializers
from .models import Line, Station, FavoriteRoute

class LineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Line
        fields = "__all__"

class StationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Station
        fields = "__all__"
        
class FavoriteRouteSerializer(serializers.ModelSerializer):
    class Meta:
        model = FavoriteRoute
        fields = "__all__"
        read_only_fields = ["id", "user", "created_at"]


