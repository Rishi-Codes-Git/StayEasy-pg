import React from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../config";
import "./HostelCard.css";

const HostelCard = ({ hostel }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/hostel/${hostel._id}`);
  };

  return (
    <div className="hostel-card" onClick={handleClick}>
      {hostel.images && hostel.images.length > 0 ? (
        <div className="image-container">
          <img
            //src={hostel.images[0]}
            src={`${API_BASE_URL}${hostel.images[0]}`}
            alt={hostel.name}
            className="hostel-image"
          />
          <div className="image-overlay">
            <span className="image-count">{hostel.images.length} photos</span>
          </div>
        </div>
      ) : (
        <div className="no-image">No Image Available</div>
      )}
      <div className="hostel-info">
        <h3 className="hostel-type">{hostel.name}</h3>
        <p className="hostel-price">₹{hostel.price}</p>
        <p className="hostel-size">{hostel.floorArea} sqft</p>
        <p className="hostel-address">
          {hostel.address}
          {","}
          {hostel.city}
          {","}
          {hostel.state}
          {","}
          {hostel.country}
        </p>
        <p className="hostel-status">{hostel.status}</p>
      </div>
    </div>
  );
};

export default HostelCard;
