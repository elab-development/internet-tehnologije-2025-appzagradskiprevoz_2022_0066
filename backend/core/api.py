from rest_framework import viewsets
from .models import Line, Station
from .serializers import LineSerializer, StationSerializer
from .permissions import IsAdminOrReadOnly

class LineViewSet(viewsets.ModelViewSet):
    queryset = Line.objects.all()
    serializer_class = LineSerializer
    permission_classes = [IsAdminOrReadOnly]

class StationViewSet(viewsets.ModelViewSet):
    queryset = Station.objects.all()
    serializer_class = StationSerializer
    permission_classes = [IsAdminOrReadOnly]



