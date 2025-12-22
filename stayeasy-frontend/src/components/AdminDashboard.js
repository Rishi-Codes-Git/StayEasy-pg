import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../config";
import "./admindashboard.css";

const AdminDashboard = () => {
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHostels = async () => {
      try {
        const token = localStorage.getItem("token");
        const userRole = localStorage.getItem("userRole");

        // Check if user is authenticated
        if (!token) {
          navigate("/login");
          return;
        }

        // Check if user is admin
        if (userRole !== "admin") {
          alert("You do not have permission to access the admin panel");
          navigate("/dashboard");
          return;
        }

        const response = await axios.get(`${API_BASE_URL}/api/hostels`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHostels(response.data);
      } catch (error) {
        console.error("Error fetching hostels:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHostels();
  }, [navigate]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this hostel?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/api/hostels/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHostels(hostels.filter((hostel) => hostel._id !== id));
      alert("Hostel deleted successfully");
    } catch (error) {
      console.error("Error deleting hostel:", error);
      alert(error.response?.data?.error || "Error deleting hostel");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="container">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Admin Dashboard - All Hostels</h1>
        <div>
          <button onClick={() => navigate("/create-hostel")}>
            Create New Hostel
          </button>
          <button
            onClick={handleLogout}
            style={{ marginLeft: "10px", backgroundColor: "#dc3545" }}
          >
            Logout
          </button>
        </div>
      </div>
      <div className="hostel-list">
        {hostels.map((hostel) => (
          <div key={hostel._id} className="hostel-item">
            {/* <p>{hostel.images}</p> */}
            <h3>{hostel.name}</h3>
            <p>
              <strong>Description:</strong> {hostel.description}
            </p>
            <p>
              <strong>Sharing:</strong> {hostel.sharing}
            </p>
            <p>
              <strong>Bathrooms:</strong> {hostel.bathrooms}
            </p>
            <p>
              <strong>Price:</strong> ₹{hostel.price}
            </p>
            <p>
              <strong>Owner:</strong> {hostel.ownerId?.username || "Unknown"}
            </p>

            <button onClick={() => navigate(`/edit-hostel/${hostel._id}`)}>
              Edit
            </button>
            <button
              onClick={() => handleDelete(hostel._id)}
              style={{ marginLeft: "10px", backgroundColor: "#dc3545" }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
