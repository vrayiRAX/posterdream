import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';

function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- Función para Cargar Usuarios ---
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/users`, {
        headers: { 'x-auth-token': token }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error al cargar usuarios');
      setUsers(data);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  // --- Cargar usuarios al iniciar ---
  useEffect(() => {
    fetchUsers();
  }, []);

  // --- Función para Borrar Usuario ---
  const handleDelete = async (userId) => {
    if (!window.confirm('¿Seguro que quieres eliminar a este usuario?')) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/users/${userId}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': token }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      alert(data.message);
      fetchUsers(); // Recargar la lista
    } catch (error) {
      alert(error.message);
    }
  };

  // --- Función para Hacer/Quitar Admin ---
  const handleToggleAdmin = async (userId) => {
    if (!window.confirm('¿Seguro que quieres cambiar el estado de admin de este usuario?')) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/users/toggle-admin/${userId}`, {
        method: 'PUT',
        headers: { 'x-auth-token': token }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      alert('Estado de admin actualizado');
      fetchUsers(); // Recargar la lista
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div>
      <h1>Gestión de Usuarios</h1>
      <div className="table-container">
        <table id="usersTable">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Es Admin</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5">Cargando usuarios...</td></tr>
            ) : (
              users.map(user => (
                <tr key={user._id}>
                  <td>{user._id}</td>
                  <td>{user.nombre}</td>
                  <td>{user.email}</td>
                  <td>{user.isAdmin ? 'Sí' : 'No'}</td>
                  <td>
                    <button
                      className="acciones-btn"
                      style={{ backgroundColor: user.isAdmin ? '#f0ad4e' : '#5cb85c' }}
                      onClick={() => handleToggleAdmin(user._id)}
                    >
                      {user.isAdmin ? 'Quitar Admin' : 'Hacer Admin'}
                    </button>
                    <button
                      className="acciones-btn delete-btn"
                      onClick={() => handleDelete(user._id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminUsersPage;