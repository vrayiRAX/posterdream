// src/pages/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import { API_URL } from '../config';

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }
            try {
                const res = await axios.get(`${API_URL}/api/auth/me`, {
                    headers: { 'x-auth-token': token }
                });
                setUser(res.data);
                setLoading(false);
            } catch (error) {
                console.error("Error al cargar perfil:", error);
                localStorage.removeItem('token'); 
                navigate('/login');
            }
        };
        fetchProfile();
    }, [navigate]);

    if (loading) {
        return (
            <main className="profile-wrapper">
                <h1 style={{color: 'white'}}>Cargando perfil...</h1>
            </main>
        );
    }

    if (!user) {
        return (
            <main className="profile-wrapper">
                <h1 style={{color: 'white'}}>Perfil no encontrado.</h1>
            </main>
        );
    }

    const initial = user.nombre ? user.nombre.charAt(0).toUpperCase() : '?';

    return (
        <main className="profile-wrapper">
            <div className="profile-card">
                {/* Fondo decorativo superior */}
                <div className="profile-header-bg"></div>

                <div className="profile-content">
                    {/* Avatar Circular */}
                    <div className="profile-avatar">
                        {initial}
                    </div>

                    <h1 className="profile-name">{user.nombre}</h1>
                    <span className="profile-role-badge">
                        {user.isAdmin ? 'Administrador' : 'Cliente Verificado'}
                    </span>

                    <div className="profile-info-grid">
                        <div className="profile-field">
                            <span className="profile-label">Correo Electrónico</span>
                            <span className="profile-value">{user.email}</span>
                        </div>

                        <div className="profile-field">
                            <span className="profile-label">RUT / Identificación</span>
                            <span className="profile-value">{user.rut || 'No registrado'}</span>
                        </div>

                        <div className="profile-field">
                            <span className="profile-label">Dirección de Envío</span>
                            <span className="profile-value">{user.direccion || 'Sin dirección registrada'}</span>
                        </div>
                        
                        <div className="profile-field">
                            <span className="profile-label">ID de Usuario</span>
                            <span className="profile-value">#{user._id ? user._id.slice(-6).toUpperCase() : 'N/A'}</span>
                        </div>
                    </div>

                    <div className="profile-actions">
                        {/* BOTÓN ACTUALIZADO: Redirige a '/' (HomePage) */}
                        <button 
                            className="btn-profile-action btn-secondary" 
                            onClick={() => navigate('/Home')} 
                        >
                            Volver al Inicio
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default ProfilePage;