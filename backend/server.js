const multer = require("multer");
const path = require("path");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
dotenv.config();

// Import Sequelize and models through the index file
const { sequelize } = require("./models");

// Import routes (you'll need to update these later)
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const providerRoutes = require("./routes/providerReqRoutes");
const productRoutes = require("./routes/productsRoutes");
const adminRoutes = require("./routes/adminRoutes");
const cartRoutes = require("./routes/cartRoutes");
const contactRoutes = require("./routes/contactRoutes");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const aiRoutes = require("./routes/aiRoutes");
const discountRoutes = require("./routes/discountRoutes");

const bcrypt = require("bcryptjs");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Routes
app.use("/api/cart", cartRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/provider", providerRoutes);
app.use("/api/products", productRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/discounts", discountRoutes);

// Make sure uploads directory exists
const fs = require("fs");
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// ==================== DATABASE INITIALIZATION ====================

// Database connection and synchronization
const initializeDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ MySQL connection established successfully.");

    // TEMPORARY: Use force: true to drop and recreate all tables
    await sequelize.sync({
      force: false, // This will DROP and RECREATE all tables
      alter: false,
    });

    console.log("✅ All tables recreated with latest schema");
  } catch (error) {
    console.error("❌ Database initialization failed:", error);
    process.exit(1);
  }
};

// ==================== SOCKET.IO SETUP ====================

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });

  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });
});

// ==================== HEALTH CHECK ENDPOINTS ====================

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Server is running",
    database: "MySQL with Sequelize",
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/db-status", async (req, res) => {
  try {
    await sequelize.authenticate();
    res.status(200).json({
      status: "OK",
      message: "Database connection successful",
      database: sequelize.config.database,
    });
  } catch (error) {
    res.status(500).json({
      status: "ERROR",
      message: "Database connection failed",
      error: error.message,
    });
  }
});

// ==================== START SERVER ====================

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Initialize database first
    await initializeDatabase();

    // Then start server
    server.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📊 Using MySQL database: ${sequelize.config.database}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n🛑 Shutting down server gracefully...");
  await sequelize.close();
  console.log("✅ Database connection closed.");
  process.exit(0);
});

startServer();

// Export for testing or other modules
module.exports = { app, sequelize, io };
