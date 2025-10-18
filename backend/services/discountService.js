// services/discountService.js
const { Discount, Product, ProductVariant } = require("../models");
const { Op } = require("sequelize");

class DiscountService {
  // Get active discounts for a product
  static async getProductDiscounts(productId, variantId = null) {
    try {
      const now = new Date();

      // Get all active discounts
      const discounts = await Discount.findAll({
        where: {
          isActive: true,
          startDate: { [Op.lte]: now },
          endDate: { [Op.gte]: now },
          [Op.or]: [
            // Product-specific discounts
            {
              applicableTo: "product",
              targetId: productId,
            },
            // Variant-specific discounts
            {
              applicableTo: "variant",
              targetId: variantId,
            },
            // Category discounts
            {
              applicableTo: "category",
            },
          ],
        },
      });

      return discounts;
    } catch (error) {
      console.error("Error getting product discounts:", error);
      return [];
    }
  }

  // Calculate discount amount
  static calculateDiscount(originalPrice, discount) {
    if (discount.discountType === "percentage") {
      return (originalPrice * discount.value) / 100;
    } else if (discount.discountType === "fixed_amount") {
      return Math.min(discount.value, originalPrice);
    }
    return 0;
  }

  // Get best discount from multiple discounts
  static getBestDiscount(price, discounts) {
    if (!discounts.length) return null;

    let bestDiscount = null;
    let highestSavings = 0;

    discounts.forEach((discount) => {
      const savings = this.calculateDiscount(price, discount);
      if (savings > highestSavings) {
        highestSavings = savings;
        bestDiscount = { ...discount.toJSON(), savings };
      }
    });

    return bestDiscount;
  }

  // Apply discount to cart items
  static async applyDiscountsToCartItems(cartItems) {
    const itemsWithDiscounts = await Promise.all(
      cartItems.map(async (item) => {
        const discounts = await this.getProductDiscounts(
          item.productId,
          item.variantId
        );

        const bestDiscount = this.getBestDiscount(
          item.product.price,
          discounts
        );
        const finalPrice = bestDiscount
          ? item.product.price - bestDiscount.savings
          : item.product.price;

        return {
          ...item,
          discounts,
          bestDiscount,
          originalPrice: item.product.price,
          finalPrice,
          itemTotal: finalPrice * item.quantity,
          savings: bestDiscount ? bestDiscount.savings * item.quantity : 0,
        };
      })
    );

    return itemsWithDiscounts;
  }

  // Validate discount code
  static async validateDiscountCode(code, cartTotal = 0) {
    try {
      const now = new Date();
      const discount = await Discount.findOne({
        where: {
          code,
          isActive: true,
          startDate: { [Op.lte]: now },
          endDate: { [Op.gte]: now },
        },
      });

      if (!discount) {
        return { valid: false, message: "Invalid discount code" };
      }

      if (discount.usageLimit && discount.usedCount >= discount.usageLimit) {
        return { valid: false, message: "Discount usage limit reached" };
      }

      if (cartTotal < discount.minOrderAmount) {
        return {
          valid: false,
          message: `Minimum order amount of ${discount.minOrderAmount} JD required`,
        };
      }

      return { valid: true, discount };
    } catch (error) {
      console.error("Error validating discount code:", error);
      return { valid: false, message: "Error validating discount" };
    }
  }
}

module.exports = DiscountService;
