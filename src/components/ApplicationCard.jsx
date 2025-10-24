import React from "react";
import { useTranslation } from "react-i18next";

const ApplicationCard = ({ application }) => {
    const { t } = useTranslation();

    if (!application) return null;

    return (
        <div className="card p-3 mb-3 shadow-sm">
            <h3>{application.offer.title}</h3>
            <p>{application.offer.description}</p>
            <p>
                <b>{t("status", "Estado")}:</b> {application.status || t("pending", "Pendiente")}
            </p>
        </div>
    );
};

export default ApplicationCard;
