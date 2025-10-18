const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  try {
    // Get token from cookies
    const token = req.cookies.token;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }

    // Verify token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Invalid or expired token." });
      }
      req.user = decoded; // Attach user data to request
      next();
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = verifyToken;
