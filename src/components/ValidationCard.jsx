import React from "react";
import { useTranslation } from "react-i18next";

const ValidationCard = ({ validation, onValidate }) => {
    const { t } = useTranslation();

    if (!validation) return null;

    return (
        <div className="card p-3 mb-3 shadow-sm">
            <h3>{validation.title}</h3>
            <p>
                <b>{t("status", "Estado")}:</b>{" "}
                {validation.validated ? t("yes", "Sí") : t("no", "No")}
            </p>
            {!validation.validated && (
                <button
                    className="btn btn-success"
                    onClick={() => onValidate(validation.id)}
                >
                    {t("validate", "Validar")}
                </button>
            )}
        </div>
    );
};

export default ValidationCard;
