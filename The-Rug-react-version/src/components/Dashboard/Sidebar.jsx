// import React from "react";
// import { Link, useLocation } from "react-router-dom";

// const Sidebar = () => {
//   const location = useLocation();

//   // Sidebar links
//   const links = [
//     { path: "users", label: "Users" },
//     { path: "products", label: "Products" },
//     { path: "feedback", label: "Feedback" },
//     { path: "analytics", label: "Analytics" },
//   ];

//   return (
//     <div className="bg-gray-800 text-white w-64 min-h-screen p-4">
//       <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
//       <ul>
//         {links.map((link) => (
//           <li key={link.path} className="mb-3">
//             <Link
//               to={`/dashboard/${link.path}`}
//               className={`hover:text-gray-400 ${
//                 location.pathname.includes(link.path) ? "text-blue-400" : ""
//               }`}
//             >
//               {link.label}
//             </Link>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default Sidebar;
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Users, Package, BarChart } from "lucide-react";

const Sidebar = () => {
  const location = useLocation();

  // Sidebar links with icons
  const links = [
    { path: "users", label: "Users", icon: <Users size={20} /> },
    { path: "products", label: "Products", icon: <Package size={20} /> },
    // { path: "feedback", label: "Feedback", icon: <Home size={20} /> },
    // { path: "analytics", label: "Analytics", icon: <BarChart size={20} /> },
    // { path: "orders", label: "Orders", icon: <BarChart size={20} /> },
  ];

  return (
    <motion.div
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-[#4A4947] text-[#D8D2C2] w-72 min-h-screen p-6 shadow-xl rounded-tr-3xl rounded-br-3xl"
    >
      <h1 className="text-3xl font-extrabold mb-8 text-[#FAF7F0] tracking-wide">
        Admin Panel
      </h1>
      <ul>
        {links.map((link) => (
          <motion.li
            key={link.path}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="mb-5"
          >
            <Link
              to={`/dashboard/${link.path}`}
              className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ease-in-out hover:bg-[#D8D2C2] hover:text-[#4A4947] ${
                location.pathname.includes(link.path)
                  ? "bg-[#D8D2C2] text-[#4A4947]"
                  : ""
              }`}
            >
              {link.icon}
              <span className="text-lg font-semibold">{link.label}</span>
            </Link>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
};

export default Sidebar;
