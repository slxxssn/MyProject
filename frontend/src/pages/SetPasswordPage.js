import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { BASE_URL } from '../api';
import '../styles/SetPasswordPage.css';

const SetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Grab email and username from previous page
  const email = location.state?.email;
  const username = location.state?.username;

  // Redirect safely if email or username is missing
  useEffect(() => {
    if (!email || !username) {
      navigate('/register'); // go back to email/username entry page
    }
  }, [email, username, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters");
      return;
    }

    try {
      // ✅ Send username instead of name to backend
      const res = await axios.post(`${BASE_URL}/api/users/register`, {
        username,
        email,
        password
      });

      setMessage(res.data.message);

      // ✅ Show message briefly before redirecting
      setTimeout(() => {
        navigate('/login', { state: { successMessage: 'Account created successfully. Please login.' } });
      }, 2000); // 2 seconds
    } catch (err) {
      setMessage(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="set-password-container">
      <h2>Create Your Password</h2>
      <p>Set a strong password for <b>{username}</b> ({email})</p>

      <form onSubmit={handleSubmit} className="password-form">
        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button type="submit">Create Account</button>
      </form>

      {message && <p className="password-message">{message}</p>}
    </div>
  );
};

export default SetPasswordPage;