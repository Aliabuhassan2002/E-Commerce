const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models"); // Sequelize model

// تسجيل مستخدم جديد
const registerUser = async (req, res) => {
  try {
    const { name, email, address, phone, password } = req.body;

    // التحقق من البريد الإلكتروني
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // تشفير كلمة المرور
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // إنشاء مستخدم جديد
    const newUser = await User.create({
      name,
      email,
      address,
      phone,
      password: hashedPassword,
      role: "end-user", // القيمة الافتراضية
      isApproved: false, // القيمة الافتراضية
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// تسجيل الدخول
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // التحقق من وجود المستخدم
    const user = await User.findOne({ where: { email } });
    if (!user)
      return res.status(401).json({ message: "Invalid email or password" });

    // التحقق من كلمة المرور
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid)
      return res.status(401).json({ message: "Invalid email or password" });

    // إنشاء JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        isApproved: user.isApproved,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // إرسال الكوكيز
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // إرجاع بيانات المستخدم
    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isApproved: user.isApproved,
        profileImage: user.profileImage,
        address: user.address,
        phone: user.phone,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res
      .status(500)
      .json({ message: "Server error during login", error: error.message });
  }
};

// تسجيل الخروج
const logout = (req, res) => {
  res
    .clearCookie("token")
    .status(200)
    .json({ message: "Logged out successfully" });
};

module.exports = { registerUser, login, logout };
