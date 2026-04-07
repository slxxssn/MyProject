import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { BASE_URL } from '../api';
import '../styles/OtpVerificationPage.css';

const OtpVerificationPage = () => {
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Grab email & username from previous page via state
  const email = location.state?.email;
  const username = location.state?.username;

  // ✅ Redirect if no email or username passed
  useEffect(() => {
    if (!email || !username) {
      navigate('/register'); // go back to email/username entry page
    }
  }, [email, username, navigate]);

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!otp.trim()) {
      setMessage('Please enter the OTP');
      return;
    }

    try {
      const res = await axios.post(`${BASE_URL}/api/users/verify-otp`, { email, otp });
      setMessage(res.data.message);

      // ✅ Navigate to password creation page with email & username
      navigate('/register/create-pass', { state: { email, username } });
    } catch (err) {
      setMessage(err.response?.data?.message || 'OTP verification failed');
    }
  };

  return (
    <div className="otp-page-container">
      <h2>Enter OTP</h2>
      {email && username && (
        <p>We sent a 6-digit verification code to <b>{email}</b> for username <b>{username}</b></p>
      )}

      <form onSubmit={handleVerify} className="otp-form">
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          maxLength={6}
        />
        <button type="submit">Verify OTP</button>
      </form>

      {message && <p className="otp-message">{message}</p>}
    </div>
  );
};

export default OtpVerificationPage;