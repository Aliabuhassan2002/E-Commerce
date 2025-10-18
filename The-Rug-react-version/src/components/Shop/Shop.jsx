import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { ShoppingCart, FilePdf, Funnel, X } from "phosphor-react";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    styles: [],
    roomTypes: [],
    materials: [],
    categories: [],
    patterns: [],
    priceRange: { min: 0, max: 1000 },
  });

  // Filter states
  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    style: "",
    roomType: "",
    material: "",
    category: "",
    pattern: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("🔄 Fetching initial data...");

        // First, fetch products
        const productsResponse = await axios.get(
          "http://localhost:5000/api/products/approved"
        );
        console.log("✅ Products fetched:", productsResponse.data.length);
        setProducts(productsResponse.data);

        // Then try to fetch filter options
        try {
          const filterOptionsResponse = await axios.get(
            "http://localhost:5000/api/products/filter-options"
          );
          console.log("✅ Filter options fetched:", filterOptionsResponse.data);
          setFilterOptions(filterOptionsResponse.data);
        } catch (filterError) {
          console.log(
            "⚠️ Filter options endpoint not available, extracting from products..."
          );
          // If filter options endpoint fails, extract from products
          extractFilterOptionsFromProducts(productsResponse.data);
        }
      } catch (error) {
        console.error("❌ Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Extract filter options from products data (fallback)
  const extractFilterOptionsFromProducts = (productsData) => {
    console.log("🔄 Extracting filter options from products...");

    const styles = [
      ...new Set(productsData.map((p) => p.style).filter(Boolean)),
    ].sort();
    const roomTypes = [
      ...new Set(productsData.map((p) => p.roomType).filter(Boolean)),
    ].sort();
    const materials = [
      ...new Set(productsData.map((p) => p.material).filter(Boolean)),
    ].sort();
    const categories = [
      ...new Set(productsData.map((p) => p.category).filter(Boolean)),
    ].sort();
    const patterns = [
      ...new Set(productsData.map((p) => p.pattern).filter(Boolean)),
    ].sort();

    // Calculate price range from products
    const prices = productsData
      .map((p) => p.price || p.basePrice)
      .filter((price) => price != null && price > 0);
    const priceRange = {
      min: prices.length > 0 ? Math.floor(Math.min(...prices)) : 0,
      max: prices.length > 0 ? Math.ceil(Math.max(...prices)) : 1000,
    };

    const options = {
      styles,
      roomTypes,
      materials,
      categories,
      patterns,
      priceRange,
    };

    console.log("✅ Extracted filter options:", options);
    setFilterOptions(options);
  };

  // Fetch products with filters
  useEffect(() => {
    const fetchFilteredProducts = async () => {
      // Don't fetch on initial load or if no filters are active
      if (products.length === 0 && !hasActiveFilters) return;

      try {
        // Build query string from filters
        const queryParams = new URLSearchParams();

        if (filters.minPrice) queryParams.append("minPrice", filters.minPrice);
        if (filters.maxPrice) queryParams.append("maxPrice", filters.maxPrice);
        if (filters.style) queryParams.append("style", filters.style);
        if (filters.roomType) queryParams.append("roomType", filters.roomType);
        if (filters.material) queryParams.append("material", filters.material);
        if (filters.category) queryParams.append("category", filters.category);
        if (filters.pattern) queryParams.append("pattern", filters.pattern);

        const url = `http://localhost:5000/api/products/approved?${queryParams.toString()}`;
        console.log("🔄 Fetching filtered products:", url);

        const response = await axios.get(url);
        console.log("✅ Filtered products received:", response.data.length);
        setProducts(response.data);
      } catch (error) {
        console.error("❌ Error fetching filtered products:", error);
      }
    };

    fetchFilteredProducts();
  }, [filters]);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      minPrice: "",
      maxPrice: "",
      style: "",
      roomType: "",
      material: "",
      category: "",
      pattern: "",
    });
  };

  // Check if any filter is active
  const hasActiveFilters = Object.values(filters).some((value) => value !== "");

  // Safe image URL function
  const getSafeImageUrl = (imagePath) => {
    if (!imagePath || imagePath === "undefined") {
      return "/placeholder-image.jpg";
    }
    return `http://localhost:5000${imagePath}`;
  };

  // Generate PDF Report
  const generatePDFReport = async () => {
    try {
      setGeneratingPdf(true);
      console.log("🔄 Requesting PDF report...");

      const response = await axios.post(
        "http://localhost:5000/api/products/pdf-report",
        {},
        {
          responseType: "blob",
          withCredentials: true,
          timeout: 30000,
        }
      );

      console.log("✅ PDF response received, size:", response.data.size);

      if (response.data.size === 0) {
        throw new Error("PDF is empty");
      }

      // Create a blob from the PDF stream
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      // Set filename with current date
      const date = new Date().toISOString().split("T")[0];
      link.download = `products-report-${date}.pdf`;

      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      console.log("📄 PDF report downloaded successfully");
    } catch (error) {
      console.error("❌ Error generating PDF report:", error);
      alert("Failed to generate PDF report. Please try again.");
    } finally {
      setGeneratingPdf(false);
    }
  };

  // Format text for display (capitalize, replace hyphens, etc.)
  const formatOptionText = (text) => {
    if (!text) return "";
    return text
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF7F0] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#D8D2C2] border-t-[#4A4947] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#4A4947] text-lg font-medium">
            Loading products...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F0]">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#4A4947] via-[#4A4947] to-[#D8D2C2] pt-24 pb-32">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-[#FAF7F0] rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#FAF7F0] rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-[#FAF7F0] mb-4">
            Discover Our Collection
          </h1>
          <p className="text-xl text-[#D8D2C2] max-w-2xl mx-auto">
            Handcrafted elegance for every space in your home
          </p>

          {/* PDF Report Button */}
          {products.length > 0 && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={generatePDFReport}
                disabled={generatingPdf}
                className={`flex items-center gap-3 px-6 py-3 rounded-full font-semibold shadow-lg transition-all duration-300 ${
                  generatingPdf
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#FAF7F0] text-[#4A4947] hover:bg-white hover:shadow-xl hover:-translate-y-1"
                }`}
              >
                <FilePdf size={20} weight="fill" />
                {generatingPdf
                  ? "Generating Report..."
                  : "Generate Products PDF Report"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 pb-20">
        {/* Filters and Products Count */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-[#4A4947]">
              Our Collection
            </h2>
            <p className="text-[#4A4947]/70 mt-1">
              {products.length} product{products.length !== 1 ? "s" : ""}{" "}
              available
              {hasActiveFilters && " (filtered)"}
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:text-red-800 transition-colors"
              >
                <X size={16} />
                Clear Filters
              </button>
            )}

            {/* PDF Report Button */}
            {products.length > 0 && (
              <button
                onClick={generatePDFReport}
                disabled={generatingPdf}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
                  generatingPdf
                    ? "bg-gray-400 cursor-not-allowed text-white"
                    : "bg-[#4A4947] text-[#FAF7F0] hover:bg-[#4A4947]/90"
                }`}
              >
                <FilePdf size={16} weight="fill" />
                {generatingPdf ? "Generating..." : "PDF Report"}
              </button>
            )}
          </div>
        </div>

        {/* FILTERS PANEL */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#4A4947] flex items-center gap-2">
              <Funnel size={20} />
              Filter Products
            </h3>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-red-600 hover:text-red-800 flex items-center gap-1"
              >
                <X size={16} />
                Clear All
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-[#4A4947] mb-2">
                Price Range (JD)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder={`Min (${filterOptions.priceRange.min})`}
                  value={filters.minPrice}
                  onChange={(e) =>
                    handleFilterChange("minPrice", e.target.value)
                  }
                  min={filterOptions.priceRange.min}
                  max={filterOptions.priceRange.max}
                  className="w-full px-3 py-2 border border-[#D8D2C2] rounded-lg focus:outline-none focus:border-[#4A4947]"
                />
                <input
                  type="number"
                  placeholder={`Max (${filterOptions.priceRange.max})`}
                  value={filters.maxPrice}
                  onChange={(e) =>
                    handleFilterChange("maxPrice", e.target.value)
                  }
                  min={filterOptions.priceRange.min}
                  max={filterOptions.priceRange.max}
                  className="w-full px-3 py-2 border border-[#D8D2C2] rounded-lg focus:outline-none focus:border-[#4A4947]"
                />
              </div>
            </div>

            {/* Style Filter */}
            {filterOptions.styles.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-[#4A4947] mb-2">
                  Style
                </label>
                <select
                  value={filters.style}
                  onChange={(e) => handleFilterChange("style", e.target.value)}
                  className="w-full px-3 py-2 border border-[#D8D2C2] rounded-lg focus:outline-none focus:border-[#4A4947] bg-white"
                >
                  <option value="">All Styles</option>
                  {filterOptions.styles.map((style) => (
                    <option key={style} value={style}>
                      {formatOptionText(style)}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Room Type Filter */}
            {filterOptions.roomTypes.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-[#4A4947] mb-2">
                  Room Type
                </label>
                <select
                  value={filters.roomType}
                  onChange={(e) =>
                    handleFilterChange("roomType", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-[#D8D2C2] rounded-lg focus:outline-none focus:border-[#4A4947] bg-white"
                >
                  <option value="">All Rooms</option>
                  {filterOptions.roomTypes.map((room) => (
                    <option key={room} value={room}>
                      {formatOptionText(room)}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Material Filter */}
            {filterOptions.materials.length > 0 && (
              <div>
                {/* <label className="block text-sm font-medium text-[#4A4947] mb-2">
                  Material
                </label> */}
                {/* <select
                  value={filters.material}
                  onChange={(e) =>
                    handleFilterChange("material", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-[#D8D2C2] rounded-lg focus:outline-none focus:border-[#4A4947] bg-white"
                >
                  <option value="">All Materials</option>
                  {filterOptions.materials.map((material) => (
                    <option key={material} value={material}>
                      {formatOptionText(material)}
                    </option>
                  ))}
                </select> */}
              </div>
            )}
          </div>

          {/* Additional Filters Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            {/* Category Filter */}
            {filterOptions.categories.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-[#4A4947] mb-2">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) =>
                    handleFilterChange("category", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-[#D8D2C2] rounded-lg focus:outline-none focus:border-[#4A4947] bg-white"
                >
                  <option value="">All Categories</option>
                  {filterOptions.categories.map((category) => (
                    <option key={category} value={category}>
                      {formatOptionText(category)}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Pattern Filter */}
            {filterOptions.patterns.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-[#4A4947] mb-2">
                  Pattern
                </label>
                <select
                  value={filters.pattern}
                  onChange={(e) =>
                    handleFilterChange("pattern", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-[#D8D2C2] rounded-lg focus:outline-none focus:border-[#4A4947] bg-white"
                >
                  <option value="">All Patterns</option>
                  {filterOptions.patterns.map((pattern) => (
                    <option key={pattern} value={pattern}>
                      {formatOptionText(pattern)}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="mt-4 pt-4 border-t border-[#D8D2C2]">
              <p className="text-sm text-[#4A4947]/70 mb-2">Active Filters:</p>
              <div className="flex flex-wrap gap-2">
                {filters.minPrice && (
                  <span className="px-3 py-1 bg-[#D8D2C2] text-[#4A4947] rounded-full text-sm">
                    Min Price: {filters.minPrice} JD
                  </span>
                )}
                {filters.maxPrice && (
                  <span className="px-3 py-1 bg-[#D8D2C2] text-[#4A4947] rounded-full text-sm">
                    Max Price: {filters.maxPrice} JD
                  </span>
                )}
                {filters.style && (
                  <span className="px-3 py-1 bg-[#D8D2C2] text-[#4A4947] rounded-full text-sm">
                    Style: {formatOptionText(filters.style)}
                  </span>
                )}
                {filters.roomType && (
                  <span className="px-3 py-1 bg-[#D8D2C2] text-[#4A4947] rounded-full text-sm">
                    Room: {formatOptionText(filters.roomType)}
                  </span>
                )}
                {filters.material && (
                  <span className="px-3 py-1 bg-[#D8D2C2] text-[#4A4947] rounded-full text-sm">
                    Material: {formatOptionText(filters.material)}
                  </span>
                )}
                {filters.category && (
                  <span className="px-3 py-1 bg-[#D8D2C2] text-[#4A4947] rounded-full text-sm">
                    Category: {formatOptionText(filters.category)}
                  </span>
                )}
                {filters.pattern && (
                  <span className="px-3 py-1 bg-[#D8D2C2] text-[#4A4947] rounded-full text-sm">
                    Pattern: {formatOptionText(filters.pattern)}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="group relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              {/* Image Container */}
              <div className="relative overflow-hidden bg-[#D8D2C2]">
                <div className="aspect-[4/3] relative">
                  <img
                    src={getSafeImageUrl(product.image)}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {
                      e.target.src = "/placeholder-image.jpg";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#4A4947]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* View Details Button - Appears on hover */}
                <Link
                  to={`/details/${product.id}`}
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-6 py-3 bg-[#FAF7F0] text-[#4A4947] rounded-full font-semibold opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-lg hover:bg-white"
                >
                  <ShoppingCart size={20} weight="fill" />
                  View Details
                </Link>
              </div>

              {/* Content */}
              <div className="p-6">
                <Link to={`/details/${product.id}`}>
                  <h3 className="text-2xl font-bold text-[#4A4947] mb-3 group-hover:text-[#4A4947]/80 transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                </Link>

                {/* Attributes */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {[
                    { value: product.material, label: "Material" },
                    { value: product.pattern, label: "Pattern" },
                    { value: product.roomType, label: "Room" },
                    { value: product.style, label: "Style" },
                  ]
                    .filter((attr) => attr.value)
                    .slice(0, 3)
                    .map((attr, index) => (
                      <span
                        key={index}
                        className="text-xs font-medium text-[#4A4947]/70 bg-[#FAF7F0] px-3 py-1.5 rounded-lg"
                      >
                        {formatOptionText(attr.value)}
                      </span>
                    ))}
                </div>

                {/* Price and Action Row */}
                <div className="flex items-center justify-between pt-4 border-t border-[#D8D2C2]">
                  <div>
                    <p className="text-sm text-[#4A4947]/60 font-medium">
                      Price
                    </p>
                    <p className="text-2xl font-bold text-[#4A4947]">
                      {product.price} <span className="text-lg">JD</span>
                    </p>
                  </div>

                  <Link
                    to={`/details/${product.id}`}
                    className="text-[#4A4947] hover:text-[#4A4947]/70 font-semibold text-sm underline underline-offset-4 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>

              {/* Decorative corner accent */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#D8D2C2] to-transparent opacity-50 rounded-bl-full"></div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {products.length === 0 && (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-[#D8D2C2] rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart size={48} className="text-[#4A4947]" />
            </div>
            <h3 className="text-2xl font-bold text-[#4A4947] mb-2">
              {hasActiveFilters
                ? "No products match your filters"
                : "No Products Available"}
            </h3>
            <p className="text-[#4A4947]/70 mb-4">
              {hasActiveFilters
                ? "Try adjusting your filters to see more results."
                : "Check back soon for new arrivals!"}
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-6 py-2 bg-[#4A4947] text-white rounded-lg hover:bg-[#4A4947]/90 transition-colors"
              >
                Clear All Filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
