const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const VariantAttribute = sequelize.define(
  "VariantAttribute",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    attributeName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    attributeValue: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    timestamps: true,
    tableName: "variant_attributes",
  }
);

// Associations method
VariantAttribute.associate = function (models) {
  VariantAttribute.belongsTo(models.ProductVariant, {
    foreignKey: "variantId",
    as: "variant",
  });
};

module.exports = VariantAttribute;
