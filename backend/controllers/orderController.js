const { User, Product, Order, Payment } = require("../models");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { Op } = require("sequelize");

// إنشاء PaymentIntent
const createPaymentIntent = async (req, res) => {
  try {
    const { amount } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // تحويل للدولار سنت
      currency: "usd",
      metadata: { userId: req.user.id },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ message: "Payment error", error });
  }
};

// إنشاء طلب
const createOrder = async (req, res) => {
  try {
    const { paymentMethod, shippingAddress } = req.body;
    if (!paymentMethod || !shippingAddress) {
      return res
        .status(400)
        .json({ message: "Payment method and shipping address are required" });
    }

    const user = await User.findByPk(req.user.id, {
      include: {
        model: Product,
        as: "cart",
        through: { attributes: ["quantity", "color", "size"] },
      },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    // تحقق من العناصر الصحيحة في السلة
    const validItems = user.cart.filter(
      (item) => item.status === "approved" && item.Cart.quantity <= item.stock
    );

    if (validItems.length === 0) {
      return res.status(400).json({ message: "No valid items in cart" });
    }

    // حساب المجموع الكلي
    const total = validItems.reduce(
      (sum, item) => sum + item.price * item.Cart.quantity,
      0
    );

    // إنشاء الطلب
    const order = await Order.create({
      userId: user.id,
      shippingAddress,
      totalAmount: total * 1.07, // يشمل الضريبة
      paymentMethod,
      paymentStatus: paymentMethod === "cod" ? "pending" : "completed",
    });

    // ربط المنتجات بالطلب
    for (const item of validItems) {
      await order.addProduct(item, {
        through: {
          quantity: item.Cart.quantity,
          price: item.price,
          color: item.Cart.color,
          size: item.Cart.size,
          providerId: item.providerId,
        },
      });

      // تحديث المخزون
      item.stock -= item.Cart.quantity;
      await item.save();
    }

    // إنشاء سجل الدفع إذا لم يكن COD
    if (paymentMethod !== "cod") {
      await Payment.create({
        orderId: order.id,
        paymentMethod,
        amount: order.totalAmount,
        status: "completed",
      });
    }

    // مسح سلة المستخدم
    await user.setCart([]);

    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

// جلب تاريخ الطلبات
const getOrderHistory = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user.id },
      include: {
        model: Product,
        as: "products",
        through: { attributes: ["quantity", "price", "color", "size"] },
      },
      order: [["createdAt", "DESC"]],
    });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// جلب طلب بالـ ID
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        { model: User, attributes: ["id", "name", "email"] },
        {
          model: Product,
          as: "products",
          through: { attributes: ["quantity", "price", "color", "size"] },
        },
      ],
    });

    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.user.id !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {
  createOrder,
  getOrderHistory,
  getOrderById,
  createPaymentIntent,
};
