from rest_framework import serializers
from .models import Line, Station

class LineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Line
        fields = "__all__"

class StationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Station
        fields = "__all__"

