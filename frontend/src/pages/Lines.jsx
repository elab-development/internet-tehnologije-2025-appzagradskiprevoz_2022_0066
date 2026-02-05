import { useEffect, useMemo, useState } from "react";
import styles from "./Lines.module.css";

export default function Lines() {
    const [lines, setLines] = useState([]);
    const [query, setQuery] = useState("");
    const [colorFilter, setColorFilter] = useState("all");
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

    const colors = useMemo(() => {
        const uniq = Array.from(
            new Set(lines.map((l) => (l.color || "").trim()).filter(Boolean))
        );
        return uniq;
    }, [lines]);

    const filteredLines = useMemo(() => {
        const q = query.trim().toLowerCase();

        return lines.filter((l) => {
            const nameFilt = !q || (l.name || "").toLowerCase().includes(q);
            const colorFilt = colorFilter === "all" || (l.color || "") === colorFilter;
            return nameFilt && colorFilt;
        });
    }, [lines, query, colorFilter]);

    return (
        <div className={styles.container}>
            <div className={styles.panel}>
                <h2 className={styles.title}>LINES</h2>

                <div className={styles.filters}>
                    <input
                        className={styles.input}
                        placeholder="Pretraga po nazivu..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />

                    <select
                        className={styles.select}
                        value={colorFilter}
                        onChange={(e) => setColorFilter(e.target.value)}
                    >
                        <option value="all">Sve boje</option>
                        {colors.map((c) => (
                            <option key={c} value={c}>
                                {c}
                            </option>
                        ))}
                    </select>

                    <button
                        className={styles.clearBtn}
                        onClick={() => {
                            setQuery("");
                            setColorFilter("all");
                        }}
                    >
                        Reset
                    </button>
                </div>

                <div className={styles.list}>
                    {filteredLines.map((line) => (
                        <div key={line.id} className={styles.card}>
                            <div className={styles.cardTitle}>{line.name}</div>
                            {line.color && (
                                <div className={styles.meta}>Boja: {line.color}</div>
                            )}
                            {line.description && (
                                <div className={styles.meta}>{line.description}</div>
                            )}
                        </div>
                    ))}

                    {filteredLines.length === 0 && (
                        <p className={styles.empty}>
                            Nema rezultata za unete filtere.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}