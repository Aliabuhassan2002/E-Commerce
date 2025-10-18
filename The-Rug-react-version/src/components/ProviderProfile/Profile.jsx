// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { motion, AnimatePresence } from "framer-motion";
// import ProviderOrders from "./ProviderOrders";
// import { useNavigate } from "react-router-dom";
// const ProviderProfile = () => {
//   const [provider, setProvider] = useState(null);
//   const [products, setProducts] = useState([]);
//   const [newProduct, setNewProduct] = useState({
//     name: "",
//     description: "",
//     price: "",
//     category: "carpet",
//     size: "",
//     colors: ["#000000"],
//     color: "",
//     material: "",
//     images: [],
//     stock: 1,
//     style: "traditional", // Added
//     roomType: "living-room", // Added
//     pattern: "solid", // Added
//   });
//   const [isFormVisible, setIsFormVisible] = useState(false);
//   const [activeTab, setActiveTab] = useState("profile"); // Default to profile tab
//   const [isLoading, setIsLoading] = useState(true);
//   const [isEditing, setIsEditing] = useState(false);
//   const [editForm, setEditForm] = useState({
//     name: provider?.name || "",
//     currentPassword: "",
//     newPassword: "",
//     confirmPassword: "",
//   });
//   const [editError, setEditError] = useState("");
//   const navigate = useNavigate();

//   const handleEditChange = (e) => {
//     setEditForm({ ...editForm, [e.target.name]: e.target.value });
//   };

//   const handleUpdateProfile = async () => {
//     try {
//       // التحقق من تطابق كلمة المرور الجديدة
//       if (editForm.newPassword !== editForm.confirmPassword) {
//         setEditError("New passwords don't match");
//         return;
//       }

//       const response = await axios.put(
//         "http://localhost:5000/api/users/update",
//         {
//           name: editForm.name,
//           currentPassword: editForm.currentPassword,
//           newPassword: editForm.newPassword,
//         },
//         { withCredentials: true }
//       );

//       setProvider(response.data.user);
//       setIsEditing(false);
//       setEditError("");
//       setEditForm({
//         name: response.data.user.name,
//         currentPassword: "",
//         newPassword: "",
//         confirmPassword: "",
//       });
//     } catch (error) {
//       setEditError(error.response?.data?.message || "Failed to update profile");
//     }
//   };

//   // Fetch provider data and products on page load
//   useEffect(() => {
//     const fetchProviderData = async () => {
//       try {
//         setIsLoading(true);
//         const res = await axios.get("http://localhost:5000/api/users/user", {
//           withCredentials: true,
//         });
//         if (res.data.role === "provider") {
//           setProvider(res.data);
//           fetchProducts(res.data._id);
//         }
//       } catch (error) {
//         navigate("/login");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     const fetchProducts = async (providerId) => {
//       try {
//         const res = await axios.get(
//           `http://localhost:5000/api/products/provider/${providerId}`
//         );
//         setProducts(res.data);
//       } catch (error) {
//         console.error("Error fetching products:", error);
//       }
//     };

//     fetchProviderData();
//   }, []);

//   // Update new product data on input
//   // const handleChange = (e) => {
//   //   setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
//   // };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setNewProduct({ ...newProduct, [name]: value });
//   };

//   // Add a new function to handle color changes
//   const handleAddColor = () => {
//     setNewProduct({
//       ...newProduct,
//       colors: [...newProduct.colors, "#000000"], // إضافة لون أسود جديد
//     });
//   };

//   const handleRemoveColor = (index) => {
//     const updatedColors = newProduct.colors.filter((_, i) => i !== index);
//     setNewProduct({ ...newProduct, colors: updatedColors });
//   };

//   const handleColorChange = (index, value) => {
//     const updatedColors = [...newProduct.colors];
//     updatedColors[index] = value;
//     setNewProduct({ ...newProduct, colors: updatedColors });
//   };
//   const handleFileChange = (e) => {
//     setNewProduct({ ...newProduct, images: e.target.files });
//   };

//   // Submit new product to server
//   // const handleAddProduct = async (e) => {
//   //   e.preventDefault();
//   //   try {
//   //     const res = await axios.post("http://localhost:5000/api/products/add", newProduct, {
//   //       withCredentials: true,
//   //     });
//   //     setProducts([...products, res.data]);

//   //     // Show success notification with animation
//   //     const notification = document.getElementById("notification");
//   //     notification.classList.remove("hidden");
//   //     setTimeout(() => {
//   //       notification.classList.add("hidden");
//   //     }, 3000);

//   //     setNewProduct({
//   //       name: "",
//   //       description: "",
//   //       price: "",
//   //       category: "carpet",
//   //       size: "",
//   //       color: "",
//   //       material: "",
//   //       images: [],
//   //       stock: 1,
//   //     });
//   //     setIsFormVisible(false);
//   //   } catch (error) {
//   //     console.error("Error adding product:", error);
//   //   }
//   // };
//   const handleAddProduct = async (e) => {
//     e.preventDefault();
//     try {
//       const formData = new FormData();
//       formData.append("name", newProduct.name);
//       formData.append("description", newProduct.description);
//       formData.append("price", newProduct.price);
//       formData.append("category", newProduct.category);
//       formData.append("size", newProduct.size);
//       formData.append("color", newProduct.color);
//       formData.append("material", newProduct.material);
//       formData.append("stock", newProduct.stock);
//       formData.append("style", newProduct.style);
//       formData.append("roomType", newProduct.roomType);
//       formData.append("pattern", newProduct.pattern);

//       // Append multiple images
//       for (let i = 0; i < newProduct.images.length; i++) {
//         formData.append("images", newProduct.images[i]);
//       }
//       newProduct.colors.forEach((color) => {
//         formData.append("colors", color);
//       });

//       const res = await axios.post(
//         "http://localhost:5000/api/products/add",
//         formData,
//         {
//           withCredentials: true,
//           headers: { "Content-Type": "multipart/form-data" },
//         }
//       );

//       setProducts([...products, res.data]);
//       setNewProduct({
//         name: "",
//         description: "",
//         price: "",
//         category: "carpet",
//         size: "",
//         colors: [],
//         material: "",
//         images: [],
//         stock: 1,
//         style: "traditional",
//         roomType: "living-room",
//         pattern: "solid",
//       });
//     } catch (error) {
//       console.error("Error adding product:", error);
//     }
//   };

//   // Get product status color
//   const getStatusColor = (status) => {
//     switch (status) {
//       case "approved":
//         return "bg-green-500";
//       case "pending":
//         return "bg-yellow-500";
//       case "rejected":
//         return "bg-red-500";
//       default:
//         return "bg-blue-500";
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50 mt-30">
//         <motion.div
//           className="h-16 w-16 rounded-full border-t-4 border-b-4 border-faf7f0"
//           animate={{ rotate: 360 }}
//           transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//         />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen" style={{ backgroundColor: "#FAF7F0" }}>
//       {/* Floating notification */}
//       <div
//         id="notification"
//         className="fixed top-5 right-5 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg hidden transition-all duration-500 z-50"
//       >
//         Product added successfully!
//       </div>

//       {provider ? (
//         <div className="min-h-screen">
//           {/* Header with profile info and glass effect */}
//           <motion.div
//             initial={{ opacity: 0, y: -50 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//             className="backdrop-blur-md bg-white bg-opacity-10 shadow-lg"
//           >
//             <div className="container mx-auto p-6">
//               <div className="flex flex-col md:flex-row items-center gap-8">
//                 {/* Profile Avatar */}
//                 <motion.div
//                   initial={{ scale: 0 }}
//                   animate={{ scale: 1 }}
//                   transition={{ delay: 0.3, type: "spring" }}
//                   className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold"
//                   style={{ backgroundColor: "#D8D2C2", color: "#4A4947" }}
//                 >
//                   {provider.name.charAt(0)}
//                 </motion.div>

//                 {/* Profile Info */}
//                 <div className="flex-1">
//                   <motion.h2
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     transition={{ delay: 0.2 }}
//                     className="text-4xl font-bold"
//                     style={{ color: "#4A4947" }}
//                   >
//                     {provider.name}'s Studio
//                   </motion.h2>
//                   <motion.div
//                     initial={{ width: 0 }}
//                     animate={{ width: "100%" }}
//                     transition={{ delay: 0.5, duration: 0.8 }}
//                     className="h-1 mt-2 rounded"
//                     style={{ backgroundColor: "#D8D2C2" }}
//                   />

//                   <motion.div
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     transition={{ delay: 0.6 }}
//                     className="mt-2 flex flex-wrap gap-x-6 gap-y-2"
//                   >
//                     <div className="flex items-center">
//                       <span className="text-sm font-medium mr-2 text-gray-500">
//                         Email:
//                       </span>
//                       <span style={{ color: "#4A4947" }}>{provider.email}</span>
//                     </div>
//                     <div className="flex items-center">
//                       <span className="text-sm font-medium mr-2 text-gray-500">
//                         Phone:
//                       </span>
//                       <span style={{ color: "#4A4947" }}>{provider.phone}</span>
//                     </div>
//                     <div className="flex items-center">
//                       <span className="text-sm font-medium mr-2 text-gray-500">
//                         Address:
//                       </span>
//                       <span style={{ color: "#4A4947" }}>
//                         {provider.address}
//                       </span>
//                     </div>
//                   </motion.div>
//                 </div>

