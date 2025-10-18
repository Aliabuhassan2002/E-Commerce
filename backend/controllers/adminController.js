const { User, Product, Contact, Order, sequelize } = require("../models");
const { Op } = require("sequelize");

// Users
const getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const deleteUser = async (req, res) => {
  try {
    await User.destroy({ where: { id: req.params.id } });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Products
const getProducts = async (req, res) => {
  try {
    const { showDeleted, provider } = req.query;
    const where = {};
    if (provider) where.providerId = provider;
    if (showDeleted !== "true") where.isDeleted = false;

    const products = await Product.findAll({
      where,
      include: [{ model: User, as: "provider", attributes: ["id", "name"] }],
    });

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// const createProduct = async (req, res) => {
//   try {
//     const { name, price, stock, description, providerId } = req.body;

//     const images = req.files.map((file) => `/uploads/${file.filename}`);

//     const colors = req.body.colors
//       ? typeof req.body.colors === "string"
//         ? req.body.colors.split(",").map((c) => c.trim())
//         : Array.isArray(req.body.colors)
//         ? req.body.colors
//         : [req.body.colors]
//       : [];

//     const product = await Product.create({
//       name,
//       price,
//       stock,
//       description,
//       providerId,
//       images,
//       colors,
//       color: colors[0] || null,
//       status: "approved",
//       isDeleted: false,
//     });

//     res.status(201).json(product);
//   } catch (error) {
//     console.error("Error creating product:", error);
//     res.status(500).json({ message: "Error creating product", error });
//   }
// };

// const updateProduct = async (req, res) => {
//   try {
//     const {
//       images: existingImages,
//       colors: inputColors,
//       ...updateData
//     } = req.body;

//     const colors = inputColors
//       ? typeof inputColors === "string"
//         ? inputColors.split(",").map((c) => c.trim())
//         : Array.isArray(inputColors)
//         ? inputColors
//         : [inputColors]
//       : [];

//     let images = existingImages
//       ? Array.isArray(existingImages)
//         ? existingImages
//         : [existingImages]
//       : [];
//     if (req.files && req.files.length > 0) {
//       const newImages = req.files.map((file) => `/uploads/${file.filename}`);
//       images = [...images, ...newImages];
//     }

//     const updatedProduct = await Product.update(
//       {
//         ...updateData,
//         images,
//         ...(colors.length > 0 && { colors, color: colors[0] }),
//       },
//       { where: { id: req.params.id }, returning: true }
//     );

//     res.status(200).json(updatedProduct[1][0]);
//   } catch (error) {
//     console.error("Error updating product:", error);
//     res.status(500).json({ message: "Error updating product", error });
//   }
// };

// Update your createProduct function in adminController.js
const createProduct = async (req, res) => {
  try {
    console.log("=== CREATE PRODUCT DEBUG ===");
    console.log("Request body:", req.body);
    console.log("Request files:", req.files);
    console.log("All fields:", Object.keys(req.body));

    const {
      name,
      description,
      basePrice,
      category,
      style,
      pattern,
      roomType,
      material,
      hasVariants,
      providerId,
      tags,
    } = req.body;

    console.log("Parsed fields:");
    console.log("- name:", name);
    console.log("- description:", description);
    console.log("- basePrice:", basePrice);
    console.log("- category:", category);
    console.log("- providerId:", providerId);
    console.log("- hasVariants:", hasVariants);

    // Validate required fields
    if (!name || !description || !basePrice || !category || !providerId) {
      console.log("MISSING REQUIRED FIELDS:");
      if (!name) console.log("❌ name is missing");
      if (!description) console.log("❌ description is missing");
      if (!basePrice) console.log("❌ basePrice is missing");
      if (!category) console.log("❌ category is missing");
      if (!providerId) console.log("❌ providerId is missing");

      return res.status(400).json({
        success: false,
        message:
          "Missing required fields: name, description, basePrice, category, providerId",
      });
    }

    // Handle images
    const images =
      req.files && req.files.length > 0
        ? req.files.map((file) => `/uploads/${file.filename}`)
        : [];

    console.log("Processed images:", images);

    // Handle tags
    let processedTags = [];
    if (tags) {
      if (typeof tags === "string") {
        processedTags = tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag);
      } else if (Array.isArray(tags)) {
        processedTags = tags;
      }
    }

    console.log("Processed tags:", processedTags);

    // Parse boolean fields
    const hasVariantsBool = hasVariants === "true" || hasVariants === true;

    const productData = {
      name: name.trim(),
      description: description.trim(),
      basePrice: parseFloat(basePrice),
      category,
      material: material?.trim() || "",
      providerId: parseInt(providerId),
      images,
      tags: processedTags,
      hasVariants: hasVariantsBool,
      status: "approved",
      isDeleted: false,
    };

    // Add optional fields if provided
    if (style) productData.style = style;
    if (pattern) productData.pattern = pattern;
    if (roomType) productData.roomType = roomType;

    console.log("Final product data to create:", productData);

    const product = await Product.create(productData);

    console.log("Product created successfully:", product.id);

    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("=== CREATE PRODUCT ERROR ===");
    console.error("Error creating product:", error);
    console.error("Error details:", error.errors);
    console.error("Error stack:", error.stack);

    res.status(500).json({
      success: false,
      message: "Error creating product",
      error: error.message,
      details: error.errors,
    });
  }
};

// Also update your updateProduct function with similar logging
const updateProduct = async (req, res) => {
  try {
    console.log("=== UPDATE PRODUCT DEBUG ===");
    console.log("Product ID:", req.params.id);
    console.log("Request body:", req.body);
    console.log("Request files:", req.files);

    const productId = req.params.id;

    // Check if product exists
    const existingProduct = await Product.findByPk(productId);
    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const updateData = { ...req.body };

    // Handle images
    let images = existingProduct.images || [];
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => `/uploads/${file.filename}`);
      images = [...images, ...newImages];
      updateData.images = images;
    }

    // Handle numeric fields
    if (updateData.basePrice)
      updateData.basePrice = parseFloat(updateData.basePrice);
    if (updateData.providerId)
      updateData.providerId = parseInt(updateData.providerId);

    // Handle boolean fields
    if (updateData.hasVariants) {
      updateData.hasVariants =
        updateData.hasVariants === "true" || updateData.hasVariants === true;
    }

    // Handle tags
    if (updateData.tags) {
      if (typeof updateData.tags === "string") {
        updateData.tags = updateData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag);
      }
    }

    console.log("Update data:", updateData);

    const [affectedRows, updatedProducts] = await Product.update(updateData, {
      where: { id: productId },
      returning: true,
    });

    if (affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found or no changes made",
      });
    }

    const updatedProduct = await Product.findByPk(productId);

    res.status(200).json({
      success: true,
      product: updatedProduct,
    });
  } catch (error) {
    console.error("=== UPDATE PRODUCT ERROR ===");
    console.error("Error updating product:", error);
    console.error("Error details:", error.errors);

    res.status(500).json({
      success: false,
      message: "Error updating product",
      error: error.message,
      details: error.errors,
    });
  }
};
const deleteProduct = async (req, res) => {
  try {
    await Product.destroy({ where: { id: req.params.id } });
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const softDeleteProduct = async (req, res) => {
  try {
    const product = await Product.update(
      { isDeleted: true },
      { where: { id: req.params.id }, returning: true }
    );
    res.status(200).json({
      message: "Product soft deleted successfully",
      product: product[1][0],
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const restoreProduct = async (req, res) => {
  try {
    const product = await Product.update(
      { isDeleted: false },
      { where: { id: req.params.id }, returning: true }
    );
    res.status(200).json({
      message: "Product restored successfully",
      product: product[1][0],
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const updateProductStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const product = await Product.update(
      { status },
      { where: { id: req.params.id }, returning: true }
    );
    res.status(200).json(product[1][0]);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Feedback (Contact)
const getFeedback = async (req, res) => {
  try {
    const feedback = await Contact.findAll();
    res.status(200).json(feedback);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const updateFeedbackStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const feedback = await Contact.update(
      { status },
      { where: { id: req.params.id }, returning: true }
    );
    res.status(200).json(feedback[1][0]);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Orders
const getOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        { model: User, attributes: ["id", "name", "email", "phone"] },
        {
          model: Product,
          as: "products",
          attributes: ["id", "name", "price", "images"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders", error });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.update(
      { orderStatus: status },
      { where: { id: req.params.id }, returning: true }
    );
    res.status(200).json(order[1][0]);
  } catch (error) {
    res.status(500).json({ message: "Error updating order", error });
  }
};

// Analytics
const getSalesAnalytics = async (req, res) => {
  try {
    const orders = await Order.findAll();
    const totalRevenue = orders.reduce(
      (sum, order) => sum + parseFloat(order.totalAmount),
      0
    );
    res.status(200).json({ totalOrders: orders.length, totalRevenue });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const getStoreVisitors = async (req, res) => {
  try {
    const visitors = 1000; // mock data
    res.status(200).json({ visitors });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const getProductsByProvider = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: { providerId: req.params.providerId, isDeleted: false },
      include: [{ model: User, as: "provider", attributes: ["id", "name"] }],
    });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {
  getUsers,
  deleteUser,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  softDeleteProduct,
  restoreProduct,
  updateProductStatus,
  getFeedback,
  updateFeedbackStatus,
  getOrders,
  updateOrderStatus,
  getSalesAnalytics,
  getStoreVisitors,
  getProductsByProvider,
};
