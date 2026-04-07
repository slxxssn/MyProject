import React from 'react';
import Register from '../components/Register';
import '../styles/AuthPage.css'; // shared CSS for login/register

const RegisterPage = () => {
  return (
    <div className="auth-container">
      <h2>Create Account</h2>
      <Register />
    </div>
  );
};

export default RegisterPage;