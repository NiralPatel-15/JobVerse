import axios from "axios";

// ✅ APPLY JOB
export const applyJobAPI = (data) =>
  axios.post("/api/applications/apply", data);

// ✅ GET APPLICANTS
export const getApplicantsAPI = (jobId) =>
  axios.get(`/api/applications/job/${jobId}`);

// ✅ UPDATE STATUS
export const updateStatusAPI = (id, status) =>
  axios.put(`/api/applications/status/${id}`, {
    status,
  });
