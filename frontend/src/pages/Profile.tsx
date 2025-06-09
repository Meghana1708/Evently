import React, { useEffect, useState } from 'react';
import { getProfile, updateProfile } from '../services/auth';
import './Profile.css';

interface User {
  name: string;
  email: string;
  interests?: string[];
}

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ name: '', interests: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      const data = await getProfile();
      setUser(data);
      setForm({
        name: data.name || '',
        interests: data.interests ? data.interests.join(', ') : '',
      });
    };
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const interestsArr = form.interests ? form.interests.split(',').map(s => s.trim()) : [];
    const updated = await updateProfile({ name: form.name, interests: interestsArr });
    setUser(updated);
    setEditMode(false);
    setMessage('Profile updated successfully!');
    setTimeout(() => setMessage(''), 2000);
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="text-gray-500">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 profile-card">
      <h2 className="text-2xl font-bold mb-4 text-center">Your Profile</h2>
      <div className="mb-6">
        <label className="block mb-1 text-gray-600">Email</label>
        <div className="border px-4 py-2 rounded bg-gray-50 text-gray-700">{user.email}</div>
      </div>
      {editMode ? (
        <form onSubmit={handleUpdate} className="flex flex-col gap-4">
          <div>
            <label className="block mb-1 text-gray-600">Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="border rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-600">Interests</label>
            <input
              name="interests"
              value={form.interests}
              onChange={handleChange}
              placeholder="Comma separated"
              className="border rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white rounded-lg py-2 font-semibold hover:bg-blue-600 transition mt-2"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => setEditMode(false)}
            className="text-gray-500 hover:text-blue-500 mt-1"
          >
            Cancel
          </button>
        </form>
      ) : (
        <>
          <div className="mb-4">
            <label className="block mb-1 text-gray-600">Name</label>
            <div className="border px-4 py-2 rounded bg-gray-50 text-gray-700">{user.name}</div>
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-gray-600">Interests</label>
            <div className="border px-4 py-2 rounded bg-gray-50 text-gray-700">
              {user.interests && user.interests.length > 0
                ? user.interests.join(', ')
                : 'None'}
            </div>
          </div>
          <button
            onClick={() => setEditMode(true)}
            className="bg-blue-500 text-white rounded-lg py-2 px-4 font-semibold hover:bg-blue-600 transition"
          >
            Edit Profile
          </button>
        </>
      )}
      {message && (
        <p className="mt-4 text-green-700 bg-green-100 border border-green-300 rounded-lg p-3 text-center">
          {message}
        </p>
      )}
    </div>
  );
};

export default Profile;