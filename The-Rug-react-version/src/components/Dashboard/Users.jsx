import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import ProviderRequests from "./ProviderReq"; // Import the new component

const Users = () => {
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("users"); // Add state for tabs

  // Fetch users from the backend
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/admin/users", { withCredentials: true })
      .then((response) => setUsers(response.data))
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  // Delete a user
  const handleDeleteUser = (userId) => {
    axios
      .delete(`http://localhost:5000/api/admin/users/${userId}`, {
        withCredentials: true,
      })
      .then(() => {
        setUsers(users.filter((user) => user._id !== userId));
      })
      .catch((error) => console.error("Error deleting user:", error));
  };

  return (
    <div className="p-8 bg-[#FAF7F0] min-h-screen mt-30">
      <div className="flex justify-between items-center mb-6">
        <motion.h1
          className="text-3xl font-bold text-[#4A4947] tracking-wide"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {activeTab === "users" ? "Users Management" : "Provider Requests"}
        </motion.h1>

        <div className="flex bg-[#D8D2C2] rounded-lg p-1">
          <button
            onClick={() => setActiveTab("users")}
            className={`px-4 py-2 rounded-md ${
              activeTab === "users"
                ? "bg-white text-[#4A4947]"
                : "text-[#4A4947]"
            }`}
          >
            Users
          </button>
          <button
            onClick={() => setActiveTab("requests")}
            className={`px-4 py-2 rounded-md ${
              activeTab === "requests"
                ? "bg-white text-[#4A4947]"
                : "text-[#4A4947]"
            }`}
          >
            Provider Requests
          </button>
        </div>
      </div>

      {activeTab === "users" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <motion.div
              key={user._id}
              className="bg-[#D8D2C2] p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 relative overflow-hidden"
              whileHover={{ scale: 1.05 }}
            >
              <h2 className="text-xl font-semibold text-[#4A4947]">
                {user.name}
              </h2>
              <p className="text-sm text-gray-700">{user.email}</p>
              <span className="block mt-2 text-gray-600 font-medium">
                Role: {user.role}
              </span>
              {user.isApproved && user.role === "provider" && (
                <span className="block mt-1 text-sm text-green-600">
                  Approved Provider
                </span>
              )}
              <motion.button
                onClick={() => handleDeleteUser(user._id)}
                className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 transition-all duration-300"
                whileHover={{ scale: 1.2 }}
              >
                <Trash2 size={18} />
              </motion.button>
            </motion.div>
          ))}
        </div>
      ) : (
        <ProviderRequests />
      )}
    </div>
  );
};

export default Users;
