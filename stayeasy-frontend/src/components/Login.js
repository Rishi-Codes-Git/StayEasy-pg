import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Reset error message
    // console.log('Login Payload:', formData); // Log the payload
    try {
      const response = await axios.post('http://localhost:5000/api/login', formData);
      localStorage.setItem('token', response.data.token);
      navigate('/dashboard'); // Redirect to dashboard
    } catch (error) {
      console.error('Login Error:', error.response?.data); // Log error response
      setError('Invalid email or password');
      //console.error(error);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        {error && <p className="error-message">{error}</p>}
        <h1>Login Form</h1>
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          value={formData.email}
          onChange={handleChange}
          className="login-input"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          value={formData.password}
          onChange={handleChange}
          className="login-input"
        />
        <button type="submit" className="login-button">Login</button>
        <p className="login-links">
          <Link to="/forgot-password">Forgot Password?</Link>
        </p>
        <p className="login-links">
          New User? <Link to="/signup">Sign Up</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;


