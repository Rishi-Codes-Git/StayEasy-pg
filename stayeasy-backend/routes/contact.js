const express = require('express');
const Contact = require('../models/Contact');

const router = express.Router();

// POST route to handle form submission
router.post('/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    const newContact = new Contact({ name, email, subject, message });
    await newContact.save(); // Save the data to the database
    res.status(200).json({ message: 'Message sent successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send message', error });
  }
});

module.exports = router;
