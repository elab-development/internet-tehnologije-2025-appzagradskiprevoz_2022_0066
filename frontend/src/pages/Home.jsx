import { useState } from "react";
import Input from "../components/Input"
import Button from "../components/Button"
import styles from "./Home.module.css";

export default function Home() {
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");

    function handleSearch() {
        alert(`Trazicemo rutu: ${from} -> ${to}`);
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>BEOGRADSKI GRADSKI PREVOZ</h1>
            <p className={styles.subtitle}>Unesi polaziste i destinaciju:</p>

            <div className={styles.form}>
                <Input label="Polaziste" value={from} onChange={(e) => setFrom(e.target.value)} placeholder="Slavija" />
                <Input label="Destinacija" value={to} onChange={(e) => setTo(e.target.value)} placeholder="Trg Republike" />
                <Button onClick={handleSearch}>Pronadji rutu</Button>
            </div>
        </div>
    );
}