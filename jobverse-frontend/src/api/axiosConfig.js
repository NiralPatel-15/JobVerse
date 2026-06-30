import axios from "axios";

const instance = axios.create({
  baseURL: "https://jobverse-api.onrender.com/api",
  withCredentials: true,
});

// ✅ ADD THIS INTERCEPTOR
instance.interceptors.request.use((config) => {
  const token = JSON.parse(localStorage.getItem("userInfo"))?.token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default instance;
