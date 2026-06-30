import axios from "./axiosConfig";

export const getPriorityQueue = async (jobId) => {
  const response = await axios.get(`/priority-queue/${jobId}`);

  return response.data;
};
