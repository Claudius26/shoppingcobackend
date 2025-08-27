const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');


const CartItem = sequelize.define('CartItem', {
cartId: { type: DataTypes.INTEGER, allowNull: false },
productId: { type: DataTypes.INTEGER, allowNull: false },
quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
unitPrice: { type: DataTypes.DECIMAL(10,2), allowNull: false }
});


module.exports = CartItem;