import React, { useEffect, useState } from 'react';
import axios from 'axios';
import HostelCard from './HostelCard';
import './HostelsPage.css';
import videoSrc from './images/vd.mp4';

const HostelsPage = () => {
  const [hostels, setHostels] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredHostels, setFilteredHostels] = useState([]);

  useEffect(() => {
    const fetchHostels = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/hostels');
        setHostels(response.data);
        setFilteredHostels(response.data);
      } catch (error) {
        console.error('Error fetching hostels:', error);
      }
    };

    fetchHostels();
  }, []);

  useEffect(() => {
    const filterHostels = () => {
      const lowercasedQuery = searchQuery.toLowerCase();
      return hostels.filter(hostel => {
        return (
          (hostel.name && hostel.name.toLowerCase().includes(lowercasedQuery)) ||
          (hostel.price && hostel.price.toString().includes(lowercasedQuery)) ||
          (hostel.address && hostel.address.toLowerCase().includes(lowercasedQuery)) ||
          (hostel.city && hostel.city.toLowerCase().includes(lowercasedQuery)) ||
          (hostel.state && hostel.state.toLowerCase().includes(lowercasedQuery))
        );
      });
    };

    setFilteredHostels(filterHostels());
  }, [searchQuery, hostels]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="hostels-page">
      <video className="background-video" autoPlay loop muted>
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="content-container">
        <h1>Our Hostels</h1>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Hostel Name, Price or Address"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <button className="search-button">
            <i className="fas fa-search"></i> 
          </button>
        </div>
        <div className="hostel-list">
          {filteredHostels.length > 0 ? (
            filteredHostels.map(hostel => (
              <HostelCard key={hostel._id} hostel={hostel} />
            ))
          ) : (
            <p>No hostels available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HostelsPage;
