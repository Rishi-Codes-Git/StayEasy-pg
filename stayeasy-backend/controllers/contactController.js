const nodemailer = require('nodemailer');
require('dotenv').config();

exports.contactOwner = async (req, res) => {
  const { name, email, message, ownerEmail } = req.body;

  // Debugging: Log the ownerEmail to ensure it's not undefined
  console.log('ownerEmail:', ownerEmail);

  if (!ownerEmail) {
    return res.status(400).json({ message: 'Owner email is required' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: email,
      to: ownerEmail, // Ensure this is correctly set
      subject: 'Inquiry about your hostel',
      text: `You have received a message from ${name} (${email}):\n\n${message}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Error in contactOwner:', error);
    res.status(500).json({ message: 'Failed to send email, please try again later' });
  }
};
