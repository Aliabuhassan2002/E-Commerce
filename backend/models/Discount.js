const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Discount = sequelize.define(
  "Discount",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    discountType: {
      type: DataTypes.ENUM("percentage", "fixed_amount"),
      allowNull: false,
    },
    value: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    applicableTo: {
      type: DataTypes.ENUM("product", "variant", "category"),
      allowNull: false,
    },
    targetId: {
      type: DataTypes.INTEGER,
    },
    targetCategory: {
      type: DataTypes.STRING,
    },
    minOrderAmount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    usageLimit: {
      type: DataTypes.INTEGER,
    },
    usedCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    code: {
      type: DataTypes.STRING(50),
      unique: true,
    },
  },
  {
    timestamps: true,
    tableName: "discounts",
    indexes: [
      {
        name: "idx_discount_code",
        fields: ["code"], // للبحث السريع عن كود الخصم
      },
      {
        name: "idx_discount_is_active",
        fields: ["isActive"],
      },
      {
        name: "idx_discount_dates",
        fields: ["startDate", "endDate"], // للتحقق من الخصومات النشطة
      },
      {
        name: "idx_discount_applicable",
        fields: ["applicableTo", "targetId"], // للعثور على خصومات لمنتج/فاريانت معين
      },
      {
        name: "idx_discount_active_dates",
        fields: ["isActive", "startDate", "endDate"], // للعثور على الخصومات النشطة حالياً
      },
    ],
  }
);

// Associations method
Discount.associate = function (models) {
  Discount.belongsTo(models.Product, {
    foreignKey: "targetId",
    constraints: false,
    as: "productDiscount",
  });
  Discount.belongsTo(models.ProductVariant, {
    foreignKey: "targetId",
    constraints: false,
    as: "variantDiscount",
  });
};

module.exports = Discount;
