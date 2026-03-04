from rest_framework import serializers
from .models import Line, Station, FavoriteRoute, RouteHistory

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

class RouteHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = RouteHistory
        fields = [
            "id",
            "from_text", "to_text",
            "from_lat", "from_lon",
            "to_lat", "to_lon",
            "created_at",
        ]
        read_only_fields = fields
