import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// ======================================
// CREATE REPORT
// ======================================
export const createReportAPI = async (data) => {
  const token = localStorage.getItem("token");

  return API.post("/api/reports/create", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
