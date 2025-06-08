import React, { useEffect, useState } from 'react';
import { getProfile, updateProfile } from '../services/auth';

const Profile = () => {
  const [profile, setProfile] = useState<any>(null);
  const [form, setForm] = useState({ name: '', interests: '' });
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    async function fetchProfile() {
      if (token) {
        const res = await getProfile(token);
        setProfile(res);
        setForm({ name: res.name, interests: res.interests ? res.interests.join(', ') : '' });
      }
    }
    fetchProfile();
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (token) {
      const interestsArr = form.interests ? form.interests.split(',').map(s => s.trim()) : [];
      const res = await updateProfile(token, { name: form.name, interests: interestsArr });
      setProfile(res);
      setMessage('Profile updated!');
    }
  };

  if (!profile) return <p>Loading...</p>;

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" value={form.name} onChange={handleChange} />
      <input name="interests" value={form.interests} onChange={handleChange} placeholder="Interests (comma separated)" />
      <button type="submit">Update</button>
      <p>{message}</p>
    </form>
  );
};

export default Profile;