const { ProductVariant, Product } = require("../models");

const productVariantSeeder = async () => {
  try {
    console.log("🎨 Seeding product variants...");

    // Get products
    const persianCarpet = await Product.findOne({
      where: { name: "Persian Traditional Carpet" },
    });
    const modernCarpet = await Product.findOne({
      where: { name: "Modern Geometric Carpet" },
    });
    const minimalistCarpet = await Product.findOne({
      where: { name: "Minimalist Solid Carpet" },
    });
    const carpetPadding = await Product.findOne({
      where: { name: "Carpet Padding Underlay" },
    });

    const variants = [
      // Persian Carpet Variants
      {
        sku: "PERS-RED-8x10",
        color: "Red",
        size: "8x10 ft",
        price: 450.0,
        stockQuantity: 5,
        image: "persian-red-8x10.jpg",
        productId: persianCarpet.id,
      },
      {
        sku: "PERS-BLUE-8x10",
        color: "Blue",
        size: "8x10 ft",
        price: 470.0,
        stockQuantity: 3,
        image: "persian-blue-8x10.jpg",
        productId: persianCarpet.id,
      },
      {
        sku: "PERS-RED-6x9",
        color: "Red",
        size: "6x9 ft",
        price: 320.0,
        stockQuantity: 7,
        image: "persian-red-6x9.jpg",
        productId: persianCarpet.id,
      },

      // Modern Carpet Variants
      {
        sku: "MOD-BLK-8x10",
        color: "Black/White",
        size: "8x10 ft",
        price: 320.0,
        stockQuantity: 8,
        image: "modern-black-8x10.jpg",
        productId: modernCarpet.id,
      },
      {
        sku: "MOD-GRAY-8x10",
        color: "Gray",
        size: "8x10 ft",
        price: 310.0,
        stockQuantity: 6,
        image: "modern-gray-8x10.jpg",
        productId: modernCarpet.id,
      },

      // Minimalist Carpet Variants
      {
        sku: "MIN-BEGE-6x9",
        color: "Beige",
        size: "6x9 ft",
        price: 190.0,
        stockQuantity: 15,
        image: "minimalist-beige-6x9.jpg",
        productId: minimalistCarpet.id,
      },
      {
        sku: "MIN-GRAY-6x9",
        color: "Gray",
        size: "6x9 ft",
        price: 190.0,
        stockQuantity: 12,
        image: "minimalist-gray-6x9.jpg",
        productId: minimalistCarpet.id,
      },
      {
        sku: "MIN-NAVY-6x9",
        color: "Navy Blue",
        size: "6x9 ft",
        price: 210.0,
        stockQuantity: 8,
        image: "minimalist-navy-6x9.jpg",
        productId: minimalistCarpet.id,
      },

      // Carpet Padding Variants
      {
        sku: "PAD-STD-8x10",
        color: "Standard",
        size: "8x10 ft",
        price: 45.0,
        stockQuantity: 20,
        image: "padding-standard.jpg",
        productId: carpetPadding.id,
      },
      {
        sku: "PAD-PREM-8x10",
        color: "Premium",
        size: "8x10 ft",
        price: 65.0,
        stockQuantity: 15,
        image: "padding-premium.jpg",
        productId: carpetPadding.id,
      },
    ];

    await ProductVariant.bulkCreate(variants, {
      ignoreDuplicates: true,
      validate: true,
    });

    console.log("✅ Product variants seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding product variants:", error);
    throw error;
  }
};

module.exports = productVariantSeeder;
