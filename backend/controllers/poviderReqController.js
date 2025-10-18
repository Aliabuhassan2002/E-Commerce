const { User } = require("../models");
const jwt = require("jsonwebtoken");

// طلب دور مقدم خدمة
const requestProviderRole = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role === "provider" && user.isApproved) {
      return res
        .status(400)
        .json({ message: "You are already an approved provider" });
    }

    if (user.providerStatus === "pending") {
      return res
        .status(400)
        .json({ message: "You already have a pending request" });
    }

    user.providerStatus = "pending";
    user.profileImage = req.files?.profileImage?.[0]?.path || "";
    user.identityDocument = req.files?.identityDocument?.[0]?.path || "";

    await user.save();

    res.status(200).json({
      message:
        "Provider request submitted successfully, awaiting admin approval.",
      status: "pending",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// جلب تفاصيل المستخدم
const getUserDetails = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
    });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// جلب الطلبات المعلقة لمقدمي الخدمة
const getProviderRequests = async (req, res) => {
  try {
    const requests = await User.findAll({
      where: { providerStatus: "pending" },
      attributes: { exclude: ["password", "cart", "orders", "likedProducts"] },
    });

    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// تحديث حالة طلب مقدم الخدمة
const updateProviderRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.providerStatus = status;

    if (status === "approved") {
      user.role = "provider";
      user.isApproved = true;

      const updatedToken = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.cookie("token", updatedToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
    } else {
      user.role = "end-user";
      user.isApproved = false;
    }

    await user.save();

    res.status(200).json({
      message: `Provider request ${status}`,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        providerStatus: user.providerStatus,
        isApproved: user.isApproved,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {
  requestProviderRole,
  getUserDetails,
  getProviderRequests,
  updateProviderRequestStatus,
};
