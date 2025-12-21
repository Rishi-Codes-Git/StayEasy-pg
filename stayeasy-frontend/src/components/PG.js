import React,{useState} from 'react';
import './PG.css';
import axios from 'axios';
import logo from './images/stay easy1.png';
import about1 from './images/hlogo.webp'

const PG = () => {

  const [formData, setFormData] = useState({ name: '', email: '',subject: '', message: '' });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/contact', formData);
      if (response.status === 200) {
        alert('Message sent successfully!');
        setFormData({ name: '', email: '',subject: '', message: '' }); // Clear the form
      }
    } catch (error) {
      console.error('There was an error sending the message:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  return (
    <div className="pg-page">
      <header>
        <div className="container">
          <a href="/">
            <img src={logo} alt="PG Logo" className="logo" />
          </a>
          <nav>
            <ul>
              <li><a href="/">Hostel</a></li>
              <li><a href="/login">Login</a></li>
              <li><a href="#services">Services</a></li>
              <li><a href="#about">About Us</a></li>
              <li><a href="#contact">Contact Us</a></li>
            </ul>
          </nav>
        </div>
      </header>

      <section className="hero" id="pg">
        <div className="container">
          <h2>Stay-Easy</h2>
          <p style={{ fontSize: '30px' }}>Your Dream PG Awaits</p>
          <a href="/signup" className="btn">Sign-Up</a>
        </div>
      </section>

      <section className="services" id="services">
        <div className="container">
          <h2>Our Services</h2>
          <div className="service-cards">
            <div className="service-card">
              <h3>PG Listings & Discovery</h3>
              <p>RecDiscover verified PG hostels around your preferred location. Filter by budget, amenities, gender, distance, and more. We help you find the stay that fits your lifestyle.</p>
            </div>
            <div className="service-card">
              <h3>Virtual Tours & Photos</h3>
              <p>Explore PGs from anywhere with detailed photos and virtual walkthroughs. Save time by shortlisting rooms before physically visiting.</p>
            </div>
            <div className="service-card">
              <h3>Owner Listings & Management</h3>
              <p>PG owners can post their properties, upload photos, set pricing, and manage inquiries from one dashboard. We make property management simple.</p>
            </div>
            <div className="service-card">
              <h3>Secure Online Enquiries</h3>
              <p>Connect directly with hostel owners through our platform. Send messages, ask questions, and schedule visits securely - no spam, no middlemen.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="about-us" id="about">
        <div className="container">
          <h2>About Us</h2>
          <div className="about-content">
            <div className="about-text">
               <p>
                At StayEasy, we're redefining the way students and working professionals find their perfect PG. Our platform blends smart technology with a clean, user-friendly experience to make searching for hostels simple, transparent, and stress-free.
              </p><br />

              <p>
                Built with the mission to make PG hunting effortless, StayEasy helps you explore verified hostels, compare amenities, check pricing, and connect directly with owners - all in one place. No brokers, no confusion, just clarity.
              </p><br />

              <p>
                Whether you're searching for a new PG, exploring options near your college or office, or looking for budget-friendly stays, StayEasy makes your entire journey smooth and reliable. Discover hostels that match your lifestyle and find your ideal stay with confidence.
              </p>

            </div>
            <div className="about-image">
              <img src={about1} alt="About Us" />
            </div>
          </div>
        </div>
      </section>

      <footer id="contact">
        <div className="container">
          <h2>Contact Us</h2>
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name:</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                value={formData.name}
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
                value={formData.email}
                onChange={handleChange}
                required 
              />
            </div>
            <div className="form-group">
              <label htmlFor="subject">Subject:</label>
              <input 
                type="text" 
                id="subject" 
                name="subject" 
                value={formData.subject}
                onChange={handleChange}
                required 
              />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message:</label>
              <textarea 
                id="message" 
                name="message" 
                rows="4"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <button type="submit" className="btn">Send Message</button>
          </form>
          <p>Email: info@stayeasy.com | Phone: (+11) 12345 54321</p>
          
        </div>
      </footer>
    </div>
  
  );
};

export default PG;



  