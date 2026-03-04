import { useEffect, useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import RouteMap from "../components/RouteMap";
import { geocode } from "../services/geocoding";
import { planRoute } from "../services/backend";
import { getRouteThroughPoints } from "../services/routing";
import styles from "./Home.overlay.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import { createFavoriteRoute } from "../services/backend";

function formatMinutes(seconds) {
  const min = Math.round(seconds / 60);
  return `${min} min`;
}
function formatKm(meters) {
  return `${(meters / 1000).toFixed(2)} km`;
}

export default function Home() {
  const location = useLocation();
  const navigate = useNavigate();

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [fromPoint, setFromPoint] = useState(null);
  const [toPoint, setToPoint] = useState(null);

  const [plan, setPlan] = useState(null);
  const [stations, setStations] = useState([]);
  const [route, setRoute] = useState(null);

  const [favoriteName, setFavoriteName] = useState("");
  const [savingFavorite, setSavingFavorite] = useState(false);

  useEffect(() => {
    const payload = location.state?.favoriteToLoad;
    if (!payload) return;

    setError("");

    setFrom(payload.from_text || "");
    setTo(payload.to_text || "");

    setPlan(payload.plan || null);
    setStations(payload.stations || []);
    setRoute(payload.streetRoute || null);

    navigate(location.pathname, { replace: true, state: {} });

  }, [location.state, navigate]);

  async function handleSearch() {
    setError("");
    setLoading(true);
    setPlan(null);
    setStations([]);
    setRoute(null);

    try {
      const a = await geocode(from);
      const b = await geocode(to);

      setFromPoint(a);
      setToPoint(b);

      const res = await planRoute(a, b);
      if (res?.error) throw new Error(res.error);

      setPlan(res);

      const pathStations = res.path_stations || [];
      setStations(pathStations);

      // ✅ ulična trasa kroz pravilno sortirane stanice
      if (pathStations.length >= 2) {
        const streetRoute = await getRouteThroughPoints(pathStations);
        setRoute(streetRoute);
      }
    } catch (e) {
      setError(e?.message || "Greška pri traženju rute.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveFavorite() {

    if (!fromPoint || !toPoint) {
      setError("Prvo pronađi rutu (polazište/destinacija).");
      return;
    }

    if (!favoriteName.trim()) {
      setError("Unesi naziv omiljene rute.");
      return;
    }

    try {
      setSavingFavorite(true);
      setError("");

      await createFavoriteRoute({
        name: favoriteName.trim(),
        from_text: from,
        to_text: to,
        from_lat: fromPoint.lat,
        from_lon: fromPoint.lon,
        to_lat: toPoint.lat,
        to_lon: toPoint.lon,
      });

      setFavoriteName("");
      alert("Ruta je sačuvana u omiljene.");
    } catch (e) {
      console.error(e);
      setError("Greška pri čuvanju omiljene rute.");
    } finally {
      setSavingFavorite(false);
    }
  }
  return (
    <div className={styles.page}>
      <div className={styles.mapBg}>
        <RouteMap
          routeGeoJson={route?.geojson}
          stations={stations}
          routeColor="purple"
        />
      </div>

      <div className={styles.card}>
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

        {plan && !error && (
          <div className={styles.result}>
            <div>
              <b>Najbliža stanica polazištu:</b> {plan.from_station?.name} ({plan.from_station?.distance_m} m)
            </div>
            <div>
              <b>Najbliža stanica destinaciji:</b> {plan.to_station?.name} ({plan.to_station?.distance_m} m)
            </div>

            {route && (
              <div style={{ marginTop: 8 }}>
                <div><b>Procena vremena:</b> {formatMinutes(route.durationSeconds)}</div>
                <div><b>Distanca:</b> {formatKm(route.distanceMeters)}</div>
              </div>
            )}

            {plan.segments?.length > 0 ? (
              <>
                <div style={{ marginTop: 10 }}><b>Uputstvo (linije):</b></div>
                <ol style={{ marginTop: 6, paddingLeft: 18 }}>
                  {plan.segments.map((s, idx) => (
                    <li key={idx}>
                      Linija <b>{s.line_name}</b> od <b>{s.from_station_name}</b> do <b>{s.to_station_name}</b>
                    </li>
                  ))}
                </ol>

                <div style={{ marginTop: 8, opacity: 0.85 }}>
                  <b>Broj stanica na ruti:</b> {stations.length}
                </div>
              </>
            ) : (
              <div style={{ marginTop: 10 }}>
                <b>Nema rute kroz mrežu stanica.</b>
              </div>
            )}

            {/* Sačuvaj u omiljene (samo kad postoji plan) */}
            {plan && (
              <div className={styles.favoriteRow}>
                <div className={styles.favoriteCol}>
                  <label className={styles.favoriteLabel}>NAZIV OMILJENE RUTE</label>
                  <input
                    className={styles.favoriteInput}
                    value={favoriteName}
                    onChange={(e) => setFavoriteName(e.target.value)}
                    placeholder='npr. "Kuća → FON"'
                  />
                </div>

                <button
                  className={styles.favoriteBtn}
                  onClick={handleSaveFavorite}
                  disabled={savingFavorite || !favoriteName.trim()}
                  type="button"
                >
                  {savingFavorite ? "Čuvam..." : "Sačuvaj"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}