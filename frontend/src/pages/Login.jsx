import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";
import { LoginUser } from "../auth";
import styles from "./Login.module.css";


export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [msg, setMsg] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from || { pathname: "/" };

    async function handleSubmit(e) {
        e.preventDefault();
        setMsg("");

        try {
            const data = await LoginUser(email, password);
            setMsg("Uspesan Login");
            navigate(from, {replace: true});
        } catch (err) {
            setMsg(err.message);
        }
    }
    return (

        <div className={styles.container}>
            <h2 className={styles.title}>LOGIN</h2>
            <form className={styles.form} onSubmit={handleSubmit}>
                <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <Button type="submit">LOGIN</Button>
            </form>

            {msg && <p className={styles.msg}>{msg}</p>}
        </div>
    );
}


