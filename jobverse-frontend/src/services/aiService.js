import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000",
  withCredentials: true,
});

export const chatAI = async (message) => {
  const res = await API.post("/api/ai/chat", {
    message,
  });

  return res.data;
};

export const generateInterviewQuestions = async (role) => {
  const res = await API.post("/api/ai/interview-questions", {
    role,
  });

  return res.data;
};

export const recommendJobs = async () => {
  const res = await API.get("/api/ai/recommend-jobs");

  return res.data;
};

export const careerGuidance = async () => {
  const res = await API.get("/api/ai/career-guidance");

  return res.data;
};

// NEW Resume Review API
export const resumeReview = async (file) => {
  const formData = new FormData();

  formData.append("resume", file);

  const res = await API.post(
    "/api/ai/resume-review",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  ); 

  return res.data;
};
