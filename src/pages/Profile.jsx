import React, { useEffect, useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import ValidationForm from "../components/ValidationForm";
import { toast } from "react-toastify";
import Select from "react-select";

const Profile = () => {
    const { t } = useTranslation();
    const { token } = useContext(AuthContext);

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [validations, setValidations] = useState([]);

    const [descripcion, setDescripcion] = useState("");
    const [aptitudes, setAptitudes] = useState([]);
    const [experiencia, setExperiencia] = useState([]);
    const [educacion, setEducacion] = useState([]);

    const skillsList = [
        "JavaScript", "React", "Node.js", "Express", "MongoDB",
        "SQL", "Python", "Django", "Java", "Spring Boot",
        "AWS", "Docker", "Kubernetes", "CI/CD", "Agile",
        "Git", "Figma", "TypeScript", "Next.js", "Vue.js"
    ];

    const skillOptions = skillsList.map((s) => ({ label: s, value: s }));

    const handleSkillChange = (selectedOptions) => {
        setAptitudes(selectedOptions.map(opt => opt.value));
    };

    const fetchProfile = async () => {
        try {
            const res = await api.get("/profiles", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = res.data;
            setProfile(data);
            setDescripcion(data.descripcion || "");
            setAptitudes(data.aptitudes || []);
            setExperiencia(data.experiencia || []);
            setEducacion(data.educacion || []);
        } catch (error) {
            toast.error("Error al cargar el perfil");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put(
                "/profiles",
                { descripcion, aptitudes, experiencia, educacion },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("✅ Perfil actualizado correctamente");
        } catch (error) {
            toast.error("❌ Error al actualizar el perfil");
        }
    };

    if (loading) return <p>Cargando perfil...</p>;

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Editar Perfil</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group mb-3">
                    <label>Descripción</label>
                    <textarea
                        className="form-control"
                        placeholder="Descripción"
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                    />
                </div>

                <div className="form-group mb-3">
                    <label>Aptitudes</label>
                    <Select
                        options={skillOptions}
                        value={skillOptions.filter((opt) => aptitudes.includes(opt.value))}
                        onChange={handleSkillChange}
                        isMulti
                        placeholder="Selecciona tus habilidades..."
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

                <button type="submit" className="btn btn-primary">
                    Guardar perfil
                </button>
            </form>

            <div className="mt-5">
                <ValidationForm validations={validations} />
            </div>
        </div>
    );
};

export default Profile;
