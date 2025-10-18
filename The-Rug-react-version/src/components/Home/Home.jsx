// Home.js (updated)
import React, { useState, useEffect } from "react";
import { Twitter, Youtube, Instagram, Facebook } from "lucide-react";
import "../Navbar/Navbar.css";
import axios from "axios";
import {
  translate,
  subscribe,
  getLanguage,
} from "../../services/languageService";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [language, setLanguage] = useState(getLanguage());
  const [suppliers] = useState([
    { id: 1, name: "Shahwan", image: "src/assets/rug1/Shawan.webp" },
    {
      id: 2,
      name: "Absi",
      image: "src/assets/rug3/lu-jianfeng-QuMvwbkOvVQ-unsplash.jpg",
    },
    { id: 3, name: "AL-Jezawi", image: "src/assets/930.jpg" },
    {
      id: 4,
      name: "AL-Hosam",
      image: "src/assets/rug7/lotus-design-n-print-SWOmTM6WivM-unsplash.jpg",
    },
    {
      id: 5,
      name: "AL Mohtarefoon",
      image: "src/assets/rug3/jonathan-borba-oR_cCAa7Lsg-unsplash.jpg",
    },
  ]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/products/approved"
        );
        setProducts(response.data.slice(0, 4));
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();

    // Subscribe to language changes
    const unsubscribe = subscribe(() => {
      setLanguage(getLanguage());
    });

    return () => unsubscribe();
  }, []);

  // RTL direction based on language
  const isRTL = language === "ar";

  return (
    <div dir={isRTL ? "rtl" : "ltr"}>
      <div className="relative min-h-screen">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="src/assets/rug7/6163.jpg"
            alt="Fireplace with brick wall"
            className="w-full h-full object-cover"
          />
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/30" />
        </div>

        {/* Content */}
        <div className="relative min-h-screen flex flex-col">
          {/* Main Content */}
          <div className="flex-1 flex items-center px-6 md:px-12">
            <div className="max-w-lg">
              <div className="bg-[#FBE7C6] p-8 rounded-lg shadow-lg">
                <h1 className="text-4xl font-serif mb-4 text-gray-800">
                  {translate("home.nowOnline")}
                </h1>
                <p className="text-lg text-gray-700 mb-6">
                  {translate("home.description")}
                </p>
                <button className="px-6 py-2 bg-gray-900 text-white rounded border-2 border-gray-900 hover:bg-transparent hover:text-gray-900 transition-colors duration-300">
                  {translate("home.learnMore")}
                </button>
              </div>
            </div>
          </div>

          {/* Social Media Icons */}
          <div className="relative bg-gray-800/80 py-4">
            <div className="container mx-auto px-6">
              <div className="flex justify-end gap-6">
                <a
                  href="#"
                  className="text-white hover:text-[#FBE7C6] transition-colors"
                >
                  <Twitter className="w-6 h-6" />
                </a>
                <a
                  href="#"
                  className="text-white hover:text-[#FBE7C6] transition-colors"
                >
                  <Youtube className="w-6 h-6" />
                </a>
                <a
                  href="#"
                  className="text-white hover:text-[#FBE7C6] transition-colors"
                >
                  <Instagram className="w-6 h-6" />
                </a>
                <a
                  href="#"
                  className="text-white hover:text-[#FBE7C6] transition-colors"
                >
                  <Facebook className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Best Sellers Section */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-semibold text-center mb-8">
          {translate("home.bestSellers")}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 bg-white hover:bg-[#f8dca6] group"
            >
              <div className="relative aspect-square">
                <img
                  src={`http://localhost:5000${product.image}`}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-4 transition-colors duration-300">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">
                    {product.name}
                  </h3>
                  <span className="text-lg font-medium text-gray-900">
                    {product.price}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Carpets Section */}
      <section className="bg-white dark:bg-[#444444]">
        <div className="gap-16 items-center py-8 px-4 mx-auto max-w-screen-xl lg:grid lg:grid-cols-2 lg:py-16 lg:px-6">
          <div className="font-light text-gray-500 sm:text-lg dark:text-gray-400">
            <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
              {translate("home.ourCarpets")}
            </h2>
            <p className="mb-4">
              <strong className="text-white">
                {translate("home.handMade")} <br />
              </strong>
              {translate("home.handMadeDesc")}
            </p>
            <p>
              <strong className="text-white">
                {translate("home.machineMade")} <br />
              </strong>
              {translate("home.machineMadeDesc")}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-8">
            <img
              className="w-full h-100 rounded-lg"
              src="src/assets/12634.jpg"
              alt="office content 1"
            />
            <img
              className="mt-4 w-full h-100 lg:mt-10 rounded-lg"
              src="src/assets/sew-8353303_1280.jpg"
              alt="office content 2"
            />
          </div>
        </div>
      </section>

      {/* Suppliers Section */}
      <div className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-medium text-black text-center mb-12">
            {translate("home.ourSuppliers")}
          </h2>

          <div className="flex overflow-x-auto gap-8 pb-8 px-4 no-scrollbar">
            {suppliers.map((supplier) => (
              <div key={supplier.id} className="flex-none w-64 group">
                <p className="text-black text-lg mb-3">{supplier.name}</p>

                <div className="relative transform -rotate-12 transition-transform duration-300 group-hover:rotate-0">
                  <div className="bg-white/10 rounded-lg p-1">
                    <img
                      src={supplier.image}
                      alt={supplier.name}
                      className="w-full h-48 object-cover rounded"
                    />
                  </div>

                  <div className="absolute inset-0 shadow-xl rounded-lg transform translate-y-2 -z-10 bg-black/20" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Why Choose Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-medium text-gray-900 text-center mb-12">
            {translate("home.whyChoose")}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {translate("home.features").map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-gray-100 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="text-4xl">{feature.icon}</div>
                <h3 className="text-xl font-semibold mt-4 text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mt-2">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
