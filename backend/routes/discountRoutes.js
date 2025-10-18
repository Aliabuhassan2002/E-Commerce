// routes/discountRoutes.js
const express = require("express");
const router = express.Router();
const { Discount } = require("../models");
const { Op } = require("sequelize");

// Apply discount code
// router.post("/apply", async (req, res) => {
//   try {
//     const { code, cartTotal } = req.body;

//     // Find active discount with this code
//     const now = new Date();
//     const discount = await Discount.findOne({
//       where: {
//         code: code.toUpperCase(),
//         isActive: true,
//         startDate: { [Op.lte]: now },
//         endDate: { [Op.gte]: now },
//       },
//     });

//     if (!discount) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid discount code",
//       });
//     }

//     // Check usage limit
//     if (discount.usageLimit && discount.usedCount >= discount.usageLimit) {
//       return res.status(400).json({
//         success: false,
//         message: "This discount code has reached its usage limit",
//       });
//     }

//     // Check minimum order amount
//     if (cartTotal < discount.minOrderAmount) {
//       return res.status(400).json({
//         success: false,
//         message: `Minimum order amount of ${discount.minOrderAmount} JD required for this discount`,
//       });
//     }

//     // Calculate discount amount
//     let discountAmount = 0;
//     if (discount.discountType === "percentage") {
//       discountAmount = (cartTotal * discount.value) / 100;
//     } else if (discount.discountType === "fixed_amount") {
//       discountAmount = discount.value;
//     }

//     const finalAmount = cartTotal - discountAmount;

//     res.json({
//       success: true,
//       discount: {
//         id: discount.id,
//         name: discount.name,
//         code: discount.code,
//         discountType: discount.discountType,
//         value: discount.value,
//         discountAmount: discountAmount,
//         finalAmount: finalAmount,
//       },
//     });
//   } catch (error) {
//     console.error("Error applying discount:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// });
// routes/discountRoutes.js - Update the response part
router.post("/apply", async (req, res) => {
  try {
    const { code, cartTotal } = req.body;

    console.log("=== DISCOUNT DEBUG ===");
    console.log("Received code:", code);

    const discount = await Discount.findOne({
      where: {
        code: code.toUpperCase().trim(),
        isActive: true,
      },
    });

    if (!discount) {
      return res.status(400).json({
        success: false,
        message: "Invalid discount code",
      });
    }

    // Check usage limit
    if (discount.usageLimit && discount.usedCount >= discount.usageLimit) {
      return res.status(400).json({
        success: false,
        message: "This discount code has reached its usage limit",
      });
    }

    // Check minimum order amount
    if (parseFloat(cartTotal) < parseFloat(discount.minOrderAmount)) {
      return res.status(400).json({
        success: false,
        message: `Minimum order amount of ${discount.minOrderAmount} JD required for this discount`,
      });
    }

    // Calculate discount amount - CONVERT TO NUMBERS
    let discountAmount = 0;
    const numericCartTotal = parseFloat(cartTotal);
    const numericDiscountValue = parseFloat(discount.value);

    if (discount.discountType === "percentage") {
      discountAmount = (numericCartTotal * numericDiscountValue) / 100;
    } else if (discount.discountType === "fixed_amount") {
      discountAmount = numericDiscountValue;
    }

    // Ensure discountAmount doesn't exceed cart total
    discountAmount = Math.min(discountAmount, numericCartTotal);
    const finalAmount = numericCartTotal - discountAmount;

    console.log("Discount calculation:");
    console.log("- Cart total:", numericCartTotal);
    console.log("- Discount value:", numericDiscountValue);
    console.log("- Discount amount:", discountAmount);
    console.log("- Final amount:", finalAmount);

    res.json({
      success: true,
      discount: {
        id: discount.id,
        name: discount.name,
        code: discount.code,
        discountType: discount.discountType,
        value: numericDiscountValue,
        discountAmount: parseFloat(discountAmount.toFixed(2)), // Ensure number
        finalAmount: parseFloat(finalAmount.toFixed(2)), // Ensure number
      },
    });
  } catch (error) {
    console.error("Error applying discount:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});
module.exports = router;
