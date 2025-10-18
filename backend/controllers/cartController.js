const { User, Product, ProductVariant } = require("../models");
const DiscountService = require("../services/discountService");

const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1, size, color, variantId } = req.body;
    const userId = req.user.id;

    console.log("Add to cart request:", {
      productId,
      quantity,
      size,
      color,
      variantId,
      userId,
    });

    // Find the product first to check if it's approved
    const product = await Product.findByPk(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (product.status !== "approved") {
      return res.status(400).json({
        success: false,
        message: "Product not available",
      });
    }

    // Find the specific variant
    let selectedVariant = null;

    if (variantId) {
      // If variantId is provided, use it directly
      selectedVariant = await ProductVariant.findByPk(variantId);
    } else if (size && color) {
      // Find variant by size and color
      selectedVariant = await ProductVariant.findOne({
        where: {
          productId: productId,
          size: size,
          color: color,
          isActive: true,
        },
      });
    }

    if (!selectedVariant) {
      return res.status(404).json({
        success: false,
        message: "Variant not found for selected size and color",
      });
    }

    // Check variant stock
    if (selectedVariant.stockQuantity < quantity) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock. Only ${selectedVariant.stockQuantity} available`,
      });
    }

    const user = await User.findByPk(userId);

    // PROPERLY PARSE THE CART - FIXED
    // let cart = [];
    // if (user.cart) {
    //   if (Array.isArray(user.cart)) {
    //     cart = user.cart;
    //   } else if (typeof user.cart === "string") {
    //     try {
    //       cart = JSON.parse(user.cart);
    //       console.log("Parsed existing cart:", cart);
    //     } catch (error) {
    //       console.error("Error parsing cart JSON:", error);
    //       cart = [];
    //     }
    //   }
    // }
    let cart = [];
    if (user.cart) {
      if (Array.isArray(user.cart)) {
        cart = user.cart;
      } else if (typeof user.cart === "string") {
        try {
          let cartString = user.cart;
          if (cartString.startsWith('"') && cartString.endsWith('"')) {
            cartString = cartString.slice(1, -1);
          }
          cartString = cartString.replace(/\\"/g, '"');
          cart = JSON.parse(cartString);
        } catch (error) {
          console.error("Error parsing cart JSON:", error);
          cart = [];
        }
      }
    }
    console.log("Current cart before adding:", cart);

    // Create cart item with variant info
    const cartItem = {
      productId: parseInt(productId),
      quantity: parseInt(quantity),
      size: selectedVariant.size,
      color: selectedVariant.color,
      variantId: selectedVariant.id,
      addedAt: new Date().toISOString(),
    };

    // Check if item already exists in cart - FIXED LOGIC
    const existingIndex = cart.findIndex(
      (item) =>
        item.productId === parseInt(productId) &&
        item.variantId === selectedVariant.id
    );

    console.log("Existing item index:", existingIndex);

    if (existingIndex >= 0) {
      // Update quantity if item exists
      const newQuantity = cart[existingIndex].quantity + parseInt(quantity);

      // Check stock again for updated quantity
      if (selectedVariant.stockQuantity < newQuantity) {
        return res.status(400).json({
          success: false,
          message: `Cannot add more. Only ${
            selectedVariant.stockQuantity - cart[existingIndex].quantity
          } additional items available`,
        });
      }

      cart[existingIndex].quantity = newQuantity;
      console.log("Updated existing item quantity:", cart[existingIndex]);
    } else {
      // Add new item to cart
      cart.push(cartItem);
      console.log("Added new item to cart:", cartItem);
    }

    console.log("Final cart to save:", cart);

    // Update user's cart - STORE AS PROPER JSON
    //     await User.update(
    //       { cart: JSON.stringify(cart) },
    //       { where: { id: userId } }
    //     );

    //     res.status(200).json({
    //       success: true,
    //       message: "Product added to cart successfully",
    //       cart: cart,
    //     });
    //   } catch (error) {
    //     console.error("Error adding to cart:", error);
    //     res.status(500).json({
    //       success: false,
    //       message: "Server error",
    //       error: error.message,
    //     });
    //   }
    // };
    await User.update({ cart: cart }, { where: { id: userId } });

    res.status(200).json({
      success: true,
      message: "Product added to cart successfully",
      cart: cart,
    });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const getCart = async (req, res) => {
  try {
    console.log("=== AUTH DEBUG ===");
    console.log("Authenticated user from token:", req.user);

    const user = await User.findByPk(req.user.id);
    console.log("Raw user cart:", user.cart);
    console.log("Type of user.cart:", typeof user.cart);

    // IMPROVED PARSING LOGIC
    let cart = [];
    if (user.cart) {
      if (Array.isArray(user.cart)) {
        cart = user.cart;
      } else if (typeof user.cart === "string") {
        try {
          let cartString = user.cart;

          // Handle double-stringified JSON
          if (cartString.startsWith('"') && cartString.endsWith('"')) {
            cartString = cartString.slice(1, -1);
          }

          // Remove escape characters
          cartString = cartString.replace(/\\"/g, '"');

          cart = JSON.parse(cartString);
          console.log("Parsed cart from string:", cart);
        } catch (error) {
          console.error("Error parsing cart JSON:", error);
          console.error("Problematic cart string:", user.cart);
          cart = [];
        }
      }
    }

    // Ensure cart is an array
    if (!Array.isArray(cart)) {
      console.error("Cart is not an array after parsing:", cart);
      cart = [];
    }

    console.log("Final cart array:", cart);
    console.log("Cart length:", cart.length);

    const detailedCart = await Promise.all(
      cart.map(async (item, index) => {
        try {
          console.log(`\n--- Processing cart item ${index} ---`);
          console.log("Item data:", item);

          const product = await Product.findByPk(item.productId);
          const variant = await ProductVariant.findByPk(item.variantId);

          // ... rest of your processing logic
          if (!product || product.status !== "approved") {
            console.log("❌ FILTERED: Product issue");
            return null;
          }

          if (!variant || !variant.isActive) {
            console.log("❌ FILTERED: Variant issue");
            return null;
          }

          console.log("✅ Item passed all filters");

          return {
            ...item,
            product: {
              id: product.id,
              name: product.name,
              price: variant.price,
              images: product.images,
              description: product.description,
            },
            variant: {
              id: variant.id,
              size: variant.size,
              color: variant.color,
              sku: variant.sku,
              stockQuantity: variant.stockQuantity,
            },
          };
        } catch (error) {
          console.error("Error processing cart item:", error);
          return null;
        }
      })
    );

    const filteredCart = detailedCart.filter(Boolean);
    const total = filteredCart.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    console.log("Final cart items to return:", filteredCart.length);

    res.status(200).json({
      success: true,
      items: filteredCart,
      total,
    });
  } catch (error) {
    console.error("Error getting cart:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
// تحديث كمية منتج في السلة
// const updateCartItem = async (req, res) => {
//   try {
//     const { productId } = req.params;
//     const { quantity, variantId } = req.body;

//     if (!quantity || quantity < 1) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid quantity",
//       });
//     }

//     if (!variantId) {
//       return res.status(400).json({
//         success: false,
//         message: "Variant ID is required",
//       });
//     }

//     const user = await User.findByPk(req.user.id);
//     let cart = Array.isArray(user.cart) ? user.cart : [];

//     const index = cart.findIndex(
//       (item) =>
//         item.productId === parseInt(productId) &&
//         item.variantId === parseInt(variantId)
//     );

//     if (index === -1) {
//       return res.status(404).json({
//         success: false,
//         message: "Product not in cart",
//       });
//     }

//     // Check variant stock before updating
//     const variant = await ProductVariant.findByPk(variantId);
//     if (!variant) {
//       return res.status(404).json({
//         success: false,
//         message: "Variant not found",
//       });
//     }

//     if (variant.stockQuantity < quantity) {
//       return res.status(400).json({
//         success: false,
//         message: `Insufficient stock. Only ${variant.stockQuantity} available`,
//       });
//     }

//     cart[index].quantity = parseInt(quantity);

//     // Update user's cart
//     await User.update({ cart: cart }, { where: { id: req.user.id } });

//     res.status(200).json({
//       success: true,
//       message: "Cart updated successfully",
//       cart,
//     });
//   } catch (error) {
//     console.error("Error updating cart:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//       error: error.message,
//     });
//   }
// };
const updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity, variantId } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid quantity",
      });
    }

    if (!variantId) {
      return res.status(400).json({
        success: false,
        message: "Variant ID is required",
      });
    }

    const user = await User.findByPk(req.user.id);

    // PROPERLY PARSE CART
    let cart = [];
    if (user.cart) {
      if (Array.isArray(user.cart)) {
        cart = user.cart;
      } else if (typeof user.cart === "string") {
        try {
          cart = JSON.parse(user.cart);
        } catch (error) {
          console.error("Error parsing cart JSON:", error);
          cart = [];
        }
      }
    }

    const index = cart.findIndex(
      (item) =>
        item.productId === parseInt(productId) &&
        item.variantId === parseInt(variantId)
    );

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: "Product not in cart",
      });
    }

    // Check variant stock before updating
    const variant = await ProductVariant.findByPk(variantId);
    if (!variant) {
      return res.status(404).json({
        success: false,
        message: "Variant not found",
      });
    }

    if (variant.stockQuantity < quantity) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock. Only ${variant.stockQuantity} available`,
      });
    }

    cart[index].quantity = parseInt(quantity);

    // Update user's cart - STORE AS PROPER JSON
    // await User.update(
    //   { cart: JSON.stringify(cart) },
    //   { where: { id: req.user.id } }
    // );
    await User.update({ cart: cart }, { where: { id: req.user.id } });

    res.status(200).json({
      success: true,
      message: "Cart updated successfully",
      cart,
    });
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
// إزالة منتج من السلة
// const removeFromCart = async (req, res) => {
//   try {
//     const { productId } = req.params;
//     const { variantId } = req.body;

