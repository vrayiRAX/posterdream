import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Asegúrate de tenerlo: npm install axios

function PaymentResultPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 1. Obtener el token de la URL
    const token = searchParams.get('token_ws');

    if (!token) {
      setError('No se encontró un token de Webpay.');
      setLoading(false);
      return;
    }

    // 2. Función para confirmar el pago en el backend
    const commitPayment = async (token) => {
      try {
        // Llamamos al endpoint del backend que confirma con Transbank
        // Usamos el puerto 5000, el mismo de tu backend actual
        const res = await axios.post('http://localhost:5000/api/commit', { token });
        
        // El backend nos devuelve el resultado de Transbank
        setResult(res.data);

      } catch (err) {
        setError(err.response?.data?.error || err.message || 'Error al confirmar el pago');
      } finally {
        setLoading(false);
      }
    };

    commitPayment(token);
  }, [searchParams]);

  // 3. Función para "formatear" el resultado y mostrarlo
  const getPaymentDetails = () => {
    if (!result) return <p>No hay detalles de pago.</p>;

    // Si responseCode es 0, el pago fue exitoso
    const isSuccess = result.responseCode === 0;

    // Estilos simples para el resultado
    const boxStyle = {
      padding: '20px',
      border: `2px solid ${isSuccess ? 'green' : 'red'}`,
      backgroundColor: isSuccess ? '#e6ffed' : '#ffe6e6',
      borderRadius: '8px',
      color: '#333'
    };

    return (
      <div style={boxStyle}>
        <h2>{isSuccess ? '¡Pago Exitoso!' : 'Pago Fallido'}</h2>
        <p><strong>Orden de Compra:</strong> {result.buyOrder}</p>
        <p><strong>Monto:</strong> ${result.amount}</p>
        <p><strong>Tarjeta:</strong> **** **** **** {result.cardDetail?.cardNumber}</p>
        <p><strong>Fecha de Transacción:</strong> {new Date(result.transactionDate).toLocaleString()}</p>
        <p><strong>Estado:</strong> {result.status}</p>
        {!isSuccess && <p><strong>Razón del rechazo:</strong> {result.status}</p>}
      </div>
    );
  };

  return (
    <main className="cart-outer" style={{ color: 'white' }}>
      <div className="cart-super-container">
        <h1>Resultado de la Transacción</h1>
        <div className="cart-main">
          {loading && <p>Confirmando tu pago, por favor espera...</p>}
          {error && <div style={{ color: 'red', fontWeight: 'bold' }}><p>Error: {error}</p></div>}
          {result && getPaymentDetails()}
          
          <button 
            className="cart-btn" 
            onClick={() => navigate('/home')} 
            style={{ marginTop: '20px' }}
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    </main>
  );
}

export default PaymentResultPage;