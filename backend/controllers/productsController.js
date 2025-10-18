const { Product, User, Comment, ProductVariant } = require("../models");
const { Op } = require("sequelize");

// =====================
// GET APPROVED PRODUCTS
// =====================
// const getApprovedProducts = async (req, res) => {
//   try {
//     const products = await Product.findAll({
//       where: {
//         status: "approved",
//         isDeleted: false,
//       },
//       include: [
//         {
//           model: User,
//           as: "provider",
//           attributes: ["name"],
//         },
//       ],
//     });

//     const formattedProducts = products.map((product) => {
//       // Safely handle images
//       let images = [];
//       try {
//         if (Array.isArray(product.images)) {
//           images = product.images.filter((img) => img && img !== "undefined");
//         } else if (typeof product.images === "string") {
//           const parsed = JSON.parse(product.images);
//           images = Array.isArray(parsed)
//             ? parsed.filter((img) => img && img !== "undefined")
//             : [];
//         }
//       } catch (error) {
//         console.error("Error parsing images:", error);
//         images = [];
//       }

//       // If no images, use placeholder
//       if (images.length === 0) {
//         images = ["/uploads/placeholder-carpet.jpg"];
//       }

//       return {
//         id: product.id,
//         name: product.name,
//         price: product.basePrice || product.price,
//         image: images[0], // First image as main image
//         images: images, // All images
//         providerName: product.provider?.name,
//         style: product.style,
//         material: product.material,
//         pattern: product.pattern,
//         roomType: product.roomType,
//         description: product.description,
//         category: product.category,
//         stock: product.stockQuantity || product.stock,
//         colors: product.colors || ["#D8D2C2", "#4A4947"], // Default colors
//         size: product.size || "8x10 ft", // Default size
//       };
//     });

//     res.status(200).json(formattedProducts);
//   } catch (error) {
//     console.error("Error fetching approved products:", error);
//     res.status(500).json({ message: "Failed to fetch products" });
//   }
// };
// const getApprovedProducts = async (req, res) => {
//   try {
//     const products = await Product.findAll({
//       where: {
//         status: "approved",
//         isDeleted: false,
//       },
//       include: [
//         {
//           model: User,
//           as: "provider",
//           attributes: ["id", "name", "email"],
//         },
//         {
//           model: ProductVariant,
//           as: "variants",
//         },
//       ],
//     });

//     const formattedProducts = products.map((product) => {
//       // Safely handle images
//       let images = [];
//       try {
//         if (Array.isArray(product.images)) {
//           images = product.images.filter((img) => img && img !== "undefined");
//         } else if (typeof product.images === "string") {
//           const parsed = JSON.parse(product.images);
//           images = Array.isArray(parsed)
//             ? parsed.filter((img) => img && img !== "undefined")
//             : [];
//         }
//       } catch (error) {
//         console.error("Error parsing images:", error);
//         images = [];
//       }

//       // If no images, use placeholder
//       if (images.length === 0) {
//         images = ["/uploads/placeholder-carpet.jpg"];
//       }

//       return {
//         id: product.id,
//         name: product.name,
//         price: product.basePrice || product.price,
//         image: images[0],
//         images: images,
//         providerName: product.provider?.name,
//         providerId: product.provider?.id,
//         style: product.style,
//         material: product.material,
//         pattern: product.pattern,
//         roomType: product.roomType,
//         description: product.description,
//         category: product.category,
//         stock: product.stockQuantity || product.stock,
//         colors: product.colors || [],
//         size: product.size || "",
//         variants: product.variants || [],
//         status: product.status,
//         createdAt: product.createdAt,
//         updatedAt: product.updatedAt,
//       };
//     });

//     res.status(200).json(formattedProducts);
//   } catch (error) {
//     console.error("Error fetching approved products:", error);
//     res
//       .status(500)
//       .json({ message: "Failed to fetch products", error: error.message });
//   }
// };

