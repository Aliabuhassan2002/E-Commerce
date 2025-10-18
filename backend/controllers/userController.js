const { User, Order, Product } = require("../models");
const bcrypt = require("bcryptjs");

// =====================
// GET USER INFO
// =====================
exports.getUserInfo = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findByPk(userId, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.status(404).json({ message: "لم يتم العثور على المستخدم" });
    }

    res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      phone: user.phone,
      address: user.address,
      cart: user.cart,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =====================
// UPDATE USER INFO
// =====================
exports.updateUser = async (req, res) => {
  try {
    const { name, currentPassword, newPassword } = req.body;
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // تحديث الاسم إذا تم تقديمه
    if (name) {
      user.name = name;
    }

    // تحديث كلمة المرور إذا تم تقديم كلمة المرور الحالية والجديدة
    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "Current password is incorrect" });
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    await user.save();

    res.status(200).json({
      message: "User updated successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// =====================
// GET USER ORDERS
// =====================
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.findAll({
      where: { userId },
      include: [
        {
          model: Product,
          as: "products",
          attributes: ["id", "name", "basePrice"],
          through: { attributes: [] }, // لو في جدول وسيط بين Order و Product
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
