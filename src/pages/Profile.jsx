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

    // Estados inicializados con valores por defecto
    const [profile, setProfile] = useState({
        descripcion: "",
        aptitudes: [],
        experiencia: [],
        educacion: []
    });
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

    const handleExperienciaChange = (e, index) => {
        const updated = [...experiencia];
        updated[index] = e.target.value;
        setExperiencia(updated);
    };

    const handleEducacionChange = (e, index) => {
        const updated = [...educacion];
        updated[index] = e.target.value;
        setEducacion(updated);
    };

    const addExperiencia = () => setExperiencia([...experiencia, ""]);
    const addEducacion = () => setEducacion([...educacion, ""]);

    // Fetch profile del usuario
    const fetchProfile = async () => {
        try {
            const res = await api.get("/profiles");
            const data = res.data;

            if (data) {
                setProfile(data);
                setDescripcion(data.descripcion || "");
                setAptitudes(data.aptitudes || []);
                setExperiencia(data.experiencia || []);
                setEducacion(data.educacion || []);
            }
            // si no hay data, profile ya está inicializado vacío
        } catch (error) {
            toast.error(t("error_loading_profile", "Error loading profile"));
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
            toast.success(t("profile_updated", "Profile updated successfully"));
        } catch (error) {
            toast.error(t("error_updating_profile", "Error updating profile"));
        }
    };

    if (loading) return <p>{t("loading", "Loading profile...")}</p>;

    return (
        <div className="container mt-4">
            <h2 className="mb-4">{t("edit_profile", "Edit Profile")}</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group mb-3">
                    <label>{t("description", "Description")}</label>
                    <textarea
                        className="form-control"
                        placeholder={t("description", "Description")}
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                    />
                </div>

                <div className="form-group mb-3">
                    <label>{t("skills", "Skills")}</label>
                    <Select
                        options={skillOptions}
                        value={skillOptions.filter((opt) => aptitudes.includes(opt.value))}
                        onChange={handleSkillChange}
                        isMulti
                        placeholder={t("select_skills", "Select your skills...")}
                        theme={(theme) => ({
                            ...theme,
                            borderRadius: 4,
                            colors: { ...theme.colors, primary25: '#cce5ff', primary: '#007bff' },
                        })}
                    />
                </div>

                <div className="form-group mb-3">
                    <label>{t("experience", "Experience")}</label>
                    {experiencia.map((exp, idx) => (
                        <input
                            key={idx}
                            type="text"
                            value={exp}
                            onChange={(e) => handleExperienciaChange(e, idx)}
                            className="form-control mb-2"
                            placeholder={t("experience_entry", "Experience entry")}
                        />
                    ))}
                    <button type="button" className="btn btn-outline-secondary btn-sm" onClick={addExperiencia}>
                        {t("add_experience", "Add Experience")}
                    </button>
                </div>

                <div className="form-group mb-4">
                    <label>{t("education", "Education")}</label>
                    {educacion.map((edu, idx) => (
                        <input
                            key={idx}
                            type="text"
                            value={edu}
                            onChange={(e) => handleEducacionChange(e, idx)}
                            className="form-control mb-2"
                            placeholder={t("education_entry", "Education entry")}
                        />
                    ))}
                    <button type="button" className="btn btn-outline-secondary btn-sm" onClick={addEducacion}>
                        {t("add_education", "Add Education")}
                    </button>
                </div>

                <button type="submit" className="btn btn-primary">
                    {t("save_profile", "Save Profile")}
                </button>
            </form>

            <div className="mt-5">
                <ValidationForm validations={validations} />
            </div>
        </div>
    );
};

export default Profile;
