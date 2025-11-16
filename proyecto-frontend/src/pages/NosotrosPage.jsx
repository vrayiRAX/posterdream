import React from 'react';

// Este es el componente de la página "Nosotros"
function NosotrosPage() {
  return (
    <main>
      <section className="about-hero">
        <h1>Sobre PosterDream</h1>
        <p>Transformando sueños en arte para tus paredes desde 2020</p>
      </section>

      <div className="about-content">
        <section className="about-section">
          <h2>Nuestra Historia</h2>
          <p>PosterDream nació en 2020 del amor por los posters y el arte. Todo comenzó cuando nuestro fundador, Vicente, quería decorar su nuevo apartamento con posters que reflejaran sus pasiones, pero no encontraba diseños que combinaran calidad y originalidad. Así, decidió crear los suyos, y pronto, sus amigos y familiares querían los suyos también. Lo que empezó como un hobby se convirtió en una misión: llevar arte de alta calidad a todos los rincones.</p>
        </section>

        <section className="about-section">
          <h2>Nuestro Equipo</h2>
          <p>Somos un grupo de diseñadores, artistas y soñadores.</p>
          <div className="team-grid">
            <div className="team-member">
              <div className="member-photo">V</div>
              <h3>Vicente Fernandez</h3>
              <p>Fundador y CEO</p>
            </div>
            <div className="team-member">
              <div className="member-photo">M</div>
              <h3>Matias Espinoza</h3>
              <p>Director de Arte</p>
            </div>
            <div className="team-member">
              <div className="member-photo">I</div>
              <h3>Ian Badilla</h3>
              <p>Diseñador Gráfico</p>
            </div>
            <div className="team-member">
              <div className="member-photo">M</div>
              <h3>Martin Villarroel</h3>
              <p>Community Manager</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default NosotrosPage;