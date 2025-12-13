import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';

function CarritoPage() {
  const [carrito, setCarrito] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // --- ¡NUEVO! Estados para el formulario de pago ---
  // El backend de la guía pide estos datos
  // (En una app real, podrías sacar esto del usuario logueado)
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');

  // --- Función para Cargar el Carrito ---
  const fetchCarrito = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Debes iniciar sesión para ver tu carrito.');
      navigate('/login');
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/carrito`, {
        headers: { 'x-auth-token': token }
      });
      if (!res.ok) throw new Error('Error al cargar el carrito');
      const data = await res.json();
      
      const items = data.map(item => ({
          ...item.producto,
          cantidad: item.cantidad
      }));
      setCarrito(items);

    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // --- Cargar el carrito al iniciar ---
  useEffect(() => {
    fetchCarrito();
  }, [fetchCarrito]);

  // --- Función para Eliminar UN item ---
  const handleEliminarItem = async (productoId) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/api/carrito/eliminar/${productoId}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': token }
      });
      if (!res.ok) throw new Error('Error al eliminar item');
      // Recargamos el carrito para que se actualice la vista
      fetchCarrito(); 
    } catch (error) {
      alert(error.message);
    }
  };

  // --- Función para VACIAR el carrito ---
  const handleVaciarCarrito = async () => {
    if (!window.confirm('¿Estás seguro de que quieres vaciar el carrito?')) return;
    
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/api/carrito/vaciar`, {
        method: 'DELETE',
        headers: { 'x-auth-token': token }
      });
      if (!res.ok) throw new Error('Error al vaciar el carrito');
      setCarrito([]); // Vaciamos el estado local
    } catch (error) {
      alert(error.message);
    }
  };

  // --- Calcular total ---
  const total = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
  const totalFormateado = new Intl.NumberFormat('es-CL', {
    style: 'currency', currency: 'CLP', minimumFractionDigits: 0
  }).format(total);


  const handlePay = async (e) => {
    e.preventDefault(); // Prevenimos que el formulario recargue la página

    // Validaciones simples
    if (!userName || !email) {
      alert('Por favor, ingresa tu nombre e email para continuar.');
      return;
    }
    if (total <= 0) {
      alert('Tu carrito está vacío.');
      return;
    }

    try {
      // 1. Llamamos a nuestro backend para crear la transacción
      // Usamos el puerto 5000, el mismo de tu backend actual
      const res = await axios.post(`${API_URL}/api/pay`, {
        userName,
        email,
        total // Usamos el 'total' que ya calculaste
      }); //

      // 2. El backend nos da la URL y el Token
      const { url, token } = res.data;

      // 3. Redirigimos al usuario a Webpay
      // El formulario de Transbank se abre en la misma pestaña
      window.location.href = `${url}?token_ws=${token}`;

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Error al procesar el pago');
    }
  };


  if (loading) {
    return <main className="cart-outer"><p style={{ color: 'white', textAlign: 'center' }}>Cargando carrito...</p></main>;
  }

  return (
    <main className="cart-outer">
      <div className="cart-super-container">
        <h1>Mi Carrito</h1>
        <div className="cart-main">
          <div className="cart-table-container">
            {carrito.length === 0 ? (
              <p>Tu carrito está vacío.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th></th>
                    <th>Producto</th>
                    <th>Precio</th>
                    <th>Cantidad</th>
                    <th>Subtotal</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {carrito.map((item) => (
                    <tr key={item._id}>
                      <td><img src={item.imagen} alt={item.nombre} style={{ width: '50px' }} /></td>
                      <td>{item.nombre}</td>
                      <td>${item.precio}</td>
                      <td>{item.cantidad}</td>
                      <td>${item.precio * item.cantidad}</td>
                      <td>
                        <button 
                          className="acciones-btn delete-btn"
                          onClick={() => handleEliminarItem(item._id)}
                        >
                          X
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          
          <aside className="cart-summary">
            <h3>Resumen</h3>
            <p>Total: <span>{totalFormateado}</span></p>
            
            <button 
              className="cart-btn vaciar"
              onClick={handleVaciarCarrito}
              disabled={carrito.length === 0}
            >
              Vaciar carrito
            </button>
            
            {/*Formulario de Pago Webpay*/}
            <form className="webpay-form" onSubmit={handlePay} style={{ marginTop: '20px' }}>
              
              <p>Ingresa tus datos para pagar:</p>
              
              <div className="form-group" style={{ marginBottom: '10px' }}>
                <label htmlFor="userName" style={{ display: 'block' }}>Nombre</label>
                <input 
                  type="text" 
                  id="userName" 
                  value={userName} 
                  onChange={(e) => setUserName(e.target.value)} 
                  placeholder="Tu nombre"
                  required
                  style={{ width: '100%', padding: '8px' }}
                />
              </div>
              <div className="form-group" style={{ marginBottom: '15px' }}>
                <label htmlFor="email" style={{ display: 'block' }}>Email</label>
                <input 
                  type="email" 
                  id="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="tu@email.com"
                  required
                  style={{ width: '100%', padding: '8px' }}
                />
              </div>
              
              <button 
                type="submit" 
                className="cart-btn comprar" 
                disabled={carrito.length === 0 || loading}
              >
                Ir a Pagar con Webpay
              </button>
            </form>
            {/* --- Fin del formulario --- */}

          </aside>
        </div>
      </div>
    </main>
  );
}

export default CarritoPage;