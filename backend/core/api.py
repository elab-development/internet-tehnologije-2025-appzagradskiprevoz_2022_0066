from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Line, Station, LineStop, FavoriteRoute, RouteHistory
from rest_framework.permissions import IsAuthenticated
from .serializers import LineSerializer, StationSerializer, FavoriteRouteSerializer, RouteHistorySerializer
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

class FavoriteRouteViewSet(viewsets.ModelViewSet):
    serializer_class = FavoriteRouteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return FavoriteRoute.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class RouteHistoryViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = RouteHistorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return RouteHistory.objects.filter(user=self.request.user).order_by("-created_at")