import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './admindashboard.css';

const AdminDashboard = () => {
  const [hostels, setHostels] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHostels = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/');
          return;
        }
        const response = await axios.get('http://localhost:5000/api/hostels', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHostels(response.data);
      } catch (error) {
        console.error('Error fetching hostels:', error);
      }
    };

    fetchHostels();
  }, [navigate]);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/hostels/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHostels(hostels.filter((hostel) => hostel._id !== id));
    } catch (error) {
      console.error('Error deleting hostel:', error);
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Admin Dashboard</h1>
        <button onClick={() => navigate('/create-hostel')}>Create New Hostel</button>
      </div>
      <div className="hostel-list">
        {hostels.map((hostel) => (
          <div key={hostel._id} className="hostel-item">
            {/* <p>{hostel.images}</p> */}
            <h3>{hostel.name}</h3>
            <p><strong>Description:</strong> {hostel.description}</p>
            <p><strong>Sharing:</strong> {hostel.sharing}</p>
            <p><strong>Bathrooms:</strong> {hostel.bathrooms}</p>
            <p><strong>Price:</strong> ₹{hostel.price}</p>
            
            <button onClick={() => navigate(`/edit-hostel/${hostel._id}`)}>Edit</button>
            <button onClick={() => handleDelete(hostel._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
