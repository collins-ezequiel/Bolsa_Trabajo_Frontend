import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useTranslation } from "react-i18next";

const MyApplications = () => {
    const { t } = useTranslation();
    const [apps, setApps] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchApplications = async () => {
        try {
            const { data } = await api.get("/postulations/mine");
            setApps(data || []);
        } catch (error) {
            console.error("Error cargando postulaciones:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    const Pill = ({ estado }) => {
        const map = { aprobado: "success", rechazado: "danger", pendiente: "warning", cancelado: "secondary" };
        const bs = map[estado] || "secondary";
        return <span className={`badge bg-${bs}`}>{t(estado, estado)}</span>;
    };

    if (loading) return <p>{t("loading", "Cargando...")}</p>;

    return (
        <div className="container mt-4">
            <h2 className="mb-3">🗂️ {t("my_applications", "Mis Postulaciones")}</h2>

            {apps.length === 0 ? (
                <p>{t("no_applications", "No te has postulado a ninguna oferta.")}</p>
            ) : (
                <div className="list-group">
                    {apps.map((p) => (
                        <div key={p.id} className="list-group-item d-flex justify-content-between align-items-center">
                            <div>
                                <div className="fw-semibold">{p.ofertaslaborales?.titulo || t("unknown_offer", "Oferta desconocida")}</div>
                                <small className="text-muted">
                                    {t("company", "Empresa")}: {p.ofertaslaborales?.usuarios?.nombre || t("unknown_company", "Empresa desconocida")}
                                </small>
                            </div>
                            <Pill estado={p.estado || "pendiente"} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyApplications;
