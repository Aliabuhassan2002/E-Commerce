// routes/recommendationRoutes.js
const express = require("express");
const router = express.Router();
const {
  getStyleRecommendations,
  getPersonalizedRecommendations,
} = require("../controllers/recommendationController");
const verifyToken = require("../middlewares/verifyToken");

router.post("/style", getStyleRecommendations);
router.get("/personalized", verifyToken, getPersonalizedRecommendations);

module.exports = router;
