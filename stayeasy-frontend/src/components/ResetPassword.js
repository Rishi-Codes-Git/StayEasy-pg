import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import './ResetPassword.css';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing token.');
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    console.log('Token:', token); // Log the token to verify it

    try {
      const response = await axios.post('http://localhost:5000/api/reset-password', { token, newPassword });
      setSuccess(response.data.message);
      setTimeout(() => navigate('/login'), 2000); // Redirect after 2 seconds
    } catch (error) {
      console.error('Reset Password Error:', error); // Log error details
      console.error('Backend Error:', error.response?.data); // Log the backend error details
      setError(error.response?.data.message || 'Failed to reset password');
    }
  };

  return (
    <div className="reset-password-container">
      <form onSubmit={handleSubmit} className="reset-password-form">
        <h1>Reset Password</h1>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
        <input
          type="password"
          name="newPassword"
          placeholder="New Password"
          required
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="reset-password-input"
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="reset-password-input"
        />
        <button type="submit" className="reset-password-button">Reset Password</button>
      </form>
    </div>
  );
};

export default ResetPassword;
