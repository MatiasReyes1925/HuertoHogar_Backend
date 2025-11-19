require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS permisivo para todas las URLs de Vercel
app.use(cors({
  origin: function(origin, callback) {
    // Permite peticiones sin origin (como Postman) o desde localhost o vercel.app
    if (!origin || 
        origin.includes('localhost') || 
        origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400
}));

// IMPORTANTE: Manejar preflight requests ANTES de cualquier otra ruta
app.options('*', cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Importar rutas
const authRoutes = require('../routes/auth');
const productRoutes = require('../routes/products');
const userRoutes = require('../routes/users');
const categoryRoutes = require('../routes/categories');

// Usar rutas
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ 
    message: 'API HuertoHogar funcionando 🚀',
    version: '1.0.0',
    cors: 'Enabled for all Vercel domains',
    endpoints: {
      auth: '/api/auth (register, login)',
      products: '/api/products (CRUD)',
      users: '/api/users (admin)',
      categories: '/api/categories'
    }
  });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// Solo iniciar servidor en desarrollo local
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
  });
}

// Exportar para Vercel
module.exports = app;
