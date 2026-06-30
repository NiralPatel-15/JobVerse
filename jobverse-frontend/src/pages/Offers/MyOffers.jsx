import React, { useEffect, useState } from "react";
import {
  getMyOffersAPI,
  acceptOfferAPI,
  rejectOfferAPI,
} from "../../api/offerApi";
import { toast } from "react-toastify";

const MyOffers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOffers = async () => {
    try {
      const data = await getMyOffersAPI();

      setOffers(data.offers || []);
    } catch (error) {
      toast.error(error?.message || "Failed to load offers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleAccept = async (id) => {
    try {
      await acceptOfferAPI(id);

      toast.success("Offer accepted successfully");

      fetchOffers();
    } catch (error) {
      toast.error(error?.message || "Failed to accept offer");
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectOfferAPI(id);

      toast.success("Offer rejected");

      fetchOffers();
    } catch (error) {
      toast.error(error?.message || "Failed to reject offer");
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "accepted":
        return "bg-green-100 text-green-700";

      case "rejected":
        return "bg-red-100 text-red-700";

      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading Offers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 mb-8">
          <h1 className="text-3xl font-bold text-slate-900">My Job Offers</h1>

          <p className="text-slate-500 mt-2">
            Review and manage your received job offers.
          </p>
        </div>

        {/* Empty State */}
        {offers.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm min-h-[350px] flex flex-col justify-center items-center text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
              <svg
                className="w-10 h-10 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6M7 4h7l5 5v11a2 2 0 01-2 2H7a2 2 0 01-2-2V6a2 2 0 012-2z"
                />
              </svg>
            </div>

            <h2 className="text-xl font-semibold text-slate-900">
              No Job Offers Yet
            </h2>

            <p className="text-slate-500 mt-2">
              When recruiters send offers, they will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {offers.map((offer) => (
              <div
                key={offer._id}
                className="bg-white border border-slate-200 rounded-3xl shadow-sm p-6 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      {offer.job?.title || offer.title}
                    </h2>

                    <p className="text-slate-500 mt-2">
                      Recruiter:{" "}
                      <span className="font-medium text-slate-700">
                        {offer.recruiter?.f_name || "N/A"}
                      </span>
                    </p>

                    <p className="text-slate-500 mt-2">
                      Salary:{" "}
                      <span className="font-semibold text-slate-800">
                        ₹{offer.salary || "Not specified"}
                      </span>
                    </p>
                  </div>

                  <div>
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusBadge(
                        offer.status,
                      )}`}
                    >
                      {offer.status}
                    </span>
                  </div>
                </div>

                {offer.status === "pending" && (
                  <div className="flex flex-col sm:flex-row gap-3 mt-6">
                    <button
                      onClick={() => handleAccept(offer._id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl font-medium transition"
                    >
                      Accept Offer
                    </button>

                    <button
                      onClick={() => handleReject(offer._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl font-medium transition"
                    >
                      Reject Offer
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOffers;
