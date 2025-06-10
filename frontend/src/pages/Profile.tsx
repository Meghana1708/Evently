import React, { useEffect, useRef, useState } from 'react';
import { getProfile, updateProfile, uploadAvatar } from '../services/auth';
import Badge from '../components/Badge';
import './Profile.css';

interface User {
  name: string;
  email: string;
  interests?: string[];
  avatarUrl?: string;
}

const BACKEND_URL = "http://localhost:5001";

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ name: '', interests: '', avatarUrl: '' });
  const [message, setMessage] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const data = await getProfile();
      setUser(data);
      setForm({
        name: data.name || '',
        interests: data.interests ? data.interests.join(', ') : '',
        avatarUrl: data.avatarUrl || '',
      });
      setPreview(data.avatarUrl || null);
      setImgError(false);
    };
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      // Preview while uploading (optional)
      const reader = new FileReader();
      reader.onload = function (event) {
        if (event.target && typeof event.target.result === 'string') {
          setPreview(event.target.result);
          setImgError(false);
        }
      };
      reader.readAsDataURL(file);

      // Upload to backend and set returned URL
      const url = await uploadAvatar(file);
      if (url) {
        setForm((prev) => ({ ...prev, avatarUrl: url }));
        setPreview(url); // Use backend-served image after upload completes
        setImgError(false);
      }
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const interestsArr = form.interests ? form.interests.split(',').map(s => s.trim()) : [];
    const updated = await updateProfile({ name: form.name, interests: interestsArr });
    setUser(updated);
    setEditMode(false);
    setMessage('🎉 Profile updated successfully!');
    setPreview(updated.avatarUrl || null); // Use backend url after update
    setImgError(false);
    setTimeout(() => setMessage(''), 2000);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = "/login";
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="text-gray-500">Loading profile...</div>
      </div>
    );
  }

  // Calculate the actual image src (handles local backend dev)
  const avatarSrc =
    (preview && preview.startsWith('/api'))
      ? BACKEND_URL + preview
      : (preview ?? '') ||
        (user.avatarUrl && user.avatarUrl.startsWith('/api')
          ? BACKEND_URL + user.avatarUrl
          : user.avatarUrl ?? '');

  // Debug logs
  console.log("user.avatarUrl", user.avatarUrl);
  console.log("preview", preview);
  console.log("avatarSrc", avatarSrc);

  return (
    <div className="max-w-xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden profile-card-creative relative">
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-500 via-fuchsia-500 to-orange-400 h-36 relative flex items-center justify-center">
        {/* Avatar */}
        <div className="absolute left-1/2 -bottom-14 -translate-x-1/2 flex flex-col items-center">
          <div className="group relative">
            {avatarSrc && !imgError ? (
              <>
                {console.log("Rendering img with", avatarSrc)}
                <img
                  src={avatarSrc}
                  alt=""
                  onError={() => setImgError(true)}
                  className="w-28 h-28 rounded-full border-4 border-white shadow-lg object-cover profile-avatar transition-transform duration-300 group-hover:scale-105"
                />
              </>
            ) : (
              <>
                {console.log("Rendering gray circle")}
                <div className="w-28 h-28 rounded-full border-4 border-white shadow-lg bg-gray-200"></div>
              </>
            )}
            {editMode && (
              <>
                <button
                  type="button"
                  className="absolute inset-0 w-full h-full flex items-center justify-center bg-black bg-opacity-30 rounded-full opacity-0 group-hover:opacity-100 transition"
                  onClick={() => fileInputRef.current?.click()}
                  title="Change avatar"
                >
                  <span className="text-white text-xl font-bold">Change</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </>
            )}
          </div>
          <span className="mt-2 text-xs text-gray-400">{editMode ? "Click avatar to upload" : ""}</span>
        </div>
      </div>
      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="absolute top-6 right-6 bg-gradient-to-r from-fuchsia-500 to-orange-400 text-white px-4 py-2 rounded-full font-bold shadow hover:scale-110 transition"
        title="Logout"
      >
        Logout
      </button>
      {/* Card Body */}
      <div className="pt-24 pb-10 px-8">
        <h2 className="text-3xl font-extrabold text-center text-evently mb-2 drop-shadow-lg">
          {user.name}
        </h2>
        <div className="text-center text-gray-500 font-medium text-lg">{user.email}</div>
        <div className="mt-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl font-semibold text-evently">Interests</span>
            <span className="animate-pulse text-lg">🎈</span>
          </div>
          <div className="flex flex-wrap gap-2 py-2">
            {user.interests && user.interests.length > 0
              ? user.interests.map((interest: string, idx: number) => (
                  <Badge color="gradient" key={idx}>
                    {interest}
                  </Badge>
                ))
              : <span className="text-gray-400 italic">None yet! Tell us what you love.</span>}
          </div>
        </div>
        {/* Edit Mode */}
        {editMode ? (
          <form onSubmit={handleUpdate} className="flex flex-col gap-4 mt-6">
            <div>
              <label className="block mb-1 text-gray-600 font-semibold">Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="border-2 border-fuchsia-200 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
              />
            </div>
            <div>
              <label className="block mb-1 text-gray-600 font-semibold">Interests</label>
              <input
                name="interests"
                value={form.interests}
                onChange={handleChange}
                placeholder="Comma separated"
                className="border-2 border-blue-200 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-500 via-fuchsia-500 to-orange-400 text-white rounded-lg py-2 font-semibold hover:scale-105 transition mt-2 shadow-md"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => {
                setEditMode(false);
                setPreview(user.avatarUrl || null);
                setForm({
                  name: user.name,
                  interests: user.interests ? user.interests.join(', ') : '',
                  avatarUrl: user.avatarUrl || '',
                });
                setImgError(false);
              }}
              className="text-gray-400 hover:text-fuchsia-500 mt-1 transition"
            >
              Cancel
            </button>
          </form>
        ) : (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setEditMode(true)}
              className="bg-gradient-to-r from-blue-500 to-fuchsia-500 text-white rounded-xl px-8 py-2 font-bold shadow-md hover:scale-105 transition"
            >
              Edit Profile
            </button>
          </div>
        )}
        {message && (
          <p className="mt-6 text-center text-lg text-green-700 bg-green-100 border border-green-300 rounded-lg p-3 shadow">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default Profile;