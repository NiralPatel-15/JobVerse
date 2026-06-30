import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

// ===============================
// SAVE / UPDATE RESUME
// ===============================
export const saveResumeAPI = async (data) => {
  const res = await axios.post(`${API}/api/resume-builder`, data, {
    withCredentials: true,
  });

  return res.data;
};

// ===============================
// GET MY RESUME
// ===============================
export const getMyResumeAPI = async () => {
  const res = await axios.get(`${API}/api/resume-builder/me`, {
    withCredentials: true,
  });

  return res.data;
};
 