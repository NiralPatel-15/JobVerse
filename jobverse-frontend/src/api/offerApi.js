import axios from "../api/axiosConfig";

/*
|--------------------------------------------------------------------------
| Candidate Offers
|--------------------------------------------------------------------------
*/

export const getMyOffersAPI = async () => {
  const { data } = await axios.get("/offers/my-offers");
  return data;
};

export const acceptOfferAPI = async (offerId) => {
  const { data } = await axios.put(`/offers/accept/${offerId}`);
  return data;
};

export const rejectOfferAPI = async (offerId) => {
  const { data } = await axios.put(`/offers/reject/${offerId}`);
  return data;
};
