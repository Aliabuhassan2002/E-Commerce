const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Comment = sequelize.define(
  "Comment",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    rating: {
      type: DataTypes.INTEGER,
      validate: {
        min: 1,
        max: 5,
      },
    },
  },
  {
    timestamps: true,
    tableName: "comments",
    indexes: [
      {
        name: "idx_comment_product",
        fields: ["productId"], // لجلب تعليقات منتج معين
      },
      {
        name: "idx_comment_user",
        fields: ["userId"], // لجلب تعليقات مستخدم معين
      },
      {
        name: "idx_comment_rating",
        fields: ["rating"], // للبحث حسب التقييم
      },
      {
        name: "idx_comment_created_at",
        fields: ["createdAt"], // للترتيب حسب التاريخ
      },
      {
        name: "idx_comment_product_rating",
        fields: ["productId", "rating"], // لمتوسط التقييمات
      },
    ],
  }
);

// Associations method
Comment.associate = function (models) {
  Comment.belongsTo(models.User, { foreignKey: "userId" });
  Comment.belongsTo(models.Product, { foreignKey: "productId" });
};

module.exports = Comment;
