// // routes/products.js
// const express = require("express");
// const path = require("path");
// const fs = require("fs");
// const multer = require("multer");

// const { Product } = require("../models"); // تأكد من تصدير Product من index.js
// const { User } = require("../models");
// const { Comment } = require("../models");
// const verifyToken = require("../middlewares/verifyToken");

// const router = express.Router();

// // إنشاء مجلد التحميلات إذا لم يكن موجودًا
// const uploadDir = path.join(__dirname, "../uploads");
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// // Multer storage configuration
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, uploadDir),
//   filename: (req, file, cb) => cb(Date.now() + path.extname(file.originalname)),
// });
// const upload = multer({ storage });

// // ================================
// // Get all approved products
// // ================================
// router.get("/approved", async (req, res) => {
//   try {
//     const products = await Product.findAll({
//       where: { status: "approved" },
//       include: [
//         {
//           model: User,
//           as: "provider",
//           attributes: ["id", "name", "email"],
//         },
//       ],
//     });
//     res.status(200).json(products);
//   } catch (error) {
//     console.error("Server error:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// });

// // ================================
// // Get a single product by ID
// // ================================
// router.get("/:productId", async (req, res) => {
//   try {
//     const product = await Product.findByPk(req.params.productId, {
//       include: [
//         {
//           model: User,
//           as: "provider",
//           attributes: ["id", "name", "email"],
//         },
//         {
//           model: Comment,
//           include: [{ model: User, attributes: ["id", "name"] }],
//         },
//       ],
//     });

//     if (!product) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     res.status(200).json(product);
//   } catch (error) {
//     console.error("Server error:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// });

// // ================================
// // Add a comment to a product
// // ================================
// router.post("/:productId/comments", verifyToken, async (req, res) => {
//   try {
//     const { text, rating } = req.body;
//     const { productId } = req.params;

//     const comment = await Comment.create({
//       userId: req.user.id,
//       productId,
//       text,
//       rating,
//     });

//     const populatedComment = await Comment.findByPk(comment.id, {
//       include: [{ model: User, attributes: ["id", "name"] }],
//     });

//     res.status(201).json(populatedComment);
//   } catch (error) {
//     console.error("Error adding comment:", error);
//     res
//       .status(500)
//       .json({ message: "Failed to add comment", error: error.message });
//   }
// });

// // ================================
// // Add a new product (provider only)
// // ================================
// router.post(
//   "/add",
//   verifyToken,
//   upload.array("images", 5),
//   async (req, res) => {
//     try {
//       if (req.user.role !== "provider") {
//         return res
//           .status(403)
//           .json({ message: "Only providers can add products." });
//       }

//       const {
//         name,
//         description,
//         price,
//         category,
//         size,
//         material,
//         stock,
//         style,
//         roomType,
//         pattern,
//       } = req.body;

//       const colors = Array.isArray(req.body.colors)
//         ? req.body.colors
//         : [req.body.colors];

//       const imagePaths = req.files.map((file) => `/uploads/${file.filename}`);

//       const newProduct = await Product.create({
//         name,
//         description,
//         price,
//         category,
//         size,
//         colors,
//         material,
//         style,
//         roomType,
//         pattern,
//         providerId: req.user.id,
//         images: imagePaths,
//         stock,
//         color: "#000", // default fallback
//         status: "approved",
//       });

//       res.status(201).json(newProduct);
//     } catch (error) {
//       console.error("Error creating product:", error);
//       res.status(500).json({ message: "Server error", error: error.message });
//     }
//   }
// );

// // ================================
// // Get all products of a specific provider
// // ================================
// router.get("/provider/:providerId", async (req, res) => {
//   try {
//     const products = await Product.findAll({
//       where: { providerId: req.params.providerId },
//       include: [
//         {
//           model: User,
//           as: "provider",
//           attributes: ["id", "name"],
//         },
//       ],
//     });
//     res.status(200).json(products);
//   } catch (error) {
//     console.error("Server error:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// });

// // ================================
// // Serve static uploads
// // ================================
// router.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// module.exports = router;
const express = require("express");
const path = require("path");
const fs = require("fs");
const PDFDocument = require("pdfkit");
const multer = require("multer");
const { Product, User, Comment, ProductVariant } = require("../models");
const verifyToken = require("../middlewares/verifyToken");
const {
  getApprovedProducts,
  getProductById,
} = require("../controllers/productsController");

