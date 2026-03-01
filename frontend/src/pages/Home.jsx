import { useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import RouteMap from "../components/RouteMap";
import { geocode } from "../services/geocoding";
import { getRoute } from "../services/routing";
import styles from "./Home.overlay.module.css";

function formatMinutes(seconds) {
  const min = Math.round(seconds / 60);
  return `${min} min`;
}

function formatKm(meters) {
  return `${(meters / 1000).toFixed(2)} km`;
}

export default function Home() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [fromPoint, setFromPoint] = useState(null);
  const [toPoint, setToPoint] = useState(null);
  const [route, setRoute] = useState(null);

  async function handleSearch() {
    setError("");
    setLoading(true);
    setRoute(null);

    try {
      const a = await geocode(from);
      const b = await geocode(to);

      setFromPoint(a);
      setToPoint(b);

      const r = await getRoute(a, b);
      setRoute(r);
    } catch (e) {
      setError(e?.message || "Greška pri traženju rute.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      {/* MAPA U POZADINI */}
      <div className={styles.mapBg}>
        <RouteMap
          fromPoint={fromPoint}
          toPoint={toPoint}
          routeGeoJson={route?.geojson}
        />
      </div>

      {/* KARTICA GORE LEVO */}
      <div className={styles.card} > 
        <h1 className={styles.title}>BEOGRADSKI GRADSKI PREVOZ</h1>
        <p className={styles.subtitle}>Unesi polazište i destinaciju:</p>

        <div className={styles.form}>
          <Input
            label="Polazište"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            placeholder="Slavija"
          />
          <Input
            label="Destinacija"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="Trg Republike"
          />
          <Button onClick={handleSearch} disabled={loading}>
            {loading ? "Tražim rutu..." : "Pronađi rutu"}
          </Button>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        {route && (
          <div className={styles.result}>
            <div><b>Procena vremena:</b> {formatMinutes(route.durationSeconds)}</div>
            <div><b>Distanca:</b> {formatKm(route.distanceMeters)}</div>
          </div>
        )}
      </div>
    </div>
  );
}