//     if (!variantId) {
//       return res.status(400).json({
//         success: false,
//         message: "Variant ID is required",
//       });
//     }

//     const user = await User.findByPk(req.user.id);
//     let cart = Array.isArray(user.cart) ? user.cart : [];

//     cart = cart.filter(
//       (item) =>
//         !(
//           item.productId === parseInt(productId) &&
//           item.variantId === parseInt(variantId)
//         )
//     );

//     // Update user's cart
//     await User.update({ cart: cart }, { where: { id: req.user.id } });

//     res.status(200).json({
//       success: true,
//       message: "Product removed from cart",
//       cart,
//     });
//   } catch (error) {
//     console.error("Error removing from cart:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//       error: error.message,
//     });
//   }
// };
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const { variantId } = req.body;

    if (!variantId) {
      return res.status(400).json({
        success: false,
        message: "Variant ID is required",
      });
    }

    const user = await User.findByPk(req.user.id);

    // PROPERLY PARSE CART
    let cart = [];
    if (user.cart) {
      if (Array.isArray(user.cart)) {
        cart = user.cart;
      } else if (typeof user.cart === "string") {
        try {
          cart = JSON.parse(user.cart);
        } catch (error) {
          console.error("Error parsing cart JSON:", error);
          cart = [];
        }
      }
    }

    const initialLength = cart.length;
    cart = cart.filter(
      (item) =>
        !(
          item.productId === parseInt(productId) &&
          item.variantId === parseInt(variantId)
        )
    );

    console.log(`Removed ${initialLength - cart.length} items from cart`);

    // Update user's cart - STORE AS PROPER JSON
    // await User.update(
    //   { cart: JSON.stringify(cart) },
    //   { where: { id: req.user.id } }
    // );
    await User.update({ cart: cart }, { where: { id: req.user.id } });
    res.status(200).json({
      success: true,
      message: "Product removed from cart",
      cart,
    });
  } catch (error) {
    console.error("Error removing from cart:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
// تفريغ السلة بالكامل
const clearCart = async (req, res) => {
  try {
    // Update user's cart to empty array
    await User.update({ cart: [] }, { where: { id: req.user.id } });

    res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
    });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};
