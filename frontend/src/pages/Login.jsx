import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [msg, setMsg] = useState("");
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setMsg("");

        try {
            const res = await fetch("http://127.0.0.1:8000/api/auth/login/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setMsg(data.detail || "Login neuspesan");
                return;
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("email", data.email);

            setMsg("Uspesan Login");
            navigate("/");
        } catch {
            setMsg("Greska pri povezivanju sa serverom");
        }
    }
    return (
        <div style={{ padding: 24, maxWidth: 420 }}>
            <h2>LOGIN</h2>
            <form onSubmit={handleSubmit}>
                <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <Input label="Lozinka" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <Button type="submit">LOGIN</Button>
            </form>

            {msg && <p style={{ marginTop: 12 }}>{msg}</p>}
        </div>
    );
}


