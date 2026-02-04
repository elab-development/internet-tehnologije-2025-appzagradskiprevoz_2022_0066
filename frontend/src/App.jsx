import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";          // napravi ovaj fajl
import Home from "./pages/Home";
import Lines from "./pages/Lines";
import Stations from "./pages/Stations";
import Login from "./pages/Login";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/lines" element={<Lines />} />
        <Route path="/stations" element={<Stations />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
}