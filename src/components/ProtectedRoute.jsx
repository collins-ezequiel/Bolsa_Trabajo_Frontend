import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

/**
 * Protege rutas según autenticación y rol.
 * @param {ReactNode} children - El componente a renderizar.
 * @param {string} roleRequired - Rol necesario para acceder (opcional).
 */
const ProtectedRoute = ({ children, roleRequired }) => {
    const { user, token } = useContext(AuthContext);

    // Si no hay token -> redirigir a login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Si hay restricción de rol y no coincide -> redirigir al perfil
    if (roleRequired && user?.rol !== roleRequired) {
        return <Navigate to="/profile" replace />;
    }

    return children;
};

export default ProtectedRoute;
