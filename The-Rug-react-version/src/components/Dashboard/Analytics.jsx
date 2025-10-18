import React, { useEffect, useState } from "react";
import axios from "axios";

const Analytics = () => {
  const [salesData, setSalesData] = useState({
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [visitors, setVisitors] = useState(0);

  // Fetch analytics data from the backend
  useEffect(() => {
    axios
      .get("/api/admin/analytics/sales", { withCredentials: true })
      .then((response) => setSalesData(response.data))
      .catch((error) => console.error("Error fetching sales data:", error));

    axios
      .get("/api/admin/analytics/visitors", { withCredentials: true })
      .then((response) => setVisitors(response.data.visitors))
      .catch((error) => console.error("Error fetching visitors data:", error));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Analytics</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Sales Analytics</h2>
          <p>Total Orders: {salesData.totalOrders}</p>
          <p>Total Revenue: ${salesData.totalRevenue}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Store Visitors</h2>
          <p>Total Visitors: {visitors}</p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
