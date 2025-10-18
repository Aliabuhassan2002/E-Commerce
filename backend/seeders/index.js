const { sequelize } = require("../models");
const userSeeder = require("./01-users");
const productSeeder = require("./02-products");
const productVariantSeeder = require("./03-product-variants");
const discountSeeder = require("./04-discounts");

const runSeeders = async () => {
  try {
    console.log("🌱 Starting database seeding...");

    // Sync database first
    await sequelize.sync({ force: false });
    console.log("✅ Database synced");

    // Run seeders in order
    await userSeeder();
    await productSeeder();
    await productVariantSeeder();
    await discountSeeder();

    console.log("🎉 All seeders completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  runSeeders();
}

module.exports = runSeeders;
