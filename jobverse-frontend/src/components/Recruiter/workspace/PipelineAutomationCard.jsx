import { useEffect, useState, useCallback } from "react";

import axios from "../../../api/axiosConfig";

const PipelineAutomationCard = ({ applicationId }) => {
  const [automation, setAutomation] = useState(null);

  const [loading, setLoading] = useState(true);

  const [applying, setApplying] = useState(false);

  const fetchAutomation = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(`/automation/${applicationId}`);

      setAutomation(data.automation);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [applicationId]);

  useEffect(() => {
    fetchAutomation();
  }, [fetchAutomation]);

  const handleApplyAutomation = async () => {
    try {
      setApplying(true);

      await axios.post(`/automation/apply/${applicationId}`);

      await fetchAutomation();

      window.location.reload();
    } catch (error) {
      console.error(error);
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-5 shadow-sm border">
        <p className="text-sm text-gray-500">Loading automation insights...</p>
      </div>
    );
  }

  if (!automation) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl border shadow-sm p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          Smart Pipeline Automation
        </h2>

        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            automation.priorityLevel === "high"
              ? "bg-green-100 text-green-700"
              : automation.priorityLevel === "medium"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-red-100 text-red-700"
          }`}
        >
          {automation.priorityLevel.toUpperCase()}
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-sm text-gray-500">Current Stage</p>

          <h3 className="text-lg font-semibold capitalize mt-1">
            {automation.currentStage}
          </h3>
        </div>

        <div className="bg-blue-50 rounded-xl p-4">
          <p className="text-sm text-blue-600">Recommended Stage</p>

          <h3 className="text-lg font-semibold capitalize mt-1 text-blue-900">
            {automation.recommendedStage}
          </h3>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-4">
        <p className="text-sm text-gray-500 mb-2">AI Automation Reasoning</p>

        <p className="text-sm text-gray-700 leading-relaxed">
          {automation.automationReason}
        </p>
      </div>

      <div className="flex items-center justify-between border-t pt-4">
        <div>
          <p className="text-sm text-gray-500">ATS Score</p>

          <h3 className="text-2xl font-bold text-gray-900">
            {automation.score}
          </h3>
        </div>

        <button
          onClick={handleApplyAutomation}
          disabled={applying}
          className="px-5 py-2 rounded-xl bg-black text-white hover:bg-gray-800 transition disabled:opacity-50"
        >
          {applying ? "Applying..." : "Apply Automation"}
        </button>
      </div>
    </div>
  );
};

export default PipelineAutomationCard;