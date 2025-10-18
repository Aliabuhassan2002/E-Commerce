const express = require("express");
const {
  requestProviderRole,
  getUserDetails,
} = require("../controllers/poviderReqController");
const verifyToken = require("../middlewares/verifyToken");
const upload = require("../middlewares/upload");

const router = express.Router();

// Get user details
router.get("/user", verifyToken, getUserDetails);

// Submit provider request with file uploads
router.post(
  "/request",
  verifyToken,
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "identityDocument", maxCount: 1 },
  ]),
  requestProviderRole
);

module.exports = router;
