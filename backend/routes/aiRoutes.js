// routes/aiRoutes.js
const express = require("express");
const router = express.Router();
const {
  getAIStyleRecommendations,
  analyzeRoomImage,
} = require("../controllers/aiRecommendationController");
const verifyToken = require("../middlewares/verifyToken");

router.post("/style-recommendations", verifyToken, getAIStyleRecommendations);
router.post("/analyze-room", verifyToken, analyzeRoomImage);

module.exports = router;
