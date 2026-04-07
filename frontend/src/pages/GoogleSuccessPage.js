import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/GoogleSuccessPage.css';

function GoogleSuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const userId = params.get('userId');
    const name = params.get('name');
    const email = params.get('email');

    if (userId) {
      localStorage.setItem('userId', userId);
      localStorage.setItem('userName', name);
      localStorage.setItem('userEmail', email);

      setUserName(name); // ✅ set state so it re-renders

      setTimeout(() => {
        navigate('/'); // home page
      }, 1500);
    } else {
      navigate('/login');
    }
  }, [location, navigate]);

  return (
    <div className="google-success-container">
      <div className="google-success-box">
        <h2>Welcome, {userName || 'User'}!</h2>
        <p>Signing you in with Google...</p>
        <div className="loader"></div>
      </div>
    </div>
  );
}

export default GoogleSuccessPage;