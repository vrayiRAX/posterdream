import { useState, useEffect } from 'react';

// 1. ¡Importamos los 3 componentes!
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';

function App() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Esta lógica de traer datos del backend NO cambia
  useEffect(() => {
    fetch('http://localhost:5000/api/productos')
      .then(response => response.json())
      .then(data => {
        setProductos(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("¡Error al traer los productos!:", error);
        setLoading(false);
      });
  }, []);

  // 2. ¡Aquí armamos la página completa!
  return (
    <div className="App">

      <main>
        {/* El H1 de tu página de productos original */}
        <section className="productos-hero">
            <h1>Nuestros Posters</h1>
            <p>Descubre nuestra colección exclusiva de posters</p>
        </section>

        {loading && <p>Cargando productos...</p>}

        <div className="productos-grid">
          {productos.map(producto => (
            <ProductCard 
              key={producto._id}
              producto={producto}
            />
          ))}
        </div>
      </main>

    </div>
  );
}

export default App;