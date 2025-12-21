import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PG from "./components/PG";
import Signup from "./components/Signup";
import OwnerSignup from "./components/OwnerSignup";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import AdminDashboard from "./components/AdminDashboard";
import OwnerDashboard from "./components/OwnerDashboard";
import HostelDetails from "./components/HostelDetails";
import CreateHostel from "./components/CreateHostel";
import EditHostel from "./components/EditHostel";
import UpdateProfile from "./components/UpdateProfile";
import HostelsPage from "./components/HostelsPage";
import ResetPassword from "./components/ResetPassword";
import ForgotPassword from "./components/ForgotPassword";
import Booking from "./components/Booking";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PG />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/owner-signup" element={<OwnerSignup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/owner-dashboard" element={<OwnerDashboard />} />
        <Route path="/hostel/:id" element={<HostelDetails />} />
        <Route path="/create-hostel" element={<CreateHostel />} />
        <Route path="/edit-hostel/:id" element={<EditHostel />} />
        <Route path="/update-profile" element={<UpdateProfile />} />
        <Route path="/hostels" element={<HostelsPage />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        {/* <Route path="/forgot-password" element={<ForgotPassword />} /> */}
        <Route path="/booking" element={<Booking />} />
      </Routes>
    </Router>
  );
};

export default App;
