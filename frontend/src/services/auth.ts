import axios from "axios";

const API_URL = "http://localhost:5001/api";

// Register a new user
export const register = async (data: {
  name: string;
  email: string;
  password: string;
  interests: string[];
}) => {
  try {
    const res = await axios.post(`${API_URL}/auth/register`, data);
    return res.data;
  } catch (err: any) {
    return err.response?.data || { msg: "Registration failed" };
  }
};

// Login user
export const login = async (data: { email: string; password: string }) => {
  try {
    const res = await axios.post(`${API_URL}/auth/login`, data);
    return res.data;
  } catch (err: any) {
    return err.response?.data || { msg: "Login failed" };
  }
};

// Get user profile (requires JWT token in localStorage)
export const getProfile = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${API_URL}/user/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err: any) {
    return err.response?.data || { msg: "Unable to fetch profile" };
  }
};

// Update user profile (requires JWT)
export const updateProfile = async (data: { name: string; interests: string[] }) => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.put(`${API_URL}/user/me`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err: any) {
    return err.response?.data || { msg: "Profile update failed" };
  }
};