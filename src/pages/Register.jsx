import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import api from "../services/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [lastname, setLastname] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("USUARIO");
    const [password, setPassword] = useState("");
    const [showPwd, setShowPwd] = useState(false);
    const [loading, setLoading] = useState(false);

    const validate = () => {
        if (!name.trim() || !lastname.trim() || !email.trim() || !password.trim()) {
            toast.warn(t("fill_fields", "Completá todos los campos"));
            return false;
        }
        if (password.length < 6) {
            toast.warn(t("pwd_min", "La contraseña debe tener al menos 6 caracteres"));
            return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            toast.warn(t("invalid_email", "Email inválido"));
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            setLoading(true);
            await api.post("/auth/register", {
                nombre: name.trim(),
                apellido: lastname.trim(),
                email: email.trim(),
                contraseña: password,
                rol: role,
            });
            toast.success(t("register_success", "Registro exitoso"));
            navigate("/login");
        } catch (err) {
            console.error("Error register:", err);
            const msg = err?.response?.data?.error || t("register_error", "Error al registrarse");
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-4" style={{ maxWidth: 720 }}>
            <div className="card shadow-sm border-0">
                <div className="card-header bg-success text-white">
                    <h4 className="mb-0">📝 {t("register", "Registrarse")}</h4>
                </div>

                <div className="card-body">
                    <form onSubmit={handleSubmit} noValidate>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label className="form-label">{t("name", "Nombre")}</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    autoComplete="given-name"
                                    required
                                />
                            </div>

                            <div className="col-md-6">
                                <label className="form-label">{t("lastname", "Apellido")}</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={lastname}
                                    onChange={(e) => setLastname(e.target.value)}
                                    autoComplete="family-name"
                                    required
                                />
                            </div>

                            <div className="col-md-6">
                                <label className="form-label">{t("email", "Email")}</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    autoComplete="email"
                                    required
                                />
                            </div>

                            <div className="col-md-6">
                                <label className="form-label">{t("role", "Rol")}</label>
                                <select
                                    className="form-select"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                >
                                    <option value="USUARIO">{t("student", "Alumno / Egresado")}</option>
                                    <option value="EMPRESA">{t("company", "Empresa")}</option>
                                </select>
                            </div>

                            <div className="col-12">
                                <label className="form-label">{t("password", "Contraseña")}</label>
                                <div className="input-group">
                                    <input
                                        type={showPwd ? "text" : "password"}
                                        className="form-control"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        autoComplete="new-password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary"
                                        onClick={() => setShowPwd((v) => !v)}
                                    >
                                        {showPwd ? t("hide", "Ocultar") : t("show", "Mostrar")}
                                    </button>
                                </div>
                                <div className="form-text">{t("pwd_hint", "Mínimo 6 caracteres")}</div>
                            </div>
                        </div>

                        <button className="btn btn-success mt-3 w-100" type="submit" disabled={loading}>
                            {loading ? t("registering", "Registrando...") : t("register", "Registrarse")}
                        </button>
                    </form>
                </div>

                <div className="card-footer text-muted small">
                    {t("have_account", "¿Ya tenés cuenta?")}{" "}
                    <a href="/login">{t("login_here", "Iniciá sesión acá")}</a>
                </div>
            </div>
        </div>
    );
};

export default Register;
