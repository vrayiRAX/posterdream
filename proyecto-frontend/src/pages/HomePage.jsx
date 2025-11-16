import React from 'react';

function HomePage() {
  return (
    <main>
      {/* Este es el contenido de tu index.html */}
      <section className="hero">
        <h1>Bienvenido a PosterDream</h1>
        <p>Donde tus sueños pueden convertirse en el poster perfecto para tu pared. <br /> Descubre nuestra colección exclusiva y decora tus espacios con estilo.</p>
      </section>

      <section className="features">
        <div className="feature-card">
          <h3>Posters Personalizados</h3>
          <p>Crea posters únicos con tus imágenes favoritas y diseños exclusivos. Calidad premium y entrega rápida.</p>
        </div>
        <div className="feature-card">
          <h3>Envío Gratis</h3>
          <p>Disfruta de envío gratuito en pedidos superiores a $30.000. Recibe tus posters en la puerta de tu casa.</p>
        </div>
        <div className="feature-card">
          <h3>Colecciones Exclusivas</h3>
          <p>Explora nuestras colecciones temáticas limitadas con diseños de artistas emergentes y consagrados.</p>
        </div>
      </section>
    </main>
  );
}

export default HomePage;