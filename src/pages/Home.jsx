import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Home = () => {
    const { t } = useTranslation();
    const { user } = useContext(AuthContext);

    // Renderizar botón de acción principal según el rol
    const renderActionButton = () => {
        if (!user) {
            return (
                <>
                    <Link to="/login" className="btn btn-primary btn-lg mt-3 me-2">
                        🔑 {t("login")}
                    </Link>
                    <Link to="/register" className="btn btn-success btn-lg mt-3">
                        📝 {t("register")}
                    </Link>
                </>
            );
        }

        switch (user.rol) {
            case "USUARIO":
                return (
                    <Link to="/offers" className="btn btn-primary btn-lg mt-3">
                        🔍 {t("see_offers")}
                    </Link>
                );
            case "EMPRESA":
                return (
                    <Link to="/myoffers" className="btn btn-success btn-lg mt-3">
                        📢 {t("manage_offers")}
                    </Link>
                );
            case "ADMIN":
                return (
                    <Link to="/admin" className="btn btn-warning btn-lg mt-3">
                        🛡️ {t("admin_panel")}
                    </Link>
                );
            default:
                return null;
        }
    };

    return (
        <div className="container text-center py-5">
            {/* Hero principal */}
            <div className="p-5 mb-4 bg-dark text-light rounded-3 shadow-lg">
                <div className="container-fluid py-5">
                    <h1 className="display-4 fw-bold">{t("home")}</h1>
                    <p className="fs-5">
                        {t(
                            "welcome_message",
                            "Bienvenido a la Bolsa de Trabajo ET36, conecta con oportunidades laborales y crece profesionalmente."
                        )}
                    </p>
                    {renderActionButton()}
                </div>
            </div>

            {/* Sección secundaria */}
            <div className="row">
                <div className="col-md-4">
                    <div className="card shadow-sm mb-4">
                        <div className="card-body">
                            <h5 className="card-title">👨‍🎓 {t("students")}</h5>
                            <p className="card-text">{t("students_desc")}</p>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card shadow-sm mb-4">
                        <div className="card-body">
                            <h5 className="card-title">🏢 {t("companies")}</h5>
                            <p className="card-text">{t("companies_desc")}</p>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card shadow-sm mb-4">
                        <div className="card-body">
                            <h5 className="card-title">🛡️ {t("admin")}</h5>
                            <p className="card-text">{t("admin_desc")}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
