const express = require('express');
const router = express.Router();
const {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} = require('../controllers/productControllers');

const { protect } = require('../middlewares/authMiddleware');

router.post('/', protect, createProduct); // seller only
router.get('/', getProducts); 
router.put('/:id', protect, updateProduct); // seller only
router.delete('/:id', protect, deleteProduct); // seller only

module.exports = router;
