import React, { useState } from 'react';
import { API_URL } from '../config';

function ContactoPage() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/contacto`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre, email, mensaje }),
      });

      if (!res.ok) {
        throw new Error('Hubo un problema al enviar tu mensaje.');
      }
      
      alert('¡Mensaje enviado con éxito!');
      // Limpiar formulario
      setNombre('');
      setEmail('');
      setMensaje('');

    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <main className="contact-main">
      <section className="contact-hero">
        <div className="contact-hero-content">
          <h2>Contáctanos</h2>
          <p>¿Tienes alguna duda o quieres enviarnos un mensaje? Completa el formulario abajo.</p>

          <form className="contact-form" onSubmit={handleSubmit}>
            <label htmlFor="name">Nombre:</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required 
            />

            <label htmlFor="email">Email:</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />

            <label htmlFor="message">Mensaje:</label>
            <textarea 
              id="message" 
              name="message" 
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              required
            ></textarea>

            <button type="submit" className="btn-comprar">Enviar</button>
          </form>
        </div>
      </section>   
    </main>
  );
}

export default ContactoPage;