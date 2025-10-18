const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

router.post("/create-payment-intent", verifyToken, async (req, res) => {
  try {
    const { amount } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: "jod",
      metadata: { userId: req.user.id.toString() },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
