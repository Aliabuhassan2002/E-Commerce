import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Edit2,
  Trash2,
  RefreshCw,
  Plus,
  Layers,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [providers, setProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showDeleted, setShowDeleted] = useState(false);
  const [activeTab, setActiveTab] = useState("products"); // "products" or "variants"
  const [variants, setVariants] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Product form state
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    basePrice: "",
    category: "carpet",
    style: "",
    pattern: "",
    roomType: "",
    material: "",
    images: null,
    tags: [],
    hasVariants: false,
    providerId: "",
  });

  // Variant form state
  const [newVariant, setNewVariant] = useState({
    sku: "",
    color: "#000000",
    size: "",
    price: "",
    stockQuantity: "",
    image: null,
    weight: "",
    dimensions: { length: "", width: "", height: "" },
    productId: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);
  const variantFileInputRef = useRef(null);

  // Fetch products and providers
  useEffect(() => {
    fetchProducts();
    fetchProviders();
  }, [selectedProvider, showDeleted]);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedProvider) params.append("provider", selectedProvider);
      if (showDeleted) params.append("showDeleted", "true");

      const response = await axios.get(
        `http://localhost:5000/api/admin/products?${params.toString()}`,
        { withCredentials: true }
      );
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProviders = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/admin/providers",
        { withCredentials: true }
      );
      setProviders(response.data);
    } catch (error) {
      console.error("Error fetching providers:", error);
    }
  };

  const fetchVariants = async (productId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/admin/products/${productId}/variants`,
        { withCredentials: true }
      );
      setVariants(response.data);
    } catch (error) {
      console.error("Error fetching variants:", error);
    }
  };

  // Product handlers
  const handleProductImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setNewProduct({ ...newProduct, images: files });
  };

  const handleProductInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  // const handleProductSubmit = async (e) => {
  //   e.preventDefault();
  //   const formData = new FormData();

  //   Object.entries(newProduct).forEach(([key, value]) => {
  //     if (key === "images" && value) {
  //       value.forEach((file) => formData.append("images", file));
  //     } else if (key === "tags" && Array.isArray(value)) {
  //       value.forEach((tag) => formData.append("tags", tag));
  //     } else if (value !== null && value !== undefined) {
  //       formData.append(key, value);
  //     }
  //   });

  //   try {
  //     if (editingProduct) {
  //       await axios.put(
  //         `http://localhost:5000/api/admin/products/${editingProduct.id}`,
  //         formData,
  //         {
  //           withCredentials: true,
  //           headers: { "Content-Type": "multipart/form-data" },
  //         }
  //       );
  //     } else {
  //       await axios.post("http://localhost:5000/api/admin/products", formData, {
  //         withCredentials: true,
  //         headers: { "Content-Type": "multipart/form-data" },
  //       });
  //     }

  //     resetProductForm();
  //     fetchProducts();
  //   } catch (error) {
  //     console.error("Error saving product:", error);
  //     alert(
  //       "Error saving product: " +
  //         (error.response?.data?.message || error.message)
  //     );
  //   }
  // };
  const handleProductSubmit = async (e) => {
    e.preventDefault();

    console.log("=== FRONTEND PRODUCT SUBMIT DEBUG ===");
    console.log("Form data:", newProduct);
    console.log("Editing product:", editingProduct);

    const formData = new FormData();

    // Add all product data to formData with logging
    Object.entries(newProduct).forEach(([key, value]) => {
      console.log(
        `Processing field: ${key} =`,
        value,
        `(type: ${typeof value})`
      );

      if (key === "images" && value) {
        if (Array.isArray(value)) {
          value.forEach((file) => {
            formData.append("images", file);
            console.log(`Added image file: ${file.name}`);
          });
        } else {
          formData.append("images", value);
          console.log(`Added single image: ${value.name}`);
        }
      } else if (key === "tags" && Array.isArray(value)) {
        value.forEach((tag) => {
          formData.append("tags", tag);
          console.log(`Added tag: ${tag}`);
        });
      } else if (value !== null && value !== undefined && value !== "") {
        formData.append(key, value.toString());
        console.log(`Added ${key}: ${value}`);
      } else {
        console.log(`Skipped ${key}: value is empty`);
      }
    });

    // Log what's actually in formData
    console.log("=== FORM DATA CONTENTS ===");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      console.log("Sending product request to backend...");

      const url = editingProduct
        ? `http://localhost:5000/api/admin/products/${editingProduct.id}`
        : "http://localhost:5000/api/admin/products";

      const method = editingProduct ? "put" : "post";

      const response = await axios[method](url, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Product saved successfully:", response.data);

      if (response.data.success) {
        resetProductForm();
        fetchProducts();
        alert(
          editingProduct
            ? "Product updated successfully!"
            : "Product created successfully!"
        );
      }
    } catch (error) {
      console.error("Error saving product:", error);
      console.error("Error response:", error.response?.data);
      alert(
        "Error saving product: " +
          (error.response?.data?.message || error.message)
      );
    }
  };
  const resetProductForm = () => {
    setNewProduct({
      name: "",
      description: "",
      basePrice: "",
      category: "carpet",
      style: "",
      pattern: "",
      roomType: "",
      material: "",
      images: null,
      tags: [],
      hasVariants: false,
      providerId: "",
    });
    setEditingProduct(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      description: product.description,
      basePrice: product.basePrice,
      category: product.category,
      style: product.style || "",
      pattern: product.pattern || "",
      roomType: product.roomType || "",
      material: product.material,
      images: product.images,
      tags: product.tags || [],
      hasVariants: product.hasVariants,
      providerId: product.providerId,
    });
  };

  const handleSoftDeleteProduct = async (productId) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      await axios.put(
        `http://localhost:5000/api/admin/products/${productId}/soft-delete`,
        {},
        { withCredentials: true }
      );
      fetchProducts();
    } catch (error) {
      console.error("Error soft deleting product:", error);
    }
  };

  const handleRestoreProduct = async (productId) => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/products/${productId}/restore`,
        {},
        { withCredentials: true }
      );
      fetchProducts();
    } catch (error) {
      console.error("Error restoring product:", error);
    }
  };

  const handleStatusChange = async (productId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/products/${productId}/status`,
        { status: newStatus },
        { withCredentials: true }
      );
      fetchProducts();
    } catch (error) {
      console.error("Error changing product status:", error);
    }
  };

  // Variant handlers
  const handleVariantInputChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("dimensions.")) {
      const dimensionField = name.split(".")[1];
      setNewVariant({
        ...newVariant,
        dimensions: {
          ...newVariant.dimensions,
          [dimensionField]: value,
        },
      });
    } else {
      setNewVariant({ ...newVariant, [name]: value });
    }
  };

  const handleVariantImageUpload = (e) => {
    const file = e.target.files[0];
    setNewVariant({ ...newVariant, image: file });
  };

  // const handleVariantSubmit = async (e) => {
  //   e.preventDefault();

  //   if (!newVariant.productId) {
  //     alert("Please select a product first");
  //     return;
  //   }

  //   const formData = new FormData();
  //   Object.entries(newVariant).forEach(([key, value]) => {
  //     if (key === "image" && value) {
  //       formData.append("image", value);
  //     } else if (key === "dimensions") {
  //       formData.append("dimensions", JSON.stringify(value));
  //     } else if (value !== null && value !== undefined) {
  //       formData.append(key, value);
  //     }
  //   });

  //   try {
  //     await axios.post("http://localhost:5000/api/admin/variants", formData, {
  //       withCredentials: true,
  //       headers: { "Content-Type": "multipart/form-data" },
  //     });

  //     resetVariantForm();
  //     if (selectedProduct) {
  //       fetchVariants(selectedProduct.id);
  //     }
  //   } catch (error) {
  //     console.error("Error saving variant:", error);
  //     alert(
  //       "Error saving variant: " +
  //         (error.response?.data?.message || error.message)
  //     );
  //   }
  // };
  const handleVariantSubmit = async (e) => {
    e.preventDefault();

    if (!newVariant.productId) {
      alert("Please select a product first");
      return;
    }

    console.log("=== FRONTEND VARIANT DATA ===");
    console.log("Raw newVariant state:", newVariant);

    const formData = new FormData();

    // Add all variant data to formData with logging
    Object.entries(newVariant).forEach(([key, value]) => {
      console.log(
        `Processing field: ${key} =`,
        value,
        `(type: ${typeof value})`
      );

      if (key === "image" && value) {
        formData.append("image", value);
        console.log(`Added image file: ${value.name}`);
      } else if (key === "dimensions") {
        const dimensionsString = JSON.stringify(value);
        formData.append("dimensions", dimensionsString);
        console.log(`Added dimensions: ${dimensionsString}`);
      } else if (value !== null && value !== undefined && value !== "") {
        formData.append(key, value.toString());
        console.log(`Added ${key}: ${value}`);
      } else {
        console.log(`Skipped ${key}: value is empty`);
      }
    });

    // Log what's actually in formData
    console.log("=== FORM DATA CONTENTS ===");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      console.log("Sending request to backend...");

      const response = await axios.post(
        "http://localhost:5000/api/admin/variants",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log("Variant created successfully:", response.data);

      if (response.data.success) {
        resetVariantForm();
        if (selectedProduct) {
          fetchVariants(selectedProduct.id);
        }
        alert("Variant created successfully!");
      }
    } catch (error) {
      console.error("Error saving variant:", error);
      console.error("Error response:", error.response?.data);
      alert(
        "Error saving variant: " +
          (error.response?.data?.message || error.message)
      );
    }
  };
  const resetVariantForm = () => {
    setNewVariant({
      sku: "",
      color: "#000000",
      size: "",
      price: "",
      stockQuantity: "",
      image: null,
      weight: "",
      dimensions: { length: "", width: "", height: "" },
      productId: selectedProduct?.id || "",
    });
    if (variantFileInputRef.current) variantFileInputRef.current.value = "";
  };

  const handleDeleteVariant = async (variantId) => {
    if (!confirm("Are you sure you want to delete this variant?")) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/admin/variants/${variantId}`,
        { withCredentials: true }
      );
      if (selectedProduct) {
        fetchVariants(selectedProduct.id);
      }
    } catch (error) {
      console.error("Error deleting variant:", error);
    }
  };

  const handleViewVariants = (product) => {
    setSelectedProduct(product);
    setActiveTab("variants");
    fetchVariants(product.id);
  };

  const generateSKU = () => {
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    const productCode = selectedProduct
      ? selectedProduct.name.substring(0, 3).toUpperCase()
      : "PRO";
    setNewVariant({ ...newVariant, sku: `${productCode}-${random}` });
  };

  return (
    <div className="bg-[#D8D2C2] min-h-screen p-8 mt-25">
      <div className="max-w-7xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-[#4A4947] text-[#D8D2C2] p-6">
          <h1 className="text-3xl font-bold tracking-wide">
            Product Management
          </h1>
        </div>

        {/* Tabs */}
        <div className="border-b border-[#D8D2C2]">
          <div className="flex">
            <button
              onClick={() => setActiveTab("products")}
              className={`px-6 py-3 font-medium text-sm ${
                activeTab === "products"
                  ? "border-b-2 border-[#4A4947] text-[#4A4947]"
                  : "text-gray-500 hover:text-[#4A4947]"
              }`}
            >
              Products
            </button>
            <button
              onClick={() => setActiveTab("variants")}
              className={`px-6 py-3 font-medium text-sm ${
                activeTab === "variants"
                  ? "border-b-2 border-[#4A4947] text-[#4A4947]"
                  : "text-gray-500 hover:text-[#4A4947]"
              }`}
            >
              Variants
            </button>
          </div>
        </div>

        {/* Products Tab */}
        {activeTab === "products" && (
          <>
            {/* Providers Section */}
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-4 text-[#4A4947]">
                Providers
              </h2>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setSelectedProvider(null)}
                  className={`px-4 py-2 rounded-full transition-all duration-300 ${
                    !selectedProvider
                      ? "bg-[#4A4947] text-[#D8D2C2]"
                      : "bg-[#D8D2C2] text-[#4A4947] hover:bg-[#4A4947]/10"
                  }`}
                >
                  All Providers
                </button>
                {providers.map((provider) => (
                  <button
                    key={provider.id}
                    onClick={() => setSelectedProvider(provider.id)}
                    className={`px-4 py-2 rounded-full transition-all duration-300 ${
                      selectedProvider === provider.id
                        ? "bg-[#4A4947] text-[#D8D2C2]"
                        : "bg-[#D8D2C2] text-[#4A4947] hover:bg-[#4A4947]/10"
                    }`}
                  >
                    {provider.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Product Form */}
            <form
              onSubmit={handleProductSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-[#D8D2C2]/20"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Basic Information */}
                <div className="flex flex-col">
                  <label className="mb-2 text-sm font-medium text-[#4A4947]">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={newProduct.name}
                    onChange={handleProductInputChange}
                    className="p-2 border border-[#4A4947]/20 rounded-lg focus:ring-2 focus:ring-[#4A4947]/30 transition-all"
                    required
                  />
                </div>

                <div className="flex flex-col">
                  <label className="mb-2 text-sm font-medium text-[#4A4947]">
                    Description
                  </label>
                  <input
                    type="text"
                    name="description"
                    value={newProduct.description}
                    onChange={handleProductInputChange}
                    className="p-2 border border-[#4A4947]/20 rounded-lg focus:ring-2 focus:ring-[#4A4947]/30 transition-all"
                    required
                  />
                </div>

                <div className="flex flex-col">
                  <label className="mb-2 text-sm font-medium text-[#4A4947]">
                    Base Price (JD)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="basePrice"
                    value={newProduct.basePrice}
                    onChange={handleProductInputChange}
                    className="p-2 border border-[#4A4947]/20 rounded-lg focus:ring-2 focus:ring-[#4A4947]/30 transition-all"
                    required
                  />
                </div>

                <div className="flex flex-col">
                  <label className="mb-2 text-sm font-medium text-[#4A4947]">
                    Category
                  </label>
                  <select
                    name="category"
                    value={newProduct.category}
                    onChange={handleProductInputChange}
                    className="p-2 border border-[#4A4947]/20 rounded-lg focus:ring-2 focus:ring-[#4A4947]/30 transition-all"
                    required
                  >
                    <option value="carpet">Carpet</option>
                    <option value="accessory">Accessory</option>
                  </select>
                </div>

                {/* Design Information */}
                <div className="flex flex-col">
                  <label className="mb-2 text-sm font-medium text-[#4A4947]">
                    Style
                  </label>
                  <select
                    name="style"
                    value={newProduct.style}
                    onChange={handleProductInputChange}
                    className="p-2 border border-[#4A4947]/20 rounded-lg focus:ring-2 focus:ring-[#4A4947]/30 transition-all"
                  >
                    <option value="">Select Style</option>
                    <option value="traditional">Traditional</option>
                    <option value="modern">Modern</option>
                    <option value="bohemian">Bohemian</option>
                    <option value="transitional">Transitional</option>
                    <option value="vintage">Vintage</option>
                    <option value="contemporary">Contemporary</option>
                    <option value="minimalist">Minimalist</option>
                    <option value="coastal">Coastal</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="mb-2 text-sm font-medium text-[#4A4947]">
                    Pattern
                  </label>
                  <select
                    name="pattern"
                    value={newProduct.pattern}
                    onChange={handleProductInputChange}
                    className="p-2 border border-[#4A4947]/20 rounded-lg focus:ring-2 focus:ring-[#4A4947]/30 transition-all"
                  >
                    <option value="">Select Pattern</option>
                    <option value="solid">Solid</option>
                    <option value="geometric">Geometric</option>
                    <option value="floral">Floral</option>
                    <option value="abstract">Abstract</option>
                    <option value="striped">Striped</option>
                    <option value="oriental">Oriental</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="mb-2 text-sm font-medium text-[#4A4947]">
                    Room Type
                  </label>
                  <select
                    name="roomType"
                    value={newProduct.roomType}
                    onChange={handleProductInputChange}
                    className="p-2 border border-[#4A4947]/20 rounded-lg focus:ring-2 focus:ring-[#4A4947]/30 transition-all"
                  >
                    <option value="">Select Room</option>
                    <option value="living-room">Living Room</option>
                    <option value="bedroom">Bedroom</option>
                    <option value="dining-room">Dining Room</option>
                    <option value="office">Office</option>
                    <option value="hallway">Hallway</option>
                    <option value="outdoor">Outdoor</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="mb-2 text-sm font-medium text-[#4A4947]">
                    Material
                  </label>
                  <input
                    type="text"
                    name="material"
                    value={newProduct.material}
                    onChange={handleProductInputChange}
                    className="p-2 border border-[#4A4947]/20 rounded-lg focus:ring-2 focus:ring-[#4A4947]/30 transition-all"
                    required
                  />
                </div>

                <div className="flex flex-col">
                  <label className="mb-2 text-sm font-medium text-[#4A4947]">
                    Provider
                  </label>
                  <select
                    name="providerId"
                    value={newProduct.providerId}
                    onChange={handleProductInputChange}
                    className="p-2 border border-[#4A4947]/20 rounded-lg focus:ring-2 focus:ring-[#4A4947]/30 transition-all"
                    required
                  >
                    <option value="">Select Provider</option>
                    {providers.map((provider) => (
                      <option key={provider.id} value={provider.id}>
                        {provider.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="mb-2 text-sm font-medium text-[#4A4947]">
                    Has Variants
                  </label>
                  <select
                    name="hasVariants"
                    value={newProduct.hasVariants}
                    onChange={handleProductInputChange}
                    className="p-2 border border-[#4A4947]/20 rounded-lg focus:ring-2 focus:ring-[#4A4947]/30 transition-all"
                  >
                    <option value={false}>No</option>
                    <option value={true}>Yes</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="mb-2 text-sm font-medium text-[#4A4947]">
                    Images
                  </label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleProductImageUpload}
                    className="p-2 border border-[#4A4947]/20 rounded-lg focus:ring-2 focus:ring-[#4A4947]/30 transition-all"
                    multiple
                  />
                </div>
              </div>

              {/* Form Buttons */}
              <div className="col-span-full flex space-x-4 mt-6">
                <button
                  type="submit"
                  className="flex items-center px-6 py-2 bg-[#4A4947] text-[#D8D2C2] rounded-full hover:bg-[#4A4947]/90 transition-all"
                >
                  {editingProduct ? "Update Product" : "Add Product"}
                </button>
                {editingProduct && (
                  <button
                    type="button"
                    onClick={resetProductForm}
                    className="flex items-center px-6 py-2 bg-[#D8D2C2] text-[#4A4947] rounded-full hover:bg-[#D8D2C2]/90 transition-all"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            {/* Products Table */}
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={showDeleted}
                    onChange={() => setShowDeleted(!showDeleted)}
                    className="form-checkbox text-[#4A4947] rounded"
                  />
                  <span className="ml-2 text-[#4A4947]">
                    Show Deleted Products
                  </span>
                </label>
              </div>

              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4A4947]"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white">
                    <thead className="bg-[#D8D2C2]/30">
                      <tr>
                        {[
                          "Name",
                          "Price",
                          "Category",
                          "Variants",
                          "Status",
                          "Actions",
                        ].map((header) => (
                          <th
                            key={header}
                            className="py-3 px-4 text-left text-[#4A4947] font-semibold uppercase tracking-wider"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr
                          key={product.id}
                          className={`hover:bg-[#D8D2C2]/10 transition-all duration-300 ${
                            product.isDeleted ? "bg-red-50" : ""
                          }`}
                        >
                          <td className="py-3 px-4 border-b border-[#4A4947]/10">
                            {product.name}
                          </td>
                          <td className="py-3 px-4 border-b border-[#4A4947]/10">
                            {product.basePrice} JD
                          </td>
                          <td className="py-3 px-4 border-b border-[#4A4947]/10 capitalize">
                            {product.category}
                          </td>
                          <td className="py-3 px-4 border-b border-[#4A4947]/10">
                            <button
                              onClick={() => handleViewVariants(product)}
                              className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                            >
                              <Layers size={16} />
                              View Variants
                            </button>
                          </td>
                          <td className="py-3 px-4 border-b border-[#4A4947]/10">
                            <select
                              value={product.status}
                              onChange={(e) =>
                                handleStatusChange(product.id, e.target.value)
                              }
                              className={`w-full px-3 py-1 rounded-full text-xs font-semibold border-2 transition-all duration-300 ${
                                product.status === "approved"
                                  ? "border-green-300 bg-green-50 text-green-800 hover:bg-green-100"
                                  : product.status === "pending"
                                  ? "border-yellow-300 bg-yellow-50 text-yellow-800 hover:bg-yellow-100"
                                  : "border-red-300 bg-red-50 text-red-800 hover:bg-red-100"
                              }`}
                            >
                              <option value="pending">Pending</option>
                              <option value="approved">Approved</option>
                              <option value="rejected">Rejected</option>
                            </select>
                          </td>
                          <td className="py-3 px-4 border-b border-[#4A4947]/10 space-x-2">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleEditProduct(product)}
                                className="text-[#4A4947] hover:text-[#4A4947]/70 transition-all"
                                title="Edit"
                              >
                                <Edit2 size={18} />
                              </button>
                              {product.isDeleted ? (
                                <button
                                  onClick={() =>
                                    handleRestoreProduct(product.id)
                                  }
                                  className="text-green-600 hover:text-green-800 transition-all"
                                  title="Restore"
                                >
                                  <RefreshCw size={18} />
                                </button>
                              ) : (
                                <button
                                  onClick={() =>
                                    handleSoftDeleteProduct(product.id)
                                  }
                                  className="text-red-600 hover:text-red-800 transition-all"
                                  title="Delete"
                                >
                                  <Trash2 size={18} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {/* Variants Tab */}
        {activeTab === "variants" && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-[#4A4947]">
                Product Variants
              </h2>
              {selectedProduct && (
                <div className="text-sm text-[#4A4947]">
                  Selected: <strong>{selectedProduct.name}</strong>
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="ml-2 text-red-600 hover:text-red-800"
                  >
                    Change
                  </button>
                </div>
              )}
            </div>

            {/* Product Selection */}
            {!selectedProduct && (
              <div className="mb-6 p-4 bg-yellow-50 rounded-lg">
                <h3 className="font-semibold mb-2">Select a Product</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {products
                    .filter((p) => !p.isDeleted)
                    .map((product) => (
                      <button
                        key={product.id}
                        onClick={() => {
                          setSelectedProduct(product);
                          setNewVariant({
                            ...newVariant,
                            productId: product.id,
                          });
                          fetchVariants(product.id);
                        }}
                        className="p-3 text-left border border-[#D8D2C2] rounded-lg hover:bg-[#D8D2C2]/20 transition-all"
                      >
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-gray-600">
                          {product.category}
                        </div>
                      </button>
                    ))}
                </div>
              </div>
            )}

            {/* Variant Form */}
            {selectedProduct && (
              <form
                onSubmit={handleVariantSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-[#D8D2C2]/20 rounded-lg mb-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* SKU Field */}
                  <div className="flex flex-col">
                    <label className="mb-2 text-sm font-medium text-[#4A4947]">
                      SKU *
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        name="sku"
                        value={newVariant.sku || ""}
                        onChange={handleVariantInputChange}
                        className="flex-1 p-2 border border-[#4A4947]/20 rounded-lg focus:ring-2 focus:ring-[#4A4947]/30 transition-all"
                        required
                        placeholder="Enter SKU"
                      />
                      <button
                        type="button"
                        onClick={generateSKU}
                        className="px-3 bg-[#4A4947] text-[#D8D2C2] rounded-lg hover:bg-[#4A4947]/90"
                      >
                        Generate
                      </button>
                    </div>
                  </div>
                  {/* Color Field */}
                  <div className="flex flex-col">
                    <label className="mb-2 text-sm font-medium text-[#4A4947]">
                      Color *
                    </label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="color"
                        name="color"
                        value={newVariant.color || "#000000"}
                        onChange={handleVariantInputChange}
                        className="p-1 border border-[#4A4947]/20 rounded-lg focus:ring-2 focus:ring-[#4A4947]/30 transition-all h-10"
                      />
                      <input
                        type="text"
                        value={newVariant.color || "#000000"}
                        onChange={(e) =>
                          setNewVariant({
                            ...newVariant,
                            color: e.target.value,
                          })
                        }
                        className="flex-1 p-2 border border-[#4A4947]/20 rounded-lg focus:ring-2 focus:ring-[#4A4947]/30 transition-all"
                        placeholder="#000000"
                      />
                    </div>
                  </div>
                  {/* Size Field */}
                  <div className="flex flex-col">
                    <label className="mb-2 text-sm font-medium text-[#4A4947]">
                      Size *
                    </label>
                    <input
                      type="text"
                      name="size"
                      value={newVariant.size || ""}
                      onChange={handleVariantInputChange}
                      className="p-2 border border-[#4A4947]/20 rounded-lg focus:ring-2 focus:ring-[#4A4947]/30 transition-all"
                      required
                      placeholder="e.g., 6x9 ft, M, L"
                    />
                  </div>
                  {/* Price Field */}
                  <div className="flex flex-col">
                    <label className="mb-2 text-sm font-medium text-[#4A4947]">
                      Price (JD) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      name="price"
                      value={newVariant.price || ""}
                      onChange={handleVariantInputChange}
                      className="p-2 border border-[#4A4947]/20 rounded-lg focus:ring-2 focus:ring-[#4A4947]/30 transition-all"
                      required
                      placeholder="0.00"
                    />
                  </div>
                  {/* Stock Quantity Field */}
                  <div className="flex flex-col">
                    <label className="mb-2 text-sm font-medium text-[#4A4947]">
                      Stock Quantity *
                    </label>
                    <input
                      type="number"
                      name="stockQuantity"
                      value={newVariant.stockQuantity || ""}
                      onChange={handleVariantInputChange}
                      className="p-2 border border-[#4A4947]/20 rounded-lg focus:ring-2 focus:ring-[#4A4947]/30 transition-all"
                      required
                      placeholder="0"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="mb-2 text-sm font-medium text-[#4A4947]">
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      name="weight"
                      value={newVariant.weight}
                      onChange={handleVariantInputChange}
                      className="p-2 border border-[#4A4947]/20 rounded-lg focus:ring-2 focus:ring-[#4A4947]/30 transition-all"
                    />
                  </div>
                  {/* Dimensions */}
                  <div className="flex flex-col">
                    <label className="mb-2 text-sm font-medium text-[#4A4947]">
                      Length (cm)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      name="dimensions.length"
                      value={newVariant.dimensions.length}
                      onChange={handleVariantInputChange}
                      className="p-2 border border-[#4A4947]/20 rounded-lg focus:ring-2 focus:ring-[#4A4947]/30 transition-all"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="mb-2 text-sm font-medium text-[#4A4947]">
                      Width (cm)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      name="dimensions.width"
                      value={newVariant.dimensions.width}
                      onChange={handleVariantInputChange}
                      className="p-2 border border-[#4A4947]/20 rounded-lg focus:ring-2 focus:ring-[#4A4947]/30 transition-all"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="mb-2 text-sm font-medium text-[#4A4947]">
                      Height (cm)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      name="dimensions.height"
                      value={newVariant.dimensions.height}
                      onChange={handleVariantInputChange}
                      className="p-2 border border-[#4A4947]/20 rounded-lg focus:ring-2 focus:ring-[#4A4947]/30 transition-all"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="mb-2 text-sm font-medium text-[#4A4947]">
                      Variant Image
                    </label>
                    <input
                      type="file"
                      ref={variantFileInputRef}
                      onChange={handleVariantImageUpload}
                      className="p-2 border border-[#4A4947]/20 rounded-lg focus:ring-2 focus:ring-[#4A4947]/30 transition-all"
                    />
                  </div>
                </div>

                <div className="col-span-full flex space-x-4 mt-6">
                  <button
                    type="submit"
                    className="flex items-center px-6 py-2 bg-[#4A4947] text-[#D8D2C2] rounded-full hover:bg-[#4A4947]/90 transition-all"
                  >
                    <Plus size={18} className="mr-2" />
                    Add Variant
                  </button>
                  <button
                    type="button"
                    onClick={resetVariantForm}
                    className="flex items-center px-6 py-2 bg-[#D8D2C2] text-[#4A4947] rounded-full hover:bg-[#D8D2C2]/90 transition-all"
                  >
                    Reset
                  </button>
                </div>
              </form>
            )}

            {/* Variants List */}
            {selectedProduct && (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead className="bg-[#D8D2C2]/30">
                    <tr>
                      {[
                        "SKU",
                        "Color",
                        "Size",
                        "Price",
                        "Stock",
                        "Status",
                        "Actions",
                      ].map((header) => (
                        <th
                          key={header}
                          className="py-3 px-4 text-left text-[#4A4947] font-semibold uppercase tracking-wider"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {variants.map((variant) => (
                      <tr
                        key={variant.id}
                        className="hover:bg-[#D8D2C2]/10 transition-all duration-300"
                      >
                        <td className="py-3 px-4 border-b border-[#4A4947]/10">
                          {variant.sku}
                        </td>
                        <td className="py-3 px-4 border-b border-[#4A4947]/10">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-4 h-4 rounded border border-gray-300"
                              style={{ backgroundColor: variant.color }}
                            ></div>
                            {variant.color}
                          </div>
                        </td>
                        <td className="py-3 px-4 border-b border-[#4A4947]/10">
                          {variant.size}
                        </td>
                        <td className="py-3 px-4 border-b border-[#4A4947]/10">
                          {variant.price} JD
                        </td>
                        <td className="py-3 px-4 border-b border-[#4A4947]/10">
                          {variant.stockQuantity}
                        </td>
                        <td className="py-3 px-4 border-b border-[#4A4947]/10">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              variant.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {variant.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="py-3 px-4 border-b border-[#4A4947]/10">
                          <button
                            onClick={() => handleDeleteVariant(variant.id)}
                            className="text-red-600 hover:text-red-800 transition-all"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
