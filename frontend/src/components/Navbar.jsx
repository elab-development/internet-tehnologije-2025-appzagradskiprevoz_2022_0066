import { Link, useNavigate } from "react-router-dom";
import { getAuth, logout } from "../auth";
import { useEffect, useState } from "react";

export default function Navbar() {
    const navigate = useNavigate();
    const [auth, setAuth] = useState(getAuth());

    useEffect(() => {
        const onStorage = () => setAuth(getAuth());
        window.addEventListener("storage", onStorage);

        const interval = setInterval(() => setAuth(getAuth()), 300);

        return () => {
            window.removeEventListener("storage", onStorage);
            clearInterval(interval);
        };
    }, []);

    function handleLogout() {
        logout();
        setAuth(getAuth());
        navigate("/");
    }

    return (
        <nav style={{display: "flex", gap: 12, padding: 12}}>
            <Link to="/">Home</Link>
            <Link to="/lines">Lines</Link>
            <Link to="/stations">Stations</Link>

            <div style={{ marginLeft: "auto"}}>
                {!auth.isLoggedIn ? (
                    <Link to="/login">Login</Link>   
                ) : (
                    <>
                        <span style={{marginRight: 12}}>👤{auth.email}</span>
                        <button onClick={handleLogout}>Logout</button>
                    </>
                )}
            </div>
        </nav>
    );
}