import { Routes, Route } from 'react-router-dom';

// Importamos todas nuestras páginas
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import NosotrosPage from './pages/NosotrosPage';
import ContactoPage from './pages/ContactoPage';
import BlogsPage from './pages/BlogsPage';
import BlogDetailPage from './pages/BlogDetailPage';
import CarritoPage from './pages/CarritoPage';
import PaymentResultPage from './pages/PaymentResultPage'; 
import ProfilePage from './pages/ProfilePage'; // <--- NUEVA IMPORTACIÓN
import MainLayout from './components/MainLayout';
import AdminLayout from './components/AdminLayout';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminProductsPage from './pages/AdminProductsPage';
import AdminNewProductPage from './pages/AdminNewProductPage';
import AdminUsersPage from './pages/AdminUsersPage';

function App() {
  
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />

      <Route element={<MainLayout />}>
        
        {/*Rutas Públicas*/}
        <Route path="/home" element={<HomePage />} />
        <Route path="/productos" element={<ProductsPage />} />
        <Route path="/productos/:id" element={<ProductDetailPage />} />
        <Route path="/nosotros" element={<NosotrosPage />} />
        <Route path="/contacto" element={<ContactoPage />} />
        <Route path="/blogs" element={<BlogsPage />} />
        <Route path="/blogs/:id" element={<BlogDetailPage />} />
        <Route path="/carrito" element={<CarritoPage />} />

        {/* Ruta de resultado de Webpay*/}
        <Route path="/payment-result" element={<PaymentResultPage />} />

        {/* Ruta de Perfil (Nueva) */}
        <Route path="/perfil" element={<ProfilePage />} /> {/* <--- NUEVA RUTA */}

        {/*Rutas de Admin*/}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="productos" element={<AdminProductsPage />} />
          <Route path="productos/nuevo" element={<AdminNewProductPage />} />
          <Route path="usuarios" element={<AdminUsersPage />} />
        </Route>

      </Route>
    </Routes>
  );
}

export default App;