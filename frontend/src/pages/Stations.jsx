import { useEffect, useState } from "react";
import styles from "./Stations.module.css";

export default function Stations(){
    const[stations, setStations] = useState([]);
    const[error, setError] = useState("");

    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/stations/")
         .then((res) => {
            if(!res.ok) throw new Error("Ne mogu da se ucitaju stranice!");
            return res.json();
         })
         .then((data) => setStations(data))
         .catch((e) => setError(e.message));
    }, []);

    return(
        <div className={styles.container}>
            <h2 className={styles.title}>Stanice</h2>

            {error && <p className={styles.error}>{error}</p>}

            {!error && stations.length === 0 ? (
                <p className={styles.empty}>Nema stanica u bazi!</p>
            ) : (
                <ul className={styles.list}>
                    {stations.map((s) => (
                        <li key={s.id}>
                            <b>{s.name}</b> - ({s.latitude}, {s.longitude})
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}