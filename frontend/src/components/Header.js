import React from 'react';
import { Link } from 'react-router-dom';
import MenuBar from './MenuBar';
import ProfileMenu from './ProfileMenu';

const Header = ({ showLogoutModal, setShowLogoutModal, resetHistory }) => {
  return (
    <header className="w-full bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between">

        {/* Left: Menu */}
        <div className="flex items-center flex-shrink-0">
          <MenuBar />
        </div>

        {/* Center: BRAND LOGO */}
        <div className="flex-1 flex justify-center min-w-[150px] my-2 sm:my-0">
          <h1
            className="flex items-baseline gap-2 text-3xl sm:text-4xl md:text-5xl
                       tracking-wide hover:scale-105 transition-all duration-300
                       cursor-pointer select-none"
          >
            <Link to="/" className="flex items-baseline gap-2">
              {/* ELITE */}
              <span
                className="italic text-gray-700 truncate"
                style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 500 }}
              >
                Elite
              </span>
              {/* TECHS */}
              <span
                className="italic text-primary truncate"
                style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 700 }}
              >
                Techs
              </span>
            </Link>
          </h1>
        </div>

        {/* Right: Nav + Profile */}
        <div className="flex items-center space-x-4 flex-shrink-0">
          {/* Navigation Links */}
          <nav className="flex items-center space-x-4 sm:space-x-6 flex-wrap">
            <Link
              to="/"
              className="text-gray-700 hover:text-primary font-medium transition whitespace-nowrap"
            >
              Home
            </Link>
            <Link
              to="/products"
              className="text-gray-700 hover:text-primary font-medium transition whitespace-nowrap"
            >
              Products
            </Link>
            <Link
              to="/cart"
              className="text-gray-700 hover:text-primary font-medium transition whitespace-nowrap"
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