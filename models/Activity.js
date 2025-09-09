// models/activity.js
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/db").sequelize;

class Activity extends Model {}

Activity.init(
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false, // e.g., "Product" or "Order"
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false, // e.g., "Added", "Updated", "Deleted"
    },
    detail: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: "Activity",
    tableName: "activities",
    timestamps: true,
  }
);

module.exports = Activity;
