import axios from "./axiosConfig";

export const getShortlistRecommendations = async (jobId) => {
  const response = await axios.get(`/shortlist/recommendations/${jobId}`);

  return response.data;
};
