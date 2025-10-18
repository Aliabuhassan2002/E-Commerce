const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Contact = sequelize.define(
  "Contact",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    phone: {
      type: DataTypes.STRING,
    },
    address: {
      type: DataTypes.STRING(200),
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "reviewed"),
      defaultValue: "pending",
    },
  },
  {
    timestamps: true,
    tableName: "contacts",
  }
);

// No associations needed for Contact
Contact.associate = function (models) {
  // No associations
};

module.exports = Contact;
