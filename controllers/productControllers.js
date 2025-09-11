const { Product } = require('../models')
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const ALLOWED_CATEGORIES = Product.rawAttributes.category.values

const getCategories = (req, res) => {
  try {
    res.json(ALLOWED_CATEGORIES)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
    console.log('Error fetching categories:', err)
  }
}

const createProduct = async (req, res) => {
  try {
    const { category } = req.body

    if (!category || !ALLOWED_CATEGORIES.includes(category)) {
      console.log('Invalid category:', category)
      return res.status(400).json({ message: 'Invalid category' })
    }

    let imageUrl = req.body.imageUrl || null

    if (req.file) {
      const { originalname, buffer } = req.file
      const filePath = `products/${Date.now()}-${originalname}`
      const { error } = await supabase.storage
        .from('product-image')
        .upload(filePath, buffer, { contentType: req.file.mimetype })

      if (error) {
        console.log('Image upload failed:', error)
        return res.status(400).json({ message: 'Image upload failed', error })
      }

      const { data } = supabase.storage.from('product-image').getPublicUrl(filePath)
      imageUrl = data.publicUrl
    }

    const product = await Product.create({
      ...req.body,
      imageUrl,
      sellerId: req.user.id,
    })

    res.status(201).json(product)
  } catch (err) {
    console.error('Error creating product:', err)
    res.status(500).json({ message: 'Server error', error: err.message })
    
  }
}

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id)
    if (!product) return res.status(404).json({ message: 'Product not found' })

    const { category } = req.body
    if (category && !ALLOWED_CATEGORIES.includes(category)) {
      return res.status(400).json({ message: 'Invalid category' })
    }

    let imageUrl = req.body.imageUrl || product.imageUrl

    if (req.file) {
      const { originalname, buffer } = req.file
      const filePath = `products/${Date.now()}-${originalname}`
      const { error } = await supabase.storage
        .from('product-image')
        .upload(filePath, buffer, { contentType: req.file.mimetype })

      if (error) return res.status(400).json({ message: 'Image upload failed', error })

      const { data } = supabase.storage.from('product-image').getPublicUrl(filePath)
      imageUrl = data.publicUrl
    }

    await product.update({ ...req.body, imageUrl })
    res.json(product)
  } catch (err) {
    console.error('Error updating product:', err)
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

const getProducts = async (req, res) => {
  try {
    const products = await Product.findAll()
    res.json(products)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

const getSellerProducts = async (req, res) => {
  try {
    const products = await Product.findAll({ where: { sellerId: req.user.id } })
    res.json(products)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id)
    if (!product) return res.status(404).json({ message: 'Product not found' })

    await product.destroy()
    res.json({ message: 'Product deleted' })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

module.exports = {
  createProduct,
  updateProduct,
  getProducts,
  getSellerProducts,
  deleteProduct,
  getCategories,
}
