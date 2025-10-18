const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Order = sequelize.define(
  "Order",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    products: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    shippingAddress: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    discountedAmount: {
      type: DataTypes.DECIMAL(10, 2),
    },
    appliedDiscounts: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    paymentMethod: {
      type: DataTypes.ENUM("cod", "credit_card", "stripe"),
      allowNull: false,
    },
    paymentStatus: {
      type: DataTypes.ENUM("pending", "completed", "failed"),
      defaultValue: "pending",
    },
    orderStatus: {
      type: DataTypes.ENUM("processing", "shipped", "delivered", "cancelled"),
      defaultValue: "processing",
    },
    transactionId: {
      type: DataTypes.STRING,
    },
    notes: {
      type: DataTypes.TEXT,
    },
  },
  {
    timestamps: true,
    tableName: "orders",
  }
);

// Associations method
Order.associate = function (models) {
  Order.belongsTo(models.User, { foreignKey: "userId" });
  Order.hasOne(models.Payment, { foreignKey: "orderId" });
  Order.hasMany(models.OrderItem, { foreignKey: "orderId", as: "items" });
};

module.exports = Order;
