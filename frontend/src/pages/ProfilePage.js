import React, { useEffect, useState, useCallback } from 'react';
import { FaCamera, FaTimes } from 'react-icons/fa';
import axios from 'axios';

const ProfilePage = () => {
  const [user, setUser] = useState({ id: null, name: '', email: '', avatar: null });
  const [editMode, setEditMode] = useState(false);
  const [tempUser, setTempUser] = useState({ name: '', email: '' });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [newAvatarFile, setNewAvatarFile] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });

  const userId = localStorage.getItem('userId');

  // Load user from DB
  const loadUser = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await axios.get(`http://localhost:5000/api/users/${userId}`);
      const u = res.data;
      setUser({
        id: u.id,
        name: u.username,
        email: u.email,
        avatar: u.profile_image,
      });
      setTempUser({ name: u.username, email: u.email });
      setAvatarPreview(u.profile_image ? `http://localhost:5000/uploads/${u.profile_image}` : null);
    } catch (err) {
      console.error('Failed to load user:', err);
    }
  }, [userId]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // Avatar change
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setNewAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  // Remove avatar from DB
  const handleRemoveAvatar = async () => {
    if (!userId) return;
    try {
      await axios.post(`http://localhost:5000/api/users/upload-profile/${userId}`, null); // null triggers deletion
      setAvatarPreview(null);
      setNewAvatarFile(null);
      await loadUser();
      setMessage({ text: 'Profile photo removed successfully!', type: 'success' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (err) {
      console.error(err);
      setMessage({ text: 'Failed to remove profile photo.', type: 'error' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    }
  };

  // Save profile
  const handleSave = async () => {
    if (!userId) return;
    try {
      await axios.put(`http://localhost:5000/api/users/update/${userId}`, {
        username: tempUser.name,
        email: tempUser.email,
      });

      // Upload avatar if new file
      if (newAvatarFile) {
        const formData = new FormData();
        formData.append('avatar', newAvatarFile);
        await axios.post(`http://localhost:5000/api/users/upload-profile/${userId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else if (!avatarPreview) {
        // Removed avatar
        await axios.post(`http://localhost:5000/api/users/upload-profile/${userId}`, null);
      }

      await loadUser();
      setEditMode(false);
      setNewAvatarFile(null);
      setMessage({ text: 'Profile updated successfully!', type: 'success' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (err) {
      console.error('Failed to save profile:', err);
      setMessage({ text: 'Failed to save profile.', type: 'error' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Floating Popup Message */}
      {message.text && (
        <div
          className={`absolute top-10 left-1/2 transform -translate-x-1/2 px-6 py-2 rounded-md text-white text-center z-50 transition-all ${
            message.type === 'success' ? 'bg-green-600/90' : 'bg-red-600/90'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-8 space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 text-center">My Profile</h2>

        {/* Avatar Section */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative group w-28 h-28">
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="Avatar"
                className="w-28 h-28 rounded-full object-cover border-2 border-gray-200"
              />
            ) : (
              <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-4xl border-2 border-gray-200">
                <span className="material-icons">person</span>
              </div>
            )}

            {editMode && (
              <>
                <label className="absolute bottom-0 right-0 bg-primary p-1 rounded-full cursor-pointer hover:scale-110 transition">
                  <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                  <FaCamera className="text-white text-sm" />
                </label>

                {avatarPreview && (
                  <button
                    onClick={handleRemoveAvatar}
                    className="absolute top-0 right-0 bg-gray-300 p-1 rounded-full hover:bg-gray-400 transition"
                  >
                    <FaTimes className="text-gray-700 text-sm" />
                  </button>
                )}
              </>
            )}
          </div>

          {/* Info Section */}
          <div className="w-full space-y-4">
            {editMode ? (
              <>
                <input
                  type="text"
                  value={tempUser.name}
                  onChange={(e) => setTempUser({ ...tempUser, name: e.target.value })}
                  placeholder="Enter Name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <input
                  type="email"
                  value={tempUser.email}
                  onChange={(e) => setTempUser({ ...tempUser, email: e.target.value })}
                  placeholder="Enter Email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <div className="flex justify-center gap-4">
                  <button
                    onClick={handleSave}
                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditMode(false)}
                    className="px-6 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="text-gray-700 text-center">
                  <span className="font-semibold">Name:</span> {user.name || 'Not set'}
                </p>
                <p className="text-gray-700 text-center">
                  <span className="font-semibold">Email:</span> {user.email || 'Not set'}
                </p>
                <div className="flex justify-center">
                  <button
                    onClick={() => setEditMode(true)}
                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
                  >
                    Edit Profile
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;