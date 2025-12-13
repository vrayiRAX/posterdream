import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';

function AdminNewProductPage() {
  const navigate = useNavigate();

  // 1. Estados para cada campo del formulario
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [imagen, setImagen] = useState('');
  const [categoria, setCategoria] = useState('');
  const [descripcion, setDescripcion] = useState('');

  // 2. Función para manejar el envío (submit)
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evitar recarga

    const productoData = { nombre, precio, imagen, categoria, descripcion };

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/productos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token // ¡Token de Admin!
        },
        body: JSON.stringify(productoData)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Error al crear el producto');
      }

      alert('¡Producto creado con éxito!');

      // 3. Redirigir de vuelta a la tabla de productos
      navigate('/admin/productos'); 

    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div>
      <h1>Crear Nuevo Producto</h1>

      {/* 4. Conectamos el formulario y los inputs */}
      <form id="newProductForm" className="admin-form" onSubmit={handleSubmit}>

        <label htmlFor="productName">Nombre del Producto:</label>
        <input type="text" id="productName" value={nombre} onChange={(e) => setNombre(e.target.value)} required />

        <label htmlFor="productPrice">Precio:</label>
        <input type="number" id="productPrice" value={precio} onChange={(e) => setPrecio(e.target.value)} required />

        <label htmlFor="productImage">URL de la Imagen:</label>
        <input type="text" id="productImage" value={imagen} onChange={(e) => setImagen(e.target.value)} required />

        <label htmlFor="productCategory">Categoría:</label>
        <select id="productCategory" value={categoria} onChange={(e) => setCategoria(e.target.value)} required>
          <option value="">Seleccione una categoría</option>
          <option value="games">Videojuegos</option>
          <option value="terror">Terror</option>
          <option value="anime">Anime</option>
        </select>

        <label htmlFor="productDescription">Descripción (Opcional):</label>
        <textarea id="productDescription" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />

        <button type="submit" className="admin-btn">Agregar Producto</button>
      </form>
    </div>
  );
}

export default AdminNewProductPage;