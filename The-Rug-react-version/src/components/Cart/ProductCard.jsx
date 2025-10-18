import React, { useState, useEffect } from "react";
import axios from "axios";

const ProductCard = ({ product }) => {
  const [productWithDiscount, setProductWithDiscount] = useState(product);

  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/discounts/product/${product.id}`
        );
        if (response.data.success) {
          setProductWithDiscount(response.data.product);
        }
      } catch (error) {
        console.error("Error fetching discounts:", error);
      }
    };

    fetchDiscounts();
  }, [product.id]);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 relative">
      {/* Discount Badge */}
      {productWithDiscount.bestDiscount && (
        <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
          {productWithDiscount.bestDiscount.discountType === "percentage"
            ? `-${productWithDiscount.bestDiscount.value}%`
            : `-${productWithDiscount.bestDiscount.value} JD`}
        </div>
      )}

      <img
        src={productWithDiscount.images?.[0]}
        alt={productWithDiscount.name}
        className="w-full h-48 object-cover rounded"
      />

      <h3 className="text-lg font-semibold mt-2">{productWithDiscount.name}</h3>

      {/* Price Display */}
      <div className="mt-2">
        {productWithDiscount.hasDiscount ? (
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-green-600">
              {productWithDiscount.finalPrice} JD
            </span>
            <span className="text-sm text-gray-500 line-through">
              {productWithDiscount.originalPrice} JD
            </span>
          </div>
        ) : (
          <span className="text-xl font-bold">
            {productWithDiscount.price} JD
          </span>
        )}
      </div>

      {/* Discount Name */}
      {productWithDiscount.bestDiscount && (
        <p className="text-xs text-gray-600 mt-1">
          {productWithDiscount.bestDiscount.name}
        </p>
      )}
    </div>
  );
};
