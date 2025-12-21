const express = require("express");
const multer = require("multer");
const Hostel = require("../models/Hostel");
const {
  authMiddleware,
  ownerMiddleware,
} = require("../middleware/authMiddleware");

const router = express.Router();

const fs = require("fs");
const path = require("path");

const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads with absolute path
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    // Sanitize filename and add timestamp
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
    cb(null, `${Date.now()}-${sanitizedName}`);
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
      // Create URLs for the uploaded files
      const imageUrls = req.files.map((file) => `/uploads/${file.filename}`);

      // Create a new hostel document with the uploaded image URLs and owner ID
      const hostel = new Hostel({
        ...req.body,
        images: imageUrls,
        ownerId: req.user._id,
      });

      // Save the hostel document to the database
      await hostel.save();

      // Respond with the created hostel
      res.status(201).json(hostel);
    } catch (error) {
      console.error("Error creating hostel:", error.message || error);
      res.status(400).json({ error: error.message || "Error creating hostel" });
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
        // If new files are uploaded, replace with new URLs
        updatedImages = req.files.map((file) => `/uploads/${file.filename}`);
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