//                 {/* Tab Navigation */}
//                 <motion.div
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   transition={{ delay: 0.7 }}
//                   className="flex gap-4 mt-6 md:mt-0"
//                 >
//                   <button
//                     onClick={() => setActiveTab("profile")}
//                     className={`px-4 py-2 rounded-full transition-all duration-300 ${
//                       activeTab === "profile"
//                         ? "bg-4A4947 text-white"
//                         : "bg-d8d2c2 text-4A4947"
//                     }`}
//                     style={{
//                       backgroundColor:
//                         activeTab === "profile" ? "#4A4947" : "#D8D2C2",
//                       color: activeTab === "profile" ? "#FAF7F0" : "#4A4947",
//                     }}
//                   >
//                     Profile
//                   </button>
//                   <button
//                     onClick={() => setActiveTab("products")}
//                     className={`px-4 py-2 rounded-full transition-all duration-300 ${
//                       activeTab === "products"
//                         ? "bg-4A4947 text-white"
//                         : "bg-d8d2c2 text-4A4947"
//                     }`}
//                     style={{
//                       backgroundColor:
//                         activeTab === "products" ? "#4A4947" : "#D8D2C2",
//                       color: activeTab === "products" ? "#FAF7F0" : "#4A4947",
//                     }}
//                   >
//                     Products
//                   </button>
//                   <button
//                     onClick={() => setActiveTab("orders")}
//                     className={`px-4 py-2 rounded-full ${
//                       activeTab === "orders"
//                         ? "bg-[#4A4947] text-white"
//                         : "bg-[#D8D2C2] text-[#4A4947]"
//                     }`}
//                   >
//                     Orders
//                   </button>
//                 </motion.div>
//               </div>
//             </div>
//           </motion.div>

//           <div className="container mx-auto p-6">
//             <AnimatePresence mode="wait">
//               {activeTab === "profile" && (
//                 <motion.div
//                   key="profile"
//                   initial={{ opacity: 0, x: -20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   exit={{ opacity: 0, x: 20 }}
//                   transition={{ duration: 0.3 }}
//                   className="mt-8"
//                 >
//                   <div
//                     className="bg-white rounded-2xl shadow-xl p-8"
//                     style={{ backgroundColor: "#FAF7F0" }}
//                   >
//                     <h3
//                       className="text-2xl font-bold mb-6"
//                       style={{ color: "#4A4947" }}
//                     >
//                       Profile Details
//                     </h3>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
//                       <div
//                         className="bg-white p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-xl"
//                         style={{ backgroundColor: "white" }}
//                       >
//                         <p className="text-sm font-medium text-gray-500">
//                           Email
//                         </p>
//                         <p
//                           className="text-lg font-semibold mt-2"
//                           style={{ color: "#4A4947" }}
//                         >
//                           {provider.email}
//                         </p>
//                       </div>
//                       <div
//                         className="bg-white p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-xl"
//                         style={{ backgroundColor: "white" }}
//                       >
//                         <p className="text-sm font-medium text-gray-500">
//                           Phone
//                         </p>
//                         <p
//                           className="text-lg font-semibold mt-2"
//                           style={{ color: "#4A4947" }}
//                         >
//                           {provider.phone}
//                         </p>
//                       </div>
//                       <div
//                         className="bg-white p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-xl md:col-span-2"
//                         style={{ backgroundColor: "white" }}
//                       >
//                         <p className="text-sm font-medium text-gray-500">
//                           Address
//                         </p>
//                         <p
//                           className="text-lg font-semibold mt-2"
//                           style={{ color: "#4A4947" }}
//                         >
//                           {provider.address}
//                         </p>
//                       </div>

//                       {/* Additional profile sections */}
//                       <div
//                         className="bg-white p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-xl md:col-span-2"
//                         style={{ backgroundColor: "white" }}
//                       >
//                         <p className="text-sm font-medium text-gray-500">
//                           Business Summary
//                         </p>
//                         <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
//                           <div
//                             className="p-4 rounded-lg text-center"
//                             style={{ backgroundColor: "#D8D2C2" }}
//                           >
//                             <p
//                               className="text-3xl font-bold"
//                               style={{ color: "#4A4947" }}
//                             >
//                               {products.length}
//                             </p>
//                             <p
//                               className="text-sm mt-1"
//                               style={{ color: "#4A4947" }}
//                             >
//                               Total Products
//                             </p>
//                           </div>
//                           <div
//                             className="p-4 rounded-lg text-center"
//                             style={{ backgroundColor: "#D8D2C2" }}
//                           >
//                             <p
//                               className="text-3xl font-bold"
//                               style={{ color: "#4A4947" }}
//                             >
//                               {
//                                 products.filter((p) => p.status === "approved")
//                                   .length
//                               }
//                             </p>
//                             <p
//                               className="text-sm mt-1"
//                               style={{ color: "#4A4947" }}
//                             >
//                               Approved Products
//                             </p>
//                           </div>
//                           <div
//                             className="p-4 rounded-lg text-center"
//                             style={{ backgroundColor: "#D8D2C2" }}
//                           >
//                             <p
//                               className="text-3xl font-bold"
//                               style={{ color: "#4A4947" }}
//                             >
//                               {
//                                 products.filter((p) => p.status === "pending")
//                                   .length
//                               }
//                             </p>
//                             <p
//                               className="text-sm mt-1"
//                               style={{ color: "#4A4947" }}
//                             >
//                               Pending Review
//                             </p>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                     {/* Edit Profile Section */}
//                     <div className="mt-8 bg-white p-6 rounded-xl shadow-md">
//                       <div className="flex justify-between items-center mb-4">
//                         <h3
//                           className="text-xl font-bold"
//                           style={{ color: "#4A4947" }}
//                         >
//                           Account Settings
//                         </h3>
//                         {!isEditing ? (
//                           <button
//                             onClick={() => setIsEditing(true)}
//                             className="px-4 py-2 rounded-lg"
//                             style={{
//                               backgroundColor: "#4A4947",
//                               color: "#FAF7F0",
//                             }}
//                           >
//                             Edit Profile
//                           </button>
//                         ) : (
//                           <div className="flex gap-2">
//                             <button
//                               onClick={() => {
//                                 setIsEditing(false);
//                                 setEditError("");
//                               }}
//                               className="px-4 py-2 rounded-lg border"
//                               style={{
//                                 borderColor: "#4A4947",
//                                 color: "#4A4947",
//                               }}
//                             >
//                               Cancel
//                             </button>
//                             <button
//                               onClick={handleUpdateProfile}
//                               className="px-4 py-2 rounded-lg"
//                               style={{
//                                 backgroundColor: "#4A4947",
//                                 color: "#FAF7F0",
//                               }}
//                             >
//                               Save Changes
//                             </button>
//                           </div>
//                         )}
//                       </div>

//                       {isEditing ? (
//                         <div className="space-y-4">
//                           <div>
//                             <label
//                               className="block text-sm font-medium mb-1"
//                               style={{ color: "#4A4947" }}
//                             >
//                               Name
//                             </label>
//                             <input
//                               type="text"
//                               name="name"
//                               value={editForm.name}
//                               onChange={handleEditChange}
//                               className="w-full px-4 py-2 rounded-lg border"
//                               style={{ borderColor: "#D8D2C2" }}
//                             />
//                           </div>

//                           <div className="pt-4 border-t border-gray-200">
//                             <h4
//                               className="text-sm font-medium mb-3"
//                               style={{ color: "#4A4947" }}
//                             >
//                               Change Password
//                             </h4>

//                             <div className="space-y-4">
//                               <div>
//                                 <label
//                                   className="block text-sm font-medium mb-1"
//                                   style={{ color: "#4A4947" }}
//                                 >
//                                   Current Password
//                                 </label>
//                                 <input
//                                   type="password"
//                                   name="currentPassword"
//                                   value={editForm.currentPassword}
//                                   onChange={handleEditChange}
//                                   className="w-full px-4 py-2 rounded-lg border"
//                                   style={{ borderColor: "#D8D2C2" }}
//                                 />
//                               </div>

//                               <div>
//                                 <label
//                                   className="block text-sm font-medium mb-1"
//                                   style={{ color: "#4A4947" }}
//                                 >
//                                   New Password
//                                 </label>
//                                 <input
//                                   type="password"
//                                   name="newPassword"
//                                   value={editForm.newPassword}
//                                   onChange={handleEditChange}
//                                   className="w-full px-4 py-2 rounded-lg border"
//                                   style={{ borderColor: "#D8D2C2" }}
//                                 />
//                               </div>

//                               <div>
//                                 <label
//                                   className="block text-sm font-medium mb-1"
//                                   style={{ color: "#4A4947" }}
//                                 >
//                                   Confirm New Password
//                                 </label>
//                                 <input
//                                   type="password"
//                                   name="confirmPassword"
//                                   value={editForm.confirmPassword}
//                                   onChange={handleEditChange}
//                                   className="w-full px-4 py-2 rounded-lg border"
//                                   style={{ borderColor: "#D8D2C2" }}
//                                 />
//                               </div>
//                             </div>
//                           </div>

