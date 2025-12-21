const crypto = require("crypto");
const nodemailer = require("nodemailer");
const User = require("../models/User");
require("dotenv").config(); // Load environment variables

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Validate email input
    if (!email || !email.trim()) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Don't reveal if user exists or not (security best practice)
      return res
        .status(200)
        .json({
          message: "If the email exists, a password reset link has been sent",
        });
    }

    // Generate a reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetToken = resetToken;
    user.resetTokenExpiration = Date.now() + 3600000; // 1 hour from now
    await user.save();

    // Check if email credentials are configured
    if (
      !process.env.EMAIL_USER ||
      !process.env.EMAIL_PASS ||
      process.env.EMAIL_USER === "your-email@gmail.com" ||
      process.env.EMAIL_PASS === "your-app-specific-password-here"
    ) {
      console.error(
        "Email configuration missing. Please set EMAIL_USER and EMAIL_PASS in .env"
      );
      // For testing/development - return success but log the reset token
      console.log(`Reset token for ${email}: ${resetToken}`);
      return res.status(200).json({
        message: "Email configuration not set. Contact administrator.",
        token: resetToken, // Return token for testing purposes
      });
    }

    // Create a reset password link with the token as a query parameter
    const resetPasswordLink = `${
      process.env.FRONTEND_URL || "http://localhost:3000"
    }/reset-password?token=${resetToken}`;

    // Configure Nodemailer using environment variables
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "StayEasy - Password Reset",
      html: `
        <h2>Password Reset Request</h2>
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <a href="${resetPasswordLink}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Reset Password
        </a>
        <p>Or copy and paste this link: ${resetPasswordLink}</p>
        <p><strong>This link will expire in 1 hour.</strong></p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
      text: `You requested a password reset. Click the following link to reset your password: ${resetPasswordLink}\n\nThis link will expire in 1 hour.`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Password reset email sent successfully" });
  } catch (error) {
    console.error("Error in forgotPassword:", error.message);
    res.status(500).json({
      message: "Error processing request. Please try again later.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
