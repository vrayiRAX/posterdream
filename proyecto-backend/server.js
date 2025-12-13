// server.js - Versión modificada para funcionar en Render y localmente
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Cargar variables de entorno
dotenv.config();

const app = express();
 
// 1. CORS - Permite conexiones desde cualquier origen (para desarrollo y producción)
// ¡IMPORTANTE! En producción podrías restringir esto solo a tu dominio de Render
app.use(cors({
  origin: '*', // Permite todas las conexiones
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-auth-token']
}));

// Middleware para parsear JSON
app.use(express.json());

// 2. Conectar a MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/posterdream', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Conectado a MongoDB Atlas'))
.catch(err => console.error('❌ Error conectando a MongoDB:', err));

// 3. Importar rutas (ajusta según tu estructura)
const authRoutes = require('./routes/auth');
const productoRoutes = require('./routes/productos');
const carritoRoutes = require('./routes/carrito');
const blogRoutes = require('./routes/blogs');
const userRoutes = require('./routes/users');
const paymentRoutes = require('./routes/payment');

// 4. Usar rutas
app.use('/api/auth', authRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/carrito', carritoRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/users', userRoutes);
app.use('/api/pay', paymentRoutes);
app.use('/api/commit', paymentRoutes);

// 5. Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Backend funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// 6. Manejar rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// 7. Manejo de errores global
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  res.status(500).json({ 
    error: 'Algo salió mal en el servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 8. Puerto dinámico para Render
// Render asigna un puerto aleatorio, no podemos usar 5000 fijo
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor funcionando en puerto ${PORT}`);
  console.log(`🌐 Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 URL: http://localhost:${PORT}`);
});

module.exports = app; // Para testing
