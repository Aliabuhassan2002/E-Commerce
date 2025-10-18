const express = require("express");
const {
  registerUser,
  login,
  logout,
} = require("../controllers/authController");
const verifyToken = require("../middlewares/verifyToken");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", login);
router.post("/logout", logout); // New logout route
// Protected route example
router.get("/me", verifyToken, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
