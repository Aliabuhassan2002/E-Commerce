const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contactController");
const { contactValidationRules } = require("../middlewares/validators");
// const { protect, admin } = require("../middlewares/authMiddleware");

// Public routes
router.post("/", contactValidationRules, contactController.submitContactForm);

// Admin routes
router.get("/", contactController.getContactSubmissions);

module.exports = router;
