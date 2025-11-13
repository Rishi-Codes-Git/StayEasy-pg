const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

exports.sendConfirmationEmail = (email, bookingDetails) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Your Booking is Confirmed!',
    text: `Dear Customer,\n\nYour booking is confirmed.\n\nDetails:\n${bookingDetails}\n\nThank you for booking with us.`,
  };

  return transporter.sendMail(mailOptions);
};
