import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

const Login = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPwd, setShowPwd] = useState(false);
    const [loading, setLoading] = useState(false);

    const validate = () => {
        if (!email.trim() || !password.trim()) {
            toast.warn(t("fill_fields", "Completá todos los campos"));
            return false;
        }
        // chequeo simple de email
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
            const res = await api.post("/auth/login", {
                email: email.trim(),
                contraseña: password,
            });

            const { token, user } = res.data;
            login(user, token);

            // Redirección automática según rol
            if (user.rol === "ADMIN") navigate("/admin");
            else if (user.rol === "EMPRESA") navigate("/myoffers");
            else if (user.rol === "USUARIO") navigate("/offers");
            else navigate("/profile");

            toast.success(t("welcome_back", "¡Bienvenido!"));
        } catch (err) {
            console.error("Error login:", err);
            const msg = err?.response?.data?.error || t("login_error", "Error al iniciar sesión");
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-4" style={{ maxWidth: 520 }}>
            <div className="card shadow-sm border-0">
                <div className="card-header bg-primary text-white">
                    <h4 className="mb-0">🔐 {t("login", "Iniciar sesión")}</h4>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit} noValidate>
                        <div className="mb-3">
                            <label className="form-label">{t("email", "Email")}</label>
                            <input
                                type="email"
                                className="form-control"
                                value={email}
                                autoComplete="email"
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">{t("password", "Contraseña")}</label>
                            <div className="input-group">
                                <input
                                    type={showPwd ? "text" : "password"}
                                    className="form-control"
                                    value={password}
                                    autoComplete="current-password"
                                    onChange={(e) => setPassword(e.target.value)}
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
                        </div>

                        <button className="btn btn-primary w-100" type="submit" disabled={loading}>
                            {loading ? t("logging_in", "Ingresando...") : t("login", "Iniciar sesión")}
                        </button>
                    </form>
                </div>
                <div className="card-footer text-muted small">
                    {t("no_account", "¿No tenés cuenta?")}{" "}
                    <a href="/register">{t("register_here", "Registrate acá")}</a>
                </div>
            </div>
        </div>
    );
};

export default Login;
