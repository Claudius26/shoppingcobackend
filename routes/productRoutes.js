const express = require('express')
const router = express.Router()
const {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  getSellerProducts
} = require('../controllers/productControllers')
const { protect } = require('../middlewares/authMiddleware')
const multer = require('multer')
const upload = multer({ storage: multer.memoryStorage() })

router.post('/seller', protect, upload.single('image'), createProduct)
router.get('/seller', protect, getSellerProducts)
router.put('/seller/:id', protect, upload.single('image'), updateProduct)
router.delete('/seller/:id', protect, deleteProduct)
router.get('/', getProducts)

module.exports = router
