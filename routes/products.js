const express = require('express');
const router = express.Router();
const { verifyToken, checkRole } = require('../middleware/auth');
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getMyProducts
} = require('../controllers/productController');

// Rutas públicas (sin autenticación)
router.get('/', getAllProducts);              // Obtener todos los productos
router.get('/:id', getProductById);           // Obtener un producto por ID

// Rutas protegidas (requieren autenticación)
router.use(verifyToken);                      // Aplicar middleware a todas las rutas siguientes

router.post('/', createProduct);              // Crear producto (cualquier usuario autenticado)
router.get('/my/products', getMyProducts);    // Obtener mis productos
router.put('/:id', updateProduct);            // Actualizar producto (dueño o admin)
router.delete('/:id', deleteProduct);         // Eliminar producto (dueño o admin)

module.exports = router;
