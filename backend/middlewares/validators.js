const { body, validationResult } = require("express-validator");

exports.contactValidationRules = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ max: 100 })
    .withMessage("Name cannot exceed 100 characters"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail(),

  body("message")
    .trim()
    .notEmpty()
    .withMessage("Message is required")
    .isLength({ max: 2000 })
    .withMessage("Message cannot exceed 2000 characters"),

  body("phone")
    .optional()
    .trim()
    .isMobilePhone()
    .withMessage("Please enter a valid phone number"),

  body("address")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Address cannot exceed 200 characters"),
];
