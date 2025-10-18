// const { Product, User } = require("../models");

// const productSeeder = async () => {
//   try {
//     console.log("🏷️ Seeding products...");

//     // Get provider user
//     const provider = await User.findOne({
//       where: { email: "provider@carpetstore.com" },
//     });

//     if (!provider) {
//       throw new Error("Provider user not found. Run users seeder first.");
//     }

//     const products = [
//       {
//         name: "Persian Traditional Carpet",
//         description:
//           "Handwoven Persian carpet with intricate traditional patterns. Made from high-quality wool with vibrant colors that last for generations.",
//         basePrice: 450.0,
//         category: "carpet",
//         style: "traditional",
//         roomType: "living-room",
//         pattern: "oriental",
//         material: "wool",
//         images: JSON.stringify([
//           "persian-carpet-1.jpg",
//           "persian-carpet-2.jpg",
//         ]),
//         hasVariants: true,
//         status: "approved",
//         tags: ["persian", "traditional", "wool", "handmade"],
//         providerId: provider.id,
//       },
//       {
//         name: "Modern Geometric Carpet",
//         description:
//           "Contemporary carpet with bold geometric patterns. Perfect for modern living spaces and offices.",
//         basePrice: 320.0,
//         category: "carpet",
//         style: "modern",
//         roomType: "living-room",
//         pattern: "geometric",
//         material: "synthetic",
//         images: JSON.stringify([
//           "persian-carpet-1.jpg",
//           "persian-carpet-2.jpg",
//         ]),
//         hasVariants: true,
//         status: "approved",
//         tags: ["modern", "geometric", "contemporary", "office"],
//         providerId: provider.id,
//       },
//       {
//         name: "Bohemian Floral Carpet",
//         description:
//           "Beautiful bohemian-style carpet with floral patterns. Adds a cozy and artistic touch to any room.",
//         basePrice: 280.0,
//         category: "carpet",
//         style: "bohemian",
//         roomType: "bedroom",
//         pattern: "floral",
//         material: "cotton-blend",
//         images: JSON.stringify([
//           "persian-carpet-1.jpg",
//           "persian-carpet-2.jpg",
//         ]),
//         hasVariants: false,
//         status: "approved",
//         tags: ["bohemian", "floral", "bedroom", "colorful"],
//         providerId: provider.id,
//       },
//       {
//         name: "Minimalist Solid Carpet",
//         description:
//           "Clean and simple solid-colored carpet for minimalist interiors. Available in various neutral colors.",
//         basePrice: 190.0,
//         category: "carpet",
//         style: "minimalist",
//         roomType: "office",
//         pattern: "solid",
//         material: "polypropylene",
//         images: JSON.stringify([
//           "persian-carpet-1.jpg",
//           "persian-carpet-2.jpg",
//         ]),
//         hasVariants: true,
//         status: "approved",
//         tags: ["minimalist", "solid", "office", "neutral"],
//         providerId: provider.id,
//       },
//       {
//         name: "Carpet Cleaner Solution",
//         description:
//           "Professional carpet cleaning solution for all types of carpets. Safe and effective.",
//         basePrice: 25.0,
//         category: "accessory",
//         style: "modern",
//         roomType: "living-room",
//         pattern: "solid",
//         material: "liquid",
//         images: JSON.stringify([
//           "persian-carpet-1.jpg",
//           "persian-carpet-2.jpg",
//         ]),
//         hasVariants: false,
//         status: "approved",
//         tags: ["cleaner", "accessory", "maintenance"],
//         providerId: provider.id,
//       },
//       {
//         name: "Carpet Padding Underlay",
//         description:
//           "High-quality carpet padding for extra comfort and durability. Extends carpet life.",
//         basePrice: 45.0,
//         category: "accessory",
//         style: "modern",
//         roomType: "living-room",
//         pattern: "solid",
//         material: "foam",
//         images: JSON.stringify([
//           "persian-carpet-1.jpg",
//           "persian-carpet-2.jpg",
//         ]),
//         hasVariants: true,
//         status: "approved",
//         tags: ["padding", "underlay", "accessory", "comfort"],
//         providerId: provider.id,
//       },
//     ];

