const { Product } = require('../models');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const ALLOWED_CATEGORIES = Product.rawAttributes.category.values;


const getCategories = (req, res) => {
  try {
    res.json(ALLOWED_CATEGORIES);
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


const createProduct = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    const { category, tags } = req.body;

    if (!category || !ALLOWED_CATEGORIES.includes(category)) {
      return res.status(400).json({ message: 'Invalid category' });
    }

    let imageUrl = req.body.imageUrl || null;

    if (req.file) {
      const { originalname, buffer } = req.file;
      const filePath = `products/${Date.now()}-${originalname}`;
      const { error: uploadError } = await supabase.storage
        .from('product-image')
        .upload(filePath, buffer, { contentType: req.file.mimetype });

      if (uploadError) return res.status(400).json({ message: 'Image upload failed', error: uploadError });

      const { data, error: urlError } = supabase.storage.from('product-image').getPublicUrl(filePath);
      if (urlError || !data?.publicUrl) return res.status(500).json({ message: 'Failed to get image URL' });

      imageUrl = data.publicUrl;
    }

    const tagsArray = tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [];

    const product = await Product.create({
      ...req.body,
      tags: tagsArray,
      imageUrl,
      sellerId: req.user.id,
    });

    res.status(201).json(product);
  } catch (err) {
    console.error('Error creating product:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


const updateProduct = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const { category, tags } = req.body;

    if (category && !ALLOWED_CATEGORIES.includes(category)) {
      return res.status(400).json({ message: 'Invalid category' });
    }

    let imageUrl = req.body.imageUrl || product.imageUrl;

    if (req.file) {
      const { originalname, buffer } = req.file;
      const filePath = `products/${Date.now()}-${originalname}`;
      const { error: uploadError } = await supabase.storage
        .from('product-image')
        .upload(filePath, buffer, { contentType: req.file.mimetype });

      if (uploadError) return res.status(400).json({ message: 'Image upload failed', error: uploadError });

      const { data, error: urlError } = supabase.storage.from('product-image').getPublicUrl(filePath);
      if (urlError || !data?.publicUrl) return res.status(500).json({ message: 'Failed to get image URL' });

      imageUrl = data.publicUrl;
    }

    const tagsArray = tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : product.tags;

    await product.update({
      ...req.body,
      tags: tagsArray,
      imageUrl,
    });

    res.json(product);
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


const getProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


const getSellerProducts = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    const products = await Product.findAll({ where: { sellerId: req.user.id } });
    res.json(products);
  } catch (err) {
    console.error('Error fetching seller products:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


const deleteProduct = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    await product.destroy();
    res.json({ message: 'Product deleted' });
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


module.exports = {
  createProduct,
  updateProduct,
  getProducts,
  getSellerProducts,
  deleteProduct,
  getCategories,
};
