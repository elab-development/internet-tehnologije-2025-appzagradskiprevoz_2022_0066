import { useState } from "react";
import Input from "../components/Input"
import Button from "../components/Button"

export default function Home(){
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");

    function handleSearch(){
        alert(`Trazicemo rutu: ${from} -> ${to}`);
    }

    return (
        <div style = {{padding: 24, maxWidth: 520}}>
            <h1>BEOGRADSKI GRADSKI PREVOZ</h1>
            <p>Unesi polaziste i destinaciju:</p>

            <Input label="Polaziste" value={from} onChange={(e) => setFrom(e.target.value)} placeholder = "Slavija" />
            <Input label="Destinacija" value={to} onChange={(e) => setTo(e.target.value)} placeholder="Trg Republike"/>

            <Button onClick={handleSearch}>Pronadji rutu</Button>
        </div>
    );
}