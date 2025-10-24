import React from "react";
import { useTranslation } from "react-i18next";

const ProfileCard = ({ user }) => {
    const { t } = useTranslation();

    if (!user) return null;

    return (
        <div className="card p-3 mb-3 shadow-sm">
            <h3>{user.name}</h3>
            <p><b>{t("email")}:</b> {user.email}</p>
            <p><b>{t("role")}:</b> {user.role}</p>
            {user.skills && (
                <p><b>{t("skills", "Habilidades")}:</b> {user.skills.join(", ")}</p>
            )}
        </div>
    );
};

export default ProfileCard;
