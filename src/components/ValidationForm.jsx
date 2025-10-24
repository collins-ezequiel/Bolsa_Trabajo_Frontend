// src/components/ValidationForm.jsx
import React, { useState } from "react";
import api from "../services/api";
import { useTranslation } from "react-i18next";

const ValidationForm = () => {
    const { t } = useTranslation();
    const [titulo, setTitulo] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post("/validations", { titulo });
            alert(t("validation_requested"));
            setTitulo("");
        } catch (error) {
            console.error("Error creando validación:", error);
            alert(t("error_creating_validation"));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mb-3">
            <label className="form-label">{t("title_to_validate")}</label>
            <input
                type="text"
                className="form-control"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                required
            />
            <button type="submit" className="btn btn-primary mt-2">
                {t("request_validation")}
            </button>
        </form>
    );
};

export default ValidationForm;
