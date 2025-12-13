import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext'; // 1. ¡Importamos el hook del Cerebro!
import { API_URL } from '../config';

function ProductDetailPage() {
  let { id } = useParams();
  
  // 2. ¡Traemos la función del Cerebro!
  const { addToCart } = useCart(); 

  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // (Este useEffect sigue igual, para cargar los detalles del producto)
  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const res = await fetch(`${API_URL}/api/productos/${id}`);
        if (!res.ok) throw new Error('Producto no encontrado');
        const data = await res.json();
        setProducto(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducto();
  }, [id]);

  // (Lógica de loading, error, etc. sigue igual)
  if (loading) return <main><p style={{ color: 'white' }}>Cargando producto...</p></main>;
  if (error) return <main><p style={{ color: 'red' }}>Error: {error}</p></main>;
  if (!producto) return <main><p style={{ color: 'white' }}>No se encontró el producto.</p></main>;

  const precioFormateado = new Intl.NumberFormat('es-CL', {
    style: 'currency', currency: 'CLP', minimumFractionDigits: 0
  }).format(producto.precio);

  return (
    <main className="producto-detalle">
      <div className="detalle-container">
        <div className="imagen-producto">
          <img src={producto.imagen} alt={producto.nombre} />
        </div>
        
        <div className="info-producto">
          <h1>{producto.nombre}</h1>
          <p className="precio">{precioFormateado}</p>
          <p className="descripcion">
            {producto.descripcion || "Un poster increíble para tu colección."}
          </p>
          
          <div className="acciones-producto">
            {/* 3. ¡AQUÍ ESTÁ LA MAGIA! 
                Llamamos a la función 'addToCart' del cerebro,
                pasándole el ID del producto. */}
            <button 
              id="btn-add-cart" 
              className="btn-comprar"
              onClick={() => addToCart(producto._id)}
            >
              Añadir al Carrito
            </button>
          </div>
        </div>
      </div>

      <Link to="/productos" className="btn-volver">
        &larr; Volver a todos los productos
      </Link>
    </main>
  );
}

export default ProductDetailPage;