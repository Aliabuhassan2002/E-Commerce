require("dotenv").config();
const mongoose = require("mongoose");
const Order = require("../models/Order");
const Product = require("../models/Product");

const migrateOrders = async () => {
  try {
    // Connect to DB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Find all orders missing provider info
    const orders = await Order.find({
      $or: [
        { "products.provider": { $exists: false } },
        { "products.provider": null },
      ],
    }).populate("products.product");

    if (orders.length === 0) {
      console.log("No orders need updating");
      process.exit(0);
    }

    console.log(`Found ${orders.length} orders to update`);

    // Update each order
    for (const order of orders) {
      let needsUpdate = false;

      // Update each product in the order
      const updatedProducts = order.products.map((productItem) => {
        if (!productItem.provider && productItem.product?.provider) {
          needsUpdate = true;
          return {
            ...productItem.toObject(),
            provider: productItem.product.provider,
          };
        }
        return productItem;
      });

      // Save if changes were made
      if (needsUpdate) {
        order.products = updatedProducts;
        await order.save();
        console.log(`Updated order ${order._id}`);
      }
    }

    console.log("Migration complete!");
    process.exit(0);
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  }
};

migrateOrders();
