import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './EditHostel.css'; // Import the CSS file

const EditHostel = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    images: [],
    sharing: 0,
    bathrooms: 0,
    floorArea: '',
    totalBeds: '',
    amenities: [],
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

  useEffect(() => {
    const fetchHostel = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/hostels/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFormData(response.data);
      } catch (error) {
        console.error('Error fetching hostel:', error);
      }
    };

    fetchHostel();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map((file) => URL.createObjectURL(file));
    setFormData({ ...formData, images: imageUrls });
  };

  const validate = () => {
    let formErrors = [];

    if (!formData.name.trim()) formErrors.push('Hostel name is required');
    if (!formData.description.trim()) formErrors.push('Hostel description is required');

    if (!formData.contactEmail) {
      formErrors.push('Contact email is required');
    } else if (!/\S+@\S+\.\S+/.test(formData.contactEmail)) {
      formErrors.push('Email address is invalid');
    }

    if (!formData.contactPhoneNumber) {
      formErrors.push('Contact phone number is required');
    } else if (!/^\d{10}$/.test(formData.contactPhoneNumber)) {
      formErrors.push('Phone number must be exactly 10 digits');
    }

    if (!formData.price || formData.price <= 0) {
      formErrors.push('Price must be a positive number');
    }

    if (formErrors.length > 0) {
      alert(formErrors.join('\n'));
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/hostels/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate('/admin');
    } catch (error) {
      console.error('Error updating hostel:', error);
    }
  };

  return (
    <div className="edit-hostel-page">
      <div className="edit-hostel-container">
        <h1>Edit Hostel</h1>
        <form onSubmit={handleSubmit} className="edit-hostel-form">
          {[
            { label: 'Hostel Name', name: 'name', type: 'text', placeholder: 'Enter the hostel name' },
            { label: 'Hostel Description', name: 'description', type: 'textarea', placeholder: 'Enter the hostel description' },
            { label: 'Number of Sharing', name: 'sharing', type: 'number', placeholder: 'Enter the number of sharing' },
            { label: 'Number of Bathrooms', name: 'bathrooms', type: 'number', placeholder: 'Enter the number of bathrooms' },
            { label: 'Floor Area (sq. ft.)', name: 'floorArea', type: 'text', placeholder: 'Enter the floor area in square feet' },
            { label: 'Total Beds', name: 'totalBeds', type: 'number', placeholder: 'Enter the total number of beds' },
            { label: 'Amenities (comma separated)', name: 'amenities', type: 'text', placeholder: 'Enter amenities separated by commas' },
            { label: 'Address', name: 'address', type: 'text', placeholder: 'Enter the hostel address' },
            { label: 'City', name: 'city', type: 'text', placeholder: 'Enter the city' },
            { label: 'State', name: 'state', type: 'text', placeholder: 'Enter the state' },
            { label: 'Country', name: 'country', type: 'text', placeholder: 'Enter the country' },
            { label: 'Contact Name', name: 'contactName', type: 'text', placeholder: 'Enter the contact name' },
            { label: 'Contact Email', name: 'contactEmail', type: 'email', placeholder: 'Enter the contact email' },
            { label: 'Contact Phone Number', name: 'contactPhoneNumber', type: 'text', placeholder: 'Enter the contact phone number' },
            { label: 'Advance', name: 'advance', type: 'number', placeholder: 'Enter any Advance' },
            { label: 'Price', name: 'price', type: 'number', placeholder: 'Enter the price' }
          ].map(({ label, name, type, placeholder }) => (
            <div key={name} className={`form-group ${type === 'textarea' ? 'full-width' : ''}`}>
              <label htmlFor={name}>{label}</label>
              {type === 'textarea' ? (
                <textarea
                  name={name}
                  id={name}
                  placeholder={placeholder}
                  value={formData[name]}
                  onChange={handleChange}
                  className="edit-hostel-textarea"
                />
              ) : (
                <input
                  type={type}
                  name={name}
                  id={name}
                  placeholder={placeholder}
                  required={type !== 'text' && type !== 'textarea'}
                  value={formData[name]}
                  onChange={handleChange}
                  className="edit-hostel-input"
                />
              )}
            </div>
          ))}
          <div className="form-group">
            <label htmlFor="images">Hostel Images</label>
            <input
              type="file"
              name="images"
              id="images"
              multiple
              onChange={handleImageChange}
              className="edit-hostel-file"
            />
          </div>
          <button type="submit" className="edit-hostel-button">Update Hostel</button>
        </form>
      </div>
    </div>
  );
};

export default EditHostel;
