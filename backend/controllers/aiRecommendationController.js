// controllers/aiRecommendationController.js
const axios = require("axios");
const Product = require("../models/Product");
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Text-based style recommendations using OpenAI
const getAIStyleRecommendations = async (req, res) => {
  try {
    const {
      roomDescription,
      preferredStyles,
      colorPreferences,
      existingFurniture,
    } = req.body;

    const prompt = `Act as an interior design expert specializing in rugs. Recommend rug styles for:
    - Room type: ${roomDescription}
    - Preferred styles: ${preferredStyles.join(", ")}
    - Color preferences: ${colorPreferences.join(", ")}
    - Existing furniture: ${existingFurniture}
    
    Provide 3 specific recommendations with explanations in JSON format with fields: style, pattern, colors, size, reasoning.`;

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        response_format: { type: "json_object" },
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const recommendations = JSON.parse(
      response.data.choices[0].message.content
    );

    // Find matching products in database
    const matchingProducts = await Product.find({
      style: { $in: recommendations.map((r) => r.style) },
      colors: { $in: recommendations.flatMap((r) => r.colors) },
    }).limit(6);

    res.json({
      aiRecommendations: recommendations,
      matchingProducts,
    });
  } catch (error) {
    console.error(
      "AI recommendation error:",
      error.response?.data || error.message
    );
    res.status(500).json({ message: "Error getting AI recommendations" });
  }
};

// Image-based recommendations using Google Vision API
const analyzeRoomImage = async (req, res) => {
  try {
    const { imageUrl } = req.body;

    const response = await axios.post(
      `https://vision.googleapis.com/v1/images:annotate?key=${process.env.GOOGLE_VISION_API_KEY}`,
      {
        requests: [
          {
            image: { source: { imageUri: imageUrl } },
            features: [
              { type: "IMAGE_PROPERTIES" }, // For color analysis
              { type: "LABEL_DETECTION" }, // For identifying furniture/styles
            ],
          },
        ],
      }
    );

    const analysis = response.data.responses[0];
    const dominantColors =
      analysis.imagePropertiesAnnotation.dominantColors.colors;
    const roomLabels = analysis.labelAnnotations.map(
      (label) => label.description
    );

    // Convert analysis to product recommendations
    const recommendedStyles = detectStylesFromLabels(roomLabels);
    const recommendedColors = getTopColors(dominantColors);

    // Find matching products
    const products = await Product.find({
      style: { $in: recommendedStyles },
      colors: { $in: recommendedColors },
    }).limit(12);

    res.json({
      analysis: { styles: recommendedStyles, colors: recommendedColors },
      products,
    });
  } catch (error) {
    console.error(
      "Image analysis error:",
      error.response?.data || error.message
    );
    res.status(500).json({ message: "Error analyzing room image" });
  }
};

// Helper functions
function detectStylesFromLabels(labels) {
  const styleMapping = {
    modern: ["sleek", "contemporary", "minimalist"],
    traditional: ["classic", "antique", "vintage"],
    bohemian: ["eclectic", "colorful", "global"],
  };

  return Object.keys(styleMapping).filter((style) =>
    styleMapping[style].some((term) =>
      labels.some((label) => label.includes(term))
    )
  );
}

function getTopColors(colors, count = 3) {
  return colors
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map((c) => c.color);
}

module.exports = {
  getAIStyleRecommendations,
  analyzeRoomImage,
};
