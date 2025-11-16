import React, { useEffect } from 'react'; // ¡Importamos useEffect!
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext'; // 1. ¡Importamos el hook del Cerebro!

function Header() {
  const location = useLocation(); 
  const navigate = useNavigate(); 
  
  // 2. ¡Traemos las cosas del Cerebro!
  const { cartCount, fetchCartCount, clearCartCount } = useCart();

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

  // Lógica de "Es Admin"
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  // Lógica de "Logout"
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    clearCartCount(); // 4. ¡Limpiamos el conteo al salir!
    navigate('/'); 
  };

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

          <li>
            <a href="#" id="logoutBtn" onClick={handleLogout}>
              Salir
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;