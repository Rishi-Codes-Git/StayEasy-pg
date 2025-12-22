const express = require("express");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const rateLimit = require("express-rate-limit");
const User = require("../models/User");

const { forgotPassword } = require("../controllers/authController");
const router = express.Router();

// Rate limiters
const signupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // Increased to 50 for testing/demo
  message: "Too many signup attempts, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per 15 minutes
  message: "Too many login attempts, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
});

// Input validation middleware
const validateEmail = body("email")
  .isEmail()
  .normalizeEmail()
  .withMessage("Invalid email format");

const validatePassword = body("password")
  .isLength({ min: 8 })
  .withMessage("Password must be at least 8 characters");

const validateUsername = body("username")
  .trim()
  .isLength({ min: 3, max: 50 })
  .withMessage("Username must be between 3 and 50 characters");

const validatePhone = body("phone")
  .matches(/^[0-9]{10}$/)
  .withMessage("Phone number must be 10 digits");

// Forgot password route with input validation
router.post("/forgot-password", validateEmail, async (req, res) => {
  // Check validation results
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Call forgotPassword controller
  forgotPassword(req, res);
});

// Signup route - default is 'user' role
router.post(
  "/signup",
  signupLimiter,
  validateUsername,
  validatePhone,
  validateEmail,
  validatePassword,
  async (req, res) => {
    // Check validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { username, phone, email, password } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }

      // Create a new user with default role 'user'
      const user = new User({
        username,
        phone,
        email,
        password,
        role: "user",
      });
      await user.save();

      // Generate a token using JWT_SECRET from environment
      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET || "change-this-secret-in-production",
        { expiresIn: "1h" }
      );

      // Send the token to the client
      res.status(201).json({
        token,
        message: "User created successfully",
        role: user.role,
      });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(400).json({ error: "Error creating user" });
    }
  }
);

// Owner signup route
router.post(
  "/owner-signup",
  signupLimiter,
  validateUsername,
  validatePhone,
  validateEmail,
  validatePassword,
  async (req, res) => {
    // Check validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { username, phone, email, password } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }

      // Create a new user with 'owner' role
      const user = new User({
        username,
        phone,
        email,
        password,
        role: "owner",
      });
      await user.save();

      // Generate a token using JWT_SECRET from environment
      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET || "change-this-secret-in-production",
        { expiresIn: "1h" }
      );

      // Send the token to the client
      res.status(201).json({
        token,
        message: "Owner created successfully",
        role: user.role,
      });
    } catch (error) {
      console.error("Owner Signup error:", error);
      res.status(400).json({ error: "Error creating owner" });
    }
  }
);

// Login route
router.post(
  "/login",
  loginLimiter,
  validateEmail,
  validatePassword,
  async (req, res) => {
    // Check validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user)
        return res.status(401).json({ error: "Invalid email or password" });

      const isMatch = await user.comparePassword(password);

      if (!isMatch)
        return res.status(401).json({ error: "Invalid email or password" });

      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET || "change-this-secret-in-production",
        { expiresIn: "1h" }
      );
      res.status(200).json({ token, role: user.role });
    } catch (error) {
      console.error("Login Error:", error);
      res.status(400).json({ error: "Error logging in" });
    }
  }
);

module.exports = router;
