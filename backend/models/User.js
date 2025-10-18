const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define(
  "User",
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
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("end-user", "provider", "admin"),
      defaultValue: "end-user",
    },
    providerStatus: {
      type: DataTypes.ENUM("pending", "approved", "rejected"),
      defaultValue: null,
    },
    isApproved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    profileImage: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    identityDocument: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    address: {
      type: DataTypes.TEXT,
    },
    phone: {
      type: DataTypes.STRING,
    },
    cart: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
  },
  {
    timestamps: true,
    tableName: "users",
    indexes: [
      // إندكسنج للحقول المستخدمة بكثرة
      {
        name: "idx_user_email",
        fields: ["email"],
      },
      {
        name: "idx_user_role",
        fields: ["role"],
      },
      {
        name: "idx_user_provider_status",
        fields: ["providerStatus"],
      },
      {
        name: "idx_user_is_approved",
        fields: ["isApproved"],
      },
      {
        name: "idx_user_created_at",
        fields: ["createdAt"],
      },
      // إندكسنج مركب للاستعلامات الشائعة
      {
        name: "idx_user_role_status",
        fields: ["role", "providerStatus"],
      },
      {
        name: "idx_user_approved_providers",
        fields: ["role", "isApproved", "providerStatus"],
      },
    ],
  }
);

// Associations method
User.associate = function (models) {
  User.hasMany(models.Product, { foreignKey: "providerId", as: "products" });
  User.hasMany(models.OrderItem, { foreignKey: "providerId" });
  User.hasMany(models.Order, { foreignKey: "userId" });
  User.hasMany(models.Comment, { foreignKey: "userId" });
  User.belongsToMany(models.Product, {
    through: "UserLikedProducts",
    foreignKey: "userId",
    otherKey: "productId",
    as: "likedProducts",
  });
};

module.exports = User;
