import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { RegisterUser } from "../auth";
import styles from "./Register.module.css";

export default function Register() {
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || "/";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");


    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!email || !password) {
            setError("Polje je OBAVEZNO!");
            return;
        }

        if (password != password2) {
            setError("Sifre se NE POKLAPAJU!");
            return;
        }

        try {
            await RegisterUser(email, password);
            setSuccess("Uspesno ste registrovani!");

            setTimeout(() => navigate("/"), 1000);
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>REGISTER</h2>

            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.field}>
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>

                <div>
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>

                <div>
                    <input type="password" placeholder="Confirm password" value={password2} onChange={(e) => setPassword2(e.target.value)} />
                </div>

                <button type="submit">REGISTER</button>
            </form>

            <p>
                Vec registrovan? <Link to="/login">Login</Link>
            </p>

            {error && <p className={styles.msg}>{error}</p>}
            {success && <p className={styles.msg}>{success}</p>}


        </div>



    )
}