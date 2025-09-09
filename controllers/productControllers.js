const { Product, Activity } = require('../models');

const getFullImageUrl = (req, imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;
  return `${req.protocol}://${req.get('host')}${imagePath}`;
};

const createProduct = async (req, res) => {
  try {
    const { title, description, price, quantity, imageUrl } = req.body;
    if (req.user.role !== 'seller') return res.status(403).json({ message: 'Only sellers can add products' });

    const finalImageUrl = req.file ? `/uploads/${req.file.filename}` : imageUrl || null;

    const product = await Product.create({
      title,
      description,
      price,
      quantity,
      imageUrl: finalImageUrl,
      sellerId: req.user.id,
      available: quantity > 0
    });

    await Activity.create({
      userId: req.user.id,
      type: 'Product',
      action: 'Added',
      detail: `Added product: ${product.title}`,
    });

    product.imageUrl = getFullImageUrl(req, product.imageUrl);
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
    if (product.sellerId !== req.user.id) return res.status(403).json({ message: 'Not authorized to update this product' });

    const finalImageUrl = req.file ? `/uploads/${req.file.filename}` : imageUrl || product.imageUrl;

    await product.update({
      title,
      description,
      price,
      quantity,
      imageUrl: finalImageUrl,
      available: quantity > 0 ? true : available
    });

    await Activity.create({
      userId: req.user.id,
      type: 'Product',
      action: 'Updated',
      detail: `Updated product: ${product.title}`,
    });

    product.imageUrl = getFullImageUrl(req, product.imageUrl);
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update product', error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.sellerId !== req.user.id) return res.status(403).json({ message: 'Not authorized to delete this product' });

    await product.destroy();

    await Activity.create({
      userId: req.user.id,
      type: 'Product',
      action: 'Deleted',
      detail: `Deleted product: ${product.title}`,
    });

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete product', error: error.message });
  }
};

const getProducts = async (req, res) => {
  try {
    const products = await Product.findAll({ where: { available: true } });
    const updatedProducts = products.map(p => ({
      ...p.toJSON(),
      imageUrl: getFullImageUrl(req, p.imageUrl)
    }));
    res.json(updatedProducts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch products', error: error.message });
  }
};

const getSellerProducts = async (req, res) => {
  try {
    if (req.user.role !== 'seller') return res.status(403).json({ message: 'Only sellers can view their products' });

    const products = await Product.findAll({
      where: { sellerId: req.user.id },
      order: [['createdAt', 'DESC']]
    });

    const updatedProducts = products.map(p => ({
      ...p.toJSON(),
      imageUrl: getFullImageUrl(req, p.imageUrl)
    }));

    res.json(updatedProducts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch seller products', error: error.message });
  }
};

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  getProducts,
  getSellerProducts
};
