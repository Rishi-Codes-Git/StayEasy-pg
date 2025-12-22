import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import API_BASE_URL from "../config";
import "./Signup.css";

const OwnerSignup = () => {
  const [formData, setFormData] = useState({
    username: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Phone number validation
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      alert("Phone number must be exactly 10 digits");
      return;
    }

    // Password validation
    if (formData.password.length < 8) {
      alert("Password must be at least 8 characters long");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/owner-signup`,
        formData
      );
      console.log(response.data); // Handle successful response
      localStorage.setItem("token", response.data.token); // Save token to localStorage
      localStorage.setItem("userRole", response.data.role); // Save role to localStorage
      window.location.href = "/owner-dashboard"; // Redirect to Owner Dashboard
    } catch (error) {
      console.error(error); // Handle error response
      alert(error.response?.data?.error || "Error creating owner account");
    }
  };

  return (
    <div className="signup-container">
      <form onSubmit={handleSubmit} className="signup-form">
        <h1>Hostel Owner Sign Up</h1>
        <input
          type="text"
          name="username"
          placeholder="Business Name / Username"
          required
          onChange={handleChange}
          className="signup-input"
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          required
          onChange={handleChange}
          className="signup-input"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          onChange={handleChange}
          className="signup-input"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          onChange={handleChange}
          className="signup-input"
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          required
          onChange={handleChange}
          className="signup-input"
        />
        <button type="submit" className="signup-button">
          Create Owner Account
        </button>
        <p className="signup-links">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
        <p className="signup-links">
          Guest User? <Link to="/signup">Sign Up as Guest</Link>
        </p>
      </form>
    </div>
  );
};

export default OwnerSignup;
