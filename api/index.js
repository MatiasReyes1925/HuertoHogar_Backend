require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
  origin: ['http://localhost:3000', 'https://huerto-hogar-react-m7p5gca1n-jeans-projects-56426119.vercel.app'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Importar rutas
const authRoutes = require('../routes/auth');
const productRoutes = require('../routes/products');
const userRoutes = require('../routes/users');

// Usar rutas
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ 
    message: 'API HuertoHogar funcionando en Vercel',
    version: '1.0.0'
  });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// IMPORTANTE: Para Vercel, NO uses app.listen() aquí
// Solo exporta la app
module.exports = app;
