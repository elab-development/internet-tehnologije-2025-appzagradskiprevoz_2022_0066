import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import {useEffect, useMemo} from "react";
import L from "leaflet";
import iconUrl from "leaflet/dist/images/marker-icon.png?url";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png?url";
import shadowUrl from "leaflet/dist/images/marker-shadow.png?url";

function FitBounds({fromPoint, toPoint, polyline}){
    const map = useMap();

    useEffect(() => {
        const pts = [];

        if(fromPoint) pts.push([fromPoint.lat, fromPoint.lon]);
        if(toPoint) pts.push([toPoint.lat, toPoint.lon]);

        if(polyline?.length){
            map.fitBounds(polyline, {padding: [30,30] });
            return;
        }

        if (pts.length === 2){
            map.fitBounds(pts, {padding: [30,30]});
        } else if(pts.length === 1){
            map.setView(pts[0], 14);
        }
    }, [fromPoint, toPoint, polyline, map]);

    return null;
}

export default function RouteMap({ fromPoint, toPoint, routeGeoJson }) {
  const belgrade = [44.8176, 20.4633];

  const fromLatLng = fromPoint ? [fromPoint.lat, fromPoint.lon] : null;
  const toLatLng = toPoint ? [toPoint.lat, toPoint.lon] : null;

  const polyline =
    routeGeoJson?.coordinates?.map(([lon, lat]) => [lat, lon]) ?? null;

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
    <MapContainer
      center={belgrade}
      zoom={13}
      style={{ height: "100%", width: "100%"}}
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <FitBounds fromPoint={fromPoint} toPoint={toPoint} polyline={polyline} />

      {fromLatLng && <Marker position={fromLatLng} icon={markerIcon} />}
      {toLatLng && <Marker position={toLatLng} icon={markerIcon} />}
      {polyline && <Polyline positions={polyline} />}
    </MapContainer>
  );
}



