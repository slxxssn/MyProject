// frontend/src/pages/AccountPage.js
import React, { useState } from 'react';
import ProfileForm from '../components/ProfileForm';

const AccountPage = () => {
  // ---------- Security ----------
  const [twoFA, setTwoFA] = useState(false);

  // ---------- Contact & Preferences ----------
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [language, setLanguage] = useState('English');
  const [timeZone, setTimeZone] = useState('GMT+3');

  // ---------- Popup Message ----------
  const [message, setMessage] = useState({ text: '', type: '' });

  // Languages & Time zones options
  const languages = ['English', 'Spanish', 'French', 'German', 'Chinese', 'Arabic'];
  const timeZones = ['GMT-12', 'GMT-8', 'GMT-5', 'GMT+0', 'GMT+3', 'GMT+5:30', 'GMT+8', 'GMT+12'];

  // ---------- Handlers ----------
  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // TODO: Connect backend delete route
      showMessage('Account deleted successfully!', 'success');
    }
  };

  const handleChangePassword = () => {
    showMessage('Redirecting to Change Password (simulation)', 'success');
  };

  const handleSaveChanges = () => {
    // TODO: Connect backend save logic
    showMessage('Changes saved successfully!', 'success');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 relative">
      {/* ---------- Floating Popup Message ---------- */}
      {message.text && (
        <div
          className={`absolute top-6 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-md text-white text-center z-50 transition-all ${
            message.type === 'success' ? 'bg-green-600/90' : 'bg-red-600/90'
          }`}
        >
          {message.text}
        </div>
      )}

      <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">My Account</h1>

      {/* ---------- Profile Section (DB connected) ---------- */}
      <ProfileForm />

      {/* ---------- Security Section ---------- */}
      <div className="bg-white shadow-md rounded-md p-6 space-y-4">
        <h2 className="text-xl font-semibold text-gray-700">Security & Login</h2>
        <div className="space-y-2">
          <button
            onClick={handleChangePassword}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            Change Password
          </button>
          <div className="flex items-center justify-between mt-2">
            <span>Two-Factor Authentication</span>
            <button
              onClick={() => setTwoFA(!twoFA)}
              className={`w-12 h-6 rounded-full transition-colors ${
                twoFA ? 'bg-green-500' : 'bg-red-500'
              } relative`}
            >
              <span
                className={`block w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                  twoFA ? 'translate-x-6' : 'translate-x-0'
                }`}
              ></span>
            </button>
          </div>
          <p className="text-gray-500 text-sm mt-2">Last login: 2026-04-07 10:30 AM</p>
        </div>
      </div>

      {/* ---------- Contact & Preferences Section ---------- */}
      <div className="bg-white shadow-md rounded-md p-6 space-y-4">
        <h2 className="text-xl font-semibold text-gray-700">Contact & Preferences</h2>
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Phone Number"
        />
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Address"
        />
        <div className="flex gap-4">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {languages.map((lang) => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
          <select
            value={timeZone}
            onChange={(e) => setTimeZone(e.target.value)}
            className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {timeZones.map((tz) => (
              <option key={tz} value={tz}>{tz}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ---------- Account Actions Section ---------- */}
      <div className="flex justify-end gap-4">
        <button
          onClick={handleDeleteAccount}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
        >
          Delete Account
        </button>
        <button
          onClick={handleSaveChanges}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default AccountPage;