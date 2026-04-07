import React, { useEffect, useState, useCallback } from 'react';
import { FaCamera, FaTimes } from 'react-icons/fa';
import axios from 'axios';

const ProfileForm = () => {
  const [user, setUser] = useState({ id: null, name: '', email: '', avatar: null });
  const [editMode, setEditMode] = useState(false);
  const [tempUser, setTempUser] = useState({ name: '', email: '' });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [newAvatarFile, setNewAvatarFile] = useState(null);
  const [successMessage, setSuccessMessage] = useState(''); // ✅ success message state

  const userId = localStorage.getItem('userId');

  const loadUser = useCallback(async () => {
    if (!userId) return;

    try {
      const res = await axios.get(`http://localhost:5000/api/users/${userId}`);
      const u = res.data;
      setUser({ id: u.id, name: u.username, email: u.email, avatar: u.profile_image });
      setTempUser({ name: u.username, email: u.email });
      setAvatarPreview(u.profile_image ? `http://localhost:5000/uploads/${u.profile_image}` : null);
    } catch (err) {
      console.error('Failed to load user:', err);
    }
  }, [userId]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setNewAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleRemoveAvatar = () => {
    setAvatarPreview(null);
    setNewAvatarFile(null);
  };

  const handleSave = async () => {
    if (!userId) return;

    try {
      await axios.put(`http://localhost:5000/api/users/update/${userId}`, {
        username: tempUser.name,
        email: tempUser.email,
      });

      if (newAvatarFile) {
        const formData = new FormData();
        formData.append('avatar', newAvatarFile);
        await axios.post(`http://localhost:5000/api/users/upload-profile/${userId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else if (!avatarPreview) {
        await axios.post(`http://localhost:5000/api/users/upload-profile/${userId}`, new FormData());
      }

      await loadUser();
      setEditMode(false);
      setNewAvatarFile(null);

      // ✅ Show success message
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000); // hide after 3 sec
    } catch (err) {
      console.error('Failed to save profile:', err);
      setSuccessMessage('Failed to update profile.');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-md p-6 space-y-4">
      {successMessage && (
        <div className="fixed top-5 right-5 bg-green-500 text-white px-4 py-2 rounded shadow-lg transition-all">
          {successMessage}
        </div>
      )}

      <h2 className="text-xl font-semibold text-gray-700">Profile Information</h2>
      <div className="flex items-center space-x-6">
        <div className="relative">
          <img
            src={avatarPreview || 'https://via.placeholder.com/100'}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border border-gray-300"
          />
          {editMode && (
            <>
              <label className="absolute bottom-0 right-0 bg-primary p-1 rounded-full cursor-pointer">
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
        <div className="flex-1 space-y-2">
          {editMode ? (
            <>
              <input
                type="text"
                value={tempUser.name}
                onChange={(e) => setTempUser({ ...tempUser, name: e.target.value })}
                placeholder="Enter Name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="email"
                value={tempUser.email}
                onChange={(e) => setTempUser({ ...tempUser, email: e.target.value })}
                placeholder="Enter Email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <div className="flex gap-4 mt-2">
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditMode(false)}
                  className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-gray-700">
                <span className="font-semibold">Name:</span> {user.name || 'Not set'}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Email:</span> {user.email || 'Not set'}
              </p>
              <button
                onClick={() => setEditMode(true)}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition"
              >
                Edit Profile
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;