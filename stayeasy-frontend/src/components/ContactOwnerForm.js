import axios from "axios";
import React, { useState } from "react";
import API_BASE_URL from "../config";
import "./ContactOwnerForm.css";

const ContactOwnerForm = ({ hostel, onClose }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${API_BASE_URL}/api/contact-owner`, {
        name,
        email,
        message,
        ownerEmail: hostel.contactEmail, // Ensure ownerEmail is passed here
      });

      console.log(response.data.message);
      onClose(); // Close the modal after successful submission
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close-button" onClick={onClose}>
          &times;
        </span>
        <h2>Contact {hostel.contactName}</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Your Name:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
          <label>
            Your Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label>
            Your Message:
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </label>
          <button type="submit">Send Message</button>
        </form>
      </div>
    </div>
  );
};

export default ContactOwnerForm;