//                           {editError && (
//                             <div className="text-red-500 text-sm mt-2">
//                               {editError}
//                             </div>
//                           )}
//                         </div>
//                       ) : (
//                         <div className="space-y-2">
//                           <p style={{ color: "#4A4947" }}>
//                             <span className="font-medium">Name:</span>{" "}
//                             {provider.name}
//                           </p>
//                           <p style={{ color: "#4A4947" }}>
//                             <span className="font-medium">Email:</span>{" "}
//                             {provider.email}
//                           </p>
//                         </div>
//                       )}
//                     </div>
//                     <div className="flex justify-center mt-8">
//                       <button
//                         onClick={() => setActiveTab("products")}
//                         className="px-6 py-3 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:translate-y-1"
//                         style={{ backgroundColor: "#4A4947", color: "#FAF7F0" }}
//                       >
//                         Manage Products
//                       </button>
//                     </div>
//                   </div>
//                 </motion.div>
//               )}

//               {activeTab === "products" && (
//                 <motion.div
//                   key="products"
//                   initial={{ opacity: 0, x: 20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   exit={{ opacity: 0, x: -20 }}
//                   transition={{ duration: 0.3 }}
//                   className="mt-8"
//                 >
//                   {/* Add Product Button */}
//                   <motion.div
//                     className="flex justify-end mb-6"
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ delay: 0.2 }}
//                   >
//                     <button
//                       onClick={() => setIsFormVisible(!isFormVisible)}
//                       className="flex items-center px-6 py-3 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl"
//                       style={{ backgroundColor: "#4A4947", color: "#FAF7F0" }}
//                     >
//                       <span className="mr-2">
//                         {isFormVisible ? "Cancel" : "Add New Product"}
//                       </span>
//                       <span>{isFormVisible ? "×" : "+"}</span>
//                     </button>
//                   </motion.div>

//                   {/* Add Product Form */}
//                   <AnimatePresence>
//                     {isFormVisible && (
//                       <motion.div
//                         initial={{ opacity: 0, height: 0 }}
//                         animate={{ opacity: 1, height: "auto" }}
//                         exit={{ opacity: 0, height: 0 }}
//                         transition={{ duration: 0.3 }}
//                         className="overflow-hidden"
//                       >
//                         <div
//                           className="bg-white rounded-2xl shadow-xl p-8 mb-10"
//                           style={{ backgroundColor: "#FAF7F0" }}
//                         >
//                           <h3
//                             className="text-2xl font-semibold mb-6"
//                             style={{ color: "#4A4947" }}
//                           >
//                             Add New Product
//                           </h3>

//                           <form
//                             onSubmit={handleAddProduct}
//                             className="grid grid-cols-1 md:grid-cols-2 gap-6"
//                           >
//                             <div className="group">
//                               <input
//                                 type="text"
//                                 name="name"
//                                 placeholder="Product Name"
//                                 className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-all duration-300 focus:border-4A4947"
//                                 style={{
//                                   borderColor: "#D8D2C2",
//                                   backgroundColor: "white",
//                                 }}
//                                 onChange={handleChange}
//                                 value={newProduct.name}
//                                 required
//                               />
//                             </div>
//                             <div>
//                               <input
//                                 type="number"
//                                 name="price"
//                                 placeholder="Price"
//                                 className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-all duration-300 focus:border-4A4947"
//                                 style={{
//                                   borderColor: "#D8D2C2",
//                                   backgroundColor: "white",
//                                 }}
//                                 onChange={handleChange}
//                                 value={newProduct.price}
//                                 required
//                               />
//                             </div>
//                             <div className="md:col-span-2">
//                               <textarea
//                                 name="description"
//                                 placeholder="Description"
//                                 className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-all duration-300 focus:border-4A4947"
//                                 style={{
//                                   borderColor: "#D8D2C2",
//                                   backgroundColor: "white",
//                                 }}
//                                 rows="3"
//                                 onChange={handleChange}
//                                 value={newProduct.description}
//                                 required
//                               ></textarea>
//                             </div>
//                             <div>
//                               <input
//                                 type="text"
//                                 name="size"
//                                 placeholder="Size"
//                                 className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-all duration-300 focus:border-4A4947"
//                                 style={{
//                                   borderColor: "#D8D2C2",
//                                   backgroundColor: "white",
//                                 }}
//                                 onChange={handleChange}
//                                 value={newProduct.size}
//                                 required
//                               />
//                             </div>
//                             {/* <div>
//                               <input
//                                 type="text"
//                                 name="color"
//                                 placeholder="Color"
//                                 className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-all duration-300 focus:border-4A4947"
//                                 style={{
//                                   borderColor: "#D8D2C2",
//                                   backgroundColor: "white",
//                                 }}
//                                 onChange={handleChange}
//                                 value={newProduct.color}
//                                 required
//                               />
//                             </div> */}
//                             {/* Replace single color input with multiple checkboxes */}
//                             <div className="flex flex-col">
//                               <label className="mb-2 text-sm font-medium text-[#4A4947]">
//                                 Colors
//                               </label>
//                               <div className="flex flex-wrap gap-2">
//                                 {newProduct.colors.map((color, index) => (
//                                   <div
//                                     key={index}
//                                     className="flex items-center gap-1"
//                                   >
//                                     <input
//                                       type="color"
//                                       value={color}
//                                       onChange={(e) =>
//                                         handleColorChange(index, e.target.value)
//                                       }
//                                       className="h-8 w-8 cursor-pointer"
//                                     />
//                                     <button
//                                       type="button"
//                                       onClick={() => handleRemoveColor(index)}
//                                       className="text-red-500 hover:text-red-700"
//                                     >
//                                       ×
//                                     </button>
//                                   </div>
//                                 ))}
//                                 <button
//                                   type="button"
//                                   onClick={handleAddColor}
//                                   className="flex items-center justify-center h-8 w-8 bg-[#D8D2C2] rounded hover:bg-[#4A4947] hover:text-white"
//                                 >
//                                   +
//                                 </button>
//                               </div>
//                             </div>
//                             {/* Add Style dropdown */}
//                             <div>
//                               <label
//                                 className="block text-sm font-medium mb-2"
//                                 style={{ color: "#4A4947" }}
//                               >
//                                 Style
//                               </label>
//                               <select
//                                 name="style"
//                                 value={newProduct.style}
//                                 onChange={handleChange}
//                                 className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-all duration-300 focus:border-4A4947"
//                                 style={{
//                                   borderColor: "#D8D2C2",
//                                   backgroundColor: "white",
//                                 }}
//                                 required
//                               >
//                                 <option value="traditional">Traditional</option>
//                                 <option value="modern">Modern</option>
//                                 <option value="bohemian">Bohemian</option>
//                                 <option value="transitional">
//                                   Transitional
//                                 </option>
//                                 <option value="vintage">Vintage</option>
//                                 <option value="contemporary">
//                                   Contemporary
//                                 </option>
//                                 <option value="minimalist">Minimalist</option>
//                                 <option value="coastal">Coastal</option>
//                               </select>
//                             </div>

//                             {/* Add Room Type dropdown */}
//                             <div>
//                               <label
//                                 className="block text-sm font-medium mb-2"
//                                 style={{ color: "#4A4947" }}
//                               >
//                                 Room Type
//                               </label>
//                               <select
//                                 name="roomType"
//                                 value={newProduct.roomType}
//                                 onChange={handleChange}
//                                 className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-all duration-300 focus:border-4A4947"
//                                 style={{
//                                   borderColor: "#D8D2C2",
//                                   backgroundColor: "white",
//                                 }}
//                                 required
//                               >
//                                 <option value="living-room">Living Room</option>
//                                 <option value="bedroom">Bedroom</option>
//                                 <option value="dining-room">Dining Room</option>
//                                 <option value="office">Office</option>
//                                 <option value="hallway">Hallway</option>
//                                 <option value="outdoor">Outdoor</option>
//                               </select>
//                             </div>

//                             {/* Add Pattern dropdown */}
//                             <div>
//                               <label
//                                 className="block text-sm font-medium mb-2"
//                                 style={{ color: "#4A4947" }}
//                               >
//                                 Pattern
//                               </label>
//                               <select
//                                 name="pattern"
//                                 value={newProduct.pattern}
//                                 onChange={handleChange}
//                                 className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-all duration-300 focus:border-4A4947"
//                                 style={{
//                                   borderColor: "#D8D2C2",
//                                   backgroundColor: "white",
//                                 }}
//                                 required
//                               >
//                                 <option value="solid">Solid</option>
//                                 <option value="geometric">Geometric</option>
//                                 <option value="floral">Floral</option>
//                                 <option value="abstract">Abstract</option>
//                                 <option value="striped">Striped</option>
//                                 <option value="oriental">Oriental</option>
//                               </select>
//                             </div>

//                             <div>
//                               <input
//                                 type="text"
//                                 name="material"
//                                 placeholder="Material"
//                                 className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-all duration-300 focus:border-4A4947"
//                                 style={{
//                                   borderColor: "#D8D2C2",
//                                   backgroundColor: "white",
//                                 }}
//                                 onChange={handleChange}
//                                 value={newProduct.material}
//                                 required
//                               />
//                             </div>
//                             <div>
//                               <input
//                                 type="file"
//                                 multiple
//                                 accept="image/*"
//                                 onChange={handleFileChange}
//                               />
//                             </div>
//                             <div>
//                               <input
//                                 type="number"
//                                 name="stock"
//                                 placeholder="Stock"
//                                 className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-all duration-300 focus:border-4A4947"
//                                 style={{
//                                   borderColor: "#D8D2C2",
//                                   backgroundColor: "white",
//                                 }}
//                                 onChange={handleChange}
//                                 value={newProduct.stock}
//                                 required
//                               />
//                             </div>
//                             <div className="md:col-span-2 mt-4">
//                               <button
//                                 type="submit"
//                                 className="w-full py-4 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:translate-y-1"
//                                 style={{
//                                   backgroundColor: "#4A4947",
//                                   color: "#FAF7F0",
//                                 }}
//                               >
//                                 Add Product
//                               </button>
//                             </div>
//                           </form>
//                         </div>
//                       </motion.div>
//                     )}
//                   </AnimatePresence>

