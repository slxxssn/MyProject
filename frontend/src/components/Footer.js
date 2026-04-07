import React from 'react';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-left">
          <h3>Elite Techs</h3>
          <p>Your one-stop premium electronics store</p>
        </div>

        <div className="footer-center">
          <h4>Quick Links</h4>
          <a href="/products">Products</a>
          <a href="/cart">Cart</a>
          <a href="/settings">Settings</a>
          <a href="/help">Help</a>
        </div>

        <div className="footer-right">
          <h4>Contact Us</h4>
          <p>Email: support@elitetechs.com</p>
          <p>Phone: +254 700 000 000</p>
          <div className="social-icons">
            <span className="material-icons">facebook</span>
            <span className="material-icons">X</span>
            <span className="material-icons">tiktok</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} Elite Techs. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;