import {Routes, Route, Navigate} from "react-router-dom";
import Navbar from "./components/Navbar"
import Home from "./pages/Home";
import Lines from "./pages/Lines";
import Login from "./pages/Login";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/lines" element={<Lines />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/" replace/>} />
      </Routes>
    </>
  )
}
