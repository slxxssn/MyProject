// frontend/src/pages/LoginPage.js
import React, { useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../api';
import { useNavigate } from 'react-router-dom';
import '../styles/AuthPage.css';

const Login = () => {
  const [formData, setFormData] = useState({
    identifier: '', // can be username or email
    password: ''
  });

  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle manual login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!formData.identifier.trim() || !formData.password) {
      setMessage('Please enter username/email and password');
      return;
    }

    try {
      const res = await axios.post(`${BASE_URL}/api/users/login`, {
        loginIdentifier: formData.identifier, // send as identifier
        password: formData.password
      });

      // ✅ Save user info to localStorage (manual login)
      localStorage.setItem('userId', res.data.user.id);
      localStorage.setItem('userName', res.data.user.username); // now username
      localStorage.setItem('userEmail', res.data.user.email);

      // Redirect to homepage and reload to update profile
      navigate('/');
      window.location.reload(); // 🔥 forces ProfilePage to read updated localStorage
    } catch (err) {
      setMessage(err.response?.data?.message || 'Login failed');
    }
  };

  // Handle Google login
  const handleGoogle = () => {
    window.location.href = 'http://localhost:5000/api/auth/google';
  };

  return (
    <div className="login-container">
      <h2>Login</h2>

      {message && <p className="error-msg">{message}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="identifier"
          placeholder="Username or Email"
          value={formData.identifier}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button type="submit">Login</button>
      </form>

      <div className="divider">
        <span>or</span>
      </div>

      <button onClick={handleGoogle} className="google-btn">
        Continue with Google
      </button>
    </div>
  );
};

export default Login;