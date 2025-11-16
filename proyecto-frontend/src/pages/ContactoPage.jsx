import React from 'react';

function ContactoPage() {
  return (
    <main className="contact-main">
      <section className="contact-hero">
        <div className="contact-hero-content">
          <h2>Contáctanos</h2>
          <p>¿Tienes alguna duda o quieres enviarnos un mensaje? Completa el formulario abajo.</p>

          {/* Más adelante conectaremos esto al backend */}
          <form className="contact-form">
            <label htmlFor="name">Nombre:</label>
            <input type="text" id="name" name="name" required />

            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" required />

            <label htmlFor="message">Mensaje:</label>
            <textarea id="message" name="message" required></textarea>

            {/* Usamos 'button' en vez de 'a' para formularios */}
            <button type="submit" className="btn-comprar">Enviar</button>
          </form>
        </div>
      </section>   
    </main>
  );
}

export default ContactoPage;