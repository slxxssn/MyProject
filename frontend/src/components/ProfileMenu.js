import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaShoppingCart, FaBoxOpen, FaSignOutAlt, FaSignInAlt, FaUserPlus } from 'react-icons/fa';

const ProfileMenu = ({ showLogoutModal, setShowLogoutModal, resetHistory }) => {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [loggingOut, setLoggingOut] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef();

  // Fetch user info including avatar
  const fetchUser = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      setUser(null);
      setAvatar(null);
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/users/${userId}`);
      const data = await res.json();

      setUser({ id: data.id, name: data.username, email: data.email });
      setAvatar(data.profile_image ? `http://localhost:5000/uploads/${data.profile_image}` : null);
    } catch (err) {
      console.error('Failed to fetch user:', err);
      setUser(null);
      setAvatar(null);
    }
  };

  useEffect(() => {
    fetchUser();

    const handleStorageChange = () => fetchUser();
    window.addEventListener('storage', handleStorageChange);

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userAvatar');
    setUser(null);
    setAvatar(null);
    setOpen(false);
    resetHistory?.();
    navigate('/');
  };

  const profileItems = user
    ? [
        { label: 'My Profile', path: '/profile', icon: <FaUser /> },
        { label: 'My Orders', path: '/orders', icon: <FaBoxOpen /> },
        { label: 'My Cart', path: '/cart', icon: <FaShoppingCart /> },
        { label: 'Logout', action: () => setShowLogoutModal(true), icon: <FaSignOutAlt /> },
      ]
    : [
        { label: 'Login', path: '/login', icon: <FaSignInAlt /> },
        { label: 'Sign Up', path: '/register', icon: <FaUserPlus /> },
      ];

  return (
    <div className="relative flex justify-end" ref={menuRef}>
      {/* Profile Button */}
      <div
        className="flex items-center cursor-pointer space-x-2 px-3 py-2 rounded-full bg-white border border-gray-200 hover:shadow-md transition"
        onClick={() => setOpen(!open)}
      >
        {/* Show avatar if available, else default human icon */}
        {avatar ? (
          <img
            src={avatar}
            alt="Avatar"
            className="w-8 h-8 rounded-full object-cover border border-gray-300"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-lg">
            <FaUser />
          </div>
        )}
        {user && <span className="text-gray-800 font-semibold hidden md:inline">Hi, {user.name}</span>}
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-52 bg-white shadow-lg border border-gray-200 rounded-lg overflow-hidden animate-fadeIn z-50">
          {profileItems.map((item) => (
            <div
              key={item.label}
              onClick={() => {
                if (item.path) navigate(item.path);
                if (item.action) item.action();
                setOpen(false);
              }}
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-primary hover:text-white cursor-pointer transition-colors duration-200"
            >
              <span className="text-base">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-80 text-center animate-fadeIn shadow-lg">
            {!loggingOut ? (
              <>
                <h3 className="text-lg font-semibold mb-4">Do you want to log out?</h3>
                <div className="flex justify-center space-x-4">
                  <button
                    className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition-colors"
                    onClick={() => {
                      setLoggingOut(true);
                      setTimeout(() => {
                        handleLogout();
                        setLoggingOut(false);
                        setShowLogoutModal(false);
                      }, 1200);
                    }}
                  >
                    Yes
                  </button>
                  <button
                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
                    onClick={() => setShowLogoutModal(false)}
                  >
                    No
                  </button>
                </div>
              </>
            ) : (
              <h3 className="text-lg font-semibold">Logging out...</h3>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;