import { Navigate, useLocation } from "react-router-dom";
import {isLoggedIn} from "../auth";
import { useEffect } from "react";

export default function ProtectedRoute({children}){
    const location = useLocation();

    useEffect(() => {
        if(!isLoggedIn()){
            alert("Za pristup stranici morate biti ulogovani!");
        }
    }, []);

    if (!isLoggedIn()){
        return <Navigate to="/login" replace state = {{from: location}} />;
    }

    return children;
}