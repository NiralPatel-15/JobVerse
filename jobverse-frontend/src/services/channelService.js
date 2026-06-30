import axios from "../api/axiosConfig";

export const getChannels = () => axios.get("/channels");

export const createChannel = (data) => axios.post("/channels", data);

export const joinChannel = (channelId) =>
  axios.post(`/channels/${channelId}/join`);

export const leaveChannel = (channelId) =>
  axios.post(`/channels/${channelId}/leave`);

export const getChannelMessages = (channelId) =>
  axios.get(`/channel-messages/${channelId}`);

export const addChannelMember = (channelId, memberId) =>
  axios.post(`/channels/${channelId}/add-member`, {
    memberId,
  });

export const removeChannelMember = (channelId, memberId) =>
  axios.post(`/channels/${channelId}/remove-member`, {
    memberId,
  });

export const getChannelMembers = (channelId) =>
  axios.get(`/channels/${channelId}/members`);

export const searchRecruiters = (channelId, keyword) =>
  axios.get(
    `/channels/search-recruiters?channelId=${channelId}&keyword=${keyword}`,
  );
