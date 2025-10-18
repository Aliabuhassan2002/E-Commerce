import React, { useEffect, useState } from "react";
import axios from "axios";

const Feedback = () => {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch feedback from the backend
  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/admin/feedback",
          {
            withCredentials: true,
          }
        );
        setFeedback(response.data);
      } catch (err) {
        console.error("Error fetching feedback:", err);
        setError("Failed to fetch feedback. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  // Update feedback status
  const handleUpdateStatus = async (feedbackId, status) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/admin/feedback/${feedbackId}/status`,
        { status },
        { withCredentials: true }
      );

      setFeedback(
        feedback.map((item) => (item._id === feedbackId ? response.data : item))
      );
    } catch (error) {
      console.error("Error updating feedback status:", error);
      setError("Failed to update feedback status.");
    }
  };

  if (loading) {
    return <div className="p-6">Loading feedback...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Feedback Management</h1>
      {feedback.length === 0 ? (
        <p className="text-gray-500">No feedback available.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 border-b text-left">Name</th>
                <th className="py-3 px-4 border-b text-left">Email</th>
                <th className="py-3 px-4 border-b text-left">Message</th>
                <th className="py-3 px-4 border-b text-left">Date</th>
                <th className="py-3 px-4 border-b text-left">Status</th>
                <th className="py-3 px-4 border-b text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {feedback.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 border-b">{item.name}</td>
                  <td className="py-3 px-4 border-b">{item.email}</td>
                  <td className="py-3 px-4 border-b max-w-xs truncate">
                    {item.message}
                  </td>
                  <td className="py-3 px-4 border-b">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 border-b">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        item.status === "reviewed"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 border-b">
                    <select
                      value={item.status}
                      onChange={(e) =>
                        handleUpdateStatus(item._id, e.target.value)
                      }
                      className="bg-gray-100 px-3 py-1 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                    >
                      <option value="pending">Pending</option>
                      <option value="reviewed">Reviewed</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Feedback;
