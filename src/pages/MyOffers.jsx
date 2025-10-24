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
        requisitos: "",
        ubicacion: "",
    });

    const [aptitudesRequeridas, setAptitudesRequeridas] = useState([]);

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
            console.error("Error al cargar mis ofertas:", error);
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

        // Validación básica
        if (!form.titulo || !form.descripcion || !form.ubicacion || aptitudesRequeridas.length === 0) {
            toast.error("⚠️ Completá todos los campos y al menos una aptitud");
            return;
        }

        try {
            const payload = {
                ...form,
                requisitos: aptitudesRequeridas, // usamos solo esto como skills
            };

            console.log("Payload a enviar:", payload);
            await api.post("/ofertas", payload);
            toast.success("✅ Oferta publicada correctamente");

            setForm({ titulo: "", descripcion: "", ubicacion: "" });
            setAptitudesRequeridas([]);
            fetchMyOffers();
        } catch (error) {
            console.error("Error al crear oferta:", error);
            toast.error("❌ No se pudo crear la oferta");
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">{t("my_offers")}</h2>

            <form onSubmit={handleSubmit} className="mb-5">
                <div className="form-group mb-3">
                    <label>Título</label>
                    <input
                        type="text"
                        name="titulo"
                        value={form.titulo}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>
                <div className="form-group mb-3">
                    <label>Descripción</label>
                    <textarea
                        name="descripcion"
                        value={form.descripcion}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>
                <div className="form-group mb-3">
                    <label>Ubicación</label>
                    <input
                        type="text"
                        name="ubicacion"
                        value={form.ubicacion}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>
                <div className="form-group mb-3">
                    <label>Aptitudes requeridas</label>
                    <Select
                        options={skillOptions}
                        value={skillOptions.filter((opt) => aptitudesRequeridas.includes(opt.value))}
                        onChange={handleSkillChange}
                        isMulti
                        placeholder="Selecciona las skills necesarias..."
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
                    {t("create_offer")}
                </button>
            </form>

            <ul className="list-group">
                {offers.map((offer) => (
                    <li key={offer.id} className="list-group-item">
                        <strong>{offer.titulo}</strong> - {offer.ubicacion}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MyOffers;
