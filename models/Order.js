const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./user');
const Product = require('./product');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  totalPrice: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'paid', 'shipped', 'delivered', 'cancelled'),
    defaultValue: 'pending'
  },
  buyerId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'orders',
  timestamps: true,
});


Order.belongsTo(User, { foreignKey: 'buyerId', as: 'buyer' });
User.hasMany(Order, { foreignKey: 'buyerId', as: 'orders' });

Order.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
Product.hasMany(Order, { foreignKey: 'productId', as: 'orders' });

module.exports = Order;
