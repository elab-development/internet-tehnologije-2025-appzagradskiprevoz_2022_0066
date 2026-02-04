import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";
import { LoginUser } from "../auth";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [msg, setMsg] = useState("");
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setMsg("");

        try {
            const data = await LoginUser(email, password);
            setMsg("Uspesan Login");
            navigate("/");
        } catch (err) {
            setMsg(err.message);
        }
    }
    return (
        <div style={{ padding: 24, maxWidth: 420 }}>
            <h2>LOGIN</h2>
            <form onSubmit={handleSubmit}>
                <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <Button type="submit">LOGIN</Button>
            </form>

            {msg && <p style={{ marginTop: 12 }}>{msg}</p>}
        </div>
    );
}


