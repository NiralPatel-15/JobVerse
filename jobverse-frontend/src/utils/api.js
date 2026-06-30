import axios from "axios";

const API = axios.create({
  baseURL: "https://jobverse-api.onrender.com/api", // change if needed
  withCredentials: true,
});

// Optional: Request interceptor
API.interceptors.request.use((req) => {
  return req;
});

// Optional: Response interceptor
API.interceptors.response.use(
  (res) => res,
  (err) => {
    console.log("API Error:", err.response?.data || err.message);
    return Promise.reject(err);
  },
);

export default API;
