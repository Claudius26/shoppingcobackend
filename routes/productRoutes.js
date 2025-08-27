const express = require('express');
const router = express.Router();
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require('../controllers/productControllers');

const { protect, adminOnly } = require('../middlewares/authMiddleware');

router.post('/', protect, adminOnly, createProduct);
router.get('/', getProducts);
router.get('/:id', getProductById);
router.put('/:id', protect, adminOnly, updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

module.exports = router;
