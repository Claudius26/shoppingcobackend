const { Product } = require('../models');

const createProduct = async (req, res) => {
  try {
    const { title, description, price, quantity, imageUrl } = req.body;

    if (req.user.role !== 'seller') {
      return res.status(403).json({ message: 'Only sellers can add products' });
    }

    const product = await Product.create({
      title,
      description,
      price,
      quantity,
      imageUrl,
      sellerId: req.user.id, // link product to seller
      available: quantity > 0
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create product', error: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { title, description, price, quantity, imageUrl, available } = req.body;

    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (product.sellerId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this product' });
    }

    await product.update({
      title,
      description,
      price,
      quantity,
      imageUrl,
      available: quantity > 0 ? true : available
    });

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update product', error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (product.sellerId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this product' });
    }

    await product.destroy();
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete product', error: error.message });
  }
};

const getProducts = async (req, res) => {
  try {
    const products = await Product.findAll({ where: { available: true } });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch products', error: error.message });
  }
};

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  getProducts
};
