/* ==================================
 * IMPORTACIONES
 * ================================== */
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

// ✅ NUEVO: Importación de Transbank
// ✅ CORRECTO
const { WebpayPlus, IntegrationApiKeys, IntegrationCommerceCodes, Environment } = require('transbank-sdk');

/* ==================================
 * INICIALIZACIÓN Y CONEXIÓN A BD
 * ================================== */
const app = express();
const PORT = 5000;
const JWT_SECRET = 'mi-clave-secreta-para-tokens-123';

const MONGO_URI = "mongodb+srv://viplat:572364@posterdream.dialyf6.mongodb.net/PosterDream?retryWrites=true&w=majority";

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('¡Base de datos MongoDB conectada con éxito!');
    } catch (err) {
        console.error('Error al conectar a MongoDB:', err.message);
        process.exit(1);
    }
};
connectDB();

/* ==================================
 * ✅ NUEVO: CONFIGURACIÓN DE TRANSBANK
 * ================================== */
const tbk = new WebpayPlus.Transaction(
    IntegrationCommerceCodes.WEBPAY_PLUS,
    IntegrationApiKeys.WEBPAY, // Se usa .WEBPAY
    Environment.Integration
);

/* ==================================
 * "MOLDES" DE LA BASE DE DATOS (Modelos)
 * ================================== */

// --- Molde de Usuario (ORIGINAL - NO MODIFICADO) ---
const UserSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    rut: { type: String, required: true },
    direccion: { type: String, required: true },
    isAdmin: { type: Boolean, default: false }
});
const User = mongoose.model('User', UserSchema);

// --- Molde de Producto (ORIGINAL - NO MODIFICADO) ---
const ProductSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    precio: { type: Number, required: true },
    imagen: { type: String, required: true },
    categoria: { type: String, required: true },
    descripcion: { type: String, default: "" }
}, { timestamps: true });
const Product = mongoose.model('Product', ProductSchema);

// --- Molde de Blog (ORIGINAL - NO MODIFICADO) ---
const BlogSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    fecha: { type: String, required: true },
    autor: { type: String, required: true },
    imagen: { type: String },
    contenido: { type: String, required: true }
}, { timestamps: true });
const Blog = mongoose.model('Blog', BlogSchema);

// --- Molde de Carrito (ORIGINAL - NO MODIFICADO) ---
const CarritoSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    items: [
        {
            producto: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            cantidad: { type: Number, required: true, min: 1, default: 1 }
        }
    ]
}, { timestamps: true });
const Carrito = mongoose.model('Carrito', CarritoSchema);

// --- ✅ NUEVO: Molde de Orden para Webpay ---
const OrderSchema = new mongoose.Schema({
    userName: { type: String, required: true },
    email: { type: String, required: true },
    total: { type: Number, required: true },
    status: { 
        type: String, 
        required: true, 
        default: 'pending',
        enum: ['pending', 'paid', 'failed']
    },
    token: { 
        type: String,
        default: null
    },
    buyOrder: { 
        type: String,
        required: true,
        unique: true
    },
    sessionId: { 
        type: String,
        required: true
    },
    paymentResult: { 
        type: Object,
        default: null
    }
}, { timestamps: true });
const Order = mongoose.model('Order', OrderSchema);

/* ==================================
 * MIDDLEWARES (Configuración y Guardias)
 * ================================== */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // ✅ NUEVO: Para formularios

// ✅ CORREGIDO: authMiddleware (línea crítica)
const authMiddleware = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ message: 'No hay token, permiso denegado' });
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.usuario = decoded.usuario; // ✅ CRÍTICO: debe ser decoded.usuario
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token no es válido' });
    }
};

const adminMiddleware = (req, res, next) => {
    if (!req.usuario || !req.usuario.isAdmin) {
        return res.status(403).json({ message: 'Acceso denegado.' });
    }
    next();
};

/* ==================================
 * RUTAS DE LA API (¡COMPLETAS!)
 * ================================== */