//                   {/* Products List */}
//                   <motion.div
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     transition={{ delay: 0.4 }}
//                   >
//                     <h3
//                       className="text-2xl font-semibold mb-6"
//                       style={{ color: "#4A4947" }}
//                     >
//                       Your Products
//                     </h3>

//                     {products.length > 0 ? (
//                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                         {products.map((product, index) => (
//                           <motion.div
//                             key={product._id}
//                             initial={{ opacity: 0, y: 20 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             transition={{ delay: 0.1 * index }}
//                             className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
//                             style={{ backgroundColor: "white" }}
//                           >
//                             <div
//                               className="h-48 bg-gray-200 flex items-center justify-center"
//                               style={{ backgroundColor: "#D8D2C2" }}
//                             >
//                               {console.log(product.images)}
//                               {product.images && product.images.length > 0 ? (
//                                 <img
//                                   src={`http://localhost:5000${product.images[0]}`}
//                                   alt={product.name}
//                                   className="w-full h-full object-cover"
//                                 />
//                               ) : (
//                                 <div
//                                   className="text-4xl font-light"
//                                   style={{ color: "#4A4947" }}
//                                 >
//                                   No Image
//                                 </div>
//                               )}
//                             </div>
//                             <div className="p-6">
//                               <div className="flex justify-between items-center mb-2">
//                                 <h4
//                                   className="text-xl font-bold truncate"
//                                   style={{ color: "#4A4947" }}
//                                 >
//                                   {product.name}
//                                 </h4>
//                                 <span
//                                   className="text-lg font-bold"
//                                   style={{ color: "#4A4947" }}
//                                 >
//                                   ${product.price}
//                                 </span>
//                               </div>
//                               <p className="text-gray-600 text-sm mb-4 line-clamp-2">
//                                 {product.description}
//                               </p>
//                               <div className="flex flex-wrap gap-2">
//                                 <span
//                                   className="px-3 py-1 text-xs rounded-full"
//                                   style={{
//                                     backgroundColor: "#D8D2C2",
//                                     color: "#4A4947",
//                                   }}
//                                 >
//                                   {product.size}
//                                 </span>
//                                 <span
//                                   className="px-3 py-1 text-xs rounded-full"
//                                   style={{
//                                     backgroundColor: "#D8D2C2",
//                                     color: "#4A4947",
//                                   }}
//                                 >
//                                   {product.color}
//                                 </span>
//                                 <span
//                                   className="px-3 py-1 text-xs rounded-full"
//                                   style={{
//                                     backgroundColor: "#D8D2C2",
//                                     color: "#4A4947",
//                                   }}
//                                 >
//                                   {product.material}
//                                 </span>
//                               </div>
//                               <div className="flex justify-between items-center mt-4">
//                                 <span className="text-sm">
//                                   Stock: {product.stock}
//                                 </span>
//                                 <span
//                                   className={`px-3 py-1 text-xs rounded-full text-white ${getStatusColor(
//                                     product.status
//                                   )}`}
//                                 >
//                                   {product.status || "pending"}
//                                 </span>
//                               </div>
//                             </div>
//                           </motion.div>
//                         ))}
//                       </div>
//                     ) : (
//                       <motion.div
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         className="bg-white rounded-lg p-8 text-center shadow-md"
//                         style={{ backgroundColor: "white" }}
//                       >
//                         <p className="text-lg" style={{ color: "#4A4947" }}>
//                           No products added yet.
//                         </p>
//                         <button
//                           onClick={() => setIsFormVisible(true)}
//                           className="mt-4 px-6 py-2 rounded-lg transition-all duration-300"
//                           style={{
//                             backgroundColor: "#D8D2C2",
//                             color: "#4A4947",
//                           }}
//                         >
//                           Add Your First Product
//                         </button>
//                       </motion.div>
//                     )}
//                   </motion.div>
//                 </motion.div>
//               )}
//               {activeTab === "orders" && (
//                 <motion.div
//                   key="orders"
//                   initial={{ opacity: 0, x: 20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   exit={{ opacity: 0, x: -20 }}
//                   transition={{ duration: 0.3 }}
//                   className="mt-8"
//                 >
//                   <ProviderOrders user={provider} />{" "}
//                   {/* Pass provider data as prop */}
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </div>
//         </div>
//       ) : (
//         <div className="fixed inset-0 flex items-center justify-center">
//           <motion.div
//             className="h-16 w-16 rounded-full border-t-4 border-b-4 border-4A4947"
//             animate={{ rotate: 360 }}
//             transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//             style={{ borderColor: "#4A4947" }}
//           />
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProviderProfile;
import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import ProviderOrders from "./ProviderOrders";
import { useNavigate } from "react-router-dom";