//     await Product.bulkCreate(products, {
//       ignoreDuplicates: true,
//       validate: true,
//     });

//     console.log("✅ Products seeded successfully");
//   } catch (error) {
//     console.error("❌ Error seeding products:", error);
//     throw error;
//   }
// };

// module.exports = productSeeder;
const { Product, User } = require("../models");

const productSeeder = async () => {
  try {
    console.log("🏷️ Seeding products...");

    // Get provider user
    const provider = await User.findOne({
      where: { email: "provider@carpetstore.com" },
    });

    if (!provider) {
      throw new Error("Provider user not found. Run users seeder first.");
    }

    const products = [
      {
        name: "Persian Traditional Carpet",
        description:
          "Handwoven Persian carpet with intricate traditional patterns. Made from high-quality wool with vibrant colors that last for generations.",
        basePrice: 450.0,
        category: "carpet",
        style: "traditional",
        roomType: "living-room",
        pattern: "oriental",
        material: "wool",
        images: ["/uploads/1742940676888.jpg", "/uploads/1742940676888.jpg"],
        hasVariants: true,
        status: "approved",
        tags: ["persian", "traditional", "wool", "handmade"],
        providerId: provider.id,
      },
      {
        name: "Modern Geometric Carpet",
        description:
          "Contemporary carpet with bold geometric patterns. Perfect for modern living spaces and offices.",
        basePrice: 320.0,
        category: "carpet",
        style: "modern",
        roomType: "living-room",
        pattern: "geometric",
        material: "synthetic",
        images: ["/uploads/1742940676888.jpg", "/uploads/1742940676888.jpg"],
        hasVariants: true,
        status: "approved",
        tags: ["modern", "geometric", "contemporary", "office"],
        providerId: provider.id,
      },
      {
        name: "Bohemian Floral Carpet",
        description:
          "Beautiful bohemian-style carpet with floral patterns. Adds a cozy and artistic touch to any room.",
        basePrice: 280.0,
        category: "carpet",
        style: "bohemian",
        roomType: "bedroom",
        pattern: "floral",
        material: "cotton-blend",
        images: ["/uploads/1742940676888.jpg"],
        hasVariants: false,
        status: "approved",
        tags: ["bohemian", "floral", "bedroom", "colorful"],
        providerId: provider.id,
      },
      {
        name: "Minimalist Solid Carpet",
        description:
          "Clean and simple solid-colored carpet for minimalist interiors. Available in various neutral colors.",
        basePrice: 190.0,
        category: "carpet",
        style: "minimalist",
        roomType: "office",
        pattern: "solid",
        material: "polypropylene",
        images: ["/uploads/1742940676888.jpg"],
        hasVariants: true,
        status: "approved",
        tags: ["minimalist", "solid", "office", "neutral"],
        providerId: provider.id,
      },
      {
        name: "Carpet Cleaner Solution",
        description:
          "Professional carpet cleaning solution for all types of carpets. Safe and effective.",
        basePrice: 25.0,
        category: "accessory",
        style: "modern",
        roomType: "living-room",
        pattern: "solid",
        material: "liquid",
        images: ["/uploads/1742940676888.jpg"],
        hasVariants: false,
        status: "approved",
        tags: ["cleaner", "accessory", "maintenance"],
        providerId: provider.id,
      },
      {
        name: "Carpet Padding Underlay",
        description:
          "High-quality carpet padding for extra comfort and durability. Extends carpet life.",
        basePrice: 45.0,
        category: "accessory",
        style: "modern",
        roomType: "living-room",
        pattern: "solid",
        material: "foam",
        images: ["/uploads/1742940676888.jpg"],
        hasVariants: true,
        status: "approved",
        tags: ["padding", "underlay", "accessory", "comfort"],
        providerId: provider.id,
      },
    ];

    await Product.bulkCreate(products, {
      ignoreDuplicates: true,
      validate: true,
    });

    console.log("✅ Products seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding products:", error);
    throw error;
  }
};

module.exports = productSeeder;
