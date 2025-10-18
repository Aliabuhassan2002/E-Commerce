// routes/cartRoutes.js
const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const User = require("../models/User");
const ProductVariant = require("../models/ProductVariant.js");
const verifyToken = require("../middlewares/verifyToken");
const {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} = require("../controllers/cartController");
const sequelize = require("../config/database");

// إضافة منتج إلى السلة
router.post("/add", verifyToken, addToCart);

// الحصول على محتويات السلة
router.get("/", verifyToken, getCart);

// تحديث كمية المنتج في السلة
router.put("/:productId", verifyToken, updateCartItem);

// إزالة منتج من السلة
router.delete("/:productId", verifyToken, removeFromCart);

// تفريغ السلة بالكامل
router.delete("/", verifyToken, clearCart);
// Temporary debug route - remove after fixing
// Add this temporary debug route
router.get("/debug", verifyToken, async (req, res) => {
  try {
    const [results] = await sequelize.query(
      "SELECT id, email, cart FROM users WHERE id = ?",
      { replacements: [req.user.id] }
    );

    console.log("Raw SQL results:", results);

    res.json({
      sqlResults: results,
      authenticatedUserId: req.user.id,
    });
  } catch (error) {
    console.error("SQL debug error:", error);
    res.status(500).json({ error: error.message });
  }
});
// Run this once to fix the double-stringified data
router.get("/fix-cart-data", verifyToken, async (req, res) => {
  try {
    const [users] = await sequelize.query(
      "SELECT id, cart FROM users WHERE cart IS NOT NULL"
    );

    for (const user of users) {
      let fixedCart = [];

      if (typeof user.cart === "string") {
        try {
          // Remove extra quotes and escape characters
          let cartString = user.cart;

          // Remove surrounding quotes if they exist
          if (cartString.startsWith('"') && cartString.endsWith('"')) {
            cartString = cartString.slice(1, -1);
          }

          // Remove escape characters
          cartString = cartString.replace(/\\"/g, '"');

          fixedCart = JSON.parse(cartString);
        } catch (error) {
          console.error(`Error parsing cart for user ${user.id}:`, error);
          fixedCart = [];
        }
      } else if (Array.isArray(user.cart)) {
        fixedCart = user.cart;
      }

      // Update with properly formatted JSON (without extra stringification)
      await User.update(
        { cart: fixedCart }, // Store as proper array, let Sequelize handle JSON conversion
        { where: { id: user.id } }
      );

      console.log(`Fixed cart for user ${user.id}:`, fixedCart);
    }

    res.json({ success: true, message: "Cart data fixed" });
  } catch (error) {
    console.error("Fix error:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
