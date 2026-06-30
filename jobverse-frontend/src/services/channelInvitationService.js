import axios from "../api/axiosConfig";

export const sendChannelInvitation = (channelId, recruiterId) => {
  return axios.post("/channel-invitations", {
    channelId,
    recruiterId,
  });
};

export const getPendingInvitations = () => {
  return axios.get("/channel-invitations/pending");
};

export const acceptInvitation = (invitationId) => {
  return axios.post(`/channel-invitations/${invitationId}/accept`);
};

export const rejectInvitation = (invitationId) => {
  return axios.post(`/channel-invitations/${invitationId}/reject`);
};
