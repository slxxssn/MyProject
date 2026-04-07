// frontend/src/components/Header.js
import React from 'react';
import { Link } from 'react-router-dom'; // <-- import Link
import MenuBar from './MenuBar';
import ProfileMenu from './ProfileMenu';

const Header = ({ showLogoutModal, setShowLogoutModal, resetHistory }) => {
  return (
    <header className="w-full bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center relative">

        {/* Left: Menu */}
        <div className="flex items-center">
          <MenuBar />
        </div>

        {/* Center: Logo */}
        <h1 className="absolute left-1/2 transform -translate-x-1/2 text-2xl font-bold text-primary hover:text-secondary transition-colors duration-300 cursor-pointer">
          <Link to="/">Elite Techs</Link>
        </h1>

        {/* Right: Nav + Profile */}
        <div className="flex items-center ml-auto space-x-6">

          {/* Navigation Links */}
          <nav className="flex items-center space-x-6">
            <Link
              to="/"
              className="text-gray-700 hover:text-primary font-medium transition"
            >
              Home
            </Link>
            <Link
              to="/products"
              className="text-gray-700 hover:text-primary font-medium transition"
            >
              Products
            </Link>
            <Link
              to="/cart"
              className="text-gray-700 hover:text-primary font-medium transition"
            >
              Cart
            </Link>
          </nav>

          {/* Profile Menu */}
          <ProfileMenu
            showLogoutModal={showLogoutModal}
            setShowLogoutModal={setShowLogoutModal}
            resetHistory={resetHistory}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;