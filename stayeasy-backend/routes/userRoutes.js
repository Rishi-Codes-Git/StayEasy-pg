const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Update profile route
router.put('/update-profile', authMiddleware, async (req, res) => {
  const { username, phone, email } = req.body;
  
  try {
    // Find the user by ID from the auth middleware
    const user = await User.findById(req.user._id);
    console.log('Fetched User:', user);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update fields
    if (username) user.username = username;
    if (phone) user.phone = phone;
    if (email) user.email = email;

    // Save the updated user
    await user.save();

    // Generate a new token if the email has changed
    const token = jwt.sign({ id: user._id }, 'secret', { expiresIn: '1h' });

    res.status(200).json({ message: 'Profile updated successfully', token });
  } catch (error) {
    console.error('Error updating profile:', error.message || error);
    res.status(500).json({ error: 'Failed to update profile. Please try again.' });
  }
});

module.exports = router;
