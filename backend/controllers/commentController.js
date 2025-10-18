const { Comment, Product, User } = require("../models");

const addComment = async (req, res) => {
  try {
    const { text, rating } = req.body;
    const { productId } = req.params;
    const userId = req.user.id;

    // التأكد من أن المنتج موجود
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // إنشاء التعليق
    const newComment = await Comment.create({
      userId,
      productId,
      text,
      rating,
    });

    // إحضار التعليق مع بيانات المستخدم
    const populatedComment = await Comment.findByPk(newComment.id, {
      include: [
        {
          model: User,
          attributes: ["id", "name"],
        },
      ],
    });

    res.status(201).json(populatedComment);
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Failed to add comment", error });
  }
};

module.exports = { addComment };
