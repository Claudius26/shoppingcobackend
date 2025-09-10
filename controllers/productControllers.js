const { Product } = require('../models')
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

const createProduct = async (req, res) => {
  try {
    let imageUrl = req.body.imageUrl || null

    if (req.file) {
      const { originalname, buffer } = req.file
      const filePath = `products/${Date.now()}-${originalname}`
      const { error } = await supabase.storage.from('products').upload(filePath, buffer, { contentType: req.file.mimetype })
      if (error) return res.status(400).json({ message: 'Image upload failed', error })
      const { data } = supabase.storage.from('products').getPublicUrl(filePath)
      imageUrl = data.publicUrl
    }

    const product = await Product.create({ ...req.body, image: imageUrl, userId: req.user.id })
    res.status(201).json(product)
  } catch (err) {
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
    const products = await Product.findAll({ where: { userId: req.user.id } })
    res.json(products)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id)
    if (!product) return res.status(404).json({ message: 'Product not found' })

    let imageUrl = req.body.imageUrl || product.image

    if (req.file) {
      const { originalname, buffer } = req.file
      const filePath = `products/${Date.now()}-${originalname}`
      const { error } = await supabase.storage.from('products').upload(filePath, buffer, { contentType: req.file.mimetype })
      if (error) return res.status(400).json({ message: 'Image upload failed', error })
      const { data } = supabase.storage.from('products').getPublicUrl(filePath)
      imageUrl = data.publicUrl
    }

    await product.update({ ...req.body, image: imageUrl })
    res.json(product)
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

module.exports = { createProduct, getProducts, updateProduct, deleteProduct, getSellerProducts }
