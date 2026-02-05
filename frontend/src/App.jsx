import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Lines from "./pages/Lines";
import Stations from "./pages/Stations";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "./App.css";
import { useLocation } from "react-router-dom";



export default function App() {

  const location = useLocation();
  const path = location.pathname;

  let pageClass = "page-card";

  if (path === "/login") {
    pageClass = "login-card";
  } else if (path === "/lines") {
    pageClass = "lines-card";
  }

  return (
    <>
      <Navbar />
      <div className="page-shell">
        <div className={pageClass}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/lines" element={<ProtectedRoute><Lines /></ProtectedRoute>} />
            <Route path="/stations" element={<ProtectedRoute><Stations /></ProtectedRoute>} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      </div>
    </>
  );
}