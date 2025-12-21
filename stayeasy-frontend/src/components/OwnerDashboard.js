import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./admindashboard.css";

const OwnerDashboard = () => {
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHostels = async () => {
      try {
        const token = localStorage.getItem("token");
        const userRole = localStorage.getItem("userRole");

        // Check if user is authenticated and is an owner
        if (!token) {
          navigate("/login");
          return;
        }

        if (userRole !== "owner") {
          navigate("/dashboard");
          return;
        }

        // Fetch only the owner's hostels
        const response = await axios.get(
          "http://localhost:5000/api/my-hostels",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setHostels(response.data);
      } catch (error) {
        console.error("Error fetching hostels:", error);
        if (error.response?.status === 403) {
          alert("You do not have permission to access this page");
          navigate("/login");
        }
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
      await axios.delete(`http://localhost:5000/api/hostels/${id}`, {
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
        <h1>Owner Dashboard - My Hostels</h1>
        <div>
          <button onClick={() => navigate("/create-hostel")}>
            Add New Hostel
          </button>
          <button
            onClick={handleLogout}
            style={{ marginLeft: "10px", backgroundColor: "#dc3545" }}
          >
            Logout
          </button>
        </div>
      </div>

      {hostels.length === 0 ? (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <p>You haven't created any hostels yet.</p>
          <button onClick={() => navigate("/create-hostel")}>
            Create Your First Hostel
          </button>
        </div>
      ) : (
        <div className="hostel-list">
          {hostels.map((hostel) => (
            <div key={hostel._id} className="hostel-item">
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
                <strong>Location:</strong> {hostel.city}, {hostel.state}
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
      )}
    </div>
  );
};

export default OwnerDashboard;
