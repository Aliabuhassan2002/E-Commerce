const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Payment = sequelize.define(
  "Payment",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    transactionId: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.ENUM("pending", "completed", "failed"),
      defaultValue: "pending",
    },
    details: {
      type: DataTypes.JSON,
    },
  },
  {
    timestamps: true,
    tableName: "payments",
  }
);

// Associations method
Payment.associate = function (models) {
  Payment.belongsTo(models.Order, { foreignKey: "orderId" });
};

module.exports = Payment;