// --- 1. RUTAS PÚBLICAS (Productos y Blogs) ---

// [LEER] Todos los productos
app.get('/api/productos', async (req, res) => {
    try {
        const productos = await Product.find().sort({ createdAt: -1 });
        res.json(productos);
    } catch (err) {
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

// [LEER] Un solo producto por ID
app.get('/api/productos/:id', async (req, res) => {
    try {
        const producto = await Product.findById(req.params.id);
        if (!producto) return res.status(404).json({ message: 'Producto no encontrado' });
        res.json(producto);
    } catch (err) {
        res.status(500).json({ message: 'Error de servidor o ID inválido' });
    }
});

// [LEER] Todos los blogs
app.get('/api/blogs', async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 });
        res.json(blogs);
    } catch (err) {
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

// [LEER] Un solo blog por ID
app.get('/api/blogs/:id', async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ message: 'Artículo no encontrado' });
        res.json(blog);
    } catch (err) {
        res.status(500).json({ message: 'Error de servidor o ID inválido' });
    }
});

// --- 2. RUTAS DE AUTENTICACIÓN (Login/Registro) ---
app.post('/api/auth/register', async (req, res) => {
    try {
        const { nombre, email, password, rut, direccion } = req.body;
        let usuario = await User.findOne({ email });
        if (usuario) return res.status(400).json({ message: 'El email ya está registrado.' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        usuario = new User({
            nombre, email, password: hashedPassword, rut, direccion,
            isAdmin: (await User.countDocuments()) === 0 // El primero es Admin
        });
        await usuario.save();
        res.status(201).json({ message: '¡Usuario registrado con éxito!' });
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor.' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const usuario = await User.findOne({ email });
        if (!usuario) return res.status(400).json({ message: 'Email o contraseña incorrectos.' });

        const isMatch = await bcrypt.compare(password, usuario.password);
        if (!isMatch) return res.status(400).json({ message: 'Email o contraseña incorrectos.' });

        const payload = {
            usuario: { id: usuario.id, nombre: usuario.nombre, isAdmin: usuario.isAdmin }
        };
        jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            res.json({ token, isAdmin: usuario.isAdmin });
        });
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor.' });
    }
});

