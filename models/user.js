const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/db');

const User = sequelize.define('User', {
  firstname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
dob: {
  type: DataTypes.DATEONLY,
  allowNull: false,
  validate: {
    isDate: true,
    notEmpty: true
  }
},
  nationality: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  residence: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
});

module.exports = User;
