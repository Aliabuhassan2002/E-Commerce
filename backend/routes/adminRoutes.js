const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Product = require("../models/Product");
const User = require("../models/User");
const ProductVariant = require("../models/ProductVariant");

const verifyToken = require("../middlewares/verifyToken");
const {
  getUsers,
  deleteUser,
  getProducts,
  deleteProduct,
  updateProductStatus,
  getFeedback,
  updateFeedbackStatus,
  getSalesAnalytics,
  getStoreVisitors,
  createProduct,
  getProductsByProvider,
  restoreProduct,
  softDeleteProduct,
  updateProduct,
  getOrders,
  updateOrderStatus,
} = require("../controllers/adminController");
const {
  updateProviderRequestStatus,
  getProviderRequests,
} = require("../controllers/poviderReqController");
const upload = require("../config/multerConfig"); // Add this import
// User Management
router.get("/users", verifyToken, getUsers);
router.delete("/users/:id", verifyToken, deleteUser);

// Product Management
router.get("/products", verifyToken, getProducts);
router.delete("/products/:id", verifyToken, deleteProduct);
router.put("/products/:id/status", verifyToken, updateProductStatus);
// router.put("/products/:id", verifyToken, updateProduct);
router.put(
  "/products/:id",
  verifyToken,
  upload.array("images", 5),
  updateProduct
);
router.put("/products/:id/soft-delete", verifyToken, softDeleteProduct);
router.put("/products/:id/restore", verifyToken, restoreProduct);
router.get("/providers/:provider/products", verifyToken, getProductsByProvider);
// Get variants for a product
router.get("/products/:productId/variants", verifyToken, async (req, res) => {
  try {
    const variants = await ProductVariant.findAll({
      where: { productId: req.params.productId },
      include: [{ model: Product, as: "product" }],
    });
    res.status(200).json(variants);
  } catch (error) {
    res.status(500).json({ message: "Error fetching variants", error });
  }
});
// router.post("/variants", verifyToken, async (req, res) => {
//   try {
//     const variantData = { ...req.body };

//     if (req.file) {
//       variantData.image = `/uploads/${req.file.filename}`;
//     }

//     if (variantData.dimensions && typeof variantData.dimensions === "string") {
//       variantData.dimensions = JSON.parse(variantData.dimensions);
//     }

//     const variant = await ProductVariant.create(variantData);
//     res.status(201).json(variant);
//   } catch (error) {
//     console.error("Error creating variant:", error);
//     res.status(500).json({ message: "Error creating variant", error });
//   }
// });
// Delete variant

router.post(
  "/variants",
  verifyToken,
  upload.single("image"),
  async (req, res) => {
    try {
      console.log("=== BACKEND VARIANT REQUEST ===");
      console.log("Request body:", req.body);
      console.log("Request file:", req.file);
      console.log("All request fields:", Object.keys(req.body));

      const {
        sku,
        color,
        size,
        price,
        stockQuantity,
        weight,
        dimensions,
        productId,
      } = req.body;

      console.log("Parsed fields:");
      console.log("- sku:", sku, `(type: ${typeof sku})`);
      console.log("- color:", color, `(type: ${typeof color})`);
      console.log("- size:", size, `(type: ${typeof size})`);
      console.log("- price:", price, `(type: ${typeof price})`);
      console.log("- stockQuantity:", stockQuantity);
      console.log("- productId:", productId);

      // Validate required fields
      if (!sku || !color || !size || !price || !stockQuantity || !productId) {
        console.log("MISSING FIELDS:");
        if (!sku) console.log("❌ sku is missing");
        if (!color) console.log("❌ color is missing");
        if (!size) console.log("❌ size is missing");
        if (!price) console.log("❌ price is missing");
        if (!stockQuantity) console.log("❌ stockQuantity is missing");
        if (!productId) console.log("❌ productId is missing");

        return res.status(400).json({
          success: false,
          message: "Missing required fields",
        });
      }

      // Check if product exists
      const product = await Product.findByPk(productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      const variantData = {
        sku: sku.trim(),
        color: color.trim(),
        size: size.trim(),
        price: parseFloat(price),
        stockQuantity: parseInt(stockQuantity),
        productId: parseInt(productId),
        isActive: true,
      };

      console.log("Variant data to create:", variantData);

      // Add optional fields if provided
      if (weight) variantData.weight = parseFloat(weight);
      if (dimensions) {
        variantData.dimensions =
          typeof dimensions === "string" ? JSON.parse(dimensions) : dimensions;
      }
      if (req.file) {
        variantData.image = `/uploads/${req.file.filename}`;
      }

      const variant = await ProductVariant.create(variantData);

      console.log("Variant created successfully:", variant.id);

      res.status(201).json({
        success: true,
        variant,
      });
    } catch (error) {
      console.error("Error creating variant:", error);
      res.status(500).json({
        success: false,
        message: "Error creating variant",
        error: error.message,
      });
    }
  }
);

router.delete("/variants/:id", verifyToken, async (req, res) => {
  try {
    await ProductVariant.destroy({ where: { id: req.params.id } });
    res.status(200).json({ message: "Variant deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting variant", error });
  }
});

// Feedback Management
router.get("/feedback", verifyToken, getFeedback);
router.put("/feedback/:id/status", verifyToken, updateFeedbackStatus);

// Analytics
router.get("/analytics/sales", verifyToken, getSalesAnalytics);
router.get("/analytics/visitors", verifyToken, getStoreVisitors);
// router.post("/products", verifyToken, createProduct);
router.post(
  "/products",
  verifyToken,
  upload.array("images", 5), // Allow up to 5 images
  createProduct
);
// GET /api/admin/providers - Fetch all providers
// router.get("/providers", verifyToken, async (req, res) => {
//   try {
//     const providers = await User.find({ role: "provider" });
//     res.status(200).json(providers);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching providers", error });
//   }
// });
router.get("/providers", verifyToken, async (req, res) => {
  try {
    const providers = await User.findAll({
      where: { role: "provider" }, // شرط الدور
      attributes: { exclude: ["password"] }, // استثناء كلمة المرور
    });

    res.status(200).json(providers);
  } catch (error) {
    console.error("Error fetching providers:", error);
    res.status(500).json({ message: "Error fetching providers", error });
  }
});
//Orders Management
router.get("/orders", verifyToken, getOrders);
router.put("/orders/:id/status", verifyToken, updateOrderStatus);
router.get("/provider-requests", verifyToken, getProviderRequests);
router.put("/provider-requests/:id", verifyToken, updateProviderRequestStatus);
module.exports = router;
