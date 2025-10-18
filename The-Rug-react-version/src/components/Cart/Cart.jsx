import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Minus,
  Plus,
  ShoppingBag,
  CreditCard,
  Truck,
  Tag,
  Ticket,
} from "lucide-react";
import axios from "axios";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(null);
  const [applyingDiscount, setApplyingDiscount] = useState(false);
  // const fetchCart = async () => {
  //   try {
  //     setLoading(true);
  //     const response = await axios.get("http://localhost:5000/api/cart", {
  //       withCredentials: true,
  //     });

  //     if (response.data.success) {
  //       setCartItems(response.data.items || []);
  //       setTotal(response.data.total || 0);
  //     } else {
  //       console.error("Error fetching cart:", response.data.message);
  //       setCartItems([]);
  //       setTotal(0);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching cart:", error);
  //     setCartItems([]);
  //     setTotal(0);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const testSQLDebug = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/cart/debug", {
        withCredentials: true,
      });
      const responsee = await axios.get(
        "http://localhost:5000/api/cart/fix-cart-data",
        {
          withCredentials: true,
        }
      );
      console.log("SQL Debug response:", response.data);
    } catch (error) {
      console.error("SQL Debug error:", error);
    }
  };
  testSQLDebug();
  const fetchCart = async () => {
    try {
      setLoading(true);
      console.log("Fetching cart from: http://localhost:5000/api/cart");

      const response = await axios.get("http://localhost:5000/api/cart", {
        withCredentials: true,
      });

      console.log("Cart API Response:", response.data);

      if (response.data.success) {
        setCartItems(response.data.items || []);
        setTotal(response.data.total || 0);
      } else {
        console.error("Error fetching cart:", response.data.message);
        setCartItems([]);
        setTotal(0);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      console.error("Error details:", error.response?.data);
      setCartItems([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (productId, variantId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      const response = await axios.put(
        `http://localhost:5000/api/cart/${productId}`,
        {
          quantity: newQuantity,
          variantId: variantId,
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        fetchCart();
      } else {
        alert(`Error: ${response.data.message}`);
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      alert(
        `Failed to update quantity: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  const removeItem = async (productId, variantId) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/cart/${productId}`,
        {
          data: { variantId: variantId },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        fetchCart();
      } else {
        alert(`Error: ${response.data.message}`);
      }
    } catch (error) {
      console.error("Error removing item:", error);
      alert(
        `Failed to remove item: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };
  const applyDiscount = async () => {
    if (!discountCode.trim()) return;

    setApplyingDiscount(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/discounts/apply",
        {
          code: discountCode.trim(),
          cartTotal: total,
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        setAppliedDiscount(response.data.discount);
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to apply discount code");
    } finally {
      setApplyingDiscount(false);
    }
  };

  const removeDiscount = () => {
    setAppliedDiscount(null);
    setDiscountCode("");
  };

  // Calculate final total with discount
  const finalTotal = appliedDiscount ? appliedDiscount.finalAmount : total;
  const taxAmount = finalTotal * 0.07;
  const grandTotal = finalTotal + taxAmount;

  // Safe image URL function
  const getSafeImageUrl = (imagePath) => {
    if (!imagePath || imagePath === "undefined") {
      return "https://via.placeholder.com/150/D8D2C2/4A4947?text=No+Image";
    }
    if (imagePath.startsWith("http")) {
      return imagePath;
    }
    return `http://localhost:5000${imagePath}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF7F0]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#D8D2C2] border-t-[#4A4947] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#4A4947] text-lg font-medium">Loading cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F0] pt-24">
      <div className="max-w-7xl mx-auto p-6 pt-8">
        <div className="flex items-center gap-3 mb-8">
          <ShoppingBag className="w-8 h-8 text-[#4A4947]" />
          <h1 className="text-3xl font-bold text-[#4A4947]">
            Your Shopping Cart
          </h1>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-[#D8D2C2] rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-12 h-12 text-[#4A4947]" />
            </div>
            <p className="text-xl text-[#4A4947] mb-4">Your cart is empty</p>
            <Link
              to="/shop"
              className="inline-block bg-[#4A4947] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#4A4947]/90 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Products Section */}
            <div className="lg:w-2/3 space-y-6">
              {cartItems.map((item) => (
                <div
                  key={`${item.productId}-${item.variantId}`}
                  className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl border border-[#D8D2C2]"
                >
                  <div className="flex gap-6 p-6">
                    <div className="w-32 h-32 rounded-lg overflow-hidden bg-[#D8D2C2] flex-shrink-0">
                      <img
                        src={getSafeImageUrl(item.product.images?.[0])}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                        alt={item.product.name}
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/150/D8D2C2/4A4947?text=No+Image";
                        }}
                      />
                    </div>

                    <div className="flex-grow">
                      <h3 className="text-xl font-bold text-[#4A4947] mb-2">
                        {item.product.name}
                      </h3>

                      {/* Variant Information */}
                      {item.variant && (
                        <div className="mb-3">
                          <div className="flex gap-4 text-sm text-[#4A4947]/70">
                            <span className="bg-[#FAF7F0] px-3 py-1 rounded-lg">
                              Size: {item.variant.size}
                            </span>
                            <span className="bg-[#FAF7F0] px-3 py-1 rounded-lg flex items-center gap-2">
                              Color:
                              <span
                                className="w-4 h-4 rounded-full border border-[#4A4947]/20"
                                style={{ backgroundColor: item.variant.color }}
                              ></span>
                            </span>
                          </div>
                          {item.variant.stockQuantity && (
                            <p className="text-xs text-[#4A4947]/50 mt-1">
                              Stock: {item.variant.stockQuantity} available
                            </p>
                          )}
                        </div>
                      )}

                      <p className="text-[#4A4947] font-semibold mb-4">
                        Price: {item.product.price} JD
                      </p>

                      {/* <div className="flex items-center gap-4">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              item.variantId,
                              item.quantity - 1
                            )
                          }
                          disabled={item.quantity <= 1}
                          className="p-2 rounded-full bg-[#D8D2C2] hover:bg-[#4A4947] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Minus className="w-4 h-4 text-[#4A4947] hover:text-white" />
                        </button>
                        <span className="font-bold text-lg text-[#4A4947] min-w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              item.variantId,
                              item.quantity + 1
                            )
                          }
                          disabled={
                            item.variant &&
                            item.quantity >= item.variant.stockQuantity
                          }
                          className="p-2 rounded-full bg-[#D8D2C2] hover:bg-[#4A4947] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Plus className="w-4 h-4 text-[#4A4947] hover:text-white" />
                        </button>
                      </div> */}
                    </div>

                    <div className="flex flex-col items-end justify-between">
                      <div className="text-xl font-bold text-[#4A4947]">
                        {(item.product.price * item.quantity).toFixed(2)} JD
                      </div>
                      <button
                        onClick={() =>
                          removeItem(item.productId, item.variantId)
                        }
                        className="text-sm text-red-500 hover:text-red-700 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Checkout Section */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-xl shadow-lg p-8 sticky top-8 border border-[#D8D2C2]">
                <h2 className="text-2xl font-bold text-[#4A4947] mb-6 flex items-center gap-3">
                  <CreditCard className="w-6 h-6 text-[#4A4947]" />
                  Order Summary
                </h2>

                {/* Discount Code Input */}
                <div className="mb-6">
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      placeholder="Enter discount code"
                      value={discountCode}
                      onChange={(e) =>
                        setDiscountCode(e.target.value.toUpperCase())
                      }
                      className="flex-1 px-3 py-2 border border-[#D8D2C2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A4947]"
                      disabled={applyingDiscount || appliedDiscount}
                    />
                    {!appliedDiscount ? (
                      <button
                        onClick={applyDiscount}
                        disabled={applyingDiscount || !discountCode.trim()}
                        className="bg-[#4A4947] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#4A4947]/90 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        {applyingDiscount ? "..." : "Apply"}
                      </button>
                    ) : (
                      <button
                        onClick={removeDiscount}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  {/* Applied Discount Display */}
                  {appliedDiscount && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Ticket className="w-4 h-4 text-green-600" />
                          <span className="text-green-700 font-semibold">
                            {appliedDiscount.name}
                          </span>
                        </div>
                        <span className="text-green-700 font-bold">
                          -{Number(appliedDiscount.discountAmount).toFixed(2)}{" "}
                          JD
                        </span>
                      </div>
                      <p className="text-green-600 text-sm mt-1">
                        Code: {appliedDiscount.code}
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center py-3 border-b border-[#D8D2C2]">
                    <span className="text-[#4A4947]">Subtotal</span>
                    <span className="font-bold text-lg text-[#4A4947]">
                      {total.toFixed(2)} JD
                    </span>
                  </div>

                  {/* Discount Line */}
                  {appliedDiscount && (
                    <div className="flex justify-between items-center py-3 border-b border-[#D8D2C2]">
                      <span className="text-[#4A4947] flex items-center gap-2">
                        <Ticket className="w-4 h-4" />
                        Discount ({appliedDiscount.code})
                      </span>
                      <span className="font-bold text-lg text-red-600">
                        -{Number(appliedDiscount.discountAmount).toFixed(2)} JD
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-center py-3 border-b border-[#D8D2C2]">
                    <span className="text-[#4A4947]">Shipping</span>
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-[#4A4947]" />
                      <span className="font-bold text-lg text-[#4A4947]">
                        Free
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center py-3 border-b border-[#D8D2C2]">
                    <span className="text-[#4A4947]">Tax (7%)</span>
                    <span className="font-bold text-lg text-[#4A4947]">
                      {taxAmount.toFixed(2)} JD
                    </span>
                  </div>
                </div>

                <div className="bg-[#D8D2C2]/30 p-6 rounded-lg mb-8 border border-[#D8D2C2]">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-[#4A4947]">
                      Total
                    </span>
                    <span className="text-2xl font-bold text-[#4A4947]">
                      {grandTotal.toFixed(2)} JD
                    </span>
                  </div>
                </div>

                {/* <Link
                  to="/checkout"
                  className="block w-full text-center bg-[#4A4947] text-white py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:bg-[#4A4947]/90 hover:shadow-lg"
                >
                  Proceed to Checkout
                </Link> */}

                <p className="text-center text-[#4A4947]/70 mt-6 text-sm">
                  Free shipping on all orders over 100 JD
                </p>

                <div className="mt-4 text-center">
                  <Link
                    to="/shop"
                    className="text-[#4A4947] hover:underline text-sm"
                  >
                    ← Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
