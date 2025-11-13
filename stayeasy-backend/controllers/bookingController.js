// src/controllers/bookingController.js

const nodemailer = require('nodemailer');

exports.processPayment = async (req, res) => {
  try {
    // Simulate payment processing (In reality, integrate with a payment gateway)
    const { amount } = req.body;
    if (amount === 100000) {
      res.status(200).json({ message: 'Payment processed successfully.' });
    } else {
      throw new Error('Invalid payment amount');
    }
  } catch (error) {
    console.error('Payment processing error:', error);
    res.status(500).json({ message: 'Error processing payment.' });
  }
};

exports.sendConfirmationEmail = async (req, res) => {
  try {
    const { email, bookingDetails } = req.body;

    // Configure the email transport using Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Booking Confirmation',
      text: `Your booking was successful! Details: ${bookingDetails}`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Confirmation email sent successfully.' });
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    res.status(500).json({ message: 'Error sending confirmation email.' });
  }
};
