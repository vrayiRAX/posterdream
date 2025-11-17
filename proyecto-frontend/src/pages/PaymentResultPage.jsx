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
    // 1. Obtener los tokens de la URL
    const successToken = searchParams.get('token_ws');
    const failureToken = searchParams.get('TBK_TOKEN'); // ¡El token de "cancelado"!
    
    // --- CASO 1: El usuario CANCELÓ el pago ---
    if (failureToken) {
      setError('El pago fue cancelado por el usuario.');
      setLoading(false);
      return; // No hacemos nada más
    }

    // --- CASO 2: El usuario SÍ pagó (o al menos lo intentó) ---
    if (successToken) {
      const commitPayment = async (token) => {
        try {
          const res = await axios.post('http://localhost:5000/api/commit', { token });
          setResult(res.data);
        } catch (err) {
          setError(err.response?.data?.error || err.message || 'Error al confirmar el pago');
        } finally {
          setLoading(false);
        }
      };
      commitPayment(successToken);
      return; // Salimos para que no siga al Caso 3
    }
    
    // --- CASO 3: El usuario llegó aquí sin NINGÚN token ---
    setError('No se encontró un token de Webpay válido.');
    setLoading(false);

  }, [searchParams]);

  // (El resto de tu archivo, como "getPaymentDetails", sigue igual)
  const getPaymentDetails = () => {
    if (!result) return null;

    const isSuccess = result.responseCode === 0;
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
            style={{marginTop: '20px'}}
            onClick={() => navigate('/home')} 
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    </main>
  );
}

export default PaymentResultPage;