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
                localStorage.removeItem('token'); // Token inválido o expirado
                navigate('/login');
            }
        };
        fetchProfile();
    }, [navigate]);

    if (loading) {
        return <main className="cart-outer" style={{ color: 'white' }}><h1>Cargando perfil...</h1></main>;
    }

    if (!user) {
        return <main className="cart-outer" style={{ color: 'white' }}><h1>Perfil no encontrado.</h1></main>;
    }

    return (
        <main className="cart-outer" style={{ color: 'white' }}>
            <div className="cart-super-container">
                <h1>👤 Mi Perfil</h1>
                <div className="profile-details" style={{ backgroundColor: '#222', padding: '30px', borderRadius: '8px', maxWidth: '400px', margin: '20px auto' }}>
                    <p><strong>Nombre:</strong> {user.nombre}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>RUT:</strong> {user.rut}</p>
                    <p><strong>Dirección:</strong> {user.direccion}</p>
                    <p><strong>Rol:</strong> {user.isAdmin ? 'Administrador' : 'Cliente'}</p>
                </div>
            </div>
        </main>
    );
};

export default ProfilePage;