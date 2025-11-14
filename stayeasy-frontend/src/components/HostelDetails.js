import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import ImageGallery from 'react-image-gallery';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet'; 
import ContactOwnerForm from './ContactOwnerForm'; 
import './HostelDetails.css';
import 'react-image-gallery/styles/css/image-gallery.css';
import 'leaflet/dist/leaflet.css';
import markerIcon from 'leaflet/dist/images/marker-icon.png'; // Import default marker icon
import markerShadow from 'leaflet/dist/images/marker-shadow.png'; // Import marker shadow
import { useNavigate } from 'react-router-dom';  

const HostelDetails = () => {
  const { id } = useParams();
  const [hostel, setHostel] = useState(null);
  const [position, setPosition] = useState([23.0225, 72.5714]); // Default position
  const [showContactForm, setShowContactForm] = useState(false); // State to control modal visibility
  const navigate = useNavigate();  

  const handleBookingClick = () => {
    navigate('/booking', { state: { id } });  
  };

  useEffect(() => {
    const fetchHostel = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/hostels/${id}`);
        const hostelData = response.data;
        setHostel(hostelData);

        // If no coordinates available, use geocoding
        if (!hostelData.latitude || !hostelData.longitude) {
          const geocodeResponse = await axios.get(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
              `${hostelData.address}, ${hostelData.city}, ${hostelData.state}, ${hostelData.country}`
            )}`
          );

          if (geocodeResponse.data && geocodeResponse.data.length > 0) {
            const { lat, lon } = geocodeResponse.data[0];
            setPosition([parseFloat(lat), parseFloat(lon)]);
          }
        } else {
          setPosition([hostelData.latitude, hostelData.longitude]);
        }
      } catch (error) {
        console.error('Error fetching hostel details:', error);
      }
    };

    fetchHostel();
  }, [id]);

  // Custom icon setup
  const customMarkerIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41], // Size of the icon
    iconAnchor: [12, 41], // Point of the icon which will correspond to marker's location
    popupAnchor: [1, -34], // Point from which the popup should open relative to the iconAnchor
    shadowSize: [41, 41]  // Size of the shadow
  });

  const renderGallery = () => {
    if (hostel && hostel.images && hostel.images.length > 0) {
      const images = hostel.images.map((image) => ({
        original: `http://localhost:5000${image}`,
        thumbnail: `http://localhost:5000${image}`,
      }));
      return <ImageGallery items={images} showThumbnails={true} />;
    }
    return <p>No images available</p>;
  };

  const downloadBrochure = () => {
    axios({
      url: `http://localhost:5000/api/hostels/${id}/brochure`, // Use template literal here
      method: 'GET',
      responseType: 'blob', // Important for file download
    })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${hostel.name}-brochure.pdf`); // Set download filename using template literal
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      //.catch((error) => console.error('Error downloading brochure:', error));
      .catch((error) => {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error('Error response data:', error.response.data);
          console.error('Error response status:', error.response.status);
          console.error('Error response headers:', error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          console.error('Error request data:', error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error('Error message:', error.message);
        }
      });
      
  };
  

  return (
    <div className="hostel-details-container">
      {hostel ? (
        <div className="hostel-details-content">
          <div className="hostel-header">
            <h1>{hostel.name}</h1>
            <p className="hostel-price">₹{hostel.price}</p>
            <p className="hostel-location">{hostel.address}, {hostel.city}, {hostel.state}, {hostel.country}</p>
          </div>
          <div className="hostel-details-main">
            <div className="hostel-images">
              {renderGallery()}
            </div>
            <div className="hostel-info">
              <div className="hostel-summary">
                <p><b>Description:</b> {hostel.description}</p>
                <div className="hostel-specs">
                  <p><b>Sharing:</b> {hostel.sharing}</p>
                  <p><b>Bathrooms:</b> {hostel.bathrooms}</p>
                  <p><b>Floor Area:</b> {hostel.floorArea} sq. ft.</p>
                  <p><b>Total Beds:</b> {hostel.totalBeds}</p>
                  <p><b>Amenities:</b> {hostel.amenities.join(', ')}</p>
                  <p><b>Legal Documentation:</b> {hostel.legalDocumentation}</p>
                </div>
              </div>
              <div className="hostel-contact">
                <h3>Contact Owner</h3>
                <p><b>Name:</b> {hostel.contactName}</p>
                <p><b>Email:</b> {hostel.contactEmail}</p>
                <p><b>Phone:</b> {hostel.contactPhoneNumber}</p>
                {/* <button className="contact-button">Contact Owner</button> */}
                <button 
                  className="contact-button"
                  onClick={() => setShowContactForm(true)} // Show the modal on click
                >
                  Contact Owner
                </button>
                <button className="download-button" onClick={downloadBrochure}>Download Brochure</button>
                <button className="booking-button" onClick={handleBookingClick}>
                  Book Now
                </button>
              </div>
            </div>
          </div>
          <div className="hostel-map">
            <MapContainer 
              key={position.toString()} // Forces re-render when position changes
              center={position} 
              zoom={15} 
              style={{ height: '400px', width: '100%' }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
              />
              <Marker position={position} icon={customMarkerIcon}>
                <Popup>{hostel.name}</Popup>
              </Marker>
            </MapContainer> 
           
          </div>
          
          {showContactForm && (
            <ContactOwnerForm 
              hostel={hostel} 
              onClose={() => setShowContactForm(false)} 
            />
          )}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default HostelDetails;


