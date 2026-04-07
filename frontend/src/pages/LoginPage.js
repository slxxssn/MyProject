import React from 'react';
import Login from '../components/Login';
import '../styles/AuthPage.css'; // same CSS

const LoginPage = () => {
  return (
    <div className="auth-container">
      <h2>Login to Your Account</h2>
      <Login />
    </div>
  );
};

export default LoginPage;