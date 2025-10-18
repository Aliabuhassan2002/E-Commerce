// import React from "react";
// import { Outlet } from "react-router-dom";
// import Sidebar from "./Sidebar";

// const Dashboard = () => {
//   return (
//     <div className="flex">
//       <Sidebar />
//       <div className="flex-1 p-6">
//         <Outlet />
//       </div>
//     </div>
//   );
// };

// export default Dashboard;
import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const Dashboard = () => {
  return (
    <div className="flex bg-[#FAF7F0] min-h-screen ">
      <Sidebar />
      <div className="flex-1 p-8 transition-all duration-500 ease-in-out">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
