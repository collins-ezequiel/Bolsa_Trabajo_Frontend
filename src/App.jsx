import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Offers from './pages/Offers';
import MyApplications from './pages/MyApplications';
import MyOffers from './pages/MyOffers';
import AdminPanel from './pages/AdminPanel';
import ProtectedRoute from './components/ProtectedRoute';
import { useTranslation } from 'react-i18next';

import 'bootswatch/dist/slate/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

<ToastContainer position="top-right" autoClose={3000} />

function App() {
    const { t } = useTranslation();

    return (
        <Router>
            <Navbar />
            <ToastContainer position="top-right" autoClose={3000} />
            <Routes>
                {/* Públicas */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protegidas - cualquier usuario logueado */}
                <Route
                    path="/profile"
                    element={<ProtectedRoute><Profile /></ProtectedRoute>}
                />
                <Route
                    path="/offers"
                    element={<ProtectedRoute><Offers /></ProtectedRoute>}
                />

                {/* Solo alumnos (USUARIO) */}
                <Route
                    path="/applications"
                    element={<ProtectedRoute roleRequired="USUARIO"><MyApplications /></ProtectedRoute>}
                />

                {/* Solo empresas (EMPRESA) */}
                <Route
                    path="/myoffers"
                    element={<ProtectedRoute roleRequired="EMPRESA"><MyOffers /></ProtectedRoute>}
                />

                {/* Solo admin (ADMIN) */}
                <Route
                    path="/admin"
                    element={<ProtectedRoute roleRequired="ADMIN"><AdminPanel /></ProtectedRoute>}
                />

                {/* 404 */}
                <Route path="*" element={<h1>{t("page_not_found")}</h1>} />
            </Routes>
        </Router>
    );
}

export default App;
