const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("path");
const fs = require("fs");
const authRoutes = require("./routes/auth");
const hostelRoutes = require("./routes/hostel");
const userRoutes = require("./routes/userRoutes");
const { authMiddleware } = require("./middleware/authMiddleware");
const { forgotPassword } = require("./controllers/authController"); // Import the forgotPassword controller
const resetPasswordRoutes = require("./routes/resetPasswordRoutes");
const contactRoutes = require("./routes/contact");
const pdfRoutes = require("./routes/pdfRoutes"); // Import the new PDF route
const contactOwnerRoutes = require("./routes/contactOwnerRoutes");
const bookingRoutes = require("./routes/booking");
require("dotenv").config(); // Ensure .env variables are loaded

const app = express();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Security Middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
); // Set security HTTP headers with CORS for images

// Restrict CORS to specific origin
const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:3000",
  "https://stay-easy-pg.vercel.app",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Content-Type"],
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Serve uploaded files with proper CORS headers
const uploadCorsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};
app.use(
  "/uploads",
  cors(uploadCorsOptions),
  express.static(path.join(__dirname, "uploads"))
);

// Connect to MongoDB with environment variable
const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/stayeasy";
mongoose.connect(mongoUri).catch((err) => {
  console.error("MongoDB connection error:", err);
  process.exit(1);
});

// Serve the main page
app.get("/", (req, res) => {
  res.send("Welcome to the homepage!");
});

// Serve the admin page (accessible directly at /admin)
app.get("/admin", (req, res) => {
  res.send("Welcome to the admin page!");
});

app.use("/api", authRoutes);
app.use("/api", hostelRoutes);
app.use("/api", userRoutes);
app.use("/api", resetPasswordRoutes);
app.use("/api", contactRoutes);
app.use("/api", pdfRoutes); // Add the PDF route
app.use("/api", contactOwnerRoutes);
app.use("/booking", bookingRoutes);

// Forgot Password route
app.post("/api/forgot-password", forgotPassword); // Add the forgot password route

// Dashboard route
app.get("/api/dashboard", authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
