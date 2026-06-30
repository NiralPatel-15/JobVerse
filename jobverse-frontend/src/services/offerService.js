import axios from "../api/axiosConfig";

export const getMyOffersAPI = () => axios.get("/offers/my-offers");

export const acceptOfferAPI = (id) => axios.put(`/offers/accept/${id}`);

export const rejectOfferAPI = (id) => axios.put(`/offers/reject/${id}`);
