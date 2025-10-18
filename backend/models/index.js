const sequelize = require("../config/database");

// Import all models
const User = require("./User");
const Product = require("./Product");
const ProductVariant = require("./ProductVariant");
const Discount = require("./Discount");
const VariantAttribute = require("./VariantAttribute");
const Comment = require("./Comments");
const Order = require("./Order");
const Payment = require("./Payment");
const Contact = require("./Contact");
const OrderItem = require("./OrderItem");

const models = {
  User,
  Product,
  ProductVariant,
  Discount,
  VariantAttribute,
  Comment,
  Order,
  Payment,
  Contact,
  OrderItem,
};

// Initialize associations
Object.values(models).forEach((model) => {
  if (model.associate) {
    model.associate(models);
  }
});

module.exports = {
  sequelize,
  ...models,
};
