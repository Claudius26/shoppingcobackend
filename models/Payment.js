const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');


const Payment = sequelize.define('Payment', {
orderId: { type: DataTypes.INTEGER, allowNull: false },
method: { type: DataTypes.ENUM('card','paypal','bank','crypto'), allowNull: false },
status: { type: DataTypes.ENUM('pending','succeeded','failed'), defaultValue: 'pending' },
transactionId: { type: DataTypes.STRING },
amount: { type: DataTypes.DECIMAL(10,2), allowNull: false, defaultValue: 0 },
currency: { type: DataTypes.STRING, allowNull: false, defaultValue: 'USD' }
});


module.exports = Payment;