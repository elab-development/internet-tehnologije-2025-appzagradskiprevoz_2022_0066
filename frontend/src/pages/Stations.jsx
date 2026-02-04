import { useEffect, useState } from "react";

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
        <div style={{padding: 24}}>
            <h2>Stanice</h2>

            {!error && <p style={{color: "red"}}>{error}</p>}

            {!error && stations.length === 0 ? (
                <p>Nema stanica u bazi!</p>
            ) : (
                <ul>
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