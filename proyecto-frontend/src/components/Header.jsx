import React, { useState, useEffect } from 'react'; // ¡Importamos useEffect y useState!
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext'; // 1. ¡Importamos el hook del Cerebro!

function Header() {
  const location = useLocation(); 
  const navigate = useNavigate(); 
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Estado para el menú desplegable
  
  // 2. ¡Traemos las cosas del Cerebro!
  const { cartCount, fetchCartCount, clearCartCount } = useCart();

  // Obtener token del localStorage
  const token = localStorage.getItem('token');
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  // 3. ¡Cargamos el conteo del carrito CADA VEZ que la página cambia!
  //    (Esto asegura que si el token expira, el carrito vuelva a 0)
  useEffect(() => {
    // No cargamos el carrito en la página de login
    if (location.pathname !== '/' && location.pathname !== '/login') {
      fetchCartCount();
    }
  }, [location, fetchCartCount]); // Se ejecuta cuando la URL cambia

  // Lógica de "Mostrar Carrito"
  const showCarrito = location.pathname.startsWith('/productos') || 
                      location.pathname === '/carrito';

  // Función para el botón de SALIR
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    clearCartCount(); // 4. ¡Limpiamos el conteo al salir!
    setIsMenuOpen(false); // Cerramos el menú
    navigate('/'); 
  };

  // Cerrar el menú cuando se hace clic fuera de él
  useEffect(() => {
    const handleClickOutside = () => {
      if (isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <header>
      <Link to="/home" className="logo"></Link>
      
      <nav>
        <ul>
          <li><Link to="/home">Home</Link></li>
          <li><Link to="/productos">Productos</Link></li>
          <li><Link to="/nosotros">Nosotros</Link></li>
          <li><Link to="/blogs">Blogs</Link></li>
          <li><Link to="/contacto">Contacto</Link></li>

          {showCarrito && (
            <li>
              {/* 5. ¡AQUÍ VA EL NÚMERO REAL! */}
              <Link to="/carrito">Carrito <span id="cart-count">{cartCount}</span></Link>
            </li>
          )}

          {isAdmin && (
            <li>
              <Link to="/admin" style={{ color: 'yellow', fontWeight: 'bold' }}>
                Admin
              </Link>
            </li>
          )}

          {/* NUEVO: Menú de usuario */}
          {token ? (
            <li className="user-menu-container">
              <button 
                className="user-icon" 
                onClick={(e) => {
                  e.stopPropagation(); // Evita que se cierre inmediatamente
                  setIsMenuOpen(!isMenuOpen);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  padding: '5px'
                }}
              >
                👤
              </button>
              
              {isMenuOpen && (
                <div className="dropdown-menu" style={{
                  position: 'absolute',
                  backgroundColor: 'white',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  padding: '10px',
                  zIndex: 1000,
                  minWidth: '150px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                }}>
                  <Link 
                    to="/perfil" 
                    onClick={() => setIsMenuOpen(false)}
                    style={{
                      display: 'block',
                      padding: '8px',
                      textDecoration: 'none',
                      color: '#333'
                    }}
                  >
                    Ver Perfil
                  </Link>
                  <button 
                    onClick={handleLogout}
                    style={{
                      display: 'block',
                      width: '100%',
                      padding: '8px',
                      background: '#f44336',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      marginTop: '5px'
                    }}
                  >
                    Salir
                  </button>
                </div>
              )}
            </li>
          ) : (
            <li>
              <Link to="/login">Iniciar Sesión</Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Header;