const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');


const OrderItem = sequelize.define('OrderItem', {
orderId: { type: DataTypes.INTEGER, allowNull: false },
productId: { type: DataTypes.INTEGER, allowNull: false },
quantity: { type: DataTypes.INTEGER, allowNull: false },
unitPrice: { type: DataTypes.DECIMAL(10,2), allowNull: false },
subtotal: { type: DataTypes.DECIMAL(10,2), allowNull: false }
});


module.exports = OrderItem;