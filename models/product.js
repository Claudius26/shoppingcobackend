const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./user');

const Product = sequelize.define('Product', {
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
  available: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  }
}, {
  tableName: 'products',
  timestamps: true,
});

 
User.hasMany(Product, { foreignKey: 'sellerId', onDelete: 'CASCADE' });
Product.belongsTo(User, { foreignKey: 'sellerId' });

module.exports = Product;