// --- 3. RUTAS PROTEGIDAS (Carrito) ---
app.get('/api/carrito', authMiddleware, async (req, res) => {
    try {
        const carrito = await Carrito.findOne({ user: req.usuario.id }).populate('items.producto');
        if (!carrito) return res.json([]); // Devuelve array vacío
        res.json(carrito.items);
    } catch (err) {
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

app.post('/api/carrito/agregar', authMiddleware, async (req, res) => {
    const { productoId } = req.body;
    const userId = req.usuario.id;
    try {
        let carrito = await Carrito.findOne({ user: userId });
        if (!carrito) carrito = new Carrito({ user: userId, items: [] });

        const itemExistente = carrito.items.find(item => item.producto.toString() === productoId);
        if (itemExistente) itemExistente.cantidad += 1;
        else carrito.items.push({ producto: productoId, cantidad: 1 });

        await carrito.save();
        res.status(200).json({ message: 'Producto añadido al carrito' });
    } catch (err) {
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

app.delete('/api/carrito/eliminar/:productoId', authMiddleware, async (req, res) => {
    const { productoId } = req.params;
    const userId = req.usuario.id;
    try {
        const carrito = await Carrito.findOne({ user: userId });
        if (carrito) {
            carrito.items = carrito.items.filter(item => item.producto.toString() !== productoId);
            await carrito.save();
        }
        res.status(200).json({ message: 'Producto eliminado del carrito' });
    } catch (err) {
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

app.delete('/api/carrito/vaciar', authMiddleware, async (req, res) => {
    const userId = req.usuario.id;
    try {
        await Carrito.findOneAndUpdate({ user: userId }, { $set: { items: [] } });
        res.status(200).json({ message: 'Carrito vaciado con éxito' });
    } catch (err) {
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

// --- 4. RUTAS DE ADMIN (CRUD de Productos) ---
app.post('/api/productos', [authMiddleware, adminMiddleware], async (req, res) => {
    const { nombre, precio, imagen, categoria, descripcion } = req.body;
    const nuevoProducto = new Product({ nombre, precio: parseFloat(precio), imagen, categoria, descripcion });
    const productoGuardado = await nuevoProducto.save();
    res.status(201).json(productoGuardado);
});

app.delete('/api/productos/:id', [authMiddleware, adminMiddleware], async (req, res) => {
    const producto = await Product.findById(req.params.id);
    if (!producto) return res.status(404).json({ message: 'Producto no encontrado' });
    await producto.deleteOne();
    res.status(200).json({ message: 'Producto eliminado con éxito' });
});

app.put('/api/productos/:id', [authMiddleware, adminMiddleware], async (req, res) => {
    const producto = await Product.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    if (!producto) return res.status(404).json({ message: 'Producto no encontrado' });
    res.status(200).json(producto);
});

// --- 5. RUTAS DE ADMIN (Gestión de Usuarios) ---
app.get('/api/users', [authMiddleware, adminMiddleware], async (req, res) => {
    const users = await User.find().select('-password');
    res.json(users);
});

app.delete('/api/users/:id', [authMiddleware, adminMiddleware], async (req, res) => {
    if (req.params.id === req.usuario.id) return res.status(400).json({ message: 'No puedes eliminar tu propia cuenta.' });
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    await user.deleteOne();
    res.status(200).json({ message: 'Usuario eliminado con éxito' });
});

app.put('/api/users/toggle-admin/:id', [authMiddleware, adminMiddleware], async (req, res) => {
    if (req.params.id === req.usuario.id) return res.status(400).json({ message: 'No puedes cambiar tu propio estado.' });
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    user.isAdmin = !user.isAdmin;
    await user.save();
    res.status(200).json({ message: 'Estado de admin actualizado' });
});

// --- ¡NUEVO! --- 7. RUTAS DE WEBPAY (de la guía)
// ======================================================
//
// ENDPOINT 1: Crear Transacción
app.post('/api/pay', async (req, res) => {
  const { userName, email, total } = req.body;

  try {
    if (!userName || !email || !total) {
      return res.status(400).json({ error: 'Faltan datos para crear la orden' });
    }

    const buyOrder = `BO-${Date.now()}`;
    const sessionId = `SID-${Date.now()}`;
    const amount = Math.round(total);
    const returnUrl = 'http://localhost:3000/payment-result';

    const newOrder = new Order({
      userName,
      email,
      total: amount,
      status: 'pending',
      buyOrder,
      sessionId
    });
    
    const createResponse = await tbk.create(buyOrder, sessionId, amount, returnUrl);

    newOrder.token = createResponse.token;
    await newOrder.save();

    res.json({
      url: createResponse.url,
      token: createResponse.token
    });

  } catch (error) {
    console.error("Error al crear pago en Webpay:", error);
    res.status(500).json({ error: 'Error al iniciar el pago', details: error.message });
  }
});

// ENDPOINT 2: Confirmar Transacción
app.post('/api/commit', async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: 'No se proporcionó token' });
  }

  let order;

  try {
    order = await Order.findOne({ token: token });
    if (!order) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }

    const commitResponse = await tbk.commit(token);

    order.paymentResult = commitResponse;

    if (commitResponse.responseCode === 0) {
      order.status = 'paid';
    } else {
      order.status = 'failed';
    }

    await order.save();
    
    res.json(commitResponse);

  } catch (error) {
    console.error("Error al confirmar pago en Webpay:", error);
    if (order) {
      order.status = 'failed';
      order.paymentResult = { error: error.message };
      await order.save();
    }
    res.status(500).json({ error: 'Error al confirmar el pago', details: error.message });
  }
});

/* ==================================
 * ENCENDER EL SERVIDOR
 * ================================== */
app.listen(PORT, () => {
    console.log(`¡Servidor Backend corriendo en http://localhost:${PORT}`);
});