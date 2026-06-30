import axios from "./axiosConfig";

export const getTalentMatches = async (jobId) => {
  const response = await axios.get(`/talent-match/${jobId}`);

  return response.data;
};
