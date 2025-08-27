const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/db')
const User = require('./user')

const Cart = sequelize.define('Cart', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  }
})

User.hasOne(Cart, { foreignKey: 'userId', onDelete: 'CASCADE' })
Cart.belongsTo(User, { foreignKey: 'userId' })

module.exports = Cart
