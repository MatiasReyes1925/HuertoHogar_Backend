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

// Rutas públicas
router.get('/', getAllProducts);
router.get('/:id', getProductById);

// Rutas protegidas
router.use(verifyToken);

router.post('/', createProduct);
router.get('/my/products', getMyProducts);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;
