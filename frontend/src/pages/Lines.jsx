import {useEffect, useState} from "react";
import styles from "./Lines.module.css";

export default function Lines(){
    const [lines, setLines] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/lines/")
         .then((res) => {
            if (!res.ok) throw new Error("Ne mogu da ucitam linije");
            return res.json();
         })
         .then(setLines)
         .catch((e) => setError(e.message));
    }, []);

    return(
        <div className={styles.container}>
            <h2 className={styles.title}>Linije</h2>
            {error && <p className={styles.error}>{error}</p>}
            
            <ul className={styles.list}>
                {lines.map((l) => (
                    <li key={l.id} className={styles.item}>
                        <b>{l.name}</b> - {l.description} {l.color}
                    </li>
                ))}
            </ul>
        </div>
    )
}