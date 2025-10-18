import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiTruck, FiPackage, FiCheckCircle, FiXCircle } from "react-icons/fi";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [trafficCondition, setTrafficCondition] = useState("normal");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/admin/orders",
          {
            withCredentials: true,
          }
        );
        setOrders(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const { data: updatedOrder } = await axios.put(
        `http://localhost:5000/api/admin/orders/${orderId}/status`,
        { status: newStatus },
        { withCredentials: true }
      );

      setOrders((prev) =>
        prev.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order
        )
      );
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update order");
    }
  };
  const getStatusProgress = (status) => {
    switch (status) {
      case "processing":
        return 25;
      case "shipped":
        return 50;
      case "delivered":
        return 100;
      case "cancelled":
        return 0;
      default:
        return 0;
    }
  };
  const getStatusColor = (status) => {
    switch (status) {
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "processing":
        return <FiPackage className="mr-1" />;
      case "shipped":
        return <FiTruck className="mr-1" />;
      case "delivered":
        return <FiCheckCircle className="mr-1" />;
      case "cancelled":
        return <FiXCircle className="mr-1" />;
      default:
        return null;
    }
  };
  const filteredOrders = orders.filter(
    (order) =>
      order._id.includes(search) ||
      order.user?.name.toLowerCase().includes(search.toLowerCase())
  );
  const stats = {
    total: orders.length,
    processing: orders.filter((o) => o.orderStatus === "processing").length,
    shipped: orders.filter((o) => o.orderStatus === "shipped").length,
    delivered: orders.filter((o) => o.orderStatus === "delivered").length,
    cancelled: orders.filter((o) => o.orderStatus === "cancelled").length,
  };
  const predictDeliveryTime = (order) => {
    let baseTime = 1; // ساعة واحدة كأساس لكل طلب

    // 1️⃣ المسافة بين المتجر والعميل (مثال تقريبي)
    const distance = order.distance || 5; // افتراض المسافة 5 كم إن لم تكن موجودة
    const distanceFactor = distance / 10; // كل 10 كم تضيف ساعة إلى وقت التوصيل

    // 2️⃣ عدد المنتجات في الطلب
    const productFactor = order.products.length * 0.3; // كل منتج يزيد 0.3 ساعة

    // 3️⃣ تأثير حركة المرور
    let trafficFactor = 1; // عامل التأثير الافتراضي
    switch (trafficCondition) {
      case "heavy":
        trafficFactor = 2.5; // ازدحام شديد
        break;
      case "normal":
        trafficFactor = 1.5; // عادي
        break;
      case "fast":
        trafficFactor = 1; // سريع
        break;
    }

    // 4️⃣ التأثير الزمني - هل الطلب في وقت الذروة؟
    const orderHour = new Date(order.createdAt).getHours();
    const peakFactor = orderHour >= 17 && orderHour <= 20 ? 1.5 : 1; // إذا كان بين 5-8 مساءً، يزيد الوقت بنسبة 50%

    // حساب الوقت الكلي مع جميع العوامل
    const totalTime =
      (baseTime + distanceFactor + productFactor) * trafficFactor * peakFactor;

    return `${Math.ceil(totalTime)} days`;
  };

  if (loading) return <div className="text-center py-8">Loading orders...</div>;
  if (error)
    return <div className="text-center py-8 text-red-600">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Order Management</h1>

      <input
        type="text"
        placeholder="Search orders by customer name..."
        className="p-2 border rounded w-full mb-4"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="flex items-center space-x-4 mb-4">
        <span className="text-lg font-semibold">Traffic Condition:</span>
        <button
          onClick={() => setTrafficCondition("heavy")}
          className={`px-4 py-2 rounded ${
            trafficCondition === "heavy"
              ? "bg-red-500 text-white"
              : "bg-gray-200"
          }`}
        >
          Heavy Traffic
        </button>
        <button
          onClick={() => setTrafficCondition("normal")}
          className={`px-4 py-2 rounded ${
            trafficCondition === "normal"
              ? "bg-yellow-500 text-white"
              : "bg-gray-200"
          }`}
        >
          Normal
        </button>
        <button
          onClick={() => setTrafficCondition("fast")}
          className={`px-4 py-2 rounded ${
            trafficCondition === "fast"
              ? "bg-green-500 text-white"
              : "bg-gray-200"
          }`}
        >
          Fast
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left">Order ID</th>
              <th className="py-3 px-4 text-left">Customer</th>
              <th className="py-3 px-4 text-left">Products</th>
              <th className="py-3 px-4 text-left">Total</th>
              <th className="py-3 px-4 text-left">Payment</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Estimated Delivery</th>
              <th className="py-3 px-4 text-left">Date</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredOrders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-50">
                <td className="py-4 px-4">
                  {order._id.slice(-6).toUpperCase()}
                </td>
                <td className="py-4 px-4">
                  <div>
                    <p className="font-medium">{order.user?.name || "Guest"}</p>
                    <p className="text-sm text-gray-600">
                      {order.user?.email || ""}
                    </p>
                    <p className="font-medium">
                      {order.user?.phone || "Guest"}
                    </p>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="space-y-2">
                    {order.products.map((item) => (
                      <div key={item._id} className="flex items-center">
                        {item.product?.images?.[0] && (
                          <img
                            src={`http://localhost:5000${item.product.images[0]}`}
                            alt={item.product.name}
                            className="w-10 h-10 object-cover rounded mr-2"
                          />
                        )}
                        <div>
                          <p className="font-medium">
                            {item.product?.name || "Product"}
                          </p>
                          <p className="text-sm text-gray-600">
                            {item.quantity} × {item.price} JD
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </td>
                <td className="py-4 px-4 font-medium">
                  {order.totalAmount.toFixed(2)} JD
                </td>
                <td className="py-4 px-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      order.paymentStatus === "completed"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {order.paymentMethod.toUpperCase()}
                  </span>
                </td>
                {/* <td className="py-4 px-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs inline-flex items-center ${getStatusColor(
                      order.orderStatus
                    )}`}
                  >
                    {getStatusIcon(order.orderStatus)}
                    {order.orderStatus.charAt(0).toUpperCase() +
                      order.orderStatus.slice(1)}
                  </span>
                </td> */}
                <td className="py-4 px-4">
                  <div className="relative w-full bg-gray-200 rounded h-2">
                    <div
                      className="absolute top-0 left-0 h-2 bg-blue-500 rounded"
                      style={{
                        width: `${getStatusProgress(order.orderStatus)}%`,
                      }}
                    ></div>
                  </div>
                  <span
                    className={`px-2 py-1 mt-5 rounded-full text-xs inline-flex items-center ${getStatusColor(
                      order.orderStatus
                    )}`}
                  >
                    {getStatusIcon(order.orderStatus)}
                    {order.orderStatus.charAt(0).toUpperCase() +
                      order.orderStatus.slice(1)}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span className="text-gray-700 text-sm font-semibold">
                    {predictDeliveryTime(order)}
                  </span>
                </td>
                <td className="py-4 px-4">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="py-4 px-4">
                  <select
                    value={order.orderStatus}
                    onChange={(e) =>
                      handleStatusChange(order._id, e.target.value)
                    }
                    className="min-w-[120px] p-2 border rounded"
                  >
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="grid grid-cols-4 gap-4 mb-6 mt-8">
        {Object.entries(stats).map(([key, value]) => (
          <div key={key} className="p-4 bg-white shadow rounded">
            <p className="text-lg font-bold">{value}</p>
            <p className="text-gray-500">{key.toUpperCase()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
