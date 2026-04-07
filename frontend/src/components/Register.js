import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/AuthPage.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleContinue = async () => {
    setError('');

    if (!username.trim()) {
      setError('Username is required');
      return;
    }

    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    try {
      setLoading(true);

      // ✅ Call backend to send OTP
      await axios.post('http://localhost:5000/api/users/send-otp', { email });

      // ✅ Redirect to OTP page with email & username in state
      navigate('/register/verify-otp', { state: { email, username } });
    } catch (err) {
      console.log(err);
      setError('Failed to send OTP. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = () => {
    window.location.href = 'http://localhost:5000/api/auth/google';
  };

  return (
    <div className="register-container">
      <h2>Sign up</h2>

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        type="text"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      {error && <p className="error">{error}</p>}

      <button onClick={handleContinue} className="primary-btn" disabled={loading}>
        {loading ? 'Sending OTP...' : 'Continue'}
      </button>

      <div className="divider">
        <span>or</span>
      </div>

      <button onClick={handleGoogle} className="google-btn">
        Continue with Google
      </button>
    </div>
  );
};

export default Register;