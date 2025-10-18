const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Product = sequelize.define(
  "Product",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    basePrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    category: {
      type: DataTypes.ENUM("carpet", "accessory"),
      allowNull: false,
    },
    style: {
      type: DataTypes.ENUM(
        "traditional",
        "modern",
        "bohemian",
        "transitional",
        "vintage",
        "contemporary",
        "minimalist",
        "coastal"
      ),
    },
    roomType: {
      type: DataTypes.ENUM(
        "living-room",
        "bedroom",
        "dining-room",
        "office",
        "hallway",
        "outdoor"
      ),
    },
    pattern: {
      type: DataTypes.ENUM(
        "solid",
        "geometric",
        "floral",
        "abstract",
        "striped",
        "oriental"
      ),
    },
    material: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    images: {
      type: DataTypes.JSON,
      defaultValue: [],
      get() {
        const rawValue = this.getDataValue("images");
        if (Array.isArray(rawValue)) {
          return rawValue;
        }
        if (typeof rawValue === "string") {
          try {
            return JSON.parse(rawValue);
          } catch (e) {
            console.error("Error parsing images JSON:", e);
            return [];
          }
        }
        return rawValue || [];
      },
      set(value) {
        this.setDataValue("images", Array.isArray(value) ? value : []);
      },
    },
    hasVariants: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "approved", "rejected"),
      defaultValue: "pending",
    },
    rejectionReason: {
      type: DataTypes.TEXT,
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    tags: {
      type: DataTypes.JSON,
      defaultValue: [],
      get() {
        const rawValue = this.getDataValue("tags");
        if (Array.isArray(rawValue)) return rawValue;
        if (typeof rawValue === "string") {
          try {
            return JSON.parse(rawValue);
          } catch (e) {
            return [];
          }
        }
        return rawValue || [];
      },
      set(value) {
        this.setDataValue("tags", Array.isArray(value) ? value : []);
      },
    },
    providerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    tableName: "products",
    indexes: [
      // Single column indexes
      {
        name: "idx_product_status",
        fields: ["status"],
      },
      {
        name: "idx_product_category",
        fields: ["category"],
      },
      {
        name: "idx_product_provider",
        fields: ["providerId"],
      },
      {
        name: "idx_product_is_deleted",
        fields: ["isDeleted"],
      },
      {
        name: "idx_product_created_at",
        fields: ["createdAt"],
      },

      // Composite indexes for common query patterns
      {
        name: "idx_product_status_category",
        fields: ["status", "category"],
      },
      {
        name: "idx_product_status_provider",
        fields: ["status", "providerId"],
      },
      {
        name: "idx_product_search",
        fields: ["name", "material", "style"], // For search functionality
      },
      {
        name: "idx_product_filter",
        fields: ["category", "style", "roomType", "pattern"], // For filtering
      },

      // Full-text search index (if your database supports it)
      // {
      //   name: 'idx_product_fulltext',
      //   type: 'FULLTEXT',
      //   fields: ['name', 'description', 'material']
      // }
    ],
  }
);

// Associations method
Product.associate = function (models) {
  Product.hasMany(models.OrderItem, {
    foreignKey: "productId",
    as: "orderItems",
  });
  Product.belongsTo(models.User, {
    foreignKey: "providerId",
    as: "provider",
  });
  Product.hasMany(models.ProductVariant, {
    foreignKey: "productId",
    as: "variants",
  });
  Product.hasMany(models.Comment, {
    foreignKey: "productId",
  });
  Product.hasMany(models.Discount, {
    foreignKey: "targetId",
    constraints: false,
    scope: { applicableTo: "product" },
    as: "discounts",
  });
  Product.belongsToMany(models.User, {
    through: "UserLikedProducts",
    foreignKey: "productId",
    otherKey: "userId",
    as: "likedByUsers",
  });
};

module.exports = Product;
