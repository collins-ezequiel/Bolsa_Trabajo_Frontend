import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useTranslation } from "react-i18next";
import Select from "react-select";
import { toast } from "react-toastify";

const MyOffers = () => {
    const { t } = useTranslation();
    const [offers, setOffers] = useState([]);
    const [form, setForm] = useState({
        titulo: "",
        descripcion: "",
        ubicacion: "",
    });

    const [aptitudesRequeridas, setAptitudesRequeridas] = useState([]);
    const [expandedOfferId, setExpandedOfferId] = useState(null);
    const [postulantes, setPostulantes] = useState({});
    const [perfilesUsuarios, setPerfilesUsuarios] = useState({});

    const skillsList = [
        "JavaScript", "React", "Node.js", "Express", "MongoDB",
        "SQL", "Python", "Django", "Java", "Spring Boot",
        "AWS", "Docker", "Kubernetes", "CI/CD", "Agile",
        "Git", "Figma", "TypeScript", "Next.js", "Vue.js"
    ];

    const skillOptions = skillsList.map((s) => ({ label: s, value: s }));

    const handleSkillChange = (selectedOptions) => {
        setAptitudesRequeridas(selectedOptions.map((opt) => opt.value));
    };

    const fetchMyOffers = async () => {
        try {
            const res = await api.get("/ofertas/mine");
            setOffers(res.data);
        } catch (error) {
            toast.error(t("error_loading_offers", "Error loading your offers"));
        }
    };

    const fetchPostulantes = async (ofertaId) => {
        try {
            const res = await api.get("/postulations");
            const filtered = res.data.filter(p => p.oferta_id === ofertaId);
            setPostulantes(prev => ({ ...prev, [ofertaId]: filtered }));

            for (const p of filtered) {
                if (!perfilesUsuarios[p.usuario_id]) {
                    const perfilRes = await api.get(`/profiles/user/${p.usuario_id}`);
                    setPerfilesUsuarios(prev => ({ ...prev, [p.usuario_id]: perfilRes.data }));
                }
            }
        } catch (error) {
            toast.error(t("error_loading_applicants", "Error loading applicants"));
        }
    };

    useEffect(() => {
        fetchMyOffers();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.titulo || !form.descripcion || !form.ubicacion || aptitudesRequeridas.length === 0) {
            toast.error(t("complete_all_fields", "⚠️ Please complete all fields and add at least one skill"));
            return;
        }
        try {
            const payload = {
                ...form,
                requisitos: aptitudesRequeridas,
            };
            await api.post("/ofertas", payload);
            toast.success(t("offer_posted", "✅ Offer posted successfully"));
            setForm({ titulo: "", descripcion: "", ubicacion: "" });
            setAptitudesRequeridas([]);
            fetchMyOffers();
        } catch (error) {
            toast.error(t("error_offer_creation", "❌ Failed to create offer"));
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm(t("confirm_delete", "Are you sure you want to delete this offer?"))) return;
        try {
            await api.delete(`/ofertas/${id}`);
            toast.success(t("offer_deleted", "Offer deleted"));
            fetchMyOffers();
        } catch (error) {
            toast.error(t("error_deleting_offer", "Failed to delete offer"));
        }
    };

    const handleEstadoChange = async (postulacionId, estado) => {
        try {
            await api.patch(`/postulations/${postulacionId}`, { estado });
            toast.success(t("status_updated", "Status updated"));
            fetchPostulantes(expandedOfferId);
        } catch (error) {
            toast.error(t("error_updating_status", "Error updating status"));
        }
    };

    const togglePostulantes = (ofertaId) => {
        const isOpen = expandedOfferId === ofertaId;
        setExpandedOfferId(isOpen ? null : ofertaId);
        if (!isOpen) fetchPostulantes(ofertaId);
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">{t("my_offers", "My Offers")}</h2>

            <form onSubmit={handleSubmit} className="mb-5">
                <div className="form-group mb-3">
                    <label>{t("title", "Title")}</label>
                    <input type="text" name="titulo" value={form.titulo} onChange={handleChange} className="form-control" />
                </div>
                <div className="form-group mb-3">
                    <label>{t("description", "Description")}</label>
                    <textarea name="descripcion" value={form.descripcion} onChange={handleChange} className="form-control" />
                </div>
                <div className="form-group mb-3">
                    <label>{t("location", "Location")}</label>
                    <input type="text" name="ubicacion" value={form.ubicacion} onChange={handleChange} className="form-control" />
                </div>
                <div className="form-group mb-3">
                    <label>{t("required_skills", "Required Skills")}</label>
                    <Select
                        options={skillOptions}
                        value={skillOptions.filter((opt) => aptitudesRequeridas.includes(opt.value))}
                        onChange={handleSkillChange}
                        isMulti
                        placeholder={t("select_required_skills", "Select required skills...")}
                        theme={(theme) => ({
                            ...theme,
                            borderRadius: 4,
                            colors: {
                                ...theme.colors,
                                primary25: '#cce5ff',
                                primary: '#007bff',
                            },
                        })}
                    />
                </div>
                <button type="submit" className="btn btn-success">
                    {t("create_offer", "Create Offer")}
                </button>
            </form>

            <ul className="list-group">
                {offers.map((offer) => (
                    <li key={offer.id} className="list-group-item">
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <strong>{offer.titulo}</strong> - {offer.ubicacion}
                            </div>
                            <div>
                                <button className="btn btn-outline-danger btn-sm me-2" onClick={() => handleDelete(offer.id)}>
                                    {t("delete", "Delete")}
                                </button>
                                <button className="btn btn-outline-primary btn-sm" onClick={() => togglePostulantes(offer.id)}>
                                    {t("view_applicants", "View Applicants")}
                                </button>
                            </div>
                        </div>

                        {expandedOfferId === offer.id && postulantes[offer.id] && (
                            <ul className="mt-3">
                                {postulantes[offer.id].length === 0 ? (
                                    <li>{t("no_applicants", "No applicants yet")}</li>
                                ) : (
                                    postulantes[offer.id].map((p) => {
                                        const perfil = perfilesUsuarios[p.usuario_id];
                                        return (
                                            <li key={p.id} className="border rounded p-2 mb-2">
                                                <div className="mb-2">
                                                    <strong>{t("user", "User")}: {p.usuario_id}</strong> - {t("status", "Status")}: {p.estado}
                                                </div>
                                                {perfil && (
                                                    <div className="mb-2">
                                                        <p><strong>{t("description", "Description")}:</strong> {perfil.descripcion}</p>
                                                        <p><strong>{t("skills", "Skills")}:</strong> {perfil.aptitudes?.join(", ")}</p>
                                                        <p><strong>{t("education", "Education")}:</strong> {perfil.educacion?.join(", ")}</p>
                                                        <p><strong>{t("experience", "Experience")}:</strong> {perfil.experiencia?.join(", ")}</p>
                                                    </div>
                                                )}
                                                <div>
                                                    <button className="btn btn-outline-success btn-sm me-2" onClick={() => handleEstadoChange(p.id, "aprobado")}>
                                                        {t("approve", "Approve")}
                                                    </button>
                                                    <button className="btn btn-outline-danger btn-sm" onClick={() => handleEstadoChange(p.id, "rechazado")}>
                                                        {t("reject", "Reject")}
                                                    </button>
                                                </div>
                                            </li>
                                        );
                                    })
                                )}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MyOffers;