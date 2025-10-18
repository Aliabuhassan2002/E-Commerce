// components/OrderConfirmation.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { CheckCircle } from "lucide-react";

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/orders/${orderId}`,
          {
            withCredentials: true,
          }
        );
        setOrder(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading order details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbe7c6]/20 py-12">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center mb-8">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-800">Order Confirmed!</h1>
          <p className="text-gray-600 mt-2">
            Thank you for your purchase. Your order has been received.
          </p>
        </div>

        <div className="border-t border-b border-gray-200 py-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Order Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Order Number</p>
              <p className="font-medium">{order._id}</p>
            </div>
            <div>
              <p className="text-gray-600">Date</p>
              <p className="font-medium">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Total</p>
              <p className="font-medium">{order.totalAmount.toFixed(2)} JD</p>
            </div>
            <div>
              <p className="text-gray-600">Payment Method</p>
              <p className="font-medium capitalize">
                {order.paymentMethod === "cod"
                  ? "Cash on Delivery"
                  : "Credit Card"}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p>{order.shippingAddress.name}</p>
            <p>{order.shippingAddress.street}</p>
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
              {order.shippingAddress.postalCode}
            </p>
            <p>{order.shippingAddress.email}</p>
            <p>{order.shippingAddress.phone}</p>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Order Items</h2>
          <div className="space-y-4">
            {order.products.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center border-b pb-4"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                    {item.product.images && item.product.images[0] && (
                      <img
                        src={`http://localhost:5000${item.product.images[0]}`}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium">{item.product.name}</h3>
                    <p className="text-sm text-gray-600">
                      Qty: {item.quantity}
                    </p>
                  </div>
                </div>
                <div className="font-medium">
                  {(item.price * item.quantity).toFixed(2)} JD
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <a
            href="/shop"
            className="inline-block px-6 py-3 bg-[#d4a373] text-white rounded-lg font-medium hover:bg-[#ab815c] transition"
          >
            Continue Shopping
          </a>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
