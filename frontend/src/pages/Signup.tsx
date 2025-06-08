import React, { useState } from 'react';
import { register } from '../services/auth';

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
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Name" onChange={handleChange} required />
      <input name="email" placeholder="Email" onChange={handleChange} required />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
      <input name="interests" placeholder="Interests (comma separated)" onChange={handleChange} />
      <button type="submit">Sign Up</button>
      <p>{message}</p>
    </form>
  );
};

export default Signup;