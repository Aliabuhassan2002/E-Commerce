const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ProductVariant = sequelize.define(
  "ProductVariant",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    sku: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: false,
    },
    color: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    size: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    stockQuantity: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    weight: {
      type: DataTypes.DECIMAL(8, 2),
    },
    dimensions: {
      type: DataTypes.JSON,
    },
  },
  {
    timestamps: true,
    tableName: "product_variants",
    indexes: [
      {
        name: "idx_variant_product",
        fields: ["productId"], // للـ JOIN مع الـ Product
      },
      {
        name: "idx_variant_sku",
        fields: ["sku"],
      },
      {
        name: "idx_variant_is_active",
        fields: ["isActive"],
      },
      {
        name: "idx_variant_stock",
        fields: ["stockQuantity"], // للبحث عن المنتجات المتوفرة
      },
      {
        name: "idx_variant_color_size",
        fields: ["color", "size"], // للبحث حسب اللون والحجم
      },
      {
        name: "idx_variant_product_active",
        fields: ["productId", "isActive"], // للعثور على variants نشطة لمنتج معين
      },
    ],
  }
);

// Associations method
ProductVariant.associate = function (models) {
  ProductVariant.belongsTo(models.Product, {
    foreignKey: "productId",
    as: "product",
  });
  ProductVariant.hasMany(models.VariantAttribute, {
    foreignKey: "variantId",
    as: "attributes",
  });
  ProductVariant.hasMany(models.Discount, {
    foreignKey: "targetId",
    constraints: false,
    scope: { applicableTo: "variant" },
    as: "discounts",
  });
};

module.exports = ProductVariant;
