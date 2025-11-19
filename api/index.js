require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// ============================================
// CONFIGURACIÓN DE CORS (MUY IMPORTANTE)
// ============================================

// Configurar CORS ANTES de cualquier otra cosa
const corsOptions = {
  origin: function (origin, callback) {
    // Permite peticiones sin origin (Postman, curl, etc.)
    if (!origin) {
      return callback(null, true);
    }
    
    // Permite localhost en cualquier puerto
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
      return callback(null, true);
    }
    
    // Permite TODAS las URLs de Vercel
    if (origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    
    // Rechaza otros orígenes
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin'
  ],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400, // 24 horas
  optionsSuccessStatus: 200
};

// Aplicar CORS a todas las rutas
app.use(cors(corsOptions));

// Manejar preflight requests explícitamente
app.options('*', cors(corsOptions));

// ============================================
// MIDDLEWARES
// ============================================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware (útil para debugging)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Origin: ${req.headers.origin || 'No origin'}`);
  next();
});

// ============================================
// IMPORTAR RUTAS
// ============================================

const authRoutes = require('../routes/auth');
const productRoutes = require('../routes/products');
const userRoutes = require('../routes/users');
const categoryRoutes = require('../routes/categories');

// ============================================
// USAR RUTAS
// ============================================

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);

// ============================================
// RUTA DE PRUEBA
// ============================================

app.get('/', (req, res) => {
  res.json({ 
    message: 'API HuertoHogar funcionando en Vercel 🚀',
    version: '1.0.0',
    cors: 'Enabled for all Vercel domains',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: '/api/auth (register, login)',
      products: '/api/products (CRUD)',
      users: '/api/users (admin)',
      categories: '/api/categories'
    }
  });
});

// Ruta de health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

// ============================================
// MANEJO DE ERRORES
// ============================================

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ 
    message: 'Ruta no encontrada',
    path: req.path
  });
});

// Manejo de errores generales
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({
    message: err.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});

// ============================================
// INICIAR SERVIDOR (SOLO EN DESARROLLO LOCAL)
// ============================================

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📍 CORS habilitado para localhost y Vercel`);
  });
}

// ============================================
// EXPORTAR PARA VERCEL
// ============================================

module.exports = app;
