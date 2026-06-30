import { useEffect, useState, useCallback } from "react";

import axios from "../../../api/axiosConfig";

const RecruiterCopilotPanel = ({ applicationId }) => {
  const [loading, setLoading] = useState(false);

  const [copilot, setCopilot] = useState(null);

  const fetchCopilot = useCallback(async () => {
    if (!applicationId) return;

    try {
      setLoading(true);

      const response = await axios.get(`/copilot/${applicationId}`);

      setCopilot(response.data.copilot);
    } catch (error) {
      console.error("Copilot fetch failed:", error);
    } finally {
      setLoading(false);
    }
  }, [applicationId]);

  useEffect(() => {
    fetchCopilot();
  }, [fetchCopilot]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        Loading AI recruiter assistant...
      </div>
    );
  }

  if (!copilot) return null;

  const getRecommendationColor = (recommendation) => {
    switch (recommendation) {
      case "Strong Hire":
        return "bg-green-100 text-green-700";

      case "Hire":
        return "bg-blue-100 text-blue-700";

      case "Hold":
        return "bg-yellow-100 text-yellow-700";

      default:
        return "bg-red-100 text-red-700";
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6 space-y-6">
      {/* HEADER */}
      <div>
        <h2 className="text-xl font-bold text-gray-800">
          AI Recruiter Assistant
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Enterprise hiring intelligence
        </p>
      </div>

      {/* RECOMMENDATION */}
      <div>
        <span
          className={`px-4 py-2 rounded-full text-sm font-semibold ${getRecommendationColor(
            copilot.recommendation,
          )}`}
        >
          {copilot.recommendation}
        </span>
      </div>

      {/* SUMMARY */}
      <div className="bg-gray-50 rounded-2xl p-5">
        <h3 className="font-semibold text-gray-800 mb-3">
          AI Candidate Summary
        </h3>

        <p className="text-sm text-gray-600 leading-relaxed">
          {copilot.summary}
        </p>
      </div>

      {/* NEXT ACTION */}
      <div className="bg-indigo-50 rounded-2xl p-5 border border-indigo-100">
        <h3 className="font-semibold text-indigo-700 mb-2">
          Recommended Next Action
        </h3>

        <p className="text-sm text-indigo-600">{copilot.nextAction}</p>
      </div>

      {/* STRENGTHS */}
      <div>
        <h3 className="font-semibold text-green-700 mb-3">Strengths</h3>

        <div className="space-y-2">
          {copilot.strengths.map((item, index) => (
            <div
              key={index}
              className="bg-green-50 border border-green-100 rounded-xl px-4 py-3 text-sm text-green-700"
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* CONCERNS */}
      <div>
        <h3 className="font-semibold text-red-700 mb-3">Concerns</h3>

        <div className="space-y-2">
          {copilot.concerns.map((item, index) => (
            <div
              key={index}
              className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-700"
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecruiterCopilotPanel;
