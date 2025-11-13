import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './UpdateProfile.css'; 

const UpdateProfile = () => {
  const [user, setUser] = useState({ username: '', email: '', phone: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/');
          return;
        }

        const response = await axios.get('http://localhost:5000/api/dashboard', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data.user);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        navigate('/');
      }
    };

    fetchUser();
  }, [navigate]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const errors = [];
    
    // Validate username: minimum 3 characters
    if (user.username.trim().length < 3) {
      errors.push('Username must be at least 3 characters long');
    }

    // Validate email: basic email format validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(user.email)) {
      errors.push('Please enter a valid email address');
    }

    // Validate phone: must be 10 digits
    const phonePattern = /^\d{10}$/;
    if (user.phone && !phonePattern.test(user.phone)) {
      errors.push('Phone number must be 10 digits long');
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      alert(validationErrors.join('\n'));
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put('http://localhost:5000/api/update-profile', user, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
  
      alert('Profile updated successfully');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile. Please try again.');
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="update-profile-page">
      <div className="update-profile-container">
        <h2>Update Profile</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={user.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone:</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={user.phone}
              onChange={handleChange}
            />
          </div>
          <button type="submit">Update Profile</button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;
