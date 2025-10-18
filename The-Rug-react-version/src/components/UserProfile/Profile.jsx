// import { useEffect, useState } from "react";
// import io from "socket.io-client";
// import axios from "axios";

// const Profile = () => {
//   const [user, setUser] = useState(null);
//   const [orders, setOrders] = useState([]);
//   const socket = io("http://localhost:5000");

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const res = await axios.get("http://localhost:5000/api/users/user", {
//           withCredentials: true,
//         });
//         setUser(res.data);

//         // Initialize socket connection after getting user ID
//         const socket = io("http://localhost:5000", {
//           withCredentials: true,
//           transports: ["websocket", "polling"], // Add fallback
//         });

//         socket.on("connect", () => {
//           console.log("Socket connected:", socket.id);
//           socket.emit("join", res.data._id);
//         });

//         socket.on("orderUpdated", (updatedOrder) => {
//           setOrders((prev) =>
//             prev.map((order) =>
//               order._id === updatedOrder._id ? updatedOrder : order
//             )
//           );
//         });

//         return () => {
//           socket.disconnect();
//         };
//       } catch (err) {
//         console.error(err);
//       }
//     };

//     const fetchOrders = async () => {
//       try {
//         const res = await axios.get("http://localhost:5000/api/users/orders", {
//           withCredentials: true,
//         });
//         setOrders(res.data);
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     fetchUserData();
//     fetchOrders();

//     socket.on("orderUpdated", (updatedOrder) => {
//       setOrders((prevOrders) =>
//         prevOrders.map((order) =>
//           order._id === updatedOrder._id ? updatedOrder : order
//         )
//       );
//     });

//     return () => {
//       socket.disconnect();
//     };
//   }, []);

//   return (
//     <div className="container mx-auto p-4 mt-22">
//       <h2 className="text-xl font-bold">User Profile</h2>
//       {user && (
//         <div className="p-4 bg-gray-100 rounded-lg">
//           <p>
//             <strong>Name:</strong> {user.name}
//           </p>
//           <p>
//             <strong>Email:</strong> {user.email}
//           </p>
//           <p>
//             <strong>Phone:</strong> {user.phone}
//           </p>
//         </div>
//       )}

//       <h3 className="mt-4 text-lg font-semibold">Orders</h3>
//       {orders.map((order) => (
//         <div key={order._id} className="p-4 my-2 bg-white shadow rounded">
//           <p>
//             <strong>Status:</strong> {order.orderStatus}
//           </p>
//           <p>
//             <strong>Total:</strong> ${order.totalAmount}
//           </p>
//           <ul>
//             {order.products.map((item) => (
//               <li key={item.product._id}>
//                 {item.product.name} - {item.quantity} pcs
//               </li>
//             ))}
//           </ul>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default Profile;
import { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [editError, setEditError] = useState("");
  const navigate = useNavigate();

  const socket = io("http://localhost:5000", {
    withCredentials: true,
    transports: ["websocket", "polling"],
  });

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async () => {
    try {
      if (editForm.newPassword !== editForm.confirmPassword) {
        setEditError("New passwords don't match");
        return;
      }

      const response = await axios.put(
        "http://localhost:5000/api/users/update",
        {
          name: editForm.name,
          currentPassword: editForm.currentPassword,
          newPassword: editForm.newPassword,
        },
        { withCredentials: true }
      );

      setUser(response.data.user);
      setIsEditing(false);
      setEditError("");
      setEditForm({
        name: response.data.user.name,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      setEditError(error.response?.data?.message || "Failed to update profile");
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get("http://localhost:5000/api/users/user", {
          withCredentials: true,
        });
        setUser(res.data);
        setEditForm({ ...editForm, name: res.data.name });

        socket.on("connect", () => {
          console.log("Socket connected:", socket.id);
          socket.emit("join", res.data._id);
        });

        socket.on("orderUpdated", (updatedOrder) => {
          setOrders((prev) =>
            prev.map((order) =>
              order._id === updatedOrder._id ? updatedOrder : order
            )
          );
        });

        return () => {
          socket.disconnect();
        };
      } catch (err) {
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };

    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users/orders", {
          withCredentials: true,
        });
        setOrders(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUserData();
    fetchOrders();

    return () => {
      socket.disconnect();
    };
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50 mt-30">
        <motion.div
          className="h-16 w-16 rounded-full border-t-4 border-b-4 border-faf7f0"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FAF7F0" }}>
      {user ? (
        <div className="min-h-screen">
          {/* Header with profile info and glass effect */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="backdrop-blur-md bg-white bg-opacity-10 shadow-lg"
          >
            <div className="container mx-auto p-6">
              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Profile Avatar */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                  className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold"
                  style={{ backgroundColor: "#D8D2C2", color: "#4A4947" }}
                >
                  {user.name.charAt(0)}
                </motion.div>

                {/* Profile Info */}
                <div className="flex-1">
                  <motion.h2
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-4xl font-bold"
                    style={{ color: "#4A4947" }}
                  >
                    {user.name}'s Profile
                  </motion.h2>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="h-1 mt-2 rounded"
                    style={{ backgroundColor: "#D8D2C2" }}
                  />

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mt-2 flex flex-wrap gap-x-6 gap-y-2"
                  >
                    <div className="flex items-center">
                      <span className="text-sm font-medium mr-2 text-gray-500">
                        Email:
                      </span>
                      <span style={{ color: "#4A4947" }}>{user.email}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm font-medium mr-2 text-gray-500">
                        Phone:
                      </span>
                      <span style={{ color: "#4A4947" }}>{user.phone}</span>
                    </div>
                  </motion.div>
                </div>

                {/* Tab Navigation */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="flex gap-4 mt-6 md:mt-0"
                >
                  <button
                    onClick={() => setActiveTab("profile")}
                    className={`px-4 py-2 rounded-full transition-all duration-300 ${
                      activeTab === "profile"
                        ? "bg-4A4947 text-white"
                        : "bg-d8d2c2 text-4A4947"
                    }`}
                    style={{
                      backgroundColor:
                        activeTab === "profile" ? "#4A4947" : "#D8D2C2",
                      color: activeTab === "profile" ? "#FAF7F0" : "#4A4947",
                    }}
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => setActiveTab("orders")}
                    className={`px-4 py-2 rounded-full ${
                      activeTab === "orders"
                        ? "bg-[#4A4947] text-white"
                        : "bg-[#D8D2C2] text-[#4A4947]"
                    }`}
                  >
                    Orders
                  </button>
                </motion.div>
              </div>
            </div>
          </motion.div>

          <div className="container mx-auto p-6">
            <AnimatePresence mode="wait">
              {activeTab === "profile" && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="mt-8"
                >
                  <div
                    className="bg-white rounded-2xl shadow-xl p-8"
                    style={{ backgroundColor: "#FAF7F0" }}
                  >
                    <h3
                      className="text-2xl font-bold mb-6"
                      style={{ color: "#4A4947" }}
                    >
                      Profile Details
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                      <div
                        className="bg-white p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-xl"
                        style={{ backgroundColor: "white" }}
                      >
                        <p className="text-sm font-medium text-gray-500">
                          Email
                        </p>
                        <p
                          className="text-lg font-semibold mt-2"
                          style={{ color: "#4A4947" }}
                        >
                          {user.email}
                        </p>
                      </div>
                      <div
                        className="bg-white p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-xl"
                        style={{ backgroundColor: "white" }}
                      >
                        <p className="text-sm font-medium text-gray-500">
                          Phone
                        </p>
                        <p
                          className="text-lg font-semibold mt-2"
                          style={{ color: "#4A4947" }}
                        >
                          {user.phone}
                        </p>
                      </div>
                      {user.address && (
                        <div
                          className="bg-white p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-xl md:col-span-2"
                          style={{ backgroundColor: "white" }}
                        >
                          <p className="text-sm font-medium text-gray-500">
                            Address
                          </p>
                          <p
                            className="text-lg font-semibold mt-2"
                            style={{ color: "#4A4947" }}
                          >
                            {user.address}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Edit Profile Section */}
                    <div className="mt-8 bg-white p-6 rounded-xl shadow-md">
                      <div className="flex justify-between items-center mb-4">
                        <h3
                          className="text-xl font-bold"
                          style={{ color: "#4A4947" }}
                        >
                          Account Settings
                        </h3>
                        {!isEditing ? (
                          <button
                            onClick={() => setIsEditing(true)}
                            className="px-4 py-2 rounded-lg"
                            style={{
                              backgroundColor: "#4A4947",
                              color: "#FAF7F0",
                            }}
                          >
                            Edit Profile
                          </button>
                        ) : (
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setIsEditing(false);
                                setEditError("");
                              }}
                              className="px-4 py-2 rounded-lg border"
                              style={{
                                borderColor: "#4A4947",
                                color: "#4A4947",
                              }}
                            >
                              Cancel
                            </button>
                            <button
                              onClick={handleUpdateProfile}
                              className="px-4 py-2 rounded-lg"
                              style={{
                                backgroundColor: "#4A4947",
                                color: "#FAF7F0",
                              }}
                            >
                              Save Changes
                            </button>
                          </div>
                        )}
                      </div>

                      {isEditing ? (
                        <div className="space-y-4">
                          <div>
                            <label
                              className="block text-sm font-medium mb-1"
                              style={{ color: "#4A4947" }}
                            >
                              Name
                            </label>
                            <input
                              type="text"
                              name="name"
                              value={editForm.name}
                              onChange={handleEditChange}
                              className="w-full px-4 py-2 rounded-lg border"
                              style={{ borderColor: "#D8D2C2" }}
                            />
                          </div>

                          <div className="pt-4 border-t border-gray-200">
                            <h4
                              className="text-sm font-medium mb-3"
                              style={{ color: "#4A4947" }}
                            >
                              Change Password
                            </h4>

                            <div className="space-y-4">
                              <div>
                                <label
                                  className="block text-sm font-medium mb-1"
                                  style={{ color: "#4A4947" }}
                                >
                                  Current Password
                                </label>
                                <input
                                  type="password"
                                  name="currentPassword"
                                  value={editForm.currentPassword}
                                  onChange={handleEditChange}
                                  className="w-full px-4 py-2 rounded-lg border"
                                  style={{ borderColor: "#D8D2C2" }}
                                />
                              </div>

                              <div>
                                <label
                                  className="block text-sm font-medium mb-1"
                                  style={{ color: "#4A4947" }}
                                >
                                  New Password
                                </label>
                                <input
                                  type="password"
                                  name="newPassword"
                                  value={editForm.newPassword}
                                  onChange={handleEditChange}
                                  className="w-full px-4 py-2 rounded-lg border"
                                  style={{ borderColor: "#D8D2C2" }}
                                />
                              </div>

                              <div>
                                <label
                                  className="block text-sm font-medium mb-1"
                                  style={{ color: "#4A4947" }}
                                >
                                  Confirm New Password
                                </label>
                                <input
                                  type="password"
                                  name="confirmPassword"
                                  value={editForm.confirmPassword}
                                  onChange={handleEditChange}
                                  className="w-full px-4 py-2 rounded-lg border"
                                  style={{ borderColor: "#D8D2C2" }}
                                />
                              </div>
                            </div>
                          </div>

                          {editError && (
                            <div className="text-red-500 text-sm mt-2">
                              {editError}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <p style={{ color: "#4A4947" }}>
                            <span className="font-medium">Name:</span>{" "}
                            {user.name}
                          </p>
                          <p style={{ color: "#4A4947" }}>
                            <span className="font-medium">Email:</span>{" "}
                            {user.email}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "orders" && (
                <motion.div
                  key="orders"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="mt-8"
                >
                  <div
                    className="bg-white rounded-2xl shadow-xl p-8"
                    style={{ backgroundColor: "#FAF7F0" }}
                  >
                    <h3
                      className="text-2xl font-bold mb-6"
                      style={{ color: "#4A4947" }}
                    >
                      Your Orders
                    </h3>

                    {orders.length > 0 ? (
                      <div className="space-y-6">
                        {orders.map((order) => (
                          <motion.div
                            key={order._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-xl"
                            style={{ backgroundColor: "white" }}
                          >
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h4
                                  className="text-lg font-semibold"
                                  style={{ color: "#4A4947" }}
                                >
                                  Order #{order._id.substring(0, 8)}
                                </h4>
                                <p className="text-sm text-gray-500">
                                  {new Date(
                                    order.createdAt
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                              <div>
                                <span
                                  className={`px-3 py-1 rounded-full text-sm ${
                                    order.orderStatus === "completed"
                                      ? "bg-green-100 text-green-800"
                                      : order.orderStatus === "cancelled"
                                      ? "bg-red-100 text-red-800"
                                      : "bg-yellow-100 text-yellow-800"
                                  }`}
                                >
                                  {order.orderStatus}
                                </span>
                              </div>
                            </div>

                            <div className="border-t border-gray-200 pt-4">
                              <div className="flex justify-between mb-2">
                                <span className="font-medium">Total:</span>
                                <span className="font-bold">
                                  ${order.totalAmount}
                                </span>
                              </div>

                              <h5 className="font-medium mt-4 mb-2">
                                Products:
                              </h5>
                              <ul className="space-y-2">
                                {order.products.map((item) => (
                                  <li
                                    key={item.product._id}
                                    className="flex justify-between"
                                  >
                                    <span>
                                      {item.product.name} × {item.quantity}
                                    </span>
                                    <span>
                                      ${item.product.price * item.quantity}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="bg-white rounded-lg p-8 text-center shadow-md"
                        style={{ backgroundColor: "white" }}
                      >
                        <p
                          className="text-lg mb-4"
                          style={{ color: "#4A4947" }}
                        >
                          You haven't placed any orders yet.
                        </p>
                        <Link
                          to="/shop"
                          className="inline-block px-6 py-2 rounded-lg transition-all duration-300"
                          style={{
                            backgroundColor: "#D8D2C2",
                            color: "#4A4947",
                          }}
                        >
                          Start Shopping
                        </Link>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      ) : (
        <div className="fixed inset-0 flex items-center justify-center">
          <motion.div
            className="h-16 w-16 rounded-full border-t-4 border-b-4 border-4A4947"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            style={{ borderColor: "#4A4947" }}
          />
        </div>
      )}
    </div>
  );
};

export default Profile;
