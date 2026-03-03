from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Line, Station, LineStop
from .serializers import LineSerializer, StationSerializer
from .permissions import IsAdminOrReadOnly

class LineViewSet(viewsets.ModelViewSet):
    queryset = Line.objects.all()
    serializer_class = LineSerializer
    permission_classes = [IsAdminOrReadOnly]

    @action(detail=True, methods=["get"], url_path="stops")
    def stops(self, request, pk=None):
        line = self.get_object()
        qs = (
            LineStop.objects
            .filter(line=line)
            .select_related("station")
            .order_by("order")
        )

        data = [
            {
                "id": ls.station.id,
                "name": ls.station.name,
                "latitude": ls.station.latitude,
                "longitude": ls.station.longitude,
                "order": ls.order,
            }
            for ls in qs
        ]
        return Response(data)
    
    
class StationViewSet(viewsets.ModelViewSet):
    queryset = Station.objects.all()
    serializer_class = StationSerializer
    permission_classes = [IsAdminOrReadOnly]



