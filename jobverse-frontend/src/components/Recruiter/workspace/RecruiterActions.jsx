import axios from "../../../api/axiosConfig";
import { useState } from "react";

const statuses = ["shortlisted", "interview", "accepted", "rejected"];

const RecruiterActions = ({ application, refreshApplication }) => {
  const [loading, setLoading] = useState(false);

  const updateStatus = async (status) => {
    try {
      setLoading(true);

      await axios.put(`/applications/status/${application._id}`, { status });

      refreshApplication();
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const openOfferModal = () => {
    window.dispatchEvent(
      new CustomEvent("open-offer-modal", {
        detail: {
          application,
        },
      }),
    );
  };

  return (
    <div className="bg-white border border-gray-200 rounded-3xl shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-5">
        Recruiter Actions
      </h2>

      <div className="space-y-3">
        {statuses.map((status) => (
          <button
            key={status}
            disabled={loading}
            onClick={() => updateStatus(status)}
            className="w-full py-3 rounded-2xl bg-gray-50 border border-gray-200 hover:bg-indigo-50 transition"
          >
            Move to {status}
          </button>
        ))}

        {/* OFFER BUTTON */}

        {application.status === "interview" && (
          <button
            onClick={openOfferModal}
            className="
              w-full
              py-3
              rounded-2xl
              bg-green-600
              text-white
              font-medium
              hover:bg-green-500
            "
          >
            Send Offer
          </button>
        )}
      </div>
    </div>
  );
};

export default RecruiterActions;
