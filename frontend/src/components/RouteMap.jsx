import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from "react-leaflet";
import { useEffect, useMemo } from "react";
import L from "leaflet";
import iconUrl from "leaflet/dist/images/marker-icon.png?url";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png?url";
import shadowUrl from "leaflet/dist/images/marker-shadow.png?url";

function FitBounds({ polyline, stations }) {
  const map = useMap();

  useEffect(() => {
    if (polyline?.length) {
      map.fitBounds(polyline, { padding: [30, 30] });
      return;
    }
    if (stations?.length >= 2) {
      const pts = stations.map((s) => [s.lat, s.lon]);
      map.fitBounds(pts, { padding: [30, 30] });
    } else if (stations?.length === 1) {
      map.setView([stations[0].lat, stations[0].lon], 14);
    }
  }, [polyline, stations, map]);

  return null;
}

export default function RouteMap({ routeGeoJson, stations, routeColor = "purple" }) {
  const belgrade = [44.8176, 20.4633];

  const polyline = routeGeoJson?.coordinates
    ? routeGeoJson.coordinates.map(([lon, lat]) => [lat, lon])
    : null;

  const markerIcon = useMemo(
    () =>
      L.icon({
        iconUrl,
        iconRetinaUrl,
        shadowUrl,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        shadowSize: [41, 41],
      }),
    []
  );

  return (
    <MapContainer center={belgrade} zoom={13} style={{ height: "100%", width: "100%" }} scrollWheelZoom>
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <FitBounds polyline={polyline} stations={stations} />

      {stations?.map((s, idx) => (
        <Marker key={s.id ?? idx} position={[s.lat, s.lon]} icon={markerIcon}>
          <Popup>{s.name ?? "Stanica"}</Popup>
        </Marker>
      ))}

      {polyline && (
        <Polyline
          positions={polyline}
          pathOptions={{ color: routeColor, weight: 7, opacity: 0.9, lineCap: "round", lineJoin: "round" }}
        />
      )}
    </MapContainer>
  );
}