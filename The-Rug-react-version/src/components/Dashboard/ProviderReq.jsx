import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Check, X, User, FileText, Mail, Phone, MapPin } from "lucide-react";

const ProviderRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState({});
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Fetch pending provider requests
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/admin/provider-requests",
          { withCredentials: true }
        );
        setRequests(response.data);
      } catch (error) {
        console.error("Error fetching provider requests:", error);
      }
    };
    fetchRequests();
  }, []);

  const handleRequestAction = async (userId, action) => {
    setLoading((prev) => ({ ...prev, [userId]: true }));
    try {
      await axios.put(
        `http://localhost:5000/api/admin/provider-requests/${userId}`,
        { status: action },
        { withCredentials: true }
      );
      setRequests(requests.filter((request) => request._id !== userId));
    } catch (error) {
      console.error(`Error ${action} provider request:`, error);
    } finally {
      setLoading((prev) => ({ ...prev, [userId]: false }));
    }
  };

  const viewDocument = (documentUrl) => {
    if (!documentUrl) return;
    window.open(`http://localhost:5000${documentUrl}`, "_blank");
  };

  return (
    <div className="p-8 bg-[#FAF7F0]">
      <motion.div
        className="flex items-center mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <User className="mr-3 text-[#4A4947]" size={28} />
        <h1 className="text-3xl font-bold text-[#4A4947] tracking-wide">
          Provider Requests
        </h1>
        <span className="ml-auto bg-[#4A4947] text-white px-3 py-1 rounded-full">
          {requests.length} Pending
        </span>
      </motion.div>

      {requests.length === 0 ? (
        <div className="bg-[#D8D2C2] p-8 rounded-xl text-center">
          <p className="text-lg text-[#4A4947]">No pending provider requests</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((request) => (
            <motion.div
              key={request._id}
              className="bg-white p-6 rounded-xl shadow-lg border border-[#D8D2C2] relative"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-start mb-4">
                <div className="relative">
                  {request.profileImage ? (
                    <img
                      src={`http://localhost:5000${request.profileImage}`}
                      alt="Profile"
                      className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-[#D8D2C2]"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-[#D8D2C2] flex items-center justify-center mr-4 border-2 border-[#D8D2C2]">
                      <User className="text-[#4A4947]" size={24} />
                    </div>
                  )}
                  <span className="absolute -bottom-1 -right-1 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                    Provider
                  </span>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-[#4A4947]">
                    {request.name}
                  </h2>
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <Mail className="mr-1" size={14} />
                    <span>{request.email}</span>
                  </div>
                  {request.phone && (
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <Phone className="mr-1" size={14} />
                      <span>{request.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              {request.address && (
                <div className="flex items-start text-sm text-gray-600 mb-4">
                  <MapPin className="mr-1 mt-0.5 flex-shrink-0" size={14} />
                  <span>{request.address}</span>
                </div>
              )}

              <div className="mb-4">
                <button
                  onClick={() => viewDocument(request.identityDocument)}
                  className={`flex items-center text-sm ${
                    request.identityDocument
                      ? "text-blue-600 hover:underline"
                      : "text-gray-400 cursor-not-allowed"
                  }`}
                  disabled={!request.identityDocument}
                >
                  <FileText className="mr-1" size={14} />
                  {request.identityDocument
                    ? "View ID Document"
                    : "No Document"}
                </button>
              </div>

              <div className="flex justify-end space-x-3">
                <motion.button
                  onClick={() => handleRequestAction(request._id, "approved")}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg flex items-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={loading[request._id]}
                >
                  {loading[request._id] ? (
                    <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Check className="mr-2" size={18} />
                      Approve
                    </>
                  )}
                </motion.button>
                <motion.button
                  onClick={() => handleRequestAction(request._id, "rejected")}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg flex items-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={loading[request._id]}
                >
                  {loading[request._id] ? (
                    <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <X className="mr-2" size={18} />
                      Reject
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProviderRequests;
