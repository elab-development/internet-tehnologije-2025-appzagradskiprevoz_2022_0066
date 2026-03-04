import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listFavoriteRoutes, deleteFavoriteRoute, planRoute } from "../services/backend";
import { getRouteThroughPoints } from "../services/routing";
import styles from "./Favorites.module.css";

export default function Favorites() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [busyId, setBusyId] = useState(null);
    const navigate = useNavigate();

    async function load() {
        try {
            setLoading(true);
            const data = await listFavoriteRoutes();
            setItems(data);
        } catch (e) {
            console.error(e);
            alert("Greška pri učitavanju omiljenih ruta.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
    }, []);

    async function handlePlan(fav) {
        try {
            setBusyId(fav.id);

            // 1) uzmi plan iz backend-a (preko koordinata iz fav)
            const a = { lat: fav.from_lat, lon: fav.from_lon };
            const b = { lat: fav.to_lat, lon: fav.to_lon };
            const res = await planRoute(a, b);
            if (res?.error) throw new Error(res.error);

            // 2) kroz stanice napravi "uličnu" rutu za mapu
            const pathStations = res.path_stations || [];
            let streetRoute = null;
            if (pathStations.length >= 2) {
                streetRoute = await getRouteThroughPoints(pathStations);
            }

            // 3) vrati se na Home i prosledi šta treba da prikaže
            navigate("/", {
                state: {
                    favoriteToLoad: {
                        from_text: fav.from_text,
                        to_text: fav.to_text,
                        plan: res,
                        stations: pathStations,
                        streetRoute: streetRoute,
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

    async function handleDelete(id) {
        if (!confirm("Obrisati ovu rutu iz omiljenih?")) return;
        try {
            await deleteFavoriteRoute(id);
            setItems((prev) => prev.filter((x) => x.id !== id));
        } catch (e) {
            console.error(e);
            alert("Greška pri brisanju.");
        }
    }

    return (
        <div className={styles.wrap}>
            <h2 className={styles.title}>Omiljene rute</h2>

            {loading && <p>Učitavanje...</p>}

            {!loading && items.length === 0 && (
                <p>Nema sačuvanih omiljenih ruta.</p>
            )}

            {!loading && items.length > 0 && (
                <ul className={styles.list}>
                    {items.map((fav) => (
                        <li key={fav.id} className={styles.item}>
                            <div className={styles.meta}>
                                <div className={styles.name}>{fav.name}</div>
                                <div className={styles.small}>
                                    {fav.from_text} → {fav.to_text}
                                </div>
                            </div>

                            <div className={styles.actions}>
                                <button
                                    className={styles.btn}
                                    onClick={() => handlePlan(fav)}
                                    disabled={busyId === fav.id}
                                >
                                    {busyId === fav.id ? "Planiram..." : "Planiraj"}
                                </button>
                                <button
                                    className={styles.btnDanger}
                                    onClick={() => handleDelete(fav.id)}
                                    disabled={busyId === fav.id}
                                >
                                    Obriši
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}