// =====================
// GET APPROVED PRODUCTS WITH FILTERS
// =====================
const getApprovedProducts = async (req, res) => {
  try {
    const { minPrice, maxPrice, style, roomType, material, category, pattern } =
      req.query;

    console.log("Received filters:", {
      minPrice,
      maxPrice,
      style,
      roomType,
      material,
      category,
      pattern,
    });

    // Build where clause
    const whereClause = {
      status: "approved",
      isDeleted: false,
    };

    // Price range filter
    if (minPrice || maxPrice) {
      whereClause.basePrice = {};

      if (minPrice) {
        whereClause.basePrice[Op.gte] = parseFloat(minPrice);
      }

      if (maxPrice) {
        whereClause.basePrice[Op.lte] = parseFloat(maxPrice);
      }
    }

    // Style filter
    if (style) {
      whereClause.style = style;
    }

    // Room type filter
    if (roomType) {
      whereClause.roomType = roomType;
    }

    // Material filter (case-insensitive partial match)
    if (material) {
      whereClause.material = {
        [Op.iLike]: `%${material}%`,
      };
    }

    // Category filter
    if (category) {
      whereClause.category = category;
    }

    // Pattern filter
    if (pattern) {
      whereClause.pattern = pattern;
    }

    console.log("Database query where clause:", whereClause);

    const products = await Product.findAll({
      where: whereClause,
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
      order: [["createdAt", "DESC"]],
    });

    console.log(`Found ${products.length} products after filtering`);

    const formattedProducts = products.map((product) => {
      // Safely handle images
      let images = [];
      try {
        if (Array.isArray(product.images)) {
          images = product.images.filter((img) => img && img !== "undefined");
        } else if (typeof product.images === "string") {
          const parsed = JSON.parse(product.images);
          images = Array.isArray(parsed)
            ? parsed.filter((img) => img && img !== "undefined")
            : [];
        }
      } catch (error) {
        console.error("Error parsing images:", error);
        images = [];
      }

      // If no images, use placeholder
      if (images.length === 0) {
        images = ["/uploads/placeholder-carpet.jpg"];
      }

      return {
        id: product.id,
        name: product.name,
        price: product.basePrice || product.price,
        image: images[0],
        images: images,
        providerName: product.provider?.name,
        providerId: product.provider?.id,
        style: product.style,
        material: product.material,
        pattern: product.pattern,
        roomType: product.roomType,
        description: product.description,
        category: product.category,
        stock: product.stockQuantity || product.stock,
        colors: product.colors || [],
        size: product.size || "",
        variants: product.variants || [],
        status: product.status,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      };
    });

    res.status(200).json(formattedProducts);
  } catch (error) {
    console.error("Error fetching approved products:", error);
    res.status(500).json({
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};
// =====================
// GET PRODUCT BY ID
// =====================

// const getProductById = async (req, res) => {
//   try {
//     const product = await Product.findByPk(req.params.productId, {
//       include: [
//         {
//           model: User,
//           as: "provider",
//           attributes: ["name"],
//         },
//         {
//           model: Comment,
//           include: [{ model: User, attributes: ["name"] }],
//         },
//         {
//           model: ProductVariant,
//           as: "variants",
//         },
//       ],
//     });

//     if (!product) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     // Safely handle images
//     let images = [];
//     try {
//       if (Array.isArray(product.images)) {
//         images = product.images.filter((img) => img && img !== "undefined");
//       } else if (typeof product.images === "string") {
//         const parsed = JSON.parse(product.images);
//         images = Array.isArray(parsed)
//           ? parsed.filter((img) => img && img !== "undefined")
//           : [];
//       }
//     } catch (error) {
//       console.error("Error parsing images:", error);
//       images = ["/uploads/placeholder-carpet.jpg"];
//     }

//     // If no images, use placeholder
//     if (images.length === 0) {
//       images = ["/uploads/placeholder-carpet.jpg"];
//     }

//     // Prepare product data
//     const productData = {
//       ...product.toJSON(),
//       images: images,
//       price: product.basePrice || product.price,
//       stock: product.stockQuantity || product.stock,
//       colors: product.colors || [],
//       size: product.size || "",
//     };

//     // Debug: Log variants to see what's being returned
//     console.log("Product variants:", productData.variants);

//     res.status(200).json(productData);
//   } catch (error) {
//     console.error("Error fetching product:", error);
//     res.status(500).json({ message: "Failed to fetch product" });
//   }
// };

const getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.productId, {
      include: [
        {
          model: User,
          as: "provider",
          attributes: ["id", "name", "email"],
        },
        {
          model: Comment,
          include: [{ model: User, attributes: ["id", "name"] }],
        },
        {
          model: ProductVariant,
          as: "variants",
        },
      ],
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Safely handle images
    let images = [];
    try {
      if (Array.isArray(product.images)) {
        images = product.images.filter((img) => img && img !== "undefined");
      } else if (typeof product.images === "string") {
        const parsed = JSON.parse(product.images);
        images = Array.isArray(parsed)
          ? parsed.filter((img) => img && img !== "undefined")
          : [];
      }
    } catch (error) {
      console.error("Error parsing images:", error);
      images = ["/uploads/placeholder-carpet.jpg"];
    }

    if (images.length === 0) {
      images = ["/uploads/placeholder-carpet.jpg"];
    }

    const productData = {
      ...product.toJSON(),
      images: images,
      price: product.basePrice || product.price,
      stock: product.stockQuantity || product.stock,
      colors: product.colors || [],
      size: product.size || "",
      variants: product.variants || [],
    };

    console.log("Product variants count:", productData.variants?.length);
    res.status(200).json(productData);
  } catch (error) {
    console.error("Error fetching product:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch product", error: error.message });
  }
};
module.exports = { getApprovedProducts, getProductById };
