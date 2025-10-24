// src/components/Navbar.jsx
import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const { user, logout } = useContext(AuthContext);

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    const role = user?.rol?.toUpperCase();

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">
                    Bolsa de Trabajo
                </Link>

                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav me-auto">
                        {/* Todos los usuarios logueados ven Perfil */}
                        {role === "USUARIO" && (
                            <li className="nav-item">
                                <Link to="/profile" className="nav-link">
                                    {t("profile")}
                                </Link>
                            </li>
                        )}

                        {/* Rol USUARIO */}
                        {role === "USUARIO" && (
                            <>
                                <li className="nav-item">
                                    <Link to="/offers" className="nav-link">
                                        {t("offers")}
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/applications" className="nav-link">
                                        {t("my_applications")}
                                    </Link>
                                </li>
                            </>
                        )}

                        {/* Rol EMPRESA */}
                        {role === "EMPRESA" && (
                            <li className="nav-item">
                                <Link to="/myoffers" className="nav-link">
                                    {t("my_offers")}
                                </Link>
                            </li>
                        )}

                        {/* Rol ADMIN */}
                        {role === "ADMIN" && (
                            <li className="nav-item">
                                <Link to="/admin" className="nav-link">
                                    {t("admin_panel")}
                                </Link>
                            </li>
                        )}
                    </ul>

                    {/* Idioma y login/logout */}
                    <div className="d-flex align-items-center">
                        <select
                            onChange={(e) => changeLanguage(e.target.value)}
                            value={i18n.language}
                            className="form-select me-2"
                            style={{ width: "auto" }}
                        >
                            <option value="es">🇪🇸 Español</option>
                            <option value="en">🇺🇸 English</option>
                        </select>

                        {user ? (
                            <button
                                className="btn btn-outline-light"
                                onClick={() => {
                                    logout();
                                    navigate("/login");
                                }}
                            >
                                {t("logout")}
                            </button>
                        ) : (
                            <>
                                <Link to="/login" className="btn btn-outline-light me-2">
                                    {t("login")}
                                </Link>
                                <Link to="/register" className="btn btn-primary">
                                    {t("register")}
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
