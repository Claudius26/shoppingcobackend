const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');


const Order = sequelize.define('Order', {
userId: { type: DataTypes.INTEGER, allowNull: false },
totalAmount: { type: DataTypes.DECIMAL(10,2), allowNull: false, defaultValue: 0 },
status: { type: DataTypes.ENUM('pending','processing','shipped','completed','cancelled'), defaultValue: 'pending' },
paymentMethod: { type: DataTypes.ENUM('card','paypal','bank','crypto'), allowNull: false },
paymentStatus: { type: DataTypes.ENUM('unpaid','paid','failed','refunded'), defaultValue: 'unpaid' }
});


module.exports = Order;