import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token") || null);

    useEffect(() => {
        if (token) {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);

                // 🔥 Normalizamos el rol a mayúsculas SIEMPRE
                parsedUser.rol = parsedUser.rol?.toUpperCase();

                setUser(parsedUser);
            }
        }
    }, [token]);

    const login = (userData, authToken) => {
        // 🔥 Normalizamos el rol antes de guardar
        const normalizedUser = { ...userData, rol: userData.rol?.toUpperCase() };

        localStorage.setItem("token", authToken);
        localStorage.setItem("user", JSON.stringify(normalizedUser));

        setUser(normalizedUser);
        setToken(authToken);
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
