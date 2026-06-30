import axios from "../api/axiosConfig";

export const getRecruiterAnalytics = async () => {
  const response = await axios.get("/analytics/recruiter/dashboard");

  return response.data;
};
