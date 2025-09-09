const User = require("./user");
const Product = require("./product");
const Cart = require("./cart");
const CartItem = require("./cartItem");
const Order = require("./Order");
const OrderItem = require("./OrderItem");
const Payment = require("./Payment");
const Activity = require("./activity");

// Associations
User.hasOne(Cart, { foreignKey: "userId", onDelete: "CASCADE" });
Cart.belongsTo(User, { foreignKey: "userId" });

Cart.belongsToMany(Product, { through: CartItem, foreignKey: "cartId" });
Product.belongsToMany(Cart, { through: CartItem, foreignKey: "productId" });

User.hasMany(Order, { foreignKey: "userId", onDelete: "CASCADE" });
Order.belongsTo(User, { foreignKey: "userId" });

Order.belongsToMany(Product, { through: OrderItem, foreignKey: "orderId" });
Product.belongsToMany(Order, { through: OrderItem, foreignKey: "productId" });

Order.hasOne(Payment, { foreignKey: "orderId", onDelete: "CASCADE" });
Payment.belongsTo(Order, { foreignKey: "orderId" });

// Activity relation
User.hasMany(Activity, { foreignKey: "userId", onDelete: "CASCADE" });
Activity.belongsTo(User, { foreignKey: "userId" });

module.exports = {
  User,
  Product,
  Cart,
  CartItem,
  Order,
  OrderItem,
  Payment,
  Activity,
};
