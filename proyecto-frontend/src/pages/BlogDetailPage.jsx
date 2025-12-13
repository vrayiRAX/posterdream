import React, { useState, useEffect } from 'react'; // ¡Importamos hooks!
import { Link, useParams } from 'react-router-dom';
import { API_URL } from '../config';

function BlogDetailPage() {
  // 1. Leemos el ID de la URL
  let { id } = useParams();

  // 2. Creamos estados
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 3. Hacemos 'fetch' para el artículo específico
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`${API_URL}/api/blogs/${id}`);
        if (!res.ok) throw new Error('Artículo no encontrado');
        const data = await res.json();
        setBlog(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]); // Se ejecuta cada vez que el ID cambia

  // 4. Lógica de renderizado
  if (loading) {
    return <main><p style={{ color: 'white' }}>Cargando artículo...</p></main>;
  }
  if (error) {
    return <main><p style={{ color: 'red' }}>Error: {error}</p></main>;
  }
  if (!blog) {
    return <main><p style={{ color: 'white' }}>No se encontró el artículo.</p></main>;
  }

  // 5. ¡Tu HTML, ahora con datos REALES!
  return (
    <main>
      <section className="blog-detalle-hero">
        <h1>{blog.titulo}</h1>
        <p>(Mostrando detalle para el post con ID: {id})</p>
      </section>

      <div className="blog-detalle-container">
        <div className="articulo-completo">
          <div className="meta-articulo">
            <span>Por: {blog.autor}</span>
            <span>Fecha: {blog.fecha}</span>
          </div>
          <div className="imagen-destacada">
            [Imagen para {blog.titulo}]
          </div>
          <div className="contenido-articulo">
            <p>{blog.contenido}</p>
          </div>
        </div>

        {/* (Links de relacionados, etc.) */}
      </div>
    </main>
  );
}

export default BlogDetailPage;