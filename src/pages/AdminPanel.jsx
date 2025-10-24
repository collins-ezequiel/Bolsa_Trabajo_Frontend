import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useTranslation } from "react-i18next";

const AdminPanel = () => {
    const { t } = useTranslation();
    const [offers, setOffers] = useState([]);
    const [postulations, setPostulations] = useState([]);
    const [validations, setValidations] = useState([]);

    // Cargar datos
    useEffect(() => {
        fetchOffers();
        fetchPostulations();
        fetchValidations();
    }, []);

    const fetchOffers = async () => {
        try {
            const res = await api.get("/ofertas");
            setOffers(res.data);
        } catch (error) {
            console.error("Error cargando ofertas:", error);
        }
    };

    const fetchPostulations = async () => {
        try {
            const res = await api.get("/postulations");
            setPostulations(res.data);
        } catch (error) {
            console.error("Error cargando postulaciones:", error);
        }
    };

    const fetchValidations = async () => {
        try {
            const res = await api.get("/validations");
            setValidations(res.data);
        } catch (error) {
            console.error("Error cargando validaciones:", error);
        }
    };

    // ✅ Aprobar o rechazar validación
    const updateValidationStatus = async (id, estado) => {
        try {
            await api.put(`/validations/${id}`, { estado });
            fetchValidations(); // refrescar lista
        } catch (error) {
            console.error("Error actualizando validación:", error);
        }
    };

    const renderValidationIcon = (estado) => {
        if (estado === "aprobado") return <span className="text-success">✔️</span>;
        if (estado === "rechazado") return <span className="text-danger">❌</span>;
        return <span className="text-warning">⏳</span>;
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">🛡️ {t("admin_panel")}</h2>

            {/* VALIDACIONES */}
            <div className="card shadow mb-4 border-0">
                <div className="card-header bg-dark text-light">
                    <h4 className="mb-0">📜 {t("validations")}</h4>
                </div>
                <div className="card-body">
                    {validations.length === 0 ? (
                        <p>{t("no_validations")}</p>
                    ) : (
                        <table className="table table-hover align-middle">
                            <thead>
                                <tr>
                                    <th>{t("title")}</th>
                                    <th>{t("user")}</th>
                                    <th>{t("status")}</th>
                                    <th>{t("actions")}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {validations.map((v) => (
                                    <tr key={v.id}>
                                        <td>{v.titulo}</td>
                                        <td>
                                            {v.usuarios?.nombre} {v.usuarios?.apellido}
                                        </td>
                                        <td>{renderValidationIcon(v.estado)} {v.estado}</td>
                                        <td>
                                            <button
                                                className="btn btn-success btn-sm me-2"
                                                onClick={() => updateValidationStatus(v.id, "aprobado")}
                                                disabled={v.estado === "aprobado"}
                                            >
                                                ✅ {t("approve", "Aprobar")}
                                            </button>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => updateValidationStatus(v.id, "rechazado")}
                                                disabled={v.estado === "rechazado"}
                                            >
                                                ❌ {t("reject", "Rechazar")}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* OFERTAS */}
            <div className="card shadow mb-4 border-0">
                <div className="card-header bg-primary text-light">
                    <h4 className="mb-0">📢 {t("all_offers")}</h4>
                </div>
                <div className="card-body">
                    {offers.length === 0 ? (
                        <p>{t("no_offers_available")}</p>
                    ) : (
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th>{t("title")}</th>
                                    <th>{t("company")}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {offers.map((o) => (
                                    <tr key={o.id}>
                                        <td>{o.titulo}</td>
                                        <td>{o.usuarios?.nombre || "Empresa desconocida"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* POSTULACIONES */}
            <div className="card shadow mb-4 border-0">
                <div className="card-header bg-success text-light">
                    <h4 className="mb-0">📂 {t("all_applications")}</h4>
                </div>
                <div className="card-body">
                    {postulations.length === 0 ? (
                        <p>{t("no_applications")}</p>
                    ) : (
                        <table className="table table-hover align-middle">
                            <thead>
                                <tr>
                                    <th>{t("student")}</th>
                                    <th>{t("offer")}</th>
                                    <th>{t("status")}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {postulations.map((p) => (
                                    <tr key={p.id}>
                                        <td>
                                            {p.usuarios?.nombre} {p.usuarios?.apellido}
                                        </td>
                                        <td>{p.ofertaslaborales?.titulo}</td>
                                        <td>{p.estado}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;
