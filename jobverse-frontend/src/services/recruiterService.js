import axios from "axios";

const API = axios.create({
  baseURL: "https://jobverse-api.onrender.com/api",
  withCredentials: true, // IMPORTANT
});

export const getRecruiterDashboard = () => {
  return API.get("/recruiter/dashboard");
};
