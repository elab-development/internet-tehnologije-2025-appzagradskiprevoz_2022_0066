import {useEffect, useState} from "react";

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
        <div style={{padding: 24}}>
            <h2>Linije</h2>
            {error && <p style={{color: "red"}}>{error}</p>}
            
            <ul>
                {lines.map((l) => (
                    <li key={l.id}>
                        <b>{l.name}</b> - {l.description} {l.color}
                    </li>
                ))}
            </ul>
        </div>
    )
}