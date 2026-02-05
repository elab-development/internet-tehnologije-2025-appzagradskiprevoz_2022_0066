import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Lines from "./pages/Lines";
import Stations from "./pages/Stations";
import Login from "./pages/Login";
import "./App.css";
import { useLocation } from "react-router-dom";



export default function App() {

  const location = useLocation();
  const isLogin = location.pathname === "/login";

  return (
    <>
      <Navbar />
      <div className="page-shell">
        <div className={isLogin ? "login-card" : "page-card"}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/lines" element={<ProtectedRoute><Lines /></ProtectedRoute>} />
            <Route path="/stations" element={<ProtectedRoute><Stations /></ProtectedRoute>} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      </div>
    </>
  );
}