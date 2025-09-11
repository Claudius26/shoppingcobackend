const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/db')
const User = require('./user')

const Product = sequelize.define(
  'Product',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    imageUrl: {
      type: DataTypes.STRING,
    },
    brand: {
      type: DataTypes.STRING,
    },
    sku: {
      type: DataTypes.STRING,
      unique: true,
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    category: {
      type: DataTypes.ENUM(
        'Electronics',
        'Mobile Phones',
        'Laptops',
        'Tablets',
        'Cameras',
        'Audio',
        'Wearable Tech',
        'Gaming',
        'Fashion',
        'Men Clothing',
        'Women Clothing',
        'Kids Clothing',
        'Shoes',
        'Bags',
        'Watches',
        'Jewelry',
        'Beauty & Personal Care',
        'Health & Wellness',
        'Groceries',
        'Snacks & Beverages',
        'Home & Kitchen',
        'Furniture',
        'Home Decor',
        'Bedding',
        'Appliances',
        'Tools & Home Improvement',
        'Lighting',
        'Office Supplies',
        'Books',
        'Stationery',
        'Toys & Games',
        'Baby Products',
        'Sports & Outdoors',
        'Fitness Equipment',
        'Cycling',
        'Automotive',
        'Motorbike Accessories',
        'Pet Supplies',
        'Garden & Outdoors',
        'Musical Instruments',
        'Art & Craft',
        'Movies & Music',
        'Software',
        'Industrial & Scientific',
        'Travel & Luggage',
        'Gift Items',
        'Party Supplies',
        'Seasonal Products',
        'Collectibles'
      ),
      allowNull: false,
    },
    available: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: 'products',
    timestamps: true,
  }
)

User.hasMany(Product, { foreignKey: 'sellerId', onDelete: 'CASCADE' })
Product.belongsTo(User, { foreignKey: 'sellerId' })

module.exports = Product
