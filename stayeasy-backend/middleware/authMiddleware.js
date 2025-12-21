const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ error: "No authentication token provided" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "change-this-secret-in-production"
    );
    const user = await User.findById(decoded.id);
    if (!user) throw new Error();

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: "Please authenticate" });
  }
};

// Middleware to check if user is owner
const ownerMiddleware = async (req, res, next) => {
  try {
    if (req.user.role !== "owner" && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ error: "Only owners can access this resource" });
    }
    next();
  } catch (error) {
    res.status(401).json({ error: "Authentication required" });
  }
};

// Middleware to check if user is admin
const adminMiddleware = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ error: "Only admins can access this resource" });
    }
    next();
  } catch (error) {
    res.status(401).json({ error: "Authentication required" });
  }
};

module.exports = { authMiddleware, ownerMiddleware, adminMiddleware };