const ProviderProfile = () => {
  const [provider, setProvider] = useState(null);
  const [products, setProducts] = useState([]);
  // const [newProduct, setNewProduct] = useState({
  //   name: "",
  //   description: "",
  //   price: "",
  //   category: "carpet",
  //   size: "",
  //   colors: ["#000000"],
  //   material: "",
  //   images: [],
  //   stock: 1,
  //   style: "traditional",
  //   roomType: "living-room",
  //   pattern: "solid",
  // });

  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    basePrice: "",
    category: "carpet",
    style: "traditional",
    roomType: "living-room",
    pattern: "solid",
    material: "",
    images: [],
    tags: [], // New field for tags
    hasVariants: false, // New field for variants
  });
  const [isFormVisible, setIsFormVisible] = useState(false);
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
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [isEditFormVisible, setIsEditFormVisible] = useState(false);
  const navigate = useNavigate();

  // Enhanced provider data fetching
  useEffect(() => {
    const fetchProviderData = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get("http://localhost:5000/api/users/user", {
          withCredentials: true,
        });

        if (res.data.role === "provider") {
          setProvider(res.data);
          setEditForm((prev) => ({ ...prev, name: res.data.name }));
          await fetchProducts(res.data.id || res.data._id);
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.error("Error fetching provider data:", error);
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };

    const fetchProducts = async (providerId) => {
      try {
        console.log("Fetching products for provider:", providerId);
        const res = await axios.get(
          `http://localhost:5000/api/products/provider/${providerId}`
        );
        console.log("Products fetched:", res.data);
        setProducts(res.data);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      }
    };

    fetchProviderData();
  }, [navigate]);

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
    setEditError("");
  };
  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name || "",
      description: product.description || "",
      price: product.price || product.basePrice || "",
      category: product.category || "carpet",
      size: product.size || "",
      colors:
        product.colors && product.colors.length > 0
          ? product.colors
          : ["#000000"],
      material: product.material || "",
      images: [],
      stock: product.stock || product.stockQuantity || 1,
      style: product.style || "traditional",
      roomType: product.roomType || "living-room",
      pattern: product.pattern || "solid",
    });
    setIsEditFormVisible(true);
    setIsFormVisible(false); // Hide add form if open
  };

  // Update product handler
  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      setFormError("");
      setFormSuccess("");

      const formData = new FormData();
      formData.append("name", newProduct.name);
      formData.append("description", newProduct.description);
      formData.append("price", newProduct.price);
      formData.append("category", newProduct.category);
      formData.append("size", newProduct.size);
      formData.append("material", newProduct.material);
      formData.append("stock", newProduct.stock);
      formData.append("style", newProduct.style);
      formData.append("roomType", newProduct.roomType);
      formData.append("pattern", newProduct.pattern);

      // Append colors
      newProduct.colors.forEach((color) => {
        formData.append("colors", color);
      });

      // Append new images if any
      if (newProduct.images && newProduct.images.length > 0) {
        for (let i = 0; i < newProduct.images.length; i++) {
          formData.append("images", newProduct.images[i]);
        }
      }

      const res = await axios.put(
        `http://localhost:5000/api/products/${editingProduct.id}`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      // Update the product in the list
      setProducts((prev) =>
        prev.map((p) => (p.id === editingProduct.id ? res.data : p))
      );

      setFormSuccess("Product updated successfully!");
      setIsEditFormVisible(false);
      setEditingProduct(null);

      // Reset form
      setNewProduct({
        name: "",
        description: "",
        price: "",
        category: "carpet",
        size: "",
        colors: ["#000000"],
        material: "",
        images: [],
        stock: 1,
        style: "traditional",
        roomType: "living-room",
        pattern: "solid",
      });

      setTimeout(() => setFormSuccess(""), 5000);
    } catch (error) {
      console.error("Error updating product:", error);
      setFormError(error.response?.data?.message || "Failed to update product");
    }
  };

  // Cancel edit
  const handleCancelEdit = () => {
    setIsEditFormVisible(false);
    setEditingProduct(null);
    setNewProduct({
      name: "",
      description: "",
      price: "",
      category: "carpet",
      size: "",
      colors: ["#000000"],
      material: "",
      images: [],
      stock: 1,
      style: "traditional",
      roomType: "living-room",
      pattern: "solid",
    });
  };
  const handleUpdateProfile = async () => {
    try {
      if (
        editForm.newPassword &&
        editForm.newPassword !== editForm.confirmPassword
      ) {
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

      setProvider(response.data.user);
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

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setNewProduct({ ...newProduct, [name]: value });
  //   setFormError("");
  // };
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setNewProduct({ ...newProduct, [name]: checked });
    } else if (name === "tags") {
      // Handle tags as comma-separated values
      const tagsArray = value
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag);
      setNewProduct({ ...newProduct, tags: tagsArray });
    } else {
      setNewProduct({ ...newProduct, [name]: value });
    }
  };
  const handleAddColor = () => {
    if (newProduct.colors.length < 5) {
      setNewProduct({
        ...newProduct,
        colors: [...newProduct.colors, "#000000"],
      });
    }
  };

  const handleRemoveColor = (index) => {
    if (newProduct.colors.length > 1) {
      const updatedColors = newProduct.colors.filter((_, i) => i !== index);
      setNewProduct({ ...newProduct, colors: updatedColors });
    }
  };

  const handleColorChange = (index, value) => {
    const updatedColors = [...newProduct.colors];
    updatedColors[index] = value;
    setNewProduct({ ...newProduct, colors: updatedColors });
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 5) {
      setFormError("Maximum 5 images allowed");
      return;
    }
    setNewProduct({ ...newProduct, images: e.target.files });
    setFormError("");
  };

  // Enhanced product addition with better error handling
  // const handleAddProduct = async (e) => {
  //   e.preventDefault();
  //   try {
  //     setFormError("");
  //     setFormSuccess("");

  //     // Validation
  //     if (!newProduct.name.trim()) {
  //       setFormError("Product name is required");
  //       return;
  //     }
  //     if (!newProduct.price || parseFloat(newProduct.price) <= 0) {
  //       setFormError("Valid price is required");
  //       return;
  //     }
  //     if (!newProduct.images || newProduct.images.length === 0) {
  //       setFormError("At least one image is required");
  //       return;
  //     }

  //     const formData = new FormData();
  //     formData.append("name", newProduct.name);
  //     formData.append("description", newProduct.description);
  //     formData.append("price", newProduct.price);
  //     formData.append("category", newProduct.category);
  //     formData.append("size", newProduct.size);
  //     formData.append("material", newProduct.material);
  //     formData.append("stock", newProduct.stock);
  //     formData.append("style", newProduct.style);
  //     formData.append("roomType", newProduct.roomType);
  //     formData.append("pattern", newProduct.pattern);

  //     // Append colors
  //     newProduct.colors.forEach((color) => {
  //       formData.append("colors", color);
  //     });

  //     // Append images
  //     for (let i = 0; i < newProduct.images.length; i++) {
  //       formData.append("images", newProduct.images[i]);
  //     }

  //     const res = await axios.post(
  //       "http://localhost:5000/api/products/add",
  //       formData,
  //       {
  //         withCredentials: true,
  //         headers: { "Content-Type": "multipart/form-data" },
  //       }
  //     );

  //     // Add the new product to the list
  //     setProducts((prev) => [res.data, ...prev]);

  //     // Reset form
  //     setNewProduct({
  //       name: "",
  //       description: "",
  //       price: "",
  //       category: "carpet",
  //       size: "",
  //       colors: ["#000000"],
  //       material: "",
  //       images: [],
  //       stock: 1,
  //       style: "traditional",
  //       roomType: "living-room",
  //       pattern: "solid",
  //     });

  //     setFormSuccess("Product added successfully! Waiting for admin approval.");
  //     setIsFormVisible(false);

  //     // Hide success message after 5 seconds
  //     setTimeout(() => setFormSuccess(""), 5000);
  //   } catch (error) {
  //     console.error("Error adding product:", error);
  //     setFormError(error.response?.data?.message || "Failed to add product");
  //   }
  // };
  // const handleAddProduct = async (e) => {
  //   e.preventDefault();
  //   try {
  //     setFormError("");
  //     setFormSuccess("");

  //     console.log("=== ADD PRODUCT CLIENT SIDE ===");
  //     console.log("Form data:", newProduct);
  //     console.log("Images:", newProduct.images);

  //     // Enhanced validation
  //     if (!newProduct.name.trim()) {
  //       setFormError("Product name is required");
  //       return;
  //     }
  //     if (!newProduct.price || parseFloat(newProduct.price) <= 0) {
  //       setFormError("Valid price is required");
  //       return;
  //     }
  //     if (!newProduct.description.trim()) {
  //       setFormError("Product description is required");
  //       return;
  //     }
  //     if (!newProduct.size.trim()) {
  //       setFormError("Product size is required");
  //       return;
  //     }
  //     if (!newProduct.material.trim()) {
  //       setFormError("Product material is required");
  //       return;
  //     }
  //     if (!newProduct.stock || parseInt(newProduct.stock) <= 0) {
  //       setFormError("Valid stock quantity is required");
  //       return;
  //     }

  //     const formData = new FormData();

  //     // Append all fields
  //     formData.append("name", newProduct.name.trim());
  //     formData.append("description", newProduct.description.trim());
  //     formData.append("price", newProduct.price);
  //     formData.append("category", newProduct.category);
  //     formData.append("size", newProduct.size.trim());
  //     formData.append("material", newProduct.material.trim());
  //     formData.append("stock", newProduct.stock);
  //     formData.append("style", newProduct.style);
  //     formData.append("roomType", newProduct.roomType);
  //     formData.append("pattern", newProduct.pattern);

  //     // Append colors
  //     newProduct.colors.forEach((color) => {
  //       formData.append("colors", color);
  //     });

  //     // Append images if any
  //     if (newProduct.images && newProduct.images.length > 0) {
  //       for (let i = 0; i < newProduct.images.length; i++) {
  //         console.log("Appending image:", newProduct.images[i]);
  //         formData.append("images", newProduct.images[i]);
  //       }
  //     } else {
  //       console.log("No images selected");
  //     }

  //     // Log FormData contents (for debugging)
  //     console.log("FormData entries:");
  //     for (let [key, value] of formData.entries()) {
  //       console.log(key, value);
  //     }

  //     console.log("Sending request to server...");

  //     const res = await axios.post(
  //       "http://localhost:5000/api/products/add",
  //       formData,
  //       {
  //         withCredentials: true,
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //         },
  //         timeout: 30000, // 30 second timeout
  //       }
  //     );

  //     console.log("✅ Product added successfully:", res.data);

  //     // Add the new product to the list
  //     setProducts((prev) => [res.data, ...prev]);

  //     // Reset form
  //     setNewProduct({
  //       name: "",
  //       description: "",
  //       price: "",
  //       category: "carpet",
  //       size: "",
  //       colors: ["#000000"],
  //       material: "",
  //       images: [],
  //       stock: 1,
  //       style: "traditional",
  //       roomType: "living-room",
  //       pattern: "solid",
  //     });

  //     setFormSuccess("Product added successfully! Waiting for admin approval.");
  //     setIsFormVisible(false);

  //     // Hide success message after 5 seconds
  //     setTimeout(() => setFormSuccess(""), 5000);
  //   } catch (error) {
  //     console.error("❌ Error adding product:", error);
  //     console.error("Error response:", error.response?.data);

  //     const errorMessage =
  //       error.response?.data?.message ||
  //       error.response?.data?.error ||
  //       "Failed to add product. Please check all fields and try again.";

  //     setFormError(errorMessage);

  //     // Auto-hide error after 10 seconds
  //     setTimeout(() => setFormError(""), 10000);
  //   }
  // };
  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      setFormError("");
      setFormSuccess("");

      console.log("=== ADD PRODUCT ===");
      console.log("Form data:", newProduct);

      // Enhanced validation
      if (!newProduct.name.trim()) {
        setFormError("Product name is required");
        return;
      }
      if (!newProduct.basePrice || parseFloat(newProduct.basePrice) <= 0) {
        setFormError("Valid base price is required");
        return;
      }
      if (!newProduct.description.trim()) {
        setFormError("Product description is required");
        return;
      }
      if (!newProduct.material.trim()) {
        setFormError("Product material is required");
        return;
      }
      if (!newProduct.images || newProduct.images.length === 0) {
        setFormError("At least one product image is required");
        return;
      }

      const formData = new FormData();

      // Append all fields according to the model - FIXED
      formData.append("name", newProduct.name.trim());
      formData.append("description", newProduct.description.trim());
      formData.append("basePrice", newProduct.basePrice.toString()); // Ensure it's a string
      formData.append("category", newProduct.category);
      formData.append("material", newProduct.material.trim());
      formData.append("style", newProduct.style);
      formData.append("roomType", newProduct.roomType);
      formData.append("pattern", newProduct.pattern);
      formData.append("hasVariants", newProduct.hasVariants.toString());

      // Append tags as array (only if tags exist)
      if (newProduct.tags && newProduct.tags.length > 0) {
        newProduct.tags.forEach((tag) => {
          if (tag.trim()) {
            // Only append non-empty tags
            formData.append("tags", tag.trim());
          }
        });
      }

      // Append images
      for (let i = 0; i < newProduct.images.length; i++) {
        formData.append("images", newProduct.images[i]);
      }

      // Debug: Log all form data entries
      console.log("FormData entries:");
      for (let [key, value] of formData.entries()) {
        console.log(key + ":", value);
      }

      console.log("Sending form data to server...");

      const res = await axios.post(
        "http://localhost:5000/api/products/add",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log("✅ Product added successfully:", res.data);

      // Add the new product to the list
      setProducts((prev) => [res.data, ...prev]);

      // Reset form
      setNewProduct({
        name: "",
        description: "",
        basePrice: "",
        category: "carpet",
        style: "traditional",
        roomType: "living-room",
        pattern: "solid",
        material: "",
        images: [],
        tags: [],
        hasVariants: false,
      });

      setFormSuccess("Product added successfully! Waiting for admin approval.");
      setIsFormVisible(false);

      setTimeout(() => setFormSuccess(""), 5000);
    } catch (error) {
      console.error("❌ Error adding product:", error);
      console.error("Error response:", error.response?.data);

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to add product. Please check all fields and try again.";

      setFormError(errorMessage);

      setTimeout(() => setFormError(""), 10000);
    }
  };
  // Enhanced product deletion
  // const handleDeleteProduct = async (productId) => {
  //   if (window.confirm("Are you sure you want to delete this product?")) {
  //     try {
  //       await axios.delete(`http://localhost:5000/api/products/${productId}`, {
  //         withCredentials: true,
  //       });
  //       setProducts((prev) => prev.filter((p) => p.id !== productId));
  //     } catch (error) {
  //       console.error("Error deleting product:", error);
  //       alert("Failed to delete product");
  //     }
  //   }
  // };
  const handleDeleteProduct = async (productId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this product? This action cannot be undone."
      )
    ) {
      try {
        await axios.delete(`http://localhost:5000/api/products/${productId}`, {
          withCredentials: true,
        });
        setProducts((prev) => prev.filter((p) => p.id !== productId));
        setFormSuccess("Product deleted successfully!");
        setTimeout(() => setFormSuccess(""), 5000);
      } catch (error) {
        console.error("Error deleting product:", error);
        setFormError(
          error.response?.data?.message || "Failed to delete product"
        );
      }
    }
  };
  // Enhanced status display
  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-500 text-white";
      case "pending":
        return "bg-yellow-500 text-white";
      case "rejected":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "approved":
        return "Approved";
      case "pending":
        return "Pending Review";
      case "rejected":
        return "Rejected";
      default:
        return status || "Pending";
    }
  };

  // Calculate statistics
  const stats = {
    total: products.length,
    approved: products.filter((p) => p.status === "approved").length,
    pending: products.filter((p) => p.status === "pending").length,
    rejected: products.filter((p) => p.status === "rejected").length,
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
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
      {/* Success Notification */}
      {formSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-5 right-5 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50"
        >
          {formSuccess}
        </motion.div>
      )}

      {/* Error Notification */}
      {formError && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-5 right-5 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50"
        >
          {formError}
        </motion.div>
      )}

      {provider ? (
        <div className="min-h-screen">
          {/* Header Section */}
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
                  {provider.name.charAt(0).toUpperCase()}
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
                    {provider.name}'s Studio
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
                      <span style={{ color: "#4A4947" }}>{provider.email}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm font-medium mr-2 text-gray-500">
                        Phone:
                      </span>
                      <span style={{ color: "#4A4947" }}>
                        {provider.phone || "Not provided"}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm font-medium mr-2 text-gray-500">
                        Address:
                      </span>
                      <span style={{ color: "#4A4947" }}>
                        {provider.address || "Not provided"}
                      </span>
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
                    onClick={() => setActiveTab("products")}
                    className={`px-4 py-2 rounded-full transition-all duration-300 ${
                      activeTab === "products"
                        ? "bg-4A4947 text-white"
                        : "bg-d8d2c2 text-4A4947"
                    }`}
                    style={{
                      backgroundColor:
                        activeTab === "products" ? "#4A4947" : "#D8D2C2",
                      color: activeTab === "products" ? "#FAF7F0" : "#4A4947",
                    }}
                  >
                    Products ({products.length})
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
                      Business Overview
                    </h3>

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                      <div className="bg-white p-4 rounded-lg shadow text-center">
                        <div className="text-2xl font-bold text-[#4A4947]">
                          {stats.total}
                        </div>
                        <div className="text-sm text-gray-600">
                          Total Products
                        </div>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {stats.approved}
                        </div>
                        <div className="text-sm text-gray-600">Approved</div>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow text-center">
                        <div className="text-2xl font-bold text-yellow-600">
                          {stats.pending}
                        </div>
                        <div className="text-sm text-gray-600">Pending</div>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow text-center">
                        <div className="text-2xl font-bold text-red-600">
                          {stats.rejected}
                        </div>
                        <div className="text-sm text-gray-600">Rejected</div>
                      </div>
                    </div>

                    {/* Profile Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white p-6 rounded-lg shadow">
                        <p className="text-sm font-medium text-gray-500">
                          Email
                        </p>
                        <p className="text-lg font-semibold mt-2 text-[#4A4947]">
                          {provider.email}
                        </p>
                      </div>
                      <div className="bg-white p-6 rounded-lg shadow">
                        <p className="text-sm font-medium text-gray-500">
                          Phone
                        </p>
                        <p className="text-lg font-semibold mt-2 text-[#4A4947]">
                          {provider.phone || "Not provided"}
                        </p>
                      </div>
                      <div className="bg-white p-6 rounded-lg shadow md:col-span-2">
                        <p className="text-sm font-medium text-gray-500">
                          Address
                        </p>
                        <p className="text-lg font-semibold mt-2 text-[#4A4947]">
                          {provider.address || "Not provided"}
                        </p>
                      </div>
                    </div>

                    {/* Account Settings */}
                    <div className="mt-8 bg-white p-6 rounded-xl shadow">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-[#4A4947]">
                          Account Settings
                        </h3>
                        {!isEditing ? (
                          <button
                            onClick={() => setIsEditing(true)}
                            className="px-4 py-2 rounded-lg bg-[#4A4947] text-white"
                          >
                            Edit Profile
                          </button>
                        ) : (
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setIsEditing(false);
                                setEditError("");
                                setEditForm({
                                  ...editForm,
                                  currentPassword: "",
                                  newPassword: "",
                                  confirmPassword: "",
                                });
                              }}
                              className="px-4 py-2 rounded-lg border border-[#4A4947] text-[#4A4947]"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={handleUpdateProfile}
                              className="px-4 py-2 rounded-lg bg-[#4A4947] text-white"
                            >
                              Save Changes
                            </button>
                          </div>
                        )}
                      </div>

                      {isEditing ? (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium mb-1 text-[#4A4947]">
                              Name
                            </label>
                            <input
                              type="text"
                              name="name"
                              value={editForm.name}
                              onChange={handleEditChange}
                              className="w-full px-4 py-2 rounded-lg border border-[#D8D2C2]"
                            />
                          </div>

                          <div className="pt-4 border-t border-gray-200">
                            <h4 className="text-sm font-medium mb-3 text-[#4A4947]">
                              Change Password
                            </h4>
                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium mb-1 text-[#4A4947]">
                                  Current Password
                                </label>
                                <input
                                  type="password"
                                  name="currentPassword"
                                  value={editForm.currentPassword}
                                  onChange={handleEditChange}
                                  className="w-full px-4 py-2 rounded-lg border border-[#D8D2C2]"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium mb-1 text-[#4A4947]">
                                  New Password
                                </label>
                                <input
                                  type="password"
                                  name="newPassword"
                                  value={editForm.newPassword}
                                  onChange={handleEditChange}
                                  className="w-full px-4 py-2 rounded-lg border border-[#D8D2C2]"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium mb-1 text-[#4A4947]">
                                  Confirm New Password
                                </label>
                                <input
                                  type="password"
                                  name="confirmPassword"
                                  value={editForm.confirmPassword}
                                  onChange={handleEditChange}
                                  className="w-full px-4 py-2 rounded-lg border border-[#D8D2C2]"
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
                          <p className="text-[#4A4947]">
                            <span className="font-medium">Name:</span>{" "}
                            {provider.name}
                          </p>
                          <p className="text-[#4A4947]">
                            <span className="font-medium">Email:</span>{" "}
                            {provider.email}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-center mt-8">
                      <button
                        onClick={() => setActiveTab("products")}
                        className="px-6 py-3 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:translate-y-1 bg-[#4A4947] text-white"
                      >
                        Manage Products
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "products" && (
                <motion.div
                  key="products"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="mt-8"
                >
                  {/* Add Product Button */}
                  <motion.div
                    className="flex justify-between items-center mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h3 className="text-2xl font-semibold text-[#4A4947]">
                      Your Products
                    </h3>
                    <button
                      onClick={() => setIsFormVisible(!isFormVisible)}
                      className="flex items-center px-6 py-3 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl bg-[#4A4947] text-white"
                    >
                      <span className="mr-2">
                        {isFormVisible ? "Cancel" : "Add New Product"}
                      </span>
                      <span>{isFormVisible ? "×" : "+"}</span>
                    </button>
                  </motion.div>

                  {/* Add Product Form */}
                  {/* Add Product Form */}
                  <AnimatePresence>
                    {isFormVisible && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="bg-white rounded-2xl shadow-xl p-8 mb-10">
                          <h3 className="text-2xl font-semibold mb-6 text-[#4A4947]">
                            Add New Product
                          </h3>

                          <form
                            onSubmit={handleAddProduct}
                            className="grid grid-cols-1 md:grid-cols-2 gap-6"
                          >
                            {/* Product Name */}
                            <div className="group">
                              <label className="block text-sm font-medium mb-2 text-[#4A4947]">
                                Product Name *
                              </label>
                              <input
                                type="text"
                                name="name"
                                placeholder="Enter product name"
                                className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-all duration-300 focus:border-[#4A4947] border-[#D8D2C2] bg-white"
                                onChange={handleChange}
                                value={newProduct.name}
                                required
                              />
                            </div>

                            {/* Base Price */}
                            <div>
                              <label className="block text-sm font-medium mb-2 text-[#4A4947]">
                                Base Price ($) *
                              </label>
                              <input
                                type="number"
                                name="basePrice"
                                placeholder="0.00"
                                step="0.01"
                                min="0"
                                className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-all duration-300 focus:border-[#4A4947] border-[#D8D2C2] bg-white"
                                onChange={handleChange}
                                value={newProduct.basePrice}
                                required
                              />
                            </div>

                            {/* Description */}
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium mb-2 text-[#4A4947]">
                                Description *
                              </label>
                              <textarea
                                name="description"
                                placeholder="Describe your product in detail..."
                                className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-all duration-300 focus:border-[#4A4947] border-[#D8D2C2] bg-white"
                                rows="4"
                                onChange={handleChange}
                                value={newProduct.description}
                                required
                              ></textarea>
                            </div>

                            {/* Category */}
                            <div>
                              <label className="block text-sm font-medium mb-2 text-[#4A4947]">
                                Category *
                              </label>
                              <select
                                name="category"
                                value={newProduct.category}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-all duration-300 focus:border-[#4A4947] border-[#D8D2C2] bg-white"
                                required
                              >
                                <option value="carpet">Carpet</option>
                                <option value="accessory">Accessory</option>
                              </select>
                            </div>

                            {/* Material */}
                            <div>
                              <label className="block text-sm font-medium mb-2 text-[#4A4947]">
                                Material *
                              </label>
                              <input
                                type="text"
                                name="material"
                                placeholder="e.g., Wool, Silk, Synthetic"
                                className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-all duration-300 focus:border-[#4A4947] border-[#D8D2C2] bg-white"
                                onChange={handleChange}
                                value={newProduct.material}
                                required
                              />
                            </div>

                            {/* Style */}
                            <div>
                              <label className="block text-sm font-medium mb-2 text-[#4A4947]">
                                Style
                              </label>
                              <select
                                name="style"
                                value={newProduct.style}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-all duration-300 focus:border-[#4A4947] border-[#D8D2C2] bg-white"
                              >
                                <option value="traditional">Traditional</option>
                                <option value="modern">Modern</option>
                                <option value="bohemian">Bohemian</option>
                                <option value="transitional">
                                  Transitional
                                </option>
                                <option value="vintage">Vintage</option>
                                <option value="contemporary">
                                  Contemporary
                                </option>
                                <option value="minimalist">Minimalist</option>
                                <option value="coastal">Coastal</option>
                              </select>
                            </div>

                            {/* Room Type */}
                            <div>
                              <label className="block text-sm font-medium mb-2 text-[#4A4947]">
                                Room Type
                              </label>
                              <select
                                name="roomType"
                                value={newProduct.roomType}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-all duration-300 focus:border-[#4A4947] border-[#D8D2C2] bg-white"
                              >
                                <option value="living-room">Living Room</option>
                                <option value="bedroom">Bedroom</option>
                                <option value="dining-room">Dining Room</option>
                                <option value="office">Office</option>
                                <option value="hallway">Hallway</option>
                                <option value="outdoor">Outdoor</option>
                              </select>
                            </div>

                            {/* Pattern */}
                            <div>
                              <label className="block text-sm font-medium mb-2 text-[#4A4947]">
                                Pattern
                              </label>
                              <select
                                name="pattern"
                                value={newProduct.pattern}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-all duration-300 focus:border-[#4A4947] border-[#D8D2C2] bg-white"
                              >
                                <option value="solid">Solid</option>
                                <option value="geometric">Geometric</option>
                                <option value="floral">Floral</option>
                                <option value="abstract">Abstract</option>
                                <option value="striped">Striped</option>
                                <option value="oriental">Oriental</option>
                              </select>
                            </div>

                            {/* Tags */}
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium mb-2 text-[#4A4947]">
                                Tags
                              </label>
                              <input
                                type="text"
                                name="tags"
                                placeholder="e.g., handmade, premium, eco-friendly (separate with commas)"
                                className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-all duration-300 focus:border-[#4A4947] border-[#D8D2C2] bg-white"
                                onChange={handleChange}
                                value={newProduct.tags.join(", ")}
                              />
                              <p className="text-xs text-gray-500 mt-1">
                                Separate multiple tags with commas
                              </p>
                            </div>

                            {/* Has Variants */}
                            <div className="md:col-span-2">
                              <label className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  name="hasVariants"
                                  checked={newProduct.hasVariants}
                                  onChange={handleChange}
                                  className="rounded border-[#D8D2C2] text-[#4A4947] focus:ring-[#4A4947]"
                                />
                                <span className="text-sm font-medium text-[#4A4947]">
                                  This product has variants (different sizes,
                                  colors, etc.)
                                </span>
                              </label>
                              <p className="text-xs text-gray-500 mt-1">
                                If checked, you'll be able to add variants after
                                creating the product
                              </p>
                            </div>

                            {/* Product Images */}
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium mb-2 text-[#4A4947]">
                                Product Images *
                              </label>
                              <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleFileChange}
                                className="w-full px-4 py-3 rounded-lg border-2 border-[#D8D2C2] bg-white"
                                required
                              />
                              <p className="text-xs text-gray-500 mt-1">
                                Upload high-quality images of your product (max
                                5 images)
                              </p>
                            </div>

                            {/* Submit Button */}
                            <div className="md:col-span-2 mt-4">
                              <button
                                type="submit"
                                className="w-full py-4 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:translate-y-1 bg-[#4A4947] text-white font-semibold"
                              >
                                Add Product
                              </button>
                            </div>
                          </form>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {/* Edit Product Form */}
                  <AnimatePresence>
                    {isEditFormVisible && editingProduct && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="bg-white rounded-2xl shadow-xl p-8 mb-10 border-2 border-blue-200">
                          <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-semibold text-[#4A4947]">
                              Edit Product: {editingProduct.name}
                            </h3>
                            <button
                              onClick={handleCancelEdit}
                              className="px-4 py-2 rounded-lg border border-[#4A4947] text-[#4A4947] hover:bg-[#4A4947] hover:text-white transition-colors"
                            >
                              Cancel Edit
                            </button>
                          </div>

                          <form
                            onSubmit={handleUpdateProduct}
                            className="grid grid-cols-1 md:grid-cols-2 gap-6"
                          >
                            {/* Use the same form fields as add product, but with current values */}
                            <div>
                              <label className="block text-sm font-medium mb-2 text-[#4A4947]">
                                Product Name
                              </label>
                              <input
                                type="text"
                                name="name"
                                placeholder="Product Name"
                                className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-all duration-300 focus:border-[#4A4947] border-[#D8D2C2] bg-white"
                                onChange={handleChange}
                                value={newProduct.name}
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2 text-[#4A4947]">
                                Price
                              </label>
                              <input
                                type="number"
                                name="price"
                                placeholder="Price"
                                className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-all duration-300 focus:border-[#4A4947] border-[#D8D2C2] bg-white"
                                onChange={handleChange}
                                value={newProduct.price}
                                required
                                min="0"
                                step="0.01"
                              />
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium mb-2 text-[#4A4947]">
                                Description
                              </label>
                              <textarea
                                name="description"
                                placeholder="Description"
                                className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-all duration-300 focus:border-[#4A4947] border-[#D8D2C2] bg-white"
                                rows="3"
                                onChange={handleChange}
                                value={newProduct.description}
                                required
                              ></textarea>
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2 text-[#4A4947]">
                                Size
                              </label>
                              <input
                                type="text"
                                name="size"
                                placeholder="Size (e.g., 8x10 ft)"
                                className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-all duration-300 focus:border-[#4A4947] border-[#D8D2C2] bg-white"
                                onChange={handleChange}
                                value={newProduct.size}
                                required
                              />
                            </div>
                            <div className="flex flex-col">
                              <label className="mb-2 text-sm font-medium text-[#4A4947]">
                                Colors
                              </label>
                              <div className="flex flex-wrap gap-2">
                                {newProduct.colors.map((color, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center gap-1"
                                  >
                                    <input
                                      type="color"
                                      value={color}
                                      onChange={(e) =>
                                        handleColorChange(index, e.target.value)
                                      }
                                      className="h-8 w-8 cursor-pointer"
                                    />
                                    {newProduct.colors.length > 1 && (
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveColor(index)}
                                        className="text-red-500 hover:text-red-700"
                                      >
                                        ×
                                      </button>
                                    )}
                                  </div>
                                ))}
                                {newProduct.colors.length < 5 && (
                                  <button
                                    type="button"
                                    onClick={handleAddColor}
                                    className="flex items-center justify-center h-8 w-8 bg-[#D8D2C2] rounded hover:bg-[#4A4947] hover:text-white"
                                  >
                                    +
                                  </button>
                                )}
                              </div>
                            </div>
                            {/* Include all other form fields (style, roomType, pattern, material, stock) */}
                            <div>
                              <label className="block text-sm font-medium mb-2 text-[#4A4947]">
                                Style
                              </label>
                              <select
                                name="style"
                                value={newProduct.style}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-all duration-300 focus:border-[#4A4947] border-[#D8D2C2] bg-white"
                                required
                              >
                                <option value="traditional">Traditional</option>
                                <option value="modern">Modern</option>
                                <option value="bohemian">Bohemian</option>
                                <option value="transitional">
                                  Transitional
                                </option>
                                <option value="vintage">Vintage</option>
                                <option value="contemporary">
                                  Contemporary
                                </option>
                                <option value="minimalist">Minimalist</option>
                                <option value="coastal">Coastal</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2 text-[#4A4947]">
                                Room Type
                              </label>
                              <select
                                name="roomType"
                                value={newProduct.roomType}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-all duration-300 focus:border-[#4A4947] border-[#D8D2C2] bg-white"
                                required
                              >
                                <option value="living-room">Living Room</option>
                                <option value="bedroom">Bedroom</option>
                                <option value="dining-room">Dining Room</option>
                                <option value="office">Office</option>
                                <option value="hallway">Hallway</option>
                                <option value="outdoor">Outdoor</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2 text-[#4A4947]">
                                Pattern
                              </label>
                              <select
                                name="pattern"
                                value={newProduct.pattern}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-all duration-300 focus:border-[#4A4947] border-[#D8D2C2] bg-white"
                                required
                              >
                                <option value="solid">Solid</option>
                                <option value="geometric">Geometric</option>
                                <option value="floral">Floral</option>
                                <option value="abstract">Abstract</option>
                                <option value="striped">Striped</option>
                                <option value="oriental">Oriental</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2 text-[#4A4947]">
                                Material
                              </label>
                              <input
                                type="text"
                                name="material"
                                placeholder="Material"
                                className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-all duration-300 focus:border-[#4A4947] border-[#D8D2C2] bg-white"
                                onChange={handleChange}
                                value={newProduct.material}
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2 text-[#4A4947]">
                                Update Images (Optional)
                              </label>
                              <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleFileChange}
                                className="w-full"
                              />
                              <p className="text-xs text-gray-500 mt-1">
                                Leave empty to keep current images
                              </p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2 text-[#4A4947]">
                                Stock Quantity
                              </label>
                              <input
                                type="number"
                                name="stock"
                                placeholder="Stock Quantity"
                                className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-all duration-300 focus:border-[#4A4947] border-[#D8D2C2] bg-white"
                                onChange={handleChange}
                                value={newProduct.stock}
                                required
                                min="1"
                              />
                            </div>
                            <div className="md:col-span-2 mt-4">
                              <button
                                type="submit"
                                className="w-full py-4 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:translate-y-1 bg-blue-600 text-white"
                              >
                                Update Product
                              </button>
                            </div>
                          </form>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Products List */}
                  {/* <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    {products.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map((product, index) => (
                          <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * index }}
                            className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                          >
                            <div className="h-48 bg-gray-200 flex items-center justify-center">
                              {product.images && product.images.length > 0 ? (
                                <img
                                  src={`http://localhost:5000${product.images[0]}`}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.src =
                                      "https://via.placeholder.com/300x200/D8D2C2/4A4947?text=No+Image";
                                  }}
                                />
                              ) : (
                                <div className="text-4xl font-light text-[#4A4947]">
                                  No Image
                                </div>
                              )}
                            </div>
                            <div className="p-6">
                              <div className="flex justify-between items-center mb-2">
                                <h4 className="text-xl font-bold truncate text-[#4A4947]">
                                  {product.name}
                                </h4>
                                <span className="text-lg font-bold text-[#4A4947]">
                                  ${product.price}
                                </span>
                              </div>
                              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                {product.description}
                              </p>
                              <div className="flex flex-wrap gap-2 mb-3">
                                <span className="px-3 py-1 text-xs rounded-full bg-[#D8D2C2] text-[#4A4947]">
                                  {product.size}
                                </span>
                                <span className="px-3 py-1 text-xs rounded-full bg-[#D8D2C2] text-[#4A4947]">
                                  {product.material}
                                </span>
                                <span className="px-3 py-1 text-xs rounded-full bg-[#D8D2C2] text-[#4A4947]">
                                  {product.style}
                                </span>
                              </div>
                              <div className="flex justify-between items-center mt-4">
                                <span className="text-sm text-gray-600">
                                  Stock:{" "}
                                  {product.stock || product.stockQuantity}
                                </span>
                                <span
                                  className={`px-3 py-1 text-xs rounded-full ${getStatusColor(
                                    product.status
                                  )}`}
                                >
                                  {getStatusText(product.status)}
                                </span>
                              </div>
                              <div className="mt-3 flex gap-2">
                                <button
                                  onClick={() =>
                                    handleDeleteProduct(product.id)
                                  }
                                  className="flex-1 py-2 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                                >
                                  Delete
                                </button>
                                <button className="flex-1 py-2 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                                  Edit
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-white rounded-lg p-8 text-center shadow-md"
                      >
                        <p className="text-lg text-[#4A4947]">
                          No products added yet.
                        </p>
                        <button
                          onClick={() => setIsFormVisible(true)}
                          className="mt-4 px-6 py-2 rounded-lg transition-all duration-300 bg-[#D8D2C2] text-[#4A4947] hover:bg-[#4A4947] hover:text-white"
                        >
                          Add Your First Product
                        </button>
                      </motion.div>
                    )}
                  </motion.div> */}
                  {/* Products List */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    {products.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map((product, index) => (
                          <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * index }}
                            className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                          >
                            <div className="h-48 bg-gray-200 flex items-center justify-center">
                              {product.images && product.images.length > 0 ? (
                                <img
                                  src={`http://localhost:5000${product.images[0]}`}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.src =
                                      "https://via.placeholder.com/300x200/D8D2C2/4A4947?text=No+Image";
                                  }}
                                />
                              ) : (
                                <div className="text-4xl font-light text-[#4A4947]">
                                  No Image
                                </div>
                              )}
                            </div>

                            <div className="p-6">
                              {/* Product Header with Price */}
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="text-xl font-bold text-[#4A4947] flex-1 mr-2">
                                  {product.name}
                                </h4>
                                <span className="text-lg font-bold text-green-600 whitespace-nowrap">
                                  ${product.price || product.basePrice || "N/A"}
                                </span>
                              </div>

                              {/* Product Description */}
                              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                {product.description}
                              </p>

                              {/* Product Details Grid */}
                              <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                                <div>
                                  <span className="font-medium text-gray-500">
                                    Size:
                                  </span>
                                  <span className="ml-1 text-[#4A4947]">
                                    {product.size || "N/A"}
                                  </span>
                                </div>
                                <div>
                                  <span className="font-medium text-gray-500">
                                    Material:
                                  </span>
                                  <span className="ml-1 text-[#4A4947]">
                                    {product.material || "N/A"}
                                  </span>
                                </div>
                                <div>
                                  <span className="font-medium text-gray-500">
                                    Style:
                                  </span>
                                  <span className="ml-1 text-[#4A4947] capitalize">
                                    {product.style || "N/A"}
                                  </span>
                                </div>
                                <div>
                                  <span className="font-medium text-gray-500">
                                    Room:
                                  </span>
                                  <span className="ml-1 text-[#4A4947] capitalize">
                                    {product.roomType
                                      ? product.roomType.replace("-", " ")
                                      : "N/A"}
                                  </span>
                                </div>
                                <div className="col-span-2">
                                  <span className="font-medium text-gray-500">
                                    Pattern:
                                  </span>
                                  <span className="ml-1 text-[#4A4947] capitalize">
                                    {product.pattern || "N/A"}
                                  </span>
                                </div>
                              </div>

                              {/* Colors Display */}
                              {product.colors && product.colors.length > 0 && (
                                <div className="mb-3">
                                  <span className="font-medium text-gray-500 text-sm">
                                    Colors:
                                  </span>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {product.colors.map((color, colorIndex) => (
                                      <div
                                        key={colorIndex}
                                        className="w-6 h-6 rounded-full border border-gray-300"
                                        style={{ backgroundColor: color }}
                                        title={color}
                                      />
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Stock and Status */}
                              <div className="flex justify-between items-center mt-4 border-t pt-3">
                                <div>
                                  <span className="text-sm font-medium text-gray-500">
                                    Stock:
                                  </span>
                                  <span className="ml-1 text-[#4A4947] font-semibold">
                                    {product.stock ||
                                      product.stockQuantity ||
                                      0}
                                  </span>
                                </div>
                                <span
                                  className={`px-3 py-1 text-xs rounded-full ${getStatusColor(
                                    product.status
                                  )}`}
                                >
                                  {getStatusText(product.status)}
                                </span>
                              </div>

                              {/* Action Buttons */}
                              <div className="mt-3 flex gap-2">
                                <button
                                  onClick={() => handleEditProduct(product)}
                                  className="flex-1 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center justify-center gap-1"
                                >
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                    />
                                  </svg>
                                  Edit
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeleteProduct(product.id)
                                  }
                                  className="flex-1 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors flex items-center justify-center gap-1"
                                >
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                  </svg>
                                  Delete
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-white rounded-lg p-8 text-center shadow-md"
                      >
                        <p className="text-lg text-[#4A4947]">
                          No products added yet.
                        </p>
                        <button
                          onClick={() => setIsFormVisible(true)}
                          className="mt-4 px-6 py-2 rounded-lg transition-all duration-300 bg-[#D8D2C2] text-[#4A4947] hover:bg-[#4A4947] hover:text-white"
                        >
                          Add Your First Product
                        </button>
                      </motion.div>
                    )}
                  </motion.div>
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
                  <ProviderOrders user={provider} />
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

export default ProviderProfile;
