require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://huerto-hogar-react-m7p5gca1n-jeans-projects-56426119.vercel.app',
    'https://huerto-hogar-react.vercel.app',
    'https://*.vercel.app'
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Importar rutas (usando rutas relativas correctas desde api/)
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
    message: 'API HuertoHogar funcionando en Vercel 🚀',
    version: '1.0.0',
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
