import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Invalid email address');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/forgot-password', { email });
      setMessage('Password reset link has been sent to your email.');
    } catch (error) {
      setError(
        error.response?.status === 404 
          ? 'Email not found. Please check your email and try again.' 
          : 'Failed to send reset link. Please try again later.'
      );
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-container">
        <form onSubmit={handleSubmit} className="forgot-password-form">
          <h1>Forgot Password</h1>
          {message && <p className="success-message">{message}</p>}
          {error && <p className="error-message">{error}</p>}
          {loading && <p className="loading-message">Sending reset link...</p>}
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            required
            value={email}
            onChange={handleChange}
            className="forgot-password-input"
          />
          <button type="submit" className="forgot-password-button" disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
          <p className="forgot-password-links">
            <Link to="/login">Back to Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
