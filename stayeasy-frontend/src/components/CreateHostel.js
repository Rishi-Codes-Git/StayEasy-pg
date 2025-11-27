import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CreateHostel.css';

const CreateHostel = () => {
  const [formFields, setFormFields] = useState({
    name: '',
    description: '',
    images: [],
    sharing: '',
    bathrooms: '',
    floorArea: '',
    totalBeds: '',
    amenities: '',
    address: '',
    city: '',
    state: '',
    country: '',
    contactName: '',
    contactEmail: '',
    contactPhoneNumber: '',
    advance: '',
    price: '',
  });

  const navigate = useNavigate();

  const validate = () => {
    let formErrors = [];

    if (!formFields.name.trim()) formErrors.push('Hostel name is required');
    if (!formFields.description.trim()) formErrors.push('Hostel description is required');

    if (!formFields.contactEmail) {
      formErrors.push('Contact email is required');
    } else if (!/\S+@\S+\.\S+/.test(formFields.contactEmail)) {
      formErrors.push('Email address is invalid');
    }

    if (!formFields.contactPhoneNumber) {
      formErrors.push('Contact phone number is required');
    } else if (!/^\d{10}$/.test(formFields.contactPhoneNumber)) {
      formErrors.push('Phone number must be exactly 10 digits');
    }

    if (!formFields.price || formFields.price <= 0) {
      formErrors.push('Price must be a positive number');
    }

    if (formErrors.length > 0) {
      alert(formErrors.join('\n'));
      return false;
    }

    return true;
  };

  const handleChange = (e) => {
    setFormFields({ ...formFields, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormFields({ ...formFields, images: files });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    const formData = new FormData();
    for (let key in formFields) {
      formData.append(key, formFields[key]);
    }
    formFields.images.forEach(image => formData.append('images', image));

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/hostels', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      navigate('/admin');
    } catch (error) {
      console.error('Error creating hostel:', error.response.data);
    }
  };

  return (
    <div className="create-hostel-page">
      <div className="create-hostel-container">
        <h1 className="create-hostel-title">Create Hostel</h1>
        <form className="create-hostel-form" onSubmit={handleSubmit} encType="multipart/form-data">
          <input
            type="text"
            name="name"
            placeholder="Hostel Name"
            required
            onChange={handleChange}
            className="create-hostel-input"
          />
          <textarea
            name="description"
            placeholder="Hostel Description"
            required
            onChange={handleChange}
            className="create-hostel-textarea"
          />
          <input
            type="file"
            name="images"
            multiple
            onChange={handleImageChange}
            className="create-hostel-input"
          />
          <input
            type="number"
            name="sharing"
            placeholder="Sharing"
            required
            onChange={handleChange}
            className="create-hostel-input"
          />
          <input
            type="number"
            name="bathrooms"
            placeholder="Bathrooms"
            required
            onChange={handleChange}
            className="create-hostel-input"
          />
          <input
            type="number"
            name="floorArea"
            placeholder="Floor Area (sq. ft.)"
            onChange={handleChange}
            className="create-hostel-input"
          />
          <input
            type="number"
            name="totalBeds"
            placeholder="Total Beds"
            onChange={handleChange}
            className="create-hostel-input"
          />
          <input
            type="text"
            name="amenities"
            placeholder="Amenities (comma separated)"
            onChange={handleChange}
            className="create-hostel-input"
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            required
            onChange={handleChange}
            className="create-hostel-input"
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            required
            onChange={handleChange}
            className="create-hostel-input"
          />
          <input
            type="text"
            name="state"
            placeholder="State"
            required
            onChange={handleChange}
            className="create-hostel-input"
          />
          <input
            type="text"
            name="country"
            placeholder="Country"
            required
            onChange={handleChange}
            className="create-hostel-input"
          />
          <input
            type="text"
            name="contactName"
            placeholder="Contact Name"
            required
            onChange={handleChange}
            className="create-hostel-input"
          />
          <input
            type="email"
            name="contactEmail"
            placeholder="Contact Email"
            required
            onChange={handleChange}
            className="create-hostel-input"
          />
          <input
            type="tel"
            name="contactPhoneNumber"
            placeholder="Contact Phone Number"
            required
            onChange={handleChange}
            className="create-hostel-input"
          />
          <textarea
            name="advance"
            placeholder="Advance"
            onChange={handleChange}
            className="create-hostel-textarea"
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            required
            onChange={handleChange}
            className="create-hostel-input"
          />
          <button type="submit" className="create-hostel-button">Create Hostel</button>
        </form>
      </div>
    </div>
  );
};

export default CreateHostel;