const router = express.Router();

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// ================================
// Get all approved products (using controller)
// ================================
router.get("/approved", getApprovedProducts);

// ================================
// Get a single product by ID (using controller)
// ================================
router.get("/:productId", getProductById);

// ================================
// Add a comment to a product
// ================================
router.post("/:productId/comments", verifyToken, async (req, res) => {
  try {
    const { text, rating } = req.body;
    const { productId } = req.params;

    const comment = await Comment.create({
      userId: req.user.id,
      productId,
      text,
      rating,
    });

    const populatedComment = await Comment.findByPk(comment.id, {
      include: [{ model: User, attributes: ["id", "name"] }],
    });

    res.status(201).json(populatedComment);
  } catch (error) {
    console.error("Error adding comment:", error);
    res
      .status(500)
      .json({ message: "Failed to add comment", error: error.message });
  }
});

// ================================
// Update a product (provider only)
// ================================
router.put(
  "/:productId",
  verifyToken,
  upload.array("images", 5),
  async (req, res) => {
    try {
      if (req.user.role !== "provider") {
        return res
          .status(403)
          .json({ message: "Only providers can update products." });
      }

      const { productId } = req.params;
      const {
        name,
        description,
        price,
        category,
        size,
        material,
        stock,
        style,
        roomType,
        pattern,
      } = req.body;

      // Find the product first
      const product = await Product.findByPk(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      // Check if the product belongs to the provider
      if (product.providerId !== req.user.id) {
        return res
          .status(403)
          .json({ message: "You can only update your own products." });
      }

      // Handle colors
      let colors = [];
      if (req.body.colors) {
        colors = Array.isArray(req.body.colors)
          ? req.body.colors
          : [req.body.colors];
      }

      // Handle images - keep existing if no new images uploaded
      let imagePaths = product.images;
      if (req.files && req.files.length > 0) {
        imagePaths = req.files.map((file) => `/uploads/${file.filename}`);
      }

      // Update the product
      await product.update({
        name,
        description,
        price: parseFloat(price),
        category,
        size,
        colors,
        material,
        style,
        roomType,
        pattern,
        images: imagePaths,
        stockQuantity: parseInt(stock),
        stock: parseInt(stock),
      });

      // Fetch the updated product with provider info
      const updatedProduct = await Product.findByPk(productId, {
        include: [
          {
            model: User,
            as: "provider",
            attributes: ["id", "name"],
          },
          {
            model: ProductVariant,
            as: "variants",
          },
        ],
      });

      res.status(200).json(updatedProduct);
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

// ================================
// Add a new product (provider only)
// ================================
// router.post(
//   "/add",
//   verifyToken,
//   upload.array("images", 5),
//   async (req, res) => {
//     try {
//       if (req.user.role !== "provider") {
//         return res
//           .status(403)
//           .json({ message: "Only providers can add products." });
//       }

//       const {
//         name,
//         description,
//         price,
//         category,
//         size,
//         material,
//         stock,
//         style,
//         roomType,
//         pattern,
//       } = req.body;

//       // Handle colors - ensure it's always an array
//       let colors = [];
//       if (req.body.colors) {
//         colors = Array.isArray(req.body.colors)
//           ? req.body.colors
//           : [req.body.colors];
//       }

//       const imagePaths = req.files.map((file) => `/uploads/${file.filename}`);

//       const newProduct = await Product.create({
//         name,
//         description,
//         price: parseFloat(price),
//         category,
//         size,
//         colors,
//         material,
//         style,
//         roomType,
//         pattern,
//         providerId: req.user.id,
//         images: imagePaths,
//         stock: parseInt(stock),
//         status: "pending", // Change to "pending" for admin approval
//       });

//       res.status(201).json(newProduct);
//     } catch (error) {
//       console.error("Error creating product:", error);
//       res.status(500).json({ message: "Server error", error: error.message });
//     }
//   }
// );
// router.post(
//   "/add",
//   verifyToken,
//   upload.array("images", 5),
//   async (req, res) => {
//     try {
//       if (req.user.role !== "provider") {
//         return res
//           .status(403)
//           .json({ message: "Only providers can add products." });
//       }

//       const {
//         name,
//         description,
//         price,
//         category,
//         size,
//         material,
//         stock,
//         style,
//         roomType,
//         pattern,
//       } = req.body;

//       // Handle colors - ensure it's always an array
//       let colors = [];
//       if (req.body.colors) {
//         colors = Array.isArray(req.body.colors)
//           ? req.body.colors
//           : [req.body.colors];
//       }

//       const imagePaths = req.files.map((file) => `/uploads/${file.filename}`);

//       const newProduct = await Product.create({
//         name,
//         description,
//         price: parseFloat(price),
//         category,
//         size,
//         colors,
//         material,
//         style,
//         roomType,
//         pattern,
//         providerId: req.user.id,
//         images: imagePaths,
//         stockQuantity: parseInt(stock),
//         stock: parseInt(stock), // Keep both for compatibility
//         status: "pending",
//       });

//       // Fetch the created product with provider info
//       const createdProduct = await Product.findByPk(newProduct.id, {
//         include: [
//           {
//             model: User,
//             as: "provider",
//             attributes: ["id", "name"],
//           },
//         ],
//       });

//       res.status(201).json(createdProduct);
//     } catch (error) {
//       console.error("Error creating product:", error);
//       res.status(500).json({ message: "Server error", error: error.message });
//     }
//   }
// );
// ================================
// Add a new product (provider only) - FIXED VERSION
// ================================
router.post(
  "/add",
  verifyToken,
  upload.array("images", 5),
  async (req, res) => {
    try {
      console.log("=== ADD PRODUCT REQUEST ===");
      console.log("User:", req.user);
      console.log("Files:", req.files);
      console.log("Body:", req.body);

      if (req.user.role !== "provider") {
        return res
          .status(403)
          .json({ message: "Only providers can add products." });
      }

      // Validate required fields based on model
      const requiredFields = [
        "name",
        "description",
        "basePrice",
        "category",
        "material",
      ];
      const missingFields = requiredFields.filter((field) => {
        const value = req.body[field];
        return !value || value.toString().trim() === "";
      });

      if (missingFields.length > 0) {
        return res.status(400).json({
          message: `Missing required fields: ${missingFields.join(", ")}`,
        });
      }

      // Validate basePrice is a valid number
      const basePrice = parseFloat(req.body.basePrice);
      if (isNaN(basePrice) || basePrice <= 0) {
        return res.status(400).json({
          message: "Base price must be a valid positive number",
        });
      }

      const {
        name,
        description,
        category,
        style,
        roomType,
        pattern,
        material,
        hasVariants,
      } = req.body;

      // Handle tags - ensure it's always an array
      let tags = [];
      if (req.body.tags) {
        tags = Array.isArray(req.body.tags)
          ? req.body.tags.filter((tag) => tag && tag.trim() !== "")
          : [req.body.tags].filter((tag) => tag && tag.trim() !== "");
      }

      // Handle images
      let imagePaths = [];
      if (req.files && req.files.length > 0) {
        imagePaths = req.files.map((file) => `/uploads/${file.filename}`);
      } else {
        return res.status(400).json({
          message: "At least one product image is required",
        });
      }

      console.log("Creating product with data:", {
        name: name.trim(),
        description: description.trim(),
        basePrice: basePrice,
        category,
        style: style || "traditional",
        roomType: roomType || "living-room",
        pattern: pattern || "solid",
        material: material.trim(),
        tags,
        hasVariants: hasVariants === "true",
        providerId: req.user.id,
        images: imagePaths,
        status: "pending",
      });

      const newProduct = await Product.create({
        name: name.trim(),
        description: description.trim(),
        basePrice: basePrice,
        category,
        style: style || "traditional",
        roomType: roomType || "living-room",
        pattern: pattern || "solid",
        material: material.trim(),
        tags,
        hasVariants: hasVariants === "true",
        providerId: req.user.id,
        images: imagePaths,
        status: "pending",
      });

      console.log("Product created successfully, ID:", newProduct.id);

      // Fetch the created product with provider info
      const createdProduct = await Product.findByPk(newProduct.id, {
        include: [
          {
            model: User,
            as: "provider",
            attributes: ["id", "name"],
          },
        ],
      });

      res.status(201).json(createdProduct);
    } catch (error) {
      console.error("❌ ERROR creating product:", error);
      console.error("Error details:", error.message);
      console.error("Error stack:", error.stack);

      res.status(500).json({
        message: "Server error while creating product",
        error: error.message,
      });
    }
  }
);
// ================================
// Get all products of a specific provider
// ================================
// router.get("/provider/:providerId", async (req, res) => {
//   try {
//     const products = await Product.findAll({
//       where: { providerId: req.params.providerId },
//       include: [
//         {
//           model: User,
//           as: "provider",
//           attributes: ["id", "name"],
//         },
//       ],
//     });

//     // Ensure images are properly formatted
//     const formattedProducts = products.map((product) => {
//       const productData = product.toJSON();
//       productData.images = Array.isArray(productData.images)
//         ? productData.images
//         : typeof productData.images === "string"
//         ? JSON.parse(productData.images)
//         : [];
//       return productData;
//     });

//     res.status(200).json(formattedProducts);
//   } catch (error) {
//     console.error("Server error:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// });
router.get("/provider/:providerId", async (req, res) => {
  try {
    const products = await Product.findAll({
      where: { providerId: req.params.providerId },
      include: [
        {
          model: User,
          as: "provider",
          attributes: ["id", "name", "email"],
        },
        {
          model: ProductVariant,
          as: "variants",
        },
      ],
      order: [["createdAt", "DESC"]], // Newest first
    });

    // Ensure images are properly formatted
    const formattedProducts = products.map((product) => {
      const productData = product.toJSON();

      // Handle images array
      try {
        if (Array.isArray(productData.images)) {
          productData.images = productData.images.filter(
            (img) => img && img !== "undefined"
          );
        } else if (typeof productData.images === "string") {
          const parsed = JSON.parse(productData.images);
          productData.images = Array.isArray(parsed)
            ? parsed.filter((img) => img && img !== "undefined")
            : [];
        } else {
          productData.images = [];
        }
      } catch (error) {
        console.error("Error parsing images:", error);
        productData.images = [];
      }

      // If no images, use placeholder
      if (productData.images.length === 0) {
        productData.images = ["/uploads/placeholder-carpet.jpg"];
      }

      return productData;
    });

    console.log(
      `Found ${formattedProducts.length} products for provider ${req.params.providerId}`
    );
    res.status(200).json(formattedProducts);
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
// ================================
// Delete a product (provider only)
// ================================
router.delete("/:productId", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "provider") {
      return res
        .status(403)
        .json({ message: "Only providers can delete products." });
    }

    const { productId } = req.params;
    const product = await Product.findByPk(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if the product belongs to the provider
    if (product.providerId !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You can only delete your own products." });
    }

    await product.destroy();
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
// ================================
// Generate Products PDF Report - FIXED VERSION
// ================================
router.post("/pdf-report", async (req, res) => {
  try {
    console.log("🔄 Starting PDF report generation...");

    // Fetch products from database first
    const products = await Product.findAll({
      where: {
        status: "approved",
        isDeleted: false,
      },
      include: [
        {
          model: User,
          as: "provider",
          attributes: ["name"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    console.log(`✅ Found ${products.length} products for PDF report`);

    // Create PDF document AFTER fetching data
    const doc = new PDFDocument();

    // Set response headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=products-report-${Date.now()}.pdf`
    );

    // Pipe PDF to response
    doc.pipe(res);

    // Add title
    doc
      .fontSize(24)
      .font("Helvetica-Bold")
      .fillColor("#4A4947")
      .text("Products Catalog Report", 50, 50);

    // Add generation info
    doc
      .fontSize(12)
      .font("Helvetica")
      .fillColor("#666666")
      .text(`Generated on: ${new Date().toLocaleDateString()}`, 50, 90)
      .text(`Total Products: ${products.length}`, 50, 110);

    let yPosition = 150;

    // Check if we have products
    if (products.length === 0) {
      doc
        .fontSize(16)
        .fillColor("#999999")
        .text("No products available for report.", 50, yPosition);
      doc.end();
      return;
    }

    // Add products to PDF
    products.forEach((product, index) => {
      console.log(`Adding product ${index + 1}: ${product.name}`);

      // Check if we need a new page
      if (yPosition > 700) {
        doc.addPage();
        yPosition = 50;

        // Add header on new page
        doc
          .fontSize(16)
          .fillColor("#4A4947")
          .text("Products Catalog Report (Continued)", 50, yPosition);
        yPosition += 40;
      }

      // Product number and name
      doc
        .fontSize(14)
        .font("Helvetica-Bold")
        .fillColor("#4A4947")
        .text(`${index + 1}. ${product.name}`, 50, yPosition);
      yPosition += 25;

      // Product details
      doc.fontSize(10).font("Helvetica").fillColor("#333333");

      const details = [
        `Price: $${product.basePrice || product.price || "N/A"}`,
        `Material: ${product.material || "N/A"}`,
        `Style: ${product.style || "N/A"}`,
        `Room Type: ${
          product.roomType ? product.roomType.replace("-", " ") : "N/A"
        }`,
        `Pattern: ${product.pattern || "N/A"}`,
        `Provider: ${product.provider?.name || "N/A"}`,
      ];

      details.forEach((detail) => {
        doc.text(detail, 50, yPosition);
        yPosition += 15;
      });

      // Product description (truncated)
      const description =
        product.description && product.description.length > 150
          ? product.description.substring(0, 150) + "..."
          : product.description || "No description available";

      doc.text("Description:", 50, yPosition);
      yPosition += 15;

      doc.text(description, 50, yPosition, {
        width: 500,
        align: "left",
      });
      yPosition += 30;

      // Separator line
      doc
        .moveTo(50, yPosition)
        .lineTo(550, yPosition)
        .strokeColor("#D8D2C2")
        .stroke();
      yPosition += 40;
    });

    // Add footer
    doc
      .fontSize(8)
      .fillColor("#999999")
      .text(
        `Report generated by Carpet Store - ${new Date().toLocaleDateString()}`,
        50,
        780,
        {
          align: "center",
        }
      );

    console.log("✅ PDF generation completed, ending document...");

    // Finalize PDF
    doc.end();
  } catch (error) {
    console.error("❌ Error generating PDF report:", error);
    console.error("Error stack:", error.stack);

    // Send error response
    res.status(500).json({
      message: "Failed to generate PDF report",
      error: error.message,
    });
  }
});
// ================================
// DEBUG: Test PDF Data
// ================================
router.post("/pdf-debug", async (req, res) => {
  try {
    console.log("🔍 DEBUG: Testing PDF data...");

    const products = await Product.findAll({
      where: {
        status: "approved",
        isDeleted: false,
      },
      include: [
        {
          model: User,
          as: "provider",
          attributes: ["name"],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: 5, // Just get a few for testing
    });

    console.log("DEBUG - Products found:", products.length);

    // Log product details to verify data
    products.forEach((product, index) => {
      console.log(`Product ${index + 1}:`, {
        id: product.id,
        name: product.name,
        price: product.basePrice || product.price,
        material: product.material,
        hasProvider: !!product.provider,
      });
    });

    // Create simple PDF to test
    const doc = new PDFDocument();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=debug-test.pdf`);

    doc.pipe(res);

    // Simple content to verify PDF works
    doc
      .fontSize(20)
      .text("DEBUG PDF TEST", 50, 50)
      .text(`Products Found: ${products.length}`, 50, 80);

    // List products
    let yPos = 120;
    products.forEach((product, index) => {
      doc.text(
        `${index + 1}. ${product.name} - $${
          product.basePrice || product.price
        }`,
        50,
        yPos
      );
      yPos += 20;
    });

    doc.end();
  } catch (error) {
    console.error("DEBUG Error:", error);
    res.status(500).json({ error: error.message });
  }
});
// ================================
// Get filter options
// ================================
router.get("/filter-options", async (req, res) => {
  try {
    const products = await Product.findAll({
      where: {
        status: "approved",
        isDeleted: false,
      },
      attributes: [
        "style",
        "roomType",
        "material",
        "category",
        "pattern",
        "basePrice",
      ],
      raw: true,
    });

    // Extract unique values for each filter
    const options = {
      styles: [...new Set(products.map((p) => p.style).filter(Boolean))].sort(),
      roomTypes: [
        ...new Set(products.map((p) => p.roomType).filter(Boolean)),
      ].sort(),
      materials: [
        ...new Set(products.map((p) => p.material).filter(Boolean)),
      ].sort(),
      categories: [
        ...new Set(products.map((p) => p.category).filter(Boolean)),
      ].sort(),
      patterns: [
        ...new Set(products.map((p) => p.pattern).filter(Boolean)),
      ].sort(),
      priceRange: {
        min: Math.floor(
          Math.min(
            ...products
              .map((p) => p.basePrice || 0)
              .filter((price) => price > 0)
          )
        ),
        max: Math.ceil(Math.max(...products.map((p) => p.basePrice || 0))),
      },
    };

    console.log("Generated filter options:", options);

    res.status(200).json(options);
  } catch (error) {
    console.error("Error fetching filter options:", error);
    res.status(500).json({
      message: "Failed to fetch filter options",
      error: error.message,
    });
  }
});
// ================================
// Serve static uploads
// ================================
router.use("/uploads", express.static(path.join(__dirname, "../uploads")));

module.exports = router;
