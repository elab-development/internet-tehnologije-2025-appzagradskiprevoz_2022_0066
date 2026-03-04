import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listRouteHistory, planRoute } from "../services/backend";
import { getRouteThroughPoints } from "../services/routing";
import styles from "./History.module.css";

export default function History() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const navigate = useNavigate();

  async function load() {
    try {
      setLoading(true);
      const data = await listRouteHistory();
      setItems(data);
    } catch (e) {
      console.error(e);
      alert("Greška pri učitavanju istorije.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handlePlan(h) {
    try {
      setBusyId(h.id);

      const a = { lat: h.from_lat, lon: h.from_lon };
      const b = { lat: h.to_lat, lon: h.to_lon };

      const res = await planRoute(a, b, h.from_text, h.to_text);
      if (res?.error) throw new Error(res.error);

      const pathStations = res.path_stations || [];
      let streetRoute = null;
      if (pathStations.length >= 2) {
        streetRoute = await getRouteThroughPoints(pathStations);
      }

      navigate("/", {
        state: {
          favoriteToLoad: {
            from_text: h.from_text,
            to_text: h.to_text,
            plan: res,
            stations: pathStations,
            streetRoute,
          },
        },
      });
    } catch (e) {
      console.error(e);
      alert("Greška pri ponovnom planiranju rute.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className={styles.wrap}>
      <h2 className={styles.title}>Istorija ruta</h2>

      {loading && <p>Učitavanje...</p>}

      {!loading && items.length === 0 && (
        <p>Nemate prethodnih pretraga.</p>
      )}

      {!loading && items.length > 0 && (
        <ul className={styles.list}>
          {items.map((h) => (
            <li key={h.id} className={styles.item}>
              <div className={styles.meta}>
                <div className={styles.name}>
                  {h.from_text || "—"} → {h.to_text || "—"}
                </div>
                <div className={styles.small}>
                  {new Date(h.created_at).toLocaleString()}
                </div>
              </div>

              <div className={styles.actions}>
                <button
                  className={styles.btn}
                  onClick={() => handlePlan(h)}
                  disabled={busyId === h.id}
                >
                  {busyId === h.id ? "Planiram..." : "Planiraj"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}