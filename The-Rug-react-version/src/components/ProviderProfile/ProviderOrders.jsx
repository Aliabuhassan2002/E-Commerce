import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProviderOrders = ({ user }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/orders/provider/my-orders",
          {
            withCredentials: true,
          }
        );
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
        if (error.response?.status === 403) {
          navigate("/"); // Redirect if not provider
        }
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === "provider") {
      fetchOrders();
    }
  }, [user, navigate]);

  if (loading) return <div className="text-center py-8">Loading orders...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Your Product Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found for your products.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <OrderCard key={order._id} order={order} providerId={user._id} />
          ))}
        </div>
      )}
    </div>
  );
};

// Separate component for order card
const OrderCard = ({ order, providerId }) => {
  // Filter only products belonging to this provider
  const providerProducts = order.products.filter(
    (item) => item.provider?.toString() === providerId
  );

  if (providerProducts.length === 0) return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {/* Order header */}
      <div className="flex justify-between items-start mb-4 pb-4 border-b">
        <div>
          <h3 className="font-semibold">
            Order #{order._id.slice(-6).toUpperCase()}
          </h3>
          <p className="text-sm text-gray-500">
            {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
        <span
          className={`px-3 py-1 text-xs rounded-full ${
            order.orderStatus === "delivered"
              ? "bg-green-100 text-green-800"
              : order.orderStatus === "cancelled"
              ? "bg-red-100 text-red-800"
              : "bg-blue-100 text-blue-800"
          }`}
        >
          {order.orderStatus}
        </span>
      </div>

      {/* Products section */}
      <div className="mb-6">
        <h4 className="font-medium mb-3">Products:</h4>
        {providerProducts.map((item) => (
          <div
            key={item._id}
            className="flex gap-4 mb-4 p-3 bg-gray-50 rounded"
          >
            <img
              src={`http://localhost:5000${item.product.images[0]}`}
              alt={item.product?.name}
              className="w-20 h-20 object-cover rounded border"
            />
            <div className="flex-1">
              <p className="font-medium">{item.product?.name}</p>
              <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                <p>Qty: {item.quantity}</p>
                <p>Price: ${item.price?.toFixed(2)}</p>
                {item.color && <p>Color: {item.color}</p>}
                {item.size && <p>Size: {item.size}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Customer and payment info */}
      <div className="grid md:grid-cols-2 gap-6 pt-4 border-t">
        <div>
          <h4 className="font-medium mb-2">Customer:</h4>
          <p>{order.user?.name}</p>
          <p className="text-gray-600 text-sm">{order.user?.email}</p>
        </div>
        <div>
          <h4 className="font-medium mb-2">Payment:</h4>
          <p>Method: {order.paymentMethod}</p>
          <p>Status: {order.paymentStatus}</p>
          <p className="mt-2 font-semibold">
            Total: ${order.totalAmount?.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProviderOrders;
