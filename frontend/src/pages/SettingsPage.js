// frontend/src/pages/SettingsPage.js
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ import navigate

const SettingsPage = () => {
  const navigate = useNavigate(); // ✅ add navigate

  // Dropdown states
  const [openDropdown, setOpenDropdown] = useState(null); // 'theme', 'notifications', 'language'
  
  // Toggles
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState('English');

  const containerRef = useRef();

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Menu items
  const settingsItems = [
    { label: 'Account', type: 'link', path: '/settings/account' },
    { label: 'Privacy & Security', type: 'link', path: '/settings/privacy' },
    { label: 'Theme', type: 'dropdown', key: 'theme' },
    { label: 'Notifications', type: 'dropdown', key: 'notifications' },
    { label: 'Payment & Subscriptions', type: 'link', path: '/settings/payment' },
    { label: 'Language', type: 'dropdown', key: 'language' },
    { label: 'App Settings', type: 'link', path: '/settings/app' },
  ];

  // Languages
  const languages = ['English', 'Spanish', 'French', 'German', 'Chinese', 'Arabic'];

  return (
    <div ref={containerRef} className="max-w-3xl mx-auto p-6 space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
      
      <div className="bg-white shadow-md rounded-md divide-y divide-gray-200">
        {settingsItems.map((item) => (
          <div key={item.label} className="relative">
            {item.type === 'link' ? (
              <button
                onClick={() => navigate(item.path)} // ✅ navigate to actual page
                className="w-full text-left px-4 py-3 hover:bg-gray-100 transition flex justify-between items-center"
              >
                {item.label}
                <span className="material-icons text-gray-400">chevron_right</span>
              </button>
            ) : (
              <>
                <button
                  onClick={() => setOpenDropdown(openDropdown === item.key ? null : item.key)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-100 transition flex justify-between items-center"
                >
                  {item.label}
                  <span className="material-icons text-gray-400">
                    {openDropdown === item.key ? 'expand_less' : 'expand_more'}
                  </span>
                </button>

                {/* Dropdown content */}
                {openDropdown === item.key && (
                  <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 animate-slide-down">
                    {item.key === 'theme' && (
                      <div className="flex items-center justify-between">
                        <span>Turn on Dark Mode</span>
                        <button
                          onClick={() => setDarkMode(!darkMode)}
                          className={`w-12 h-6 rounded-full transition-colors ${
                            darkMode ? 'bg-green-500' : 'bg-red-500'
                          } relative`}
                        >
                          <span
                            className={`block w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                              darkMode ? 'translate-x-6' : 'translate-x-0'
                            }`}
                          ></span>
                        </button>
                      </div>
                    )}

                    {item.key === 'notifications' && (
                      <div className="flex items-center justify-between">
                        <span>Enable Notifications</span>
                        <button
                          onClick={() => setNotifications(!notifications)}
                          className={`w-12 h-6 rounded-full transition-colors ${
                            notifications ? 'bg-green-500' : 'bg-red-500'
                          } relative`}
                        >
                          <span
                            className={`block w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                              notifications ? 'translate-x-6' : 'translate-x-0'
                            }`}
                          ></span>
                        </button>
                      </div>
                    )}

                    {item.key === 'language' && (
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2 mt-1"
                      >
                        {languages.map((lang) => (
                          <option key={lang} value={lang}>
                            {lang}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SettingsPage;