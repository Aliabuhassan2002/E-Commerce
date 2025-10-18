const express = require("express");
const router = express.Router();
const { Order, OrderItem, User, Product } = require("../models");
const verifyToken = require("../middlewares/verifyToken");
const {
  createOrder,
  getOrderHistory,
  getOrderById,
  createPaymentIntent,
} = require("../controllers/orderController");
router.post("/create-payment-intent", verifyToken, createPaymentIntent);

router.post("/", verifyToken, createOrder);
router.get("/history", verifyToken, getOrderHistory);
router.get("/:id", verifyToken, getOrderById);
// Get orders for provider's products
// Get orders for a provider's products
// router.get("/provider/my-orders", verifyToken, async (req, res) => {
//   if (req.user.role !== "provider") {
//     return res.status(403).json({ message: "Access denied" });
//   }

//   try {
//     const orders = await Order.find({ "products.provider": req.user.id })
//       .populate("user", "name email")
//       .populate("products.product", "name price images")
//       .sort({ createdAt: -1 });

//     res.json(orders);
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error });
//   }
// });
router.get("/provider/my-orders", verifyToken, async (req, res) => {
  if (req.user.role !== "provider") {
    return res.status(403).json({ message: "Access denied" });
  }

  try {
    // جلب كل الـ Orders التي تحتوي على OrderItems الخاصة بالمزود الحالي
    const orders = await Order.findAll({
      include: [
        {
          model: OrderItem,
          where: { providerId: req.user.id },
          include: [
            {
              model: Product,
              attributes: ["id", "name", "price", "images"],
            },
          ],
        },
        {
          model: User,
          attributes: ["id", "name", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
});
module.exports = router;
