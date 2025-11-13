const express = require('express');
const multer = require('multer');
const Hostel = require('../models/Hostel');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

const fs = require('fs');
const path = require('path');

const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}


// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage: storage });


// Middleware to serve static files
const app = express();
app.use('/uploads', express.static('uploads'));

// Create hostel with image upload
router.post('/hostels', authMiddleware, upload.array('images', 10), async (req, res) => {
  try {
    // Create URLs for the uploaded files
    const imageUrls = req.files.map(file => `/uploads/${file.filename}`);

    // Create a new hostel document with the uploaded image URLs
    const hostel = new Hostel({
      ...req.body,
      images: imageUrls,
    });

    // Save the hostel document to the database
    await hostel.save();

    // Respond with the created hostel
    res.status(201).json(hostel);
  } catch (error) {
    console.error('Error creating hostel:', error.message || error); // Log the specific error
    res.status(400).json({ error: error.message || 'Error creating hostel' });
  }
});



// Get all hostels
router.get('/hostels', async (req, res) => {
  try {
    const hostels = await Hostel.find();
    res.status(200).json(hostels);
  } catch (error) {
    res.status(400).json({ error: 'Error fetching hostels' });
  }
});

// Get single hostel
router.get('/hostels/:id', async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.id);
    if (!hostel) return res.status(404).json({ error: 'Hostel not found' });
    res.status(200).json(hostel);
  } catch (error) {
    res.status(400).json({ error: 'Error fetching hostel' });
  }
});

// Update hostel
router.put('/hostels/:id', authMiddleware, async (req, res) => {
  try {
    const updatedHostelData = {
      name: req.body.name,
      images: req.body.images,
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
      legalDocumentation: req.body.legalDocumentation,
      price: req.body.price,

    };
    const hostel = await Hostel.findByIdAndUpdate(req.params.id, updatedHostelData, { new: true });
    if (!hostel) return res.status(404).json({ error: 'Hostel not found' });
    res.status(200).json(hostel);
  } catch (error) {
    res.status(400).json({ error: 'Error updating hostel' });
  }
});

// Delete hostel
router.delete('/hostels/:id', authMiddleware, async (req, res) => {
  try {
    const hostel = await Hostel.findByIdAndDelete(req.params.id);
    if (!hostel) return res.status(404).json({ error: 'Hostel not found' });
    res.status(200).json({ message: 'Hostel deleted' });
  } catch (error) {
    res.status(400).json({ error: 'Error deleting hostel' });
  }
});


module.exports = router;
