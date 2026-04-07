// frontend/src/components/MenuBar.js
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MenuBar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef();

  const menuItems = [
    { label: 'Home', path: '/', icon: 'home' },
    { label: 'Settings', path: '/settings', icon: 'settings' },
    { label: 'Help', path: '/help', icon: 'help_outline' },
    { label: 'Support', path: '/support', icon: 'support_agent' },
  ];

  // ✅ Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative flex items-center" ref={menuRef}>
      {/* Menu button with hamburger icon */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2 rounded-md bg-white font-medium shadow-sm hover:bg-gray-100 transition-colors duration-200"
      >
        {/* Hamburger icon */}
        <span className="flex flex-col justify-between w-5 h-4">
          <span className="block h-0.5 bg-gray-700 rounded"></span>
          <span className="block h-0.5 bg-gray-700 rounded"></span>
          <span className="block h-0.5 bg-gray-700 rounded"></span>
        </span>

        Menu
        {/* Dropdown arrow */}
        <span
          className={`material-icons transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
        >
          arrow_drop_down
        </span>
      </button>

      {/* Dropdown items */}
      {open && (
        <div className="absolute top-full left-0 mt-2 w-48 bg-white shadow-lg border border-gray-200 rounded-md overflow-hidden z-50">
          {menuItems.map((item) => (
            <div
              key={item.label}
              onClick={() => {
                navigate(item.path);
                setOpen(false);
              }}
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-primary hover:text-white cursor-pointer transition-colors duration-200"
            >
              {/* Icon */}
              {item.icon && (
                <span className="material-icons mr-2 text-gray-500 group-hover:text-white">
                  {item.icon}
                </span>
              )}
              {item.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuBar;