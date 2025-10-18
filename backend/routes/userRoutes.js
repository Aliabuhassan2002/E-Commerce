const express = require("express");
const {
  getUserInfo,
  updateUser,
  getUserOrders,
} = require("../controllers/userController");
const verifyToken = require("../middlewares/verifyToken");

const router = express.Router();

router.get("/user", verifyToken, getUserInfo);
router.put("/update", verifyToken, updateUser);
router.get("/orders", verifyToken, getUserOrders);

module.exports = router;
