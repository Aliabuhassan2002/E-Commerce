// components/AIStyleAdvisor.jsx
import React, { useState } from "react";
import axios from "axios";

const AIStyleAdvisor = ({ onRecommendations }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [inputType, setInputType] = useState("text"); // 'text' or 'image'
  const [roomImage, setRoomImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  const [formData, setFormData] = useState({
    roomDescription: "",
    preferredStyles: [],
    colorPreferences: [],
    existingFurniture: "",
  });

  const styles = [
    "traditional",
    "modern",
    "bohemian",
    "transitional",
    "vintage",
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

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setRoomImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let response;

      if (inputType === "image" && roomImage) {
        const formData = new FormData();
        formData.append("image", roomImage);
        response = await axios.post(
          "http://localhost:5000/api/ai/analyze-room",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
          }
        );
      } else {
        console.log(formData);
        response = await axios.post(
          "http://localhost:5000/api/ai/style-recommendations",
          formData,
          {
            withCredentials: true,
          }
        );
      }

      onRecommendations(response.data);
    } catch (error) {
      console.error("Error getting AI recommendations:", error);
      alert("Failed to get recommendations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-[#4A4947] mb-6">
        AI Style Advisor
      </h2>

      <div className="flex mb-6">
        <button
          className={`flex-1 py-2 ${
            inputType === "text" ? "bg-[#4A4947] text-white" : "bg-gray-200"
          }`}
          onClick={() => setInputType("text")}
        >
          Describe Your Room
        </button>
        <button
          className={`flex-1 py-2 ${
            inputType === "image" ? "bg-[#4A4947] text-white" : "bg-gray-200"
          }`}
          onClick={() => setInputType("image")}
        >
          Upload Room Photo
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {inputType === "text" ? (
          <>
            {step === 1 && (
              <div className="mb-6">
                <label className="block text-lg font-semibold mb-2">
                  Describe your room:
                </label>
                <textarea
                  className="w-full p-3 border rounded-lg"
                  rows={4}
                  value={formData.roomDescription}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      roomDescription: e.target.value,
                    })
                  }
                  placeholder="E.g. 'My living room has a modern sofa, wooden coffee table, and lots of natural light...'"
                />
              </div>
            )}

            {step === 2 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">
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
                      onClick={() => {
                        const updated = formData.preferredStyles.includes(style)
                          ? formData.preferredStyles.filter((s) => s !== style)
                          : [...formData.preferredStyles, style];
                        setFormData({ ...formData, preferredStyles: updated });
                      }}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">
                  Color preferences:
                </h3>
                <div className="grid grid-cols-4 gap-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`h-12 rounded-lg border ${
                        formData.colorPreferences.includes(color)
                          ? "ring-2 ring-offset-2 ring-[#4A4947]"
                          : ""
                      }`}
                      style={{ backgroundColor: getColorHex(color) }}
                      onClick={() => {
                        const updated = formData.colorPreferences.includes(
                          color
                        )
                          ? formData.colorPreferences.filter((c) => c !== color)
                          : [...formData.colorPreferences, color];
                        setFormData({ ...formData, colorPreferences: updated });
                      }}
                    >
                      <span className="sr-only">{color}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="mb-6">
            <label className="block text-lg font-semibold mb-2">
              Upload a photo of your room:
            </label>
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              {previewImage ? (
                <div className="relative">
                  <img
                    src={previewImage}
                    alt="Room preview"
                    className="max-h-64 mx-auto mb-4"
                  />
                  <button
                    type="button"
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6"
                    onClick={() => {
                      setRoomImage(null);
                      setPreviewImage("");
                    }}
                  >
                    ×
                  </button>
                </div>
              ) : (
                <>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="room-upload"
                  />
                  <label
                    htmlFor="room-upload"
                    className="cursor-pointer bg-gray-100 hover:bg-gray-200 py-12 px-6 rounded-lg block"
                  >
                    <div className="text-gray-500">
                      Click to upload or drag and drop
                    </div>
                  </label>
                </>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-between mt-8">
          {inputType === "text" && step > 1 && (
            <button
              type="button"
              className="px-4 py-2 rounded-lg border border-[#4A4947] text-[#4A4947]"
              onClick={() => setStep(step - 1)}
            >
              Back
            </button>
          )}

          {inputType === "text" && step < 3 ? (
            <button
              type="button"
              className="px-4 py-2 rounded-lg bg-[#4A4947] text-white"
              onClick={() => setStep(step + 1)}
              disabled={
                (step === 1 && !formData.roomDescription.trim()) ||
                (step === 2 && formData.preferredStyles.length === 0)
              }
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#4A4947] text-white"
              disabled={
                loading ||
                (inputType === "text" && formData.colorPreferences.length === 0)
              }
            >
              {loading ? "Analyzing..." : "Get AI Recommendations"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

// Helper function (same as before)
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

export default AIStyleAdvisor;
