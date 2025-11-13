import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import './Booking.css';

function Booking() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [ccv, setCcv] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = location.state;

  const validateName = (name) => /^[A-Za-z\s]+$/.test(name);
  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const validateCardNumber = (number) => /^\d{16}$/.test(number.replace(/\s/g, ''));
  const validateExpiryDate = (date) => /^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(date);
  const validateCcv = (ccv) => /^\d{3}$/.test(ccv);

  const handlePayment = async () => {
    if (!validateName(name)) {
      alert('Please enter a valid name.');
      return;
    }
    if (!validateEmail(email)) {
      alert('Please enter a valid email address.');
      return;
    }
    if (!validateCardNumber(accountNumber)) {
      alert('Please enter a valid 16-digit card number.');
      return;
    }
    if (!validateExpiryDate(expiryDate)) {
      alert('Please enter a valid expiry date in MM/YY format.');
      return;
    }
    if (!validateCcv(ccv)) {
      alert('Please enter a valid 3-digit CCV.');
      return;
    }

    setIsLoading(true);

    try {
      const paymentResponse = await axios.post('http://localhost:5000/booking/payment', {
        amount: 100000, // Fixed deposit amount
      });

      if (paymentResponse.status === 200) {
        const confirmationResponse = await axios.post('http://localhost:5000/booking/confirmation', {
          email,
          bookingDetails: 'Booking details here...',
        });

        if (confirmationResponse.status === 200) {
          alert('Booking confirmed and email sent!');
          navigate(`/hostel/${id}`);
        }
      }
    } catch (error) {
      console.error('Error processing booking:', error);
      alert('There was an error processing your booking.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="booking-pageWrap">
      <div className="booking-title">
        <h1>Payment Information</h1>
        <h2>Unlocking Doors By Stay Easy</h2>
      </div>

      <div className="booking-card">
        <div className="booking-cardfront">
          <div className="booking-card-section">
            <div className="chip">
            <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 55 45">
              <defs>
                <style>
                  {`
                    .cls-1 { fill: #3f3c3a; }
                    .cls-1, .cls-2 { stroke-width: 0px; }
                    .cls-2 { fill: #c7b299; }
                  `}
                </style>
              </defs>
              <rect className="cls-1" width="55" height="45" rx="4.89" ry="4.89"/>
              <g>
                <g>
                  <path className="cls-2" d="M17.97,2.85v6.83c0,.95-.77,1.72-1.72,1.72H2.61c-.95,0-1.72-.77-1.72-1.72v-3.92C.88,3.2,2.95,1.13,5.51,1.13h10.73c.95,0,1.72.77,1.72,1.72Z"/>
                  <rect className="cls-2" x=".88" y="12.22" width="17.08" height="10.28" rx="1.72" ry="1.72"/>
                </g>
                <rect className="cls-2" x=".88" y="23.32" width="17.08" height="10.28" rx="1.72" ry="1.72"/>
                <path className="cls-2" d="M16.24,34.41H2.61c-.95,0-1.72.77-1.72,1.72v3.92c0,2.56,2.07,4.63,4.63,4.63h10.73c.95,0,1.72-.77,1.72-1.72v-6.83c0-.95-.77-1.72-1.72-1.72Z"/>
                <path className="cls-2" d="M49.57,1.13h-29.15c-.95,0-1.72.77-1.72,1.72v40.11c0,.95.77,1.72,1.72,1.72h14.11c.95,0,1.72-.77,1.72-1.72V13.98c0-1.42,1.15-2.58,2.58-2.58h13.78c.83,0,1.51-.68,1.51-1.51v-4.22c0-2.51-2.04-4.55-4.55-4.55Z"/>
                <rect className="cls-2" x="37.03" y="12.22" width="17.08" height="10.28" rx="1.72" ry="1.72"/>
                <rect className="cls-2" x="37.03" y="23.32" width="17.08" height="10.28" rx="1.72" ry="1.72"/>
                <path className="cls-2" d="M52.39,34.41h-13.63c-.95,0-1.72.77-1.72,1.72v6.83c0,.95.77,1.72,1.72,1.72h10.73c2.56,0,4.63-2.07,4.63-4.63v-3.92c0-.95-.77-1.72-1.72-1.72Z"/>
              </g>
            </svg>
          </div>
          </div>
          <div className="booking-card-section" id="account-number-display">
            {accountNumber || '0000 0000 0000 0000'}
          </div>
          <div className="booking-card-section" id="name-display">
            {name || 'CARDHOLDER NAME'}
          </div>
          <div className="Debit">DEBIT</div>
        </div>
      </div>

      <div className="booking-inputs">
        <label htmlFor="name">Name on Card</label>
        <input
          type="text"
          id="name"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="accountNumber">Card Number</label>
        <input
          type="text"
          id="accountNumber"
          placeholder="0000 0000 0000 0000"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
        />

        <label htmlFor="amountNumber">Amount</label>
        <input
          type="text"
          id="amountNumber"
          value="1,00,000"
        />
       

        <div className="booking-dateCCV">
          <div className="date">
            <label htmlFor="expiryDate">Expiry Date</label>
            <input
              type="text"
              id="expiryDate"
              placeholder="MM/YY"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
            />
          </div>

          <div className="CCV">
            <label htmlFor="ccv">CCV</label>
            <input
              type="text"
              id="ccv"
              placeholder="000"
              value={ccv}
              onChange={(e) => setCcv(e.target.value)}
            />
          </div>
        </div>

        <center><button
          className="submit-btn"
          onClick={handlePayment}
          disabled={isLoading || !name || !accountNumber || !expiryDate || !ccv || !email}
        >
          {isLoading ? 'Processing...' : 'Pay'}
        </button></center>
      </div>
    </div>
  );
}

export default Booking;



