import React, { useState } from 'react';
import { register } from '../services/auth';
import './Signup.css';

const Signup = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', interests: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const interestsArr = form.interests ? form.interests.split(',').map(s => s.trim()) : [];
    const res = await register({ ...form, interests: interestsArr });
    setMessage(res.msg || 'Registered!');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow-lg p-8 flex flex-col gap-6 signup-form"
    >
      <h2 className="text-2xl font-bold text-center mb-2">Sign Up</h2>
      <input
        name="name"
        placeholder="Name"
        onChange={handleChange}
        required
        className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <input
        name="email"
        type="email"
        placeholder="Email"
        onChange={handleChange}
        required
        className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        onChange={handleChange}
        required
        className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <input
        name="interests"
        placeholder="Interests (comma separated)"
        onChange={handleChange}
        className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <button
        type="submit"
        className="bg-green-500 text-white rounded-lg py-2 font-semibold hover:bg-green-600 transition"
      >
        Sign Up
      </button>
      {message && (
        <p className="text-green-700 bg-green-100 border border-green-300 rounded-lg p-3 text-center">
          {message}
        </p>
      )}
    </form>
  );
};

export default Signup;