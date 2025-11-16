import React, { useState, useEffect } from 'react'; // ¡Importamos hooks!
import { Link } from 'react-router-dom';

function BlogsPage() {
  // 1. Creamos estados para guardar los blogs
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // 2. Usamos useEffect para hacer el 'fetch' al cargar
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/blogs');
        const data = await res.json();
        setBlogs(data); // Guardamos los blogs del backend
      } catch (error) {
        console.error("Error al cargar blogs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []); // [] = ejecutar solo una vez

  return (
    <main className="blogs-main">
      <section className="blogs-hero">
        <h1>Nuestro Blog</h1>
        <p>Reseñas, guías de decoración, y las últimas tendencias.</p>
      </section>

      <div className="blog-main-container">
        <section className="blog-section">
          <h2 className="section-header">Artículos Destacados</h2>
          <div className="section-content">

            {loading && <p style={{ color: 'white' }}>Cargando artículos...</p>}

            {/* 3. ¡Mapeamos los blogs del estado! */}
            {blogs.map(blog => (
              <div className="blog-card" key={blog.id}>
                {/* 4. Usamos el ID real para el Link */}
                <Link to={`/blogs/${blog.id}`}> 
                  <h3>{blog.titulo}</h3>
                  <p className="fecha">{blog.fecha}</p>
                  {/* Mostramos un resumen (o el contenido corto) */}
                  <p>{blog.contenido.substring(0, 100)}...</p>
                </Link>
              </div>
            ))}

          </div>
        </section>

        {/* (Dejamos la sección de lanzamientos estática por ahora) */}
        <section className="blog-section">
          <h2 className="section-header">Próximos Lanzamientos</h2>
          <div className="lanzamientos-content">
            <div className="lanzamiento">
              <div className="lanzamiento-imagen">Serie Retro</div>
              <h3>Serie Retro Gaming</h3>
              <p>Noviembre 2025</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default BlogsPage;