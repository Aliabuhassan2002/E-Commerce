// components/StyleAdvisor.jsx
import React, { useState } from "react";
import axios from "axios";

const StyleAdvisor = ({ onRecommendations }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    roomType: "",
    preferredStyles: [],
    colorScheme: [],
    existingFurniture: "",
  });

  const roomTypes = [
    "living-room",
    "bedroom",
    "dining-room",
    "office",
    "hallway",
    "outdoor",
  ];
  const styles = [
    "traditional",
    "modern",
    "bohemian",
    "transitional",
    "vintage",
    "contemporary",
  ];
  const colors = [
    "red",
    "blue",
    "green",
    "neutral",
    "black",
    "white",
    "multicolor",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMultiSelect = (name, value) => {
    setFormData((prev) => {
      const currentValues = [...prev[name]];
      const index = currentValues.indexOf(value);

      if (index === -1) {
        currentValues.push(value);
      } else {
        currentValues.splice(index, 1);
      }

      return { ...prev, [name]: currentValues };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/recommendations/style",
        formData
      );
      onRecommendations(response.data);
    } catch (error) {
      console.error("Error getting recommendations:", error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-[#4A4947] mb-6">Style Advisor</h2>

      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">
              What room are you decorating?
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {roomTypes.map((room) => (
                <button
                  key={room}
                  type="button"
                  className={`p-3 rounded-lg border ${
                    formData.roomType === room
                      ? "bg-[#4A4947] text-white"
                      : "bg-white text-[#4A4947]"
                  }`}
                  onClick={() =>
                    handleChange({ target: { name: "roomType", value: room } })
                  }
                >
                  {room.split("-").join(" ")}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">
              Which styles do you prefer?
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {styles.map((style) => (
                <button
                  key={style}
                  type="button"
                  className={`p-3 rounded-lg border ${
                    formData.preferredStyles.includes(style)
                      ? "bg-[#4A4947] text-white"
                      : "bg-white text-[#4A4947]"
                  }`}
                  onClick={() => handleMultiSelect("preferredStyles", style)}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">
              What's your color scheme?
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`p-3 rounded-lg border ${
                    formData.colorScheme.includes(color)
                      ? "ring-2 ring-offset-2 ring-[#4A4947]"
                      : ""
                  }`}
                  style={{ backgroundColor: getColorHex(color) }}
                  onClick={() => handleMultiSelect("colorScheme", color)}
                >
                  <span className="sr-only">{color}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-between mt-8">
          {step > 1 && (
            <button
              type="button"
              className="px-4 py-2 rounded-lg border border-[#4A4947] text-[#4A4947]"
              onClick={() => setStep(step - 1)}
            >
              Back
            </button>
          )}

          {step < 3 ? (
            <button
              type="button"
              className="px-4 py-2 rounded-lg bg-[#4A4947] text-white"
              onClick={() => setStep(step + 1)}
              disabled={
                (step === 1 && !formData.roomType) ||
                (step === 2 && formData.preferredStyles.length === 0)
              }
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#4A4947] text-white"
              disabled={formData.colorScheme.length === 0}
            >
              Get Recommendations
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

// Helper function for color display
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

export default StyleAdvisor;
