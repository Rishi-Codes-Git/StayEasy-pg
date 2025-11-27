const mongoose = require('mongoose');

const hostelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  images: [
    {
      type: String, // URLs or paths to image files
    },
  ],
  sharing: {
    type: Number,
    required: true,
  },
  bathrooms: {
    type: Number,
    required: true,
  },
  floorArea: {
    type: Number, // e.g., square feet or square meters
    required: true,
  },
  totalBeds: {
    type: Number,
    required: true,
  },
  amenities: {
    type: [String], // Array of amenities, e.g., ['Gym', 'Swimming Pool', 'Parking']
  },
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  contactName: {
    type: String,
    required: true,
  },
  contactEmail: {
    type: String,
    required: true,
  },
  contactPhoneNumber: {
    type: String,
    required: true,
  },
  advance: {
    type: String, // URL or path to legal documents
  },
  price: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Hostel = mongoose.model('Hostel', hostelSchema);

module.exports = Hostel;

