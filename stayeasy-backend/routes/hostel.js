const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const Hostel = require("../models/Hostel");
const {
  authMiddleware,
  ownerMiddleware,
} = require("../middleware/authMiddleware");

require("dotenv").config();

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure multer storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "stayeasy-hostels",
    resource_type: "auto",
    allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],
  },
});

// File filter for images only
const fileFilter = (req, file, cb) => {
  const allowedMimes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max file size
});

// Create hostel with image upload - ONLY for owners
router.post(
  "/hostels",
  authMiddleware,
  ownerMiddleware,
  upload.array("images", 10),
  async (req, res) => {
    try {
      // Get Cloudinary URLs from uploaded files
      const imageUrls = req.files
        ? req.files.map((file) => file.path) // Cloudinary returns the URL in 'path'
        : [];

      // Convert string numbers to actual numbers
      const hostelData = {
        ...req.body,
        sharing: parseInt(req.body.sharing) || 1,
        bathrooms: parseInt(req.body.bathrooms) || 1,
        floorArea: parseInt(req.body.floorArea) || 100,
        totalBeds: parseInt(req.body.totalBeds) || 1,
        price: parseFloat(req.body.price) || 0,
        advance: parseFloat(req.body.advance) || 0,
        images: imageUrls,
        ownerId: req.user._id,
      };

      // Create a new hostel document with the uploaded image URLs and owner ID
      const hostel = new Hostel(hostelData);

      // Save the hostel document to the database
      await hostel.save();

      // Respond with the created hostel
      res.status(201).json(hostel);
    } catch (error) {
      console.error("Error creating hostel:", error.message || error);
      console.error("Request body:", req.body);
      res.status(400).json({
        error: error.message || "Error creating hostel",
        details: error.errors,
      });
    }
  }
);

// Get all hostels (public endpoint, no auth required)
router.get("/hostels", async (req, res) => {
  try {
    const hostels = await Hostel.find().populate("ownerId", "username email");
    res.status(200).json(hostels);
  } catch (error) {
    res.status(400).json({ error: "Error fetching hostels" });
  }
});

// Get hostels for logged-in owner (only their hostels)
router.get("/my-hostels", authMiddleware, ownerMiddleware, async (req, res) => {
  try {
    const hostels = await Hostel.find({ ownerId: req.user._id });
    res.status(200).json(hostels);
  } catch (error) {
    res.status(400).json({ error: "Error fetching hostels" });
  }
});

// Get single hostel
router.get("/hostels/:id", async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.id).populate(
      "ownerId",
      "username email"
    );
    if (!hostel) return res.status(404).json({ error: "Hostel not found" });
    res.status(200).json(hostel);
  } catch (error) {
    res.status(400).json({ error: "Error fetching hostel" });
  }
});

// Update hostel - owner can update their own hostel, admin can update any hostel
router.put(
  "/hostels/:id",
  authMiddleware,
  ownerMiddleware,
  upload.array("images", 10),
  async (req, res) => {
    try {
      // Check if the hostel belongs to the current user or user is admin
      const hostel = await Hostel.findById(req.params.id);
      if (!hostel) return res.status(404).json({ error: "Hostel not found" });

      // Allow admins to edit all hostels, owners can only edit their own
      if (
        req.user.role !== "admin" &&
        hostel.ownerId.toString() !== req.user._id.toString()
      ) {
        return res
          .status(403)
          .json({ error: "You can only edit your own hostels" });
      }

      // Handle images: use new uploaded images or keep existing ones
      let updatedImages = hostel.images; // Keep existing images by default
      if (req.files && req.files.length > 0) {
        // If new files are uploaded, replace with Cloudinary URLs
        updatedImages = req.files.map((file) => file.path); // Cloudinary returns URL in 'path'
      }

      const updatedHostelData = {
        name: req.body.name,
        images: updatedImages,
        description: req.body.description,
        sharing: req.body.sharing,
        bathrooms: req.body.bathrooms,
        floorArea: req.body.floorArea,
        totalBeds: req.body.totalBeds,
        amenities: req.body.amenities,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        country: req.body.country,
        contactName: req.body.contactName,
        contactEmail: req.body.contactEmail,
        contactPhoneNumber: req.body.contactPhoneNumber,
        advance: req.body.advance,
        price: req.body.price,
      };
      const updatedHostel = await Hostel.findByIdAndUpdate(
        req.params.id,
        updatedHostelData,
        { new: true }
      );
      res.status(200).json(updatedHostel);
    } catch (error) {
      res.status(400).json({ error: "Error updating hostel" });
    }
  }
);

// Delete hostel - owner can delete their own hostel, admin can delete any hostel
router.delete(
  "/hostels/:id",
  authMiddleware,
  ownerMiddleware,
  async (req, res) => {
    try {
      const hostel = await Hostel.findById(req.params.id);
      if (!hostel) return res.status(404).json({ error: "Hostel not found" });

      // Allow admins to delete all hostels, owners can only delete their own
      if (
        req.user.role !== "admin" &&
        hostel.ownerId.toString() !== req.user._id.toString()
      ) {
        return res
          .status(403)
          .json({ error: "You can only delete your own hostels" });
      }

      await Hostel.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "Hostel deleted" });
    } catch (error) {
      res.status(400).json({ error: "Error deleting hostel" });
    }
  }
);

module.exports = router;
