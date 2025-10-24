import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import api from "../services/api";
import UserCard from "../components/UserCard";
import { toast } from "react-toastify";

const Postulations = () => {
    const { t } = useTranslation();
    const [postulations, setPostulations] = useState([]);

    const fetchPostulations = async () => {
        try {
            const res = await api.get("/postulations");
            setPostulations(res.data);
        } catch (err) {
            console.error("Error al cargar postulaciones:", err);
            toast.error(t("error_fetch_postulations", "Error al cargar postulaciones"));
        }
    };

    useEffect(() => {
        fetchPostulations();
    }, []);

    return (
        <div className="container py-4">
            <h1>{t("postulations", "Postulaciones recibidas")}</h1>
            {postulations.length === 0 ? (
                <p>{t("no_postulations", "No hay postulaciones en tus ofertas")}</p>
            ) : (
                postulations.map((p) => (
                    <div key={p.id} className="mb-4">
                        <h3>{t("offer", "Oferta")}: {p.offer.title}</h3>
                        <UserCard user={p.user} status={p.status} />
                    </div>
                ))
            )}
        </div>
    );
};

export default Postulations;
