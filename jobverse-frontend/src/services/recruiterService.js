import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:4000/api",
  withCredentials: true, // IMPORTANT
});

export const getRecruiterDashboard = () => {
  return API.get("/recruiter/dashboard");
};
