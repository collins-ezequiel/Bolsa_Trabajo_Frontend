import React from "react";
import { useTranslation } from "react-i18next";

const UserCard = ({ user, status }) => {
    const { t } = useTranslation();

    if (!user) return null;

    return (
        <div className="card p-3 mb-3 shadow-sm">
            <h4>{user.name}</h4>
            <p><b>{t("email")}:</b> {user.email}</p>
            <p><b>{t("role")}:</b> {user.role}</p>
            {user.skills && (
                <p><b>{t("skills", "Habilidades")}:</b> {user.skills.join(", ")}</p>
            )}
            <p>
                <b>{t("status", "Estado")}:</b> {status || t("pending", "Pendiente")}
            </p>
        </div>
    );
};

export default UserCard;
