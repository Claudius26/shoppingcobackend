const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/db')
const Cart = require('./cart')
const Product = require('./product')

const CartItem = sequelize.define('CartItem', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  }
})

Cart.hasMany(CartItem, { foreignKey: 'cartId', onDelete: 'CASCADE' })
CartItem.belongsTo(Cart, { foreignKey: 'cartId' })

Product.hasMany(CartItem, { foreignKey: 'productId', onDelete: 'CASCADE' })
CartItem.belongsTo(Product, { foreignKey: 'productId' })

module.exports = CartItem
