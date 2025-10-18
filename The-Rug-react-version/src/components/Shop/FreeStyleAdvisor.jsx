// components/FreeStyleAdvisor.jsx
import React, { useState, useEffect } from "react";
import { StyleAdvisor } from "./recommendationEngine";
import axios from "axios";

const FreeStyleAdvisor = ({ onRecommendations }) => {
  const [advisor, setAdvisor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [preferences, setPreferences] = useState({
    styles: [],
    colors: [],
  });

  useEffect(() => {
    const loadProductsAndInitialize = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/products/approved"
        );
        const styleAdvisor = new StyleAdvisor();
        await styleAdvisor.initialize(response.data);
        setAdvisor(styleAdvisor);
      } catch (error) {
        console.error("Error initializing style advisor:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProductsAndInitialize();
  }, []);

  const handleStyleToggle = (style) => {
    setPreferences((prev) => ({
      ...prev,
      styles: prev.styles.includes(style)
        ? prev.styles.filter((s) => s !== style)
        : [...prev.styles, style],
    }));
  };

  const handleColorToggle = (color) => {
    setPreferences((prev) => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter((c) => c !== color)
        : [...prev.colors, color],
    }));
  };

  const getRecommendations = () => {
    if (!advisor) return;

    const recommendedProducts = advisor.model.recommend(preferences);
    onRecommendations({
      aiRecommendations: [
        {
          style: "custom",
          reasoning: "Based on your selected preferences",
          colors: preferences.colors,
        },
      ],
      matchingProducts: recommendedProducts,
    });
  };

  if (loading) return <div>Loading style advisor...</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-[#4A4947] mb-6">
        Free Style Advisor
      </h2>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Select preferred styles:</h3>
        <div className="grid grid-cols-2 gap-3">
          {Object.keys(advisor.styleVocab).map((style) => (
            <button
              key={style}
              type="button"
              className={`p-3 rounded-lg border ${
                preferences.styles.includes(style)
                  ? "bg-[#4A4947] text-white"
                  : "bg-white text-[#4A4947]"
              }`}
              onClick={() => handleStyleToggle(style)}
            >
              {style}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Select preferred colors:</h3>
        <div className="grid grid-cols-4 gap-2">
          {Object.keys(advisor.colorVocab).map((color) => (
            <button
              key={color}
              type="button"
              className={`h-12 rounded-lg border ${
                preferences.colors.includes(color)
                  ? "ring-2 ring-offset-2 ring-[#4A4947]"
                  : ""
              }`}
              style={{ backgroundColor: getColorHex(color) }}
              onClick={() => handleColorToggle(color)}
            >
              <span className="sr-only">{color}</span>
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={getRecommendations}
        disabled={
          preferences.styles.length === 0 && preferences.colors.length === 0
        }
        className="w-full py-2 rounded-lg bg-[#4A4947] text-white disabled:opacity-50"
      >
        Get Recommendations
      </button>
    </div>
  );
};

// Helper function
const getColorHex = (color) => {
  const colors = {
    red: "#ef4444",
    blue: "#3b82f6",
    green: "#10b981",
    neutral: "#a8a29e",
    black: "#000000",
    white: "#ffffff",
    multicolor: "linear-gradient(45deg, #ff0000, #00ff00, #0000ff)",
  };
  return colors[color] || "#ffffff";
};

export default FreeStyleAdvisor;
