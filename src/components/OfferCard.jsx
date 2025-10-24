import React from "react";
import { useTranslation } from "react-i18next";

const OfferCard = ({ offer, onApply, onDelete }) => {
  const { t } = useTranslation();

  if (!offer) return null;

  return (
    <div className="card p-3 mb-3 shadow-sm">
      <h3>{offer.title}</h3>
      <p>{offer.description}</p>
      <p><b>{t("company", "Empresa")}:</b> {offer.company?.name}</p>
      <p><b>{t("location", "Ubicación")}:</b> {offer.location}</p>

      {onApply && (
        <button className="btn btn-primary" onClick={() => onApply(offer.id)}>
          {t("apply", "Postularme")}
        </button>
      )}

      {onDelete && (
        <button className="btn btn-danger ms-2" onClick={() => onDelete(offer.id)}>
          {t("delete", "Eliminar")}
        </button>
      )}
    </div>
  );
};

export default OfferCard;
