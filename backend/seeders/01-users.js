const { User } = require("../models");
const bcrypt = require("bcryptjs");

const userSeeder = async () => {
  try {
    console.log("👥 Seeding users...");

    const users = [
      {
        name: "Admin User",
        email: "admin@carpetstore.com",
        password: await bcrypt.hash("admin123", 12),
        role: "admin",
        isApproved: true,
        profileImage: "",
        address: "123 Admin Street, City",
        phone: "+1234567890",
      },
      {
        name: "Carpet Provider",
        email: "provider@carpetstore.com",
        password: await bcrypt.hash("provider123", 12),
        role: "provider",
        providerStatus: "approved",
        isApproved: true,
        profileImage: "",
        address: "456 Provider Ave, City",
        phone: "+1234567891",
      },
      {
        name: "John Customer",
        email: "customer@example.com",
        password: await bcrypt.hash("customer123", 12),
        role: "end-user",
        isApproved: true,
        profileImage: "",
        address: "789 Customer Rd, City",
        phone: "+1234567892",
      },
      {
        name: "Pending Provider",
        email: "pending@carpetstore.com",
        password: await bcrypt.hash("pending123", 12),
        role: "provider",
        providerStatus: "pending",
        isApproved: false,
        profileImage: "",
        address: "321 Pending St, City",
        phone: "+1234567893",
      },
    ];

    await User.bulkCreate(users, {
      ignoreDuplicates: true,
      validate: true,
    });

    console.log("✅ Users seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding users:", error);
    throw error;
  }
};

module.exports = userSeeder;
