import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import { useTranslation } from "react-i18next";

const Offers = () => {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);
  const [offers, setOffers] = useState([]);

  const fetchOffers = async () => {
    try {
      const { data } = await api.get("/ofertas");
      setOffers(data || []);
    } catch (error) {
      console.error("Error cargando ofertas:", error);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleApply = async (offerId) => {
    try {
      const { data: created } = await api.post("/postulations", { oferta_id: offerId });
      alert(t("applied_success", "Postulación enviada"));
      setOffers((prev) =>
        prev.map((o) => (o.id === offerId ? { ...o, postulaciones: [...(o.postulaciones || []), created] } : o))
      );
    } catch (error) {
      console.error("Error al postularse:", error);
      alert(t("error_applying", "Error al postularse"));
    }
  };

  const handleCancel = async (offerId) => {
    try {
      const offer = offers.find((o) => o.id === offerId);
      const myPost = offer?.postulaciones?.find((p) => p.usuario_id === user.id);
      if (!myPost?.id) return alert(t("no_user_postulation_found", "No se encontró tu postulación."));
      if (!window.confirm(t("confirm_cancel", "¿Cancelar tu postulación?"))) return;

      await api.delete(`/postulations/${myPost.id}`);
      alert(t("application_cancelled", "Postulación cancelada"));
      setOffers((prev) =>
        prev.map((o) =>
          o.id === offerId ? { ...o, postulaciones: (o.postulaciones || []).filter((p) => p.id !== myPost.id) } : o
        )
      );
    } catch (error) {
      console.error("Error al cancelar postulación:", error);
      alert(t("error_cancelling", "No se pudo cancelar la postulación."));
    }
  };

  const formatDate = (iso) => {
    if (!iso) return t("not_specified", "No especificada");
    try {
      return new Date(iso).toLocaleDateString();
    } catch {
      return t("not_specified", "No especificada");
    }
  };

  const StatusPill = ({ estado }) => {
    const map = { aprobado: "success", rechazado: "danger", pendiente: "warning", cancelado: "secondary" };
    const bs = map[estado] || "secondary";
    return <span className={`badge bg-${bs}`}>{t(estado, estado)}</span>;
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">
        <span role="img" aria-label="briefcase">💼</span> {t("job_offers", "Job Offers")}
      </h2>

      {offers.length === 0 ? (
        <p className="text-center">{t("no_offers_available", "No hay ofertas disponibles por el momento.")}</p>
      ) : (
        <div className="row g-4">
          {offers.map((o) => {
            const myPost = o.postulaciones?.find((p) => p.usuario_id === user.id);
            const alreadyApplied = Boolean(myPost);

            return (
              <div key={o.id} className="col-md-6">
                <div className="card shadow-sm border rounded-3 bg-gray-900 text-light">
                  {/* Header con contraste fuerte */}
                  <div className="card-header bg-primary text-white fw-semibold">
                    {o.titulo}
                  </div>

                  {/* Body con tipografía clara y labels resaltados */}
                  <div className="card-body">
                    <p className="mb-3 text-light-emphasis">{o.descripcion}</p>

                    <dl className="row mb-0 small">
                      <dt className="col-4 text-secondary">{t("company", "Company")}:</dt>
                      <dd className="col-8">{o.usuarios?.nombre || t("unknown_company", "Unknown company")}</dd>

                      <dt className="col-4 text-secondary">{t("location", "Location")}:</dt>
                      <dd className="col-8">{o.ubicacion || t("not_specified", "Not specified")}</dd>

                      {o.requisitos?.length > 0 && (
                        <>
                          <dt className="col-4 text-secondary">{t("requirements", "Requirements")}:</dt>
                          <dd className="col-8">{o.requisitos.join(", ")}</dd>
                        </>
                      )}

                      <dt className="col-4 text-secondary">🗓️ {t("posted_on", "Posted on")}:</dt>
                      <dd className="col-8">{formatDate(o.fecha_publicacion)}</dd>
                    </dl>
                  </div>

                  {/* Footer con fondo contrastado y acciones claras */}
                  <div className="card-footer d-flex justify-content-between align-items-center bg-gray-850">
                    <div className="small">
                      {alreadyApplied ? (
                        <>
                          <span className="me-2">✅ {t("applied", "Applied")}</span>
                          {myPost?.estado && <StatusPill estado={myPost.estado} />}
                        </>
                      ) : (
                        <span className="text-secondary">{t("not_applied_yet", "Not applied yet")}</span>
                      )}
                    </div>

                    {!alreadyApplied ? (
                      <button className="btn btn-success btn-sm px-3" onClick={() => handleApply(o.id)}>
                        {t("apply", "Apply")}
                      </button>
                    ) : (
                      <button
                        className="btn btn-outline-danger btn-sm px-3"
                        onClick={() => handleCancel(o.id)}
                        title={t("cancel_application", "Cancel application")}
                      >
                        {t("cancel_application", "Cancel application")}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Offers;
