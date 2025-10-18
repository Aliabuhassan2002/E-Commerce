const { Discount, Product, ProductVariant } = require("../models");

const discountSeeder = async () => {
  try {
    console.log("💰 Seeding discounts...");

    // Get products and variants
    const persianCarpet = await Product.findOne({
      where: { name: "Persian Traditional Carpet" },
    });
    const modernCarpet = await Product.findOne({
      where: { name: "Modern Geometric Carpet" },
    });
    const minimalistVariant = await ProductVariant.findOne({
      where: { sku: "MIN-BEGE-6x9" },
    });

    const discounts = [
      {
        name: "Summer Sale - Persian Carpets",
        discountType: "percentage",
        value: 15,
        startDate: new Date("2024-06-01"),
        endDate: new Date("2024-08-31"),
        isActive: true,
        applicableTo: "product",
        targetId: persianCarpet.id,
        code: "PERSIAN15",
        usageLimit: 50,
        minOrderAmount: 300.0,
      },
      {
        name: "Modern Collection Discount",
        discountType: "fixed_amount",
        value: 50,
        startDate: new Date("2024-01-01"),
        endDate: new Date("2024-12-31"),
        isActive: true,
        applicableTo: "product",
        targetId: modernCarpet.id,
        code: "MODERN50",
        usageLimit: 100,
        minOrderAmount: 200.0,
      },
      {
        name: "Beige Carpet Special",
        discountType: "percentage",
        value: 10,
        startDate: new Date("2024-01-01"),
        endDate: new Date("2024-12-31"),
        isActive: true,
        applicableTo: "variant",
        targetId: minimalistVariant.id,
        code: "BEIGE10",
        usageLimit: 30,
      },
      {
        name: "First Time Customer",
        discountType: "percentage",
        value: 10,
        startDate: new Date("2024-01-01"),
        endDate: new Date("2024-12-31"),
        isActive: true,
        applicableTo: "category",
        targetCategory: "carpet",
        code: "WELCOME10",
        usageLimit: 1000,
        minOrderAmount: 100.0,
      },
    ];

    await Discount.bulkCreate(discounts, {
      ignoreDuplicates: true,
      validate: true,
    });

    console.log("✅ Discounts seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding discounts:", error);
    throw error;
  }
};

module.exports = discountSeeder;
