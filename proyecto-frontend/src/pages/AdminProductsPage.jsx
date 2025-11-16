import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function AdminProductsPage() {
  // 1. Estados para guardar los productos y el estado de carga
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  // 2. Función para cargar los productos desde el backend
  const fetchProductos = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/productos');
      const data = await res.json();
      setProductos(data); // Guardamos los productos reales
    } catch (error) {
      console.error("Error al cargar productos:", error);
    } finally {
      setLoading(false);
    }
  };

  // 3. useEffect para llamar a fetchProductos() cuando la página carga
  useEffect(() => {
    fetchProductos();
  }, []); // [] = ejecutar solo una vez

  // 4. ¡NUEVO! Función para BORRAR un producto
  const handleDelete = async (productoId) => {
    // Pedimos confirmación
    if (!window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/productos/${productoId}`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': token // ¡Enviamos el token de admin!
        }
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Error al eliminar');
      }

      alert('¡Producto eliminado con éxito!');

      // 5. Refrescamos la lista de productos
      fetchProductos(); 

    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div>
      <h1>Gestión de Productos</h1>

      <Link to="/admin/productos/nuevo" className="admin-btn">
        Agregar Nuevo Producto
      </Link>

      <div style={{ height: '20px' }}></div> 

      <h2>Productos Existentes</h2>
      <div className="table-container">
        <table id="productsTable">
          <thead>
            <tr>
              <th>ID (MongoDB)</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4">Cargando productos...</td></tr>
            ) : (
              // 6. ¡Mapeamos los productos reales!
              productos.map(producto => (
                <tr key={producto._id}> {/* ¡Usamos el _id de MongoDB! */}
                  <td>{producto._id}</td>
                  <td>{producto.nombre}</td>
                  <td>${producto.precio}</td>
                  <td>
                    {/* 7. ¡Conectamos el botón de borrar! */}
                    <button 
                      className="acciones-btn delete-btn"
                      onClick={() => handleDelete(producto._id)}
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

export default AdminProductsPage;