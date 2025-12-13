import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ¡NUEVO! Para redirigir
import '../assets/stylelogin.css'; 
import { API_URL } from '../config';

function LoginPage() {
  // ¡NUEVO! Hook para redirigir al usuario
  const navigate = useNavigate();

  // --- ESTADOS PARA EL FORMULARIO DE LOGIN ---
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // --- ESTADOS PARA EL FORMULARIO DE REGISTRO ---
  const [regNombre, setRegNombre] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regRut, setRegRut] = useState('');
  const [regDireccion, setRegDireccion] = useState('');

  // === FUNCIÓN PARA MANEJAR EL LOGIN ===
  const handleLogin = async (e) => {
    e.preventDefault(); // Evita que el formulario recargue la página

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });

      const data = await res.json();

      if (!res.ok) {
        // Si el backend mandó un error (ej: 400)
        throw new Error(data.message || 'Error al iniciar sesión');
      }

      // ¡ÉXITO!
      alert('¡Login exitoso!');

      // Guardamos el token en localStorage para usarlo después
      localStorage.setItem('token', data.token); 
      localStorage.setItem('isAdmin', data.isAdmin);
      // Redirigimos al usuario
      if (data.isAdmin) {
        // (En el futuro, lo mandamos a /admin)
        alert("¡Bienvenido Admin! (Redirigiendo a home por ahora)");
        navigate('/home'); 
      } else {
        navigate('/home'); // Redirigir a la página principal
      }

    } catch (error) {
      alert(error.message);
    }
  };

  // === FUNCIÓN PARA MANEJAR EL REGISTRO ===
  const handleRegister = async (e) => {
    e.preventDefault();

    if (regPassword !== regConfirmPassword) {
      alert('Las contraseñas no coinciden.');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: regNombre,
          email: regEmail,
          password: regPassword,
          rut: regRut,
          direccion: regDireccion
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Error al registrar');
      }

      // ¡ÉXITO!
      alert(data.message); // "¡Usuario registrado con éxito!"

      // Limpiamos el formulario (opcional)
      setRegNombre('');
      setRegEmail('');
      setRegPassword('');
      setRegConfirmPassword('');
      setRegRut('');
      setRegDireccion('');

    } catch (error) {
      alert(error.message);
    }
  };

  // === TU HTML (JSX) CON LOS CAMPOS CONECTADOS ===
  return (
    <>
      <header>
        <div className="logo"></div>
        {/* --- FORMULARIO DE LOGIN --- */}
        <form className="loginNav" onSubmit={handleLogin}>
          <div className="correo">
            <p>Correo</p>
            <input 
              type="email" 
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              required 
            />
          </div>
          <div className="contrasena">
            <p>Contraseña</p>
            <input 
              type="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <button type="submit" className="BtnIngresar">Ingresar</button>
          </div>
        </form>
      </header>

      <main>
        <section className="hero">
          <div className="banner">
            <h3>Donde tus sueños pueden convertirse en el poster perfecto...</h3>
          </div>

          {/* --- FORMULARIO DE REGISTRO --- */}
          <div className="register-container">
            <form id="registerForm" autoComplete="off" onSubmit={handleRegister}>
              <h2>Registro de Usuario</h2>
              <div className="form-group">
                <label htmlFor="nombre">Nombre y Apellido</label>
                <input type="text" id="nombre" name="nombre" value={regNombre} onChange={(e) => setRegNombre(e.target.value)} required />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} required />
              </div>
              <div className="form-group">
                <label htmlFor="password">Contraseña</label>
                <input type="password" id="password" name="password" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} required minLength="6" />
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirme Contraseña</label>
                <input type="password" id="confirmPassword" name="confirmPassword" value={regConfirmPassword} onChange={(e) => setRegConfirmPassword(e.target.value)} required minLength="6" />
              </div>
              <div className="form-group">
                <label htmlFor="rut">RUT</label>
                <input type="text" id="rut" name="rut" value={regRut} onChange={(e) => setRegRut(e.target.value)} required placeholder="Ej: 12345678-9" />
              </div>
              <div className="form-group">
                <label htmlFor="direccion">Dirección</label>
                <input type="text" id="direccion" name="direccion" value={regDireccion} onChange={(e) => setRegDireccion(e.target.value)} required minLength="10" />
              </div>
              <button type="submit">Registrarse</button>
            </form>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-content">
          <p>&copy; 2025 PosterDream. Todos los derechos reservados.</p>
        </div>
      </footer>
    </>
  );
}

export default LoginPage;