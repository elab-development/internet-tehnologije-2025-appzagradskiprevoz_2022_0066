import { Link, useNavigate, useLocation } from "react-router-dom";
import { getAuth, logout } from "../auth";
import { useEffect, useState, useRef } from "react";
import "./Navbar.css";
import { FaUserCircle } from "react-icons/fa";

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [auth, setAuth] = useState(getAuth());
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(e) {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const syncAuth = () => setAuth(getAuth());

        window.addEventListener("storage", syncAuth);
        window.addEventListener("auth", syncAuth);

        return () => {
            window.removeEventListener("storage", syncAuth);
            window.removeEventListener("auth", syncAuth);
        };
    }, []);


    function handleLogout() {
        logout();
        setAuth(getAuth());
        navigate("/");
    }

    return (
        <nav className="navbar">
            <div className="nav-left">
                <Link className="nav-link" to="/">Home</Link>
                {auth.isLoggedIn ? (
                    <Link className="nav-link" to="/lines">Lines</Link>
                ) : (
                    <Link className="nav-link" to="/login" state={{ from: { pathname: "/lines" } }}
                        onClick={() => alert("Za pristup stranici morate biti ulogovani!")}  >Lines</Link>
                )}

                {auth.isLoggedIn ? (
                    <Link className="nav-link" to="/stations">Stations</Link>
                ) : (
                    <Link className="nav-link" to="/login" state={{ from: { pathname: "/stations" } }} 
                        onClick={() => alert("Za pristup stranici morate biti ulogovani!")}>Stations</Link>
                )}
            </div>

            <div className="nav-right">
                {!auth.isLoggedIn ? (
                    <Link className="nav-link" to="/login">Login</Link>
                ) : (
                    <>
                        <div className="user-menu" ref={menuRef}>
                            <button type="button" className="user-trigger" onClick={() => setMenuOpen((v) => !v)}>
                                <FaUserCircle className="user-icon" />
                                <span className="user-email">{auth.email}</span>
                            </button>

                            {menuOpen && (
                                <div className="dropdown">
                                    <button type="button" className="dropdown-item" onClick={handleLogout}> Logout </button>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </nav>
    );
}