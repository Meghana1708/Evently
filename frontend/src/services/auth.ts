import axios from "axios";

const API_URL = "http://localhost:5001/api";

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

export const login = async (data: { email: string; password: string }) => {
  try {
    const res = await axios.post(`${API_URL}/auth/login`, data);
    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
    }
    return res.data;
  } catch (err: any) {
    return err.response?.data || { msg: "Login failed" };
  }
};

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

// Upload avatar to backend, returns avatar URL string
export const uploadAvatar = async (file: File): Promise<string | null> => {
  try {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("avatar", file);
    const res = await axios.post(`${API_URL}/user/avatar`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data.avatarUrl;
  } catch (err) {
    return null;
  }
};