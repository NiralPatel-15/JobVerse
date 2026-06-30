import { useEffect, useState } from "react";

import axios from "../../../api/axiosConfig";
import socket from "../../../socket";

const HiringScorecardPanel = ({ applicationId }) => {
  const [scorecard, setScorecard] = useState(null);

  useEffect(() => {
    const fetchScorecard = async () => {
      try {
        const res = await axios.get(`/scorecards/${applicationId}`);

        setScorecard(res.data.scorecard);
      } catch (error) {
        console.log(error);
      }
    };

    fetchScorecard();

    socket.emit("joinApplicationRoom", applicationId);

    const handleScorecardUpdate = (updatedScorecard) => {
      setScorecard(updatedScorecard);
    };

    socket.on("scorecardUpdated", handleScorecardUpdate);

    return () => {
      socket.off("scorecardUpdated", handleScorecardUpdate);
    };
  }, [applicationId]);

  if (!scorecard) {
    return (
      <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
        <p className="text-gray-500 text-sm">
          No hiring scorecard available yet
        </p>
      </div>
    );
  }

  const getRecommendationColor = () => {
    switch (scorecard.finalRecommendation) {
      case "Strong Hire":
        return "text-emerald-600 bg-emerald-50";

      case "Hire":
        return "text-green-600 bg-green-50";

      case "Neutral":
        return "text-yellow-600 bg-yellow-50";

      case "Reject":
        return "text-orange-600 bg-orange-50";

      case "Strong Reject":
        return "text-red-600 bg-red-50";

      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
      {/* HEADER */}

      <div className="border-b border-gray-100 px-6 py-5 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Hiring Scorecard
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Enterprise candidate evaluation
          </p>
        </div>

        <div
          className={`px-4 py-2 rounded-2xl text-sm font-semibold ${getRecommendationColor()}`}
        >
          {scorecard.finalRecommendation}
        </div>
      </div>

      {/* BODY */}

      <div className="p-6 space-y-6">
        {/* SCORE */}

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-2xl p-5">
            <p className="text-sm text-gray-500">Average Score</p>

            <h3 className="text-3xl font-bold text-gray-900 mt-2">
              {scorecard.averageScore}/5
            </h3>
          </div>

          <div className="bg-gray-50 rounded-2xl p-5">
            <p className="text-sm text-gray-500">Hiring Confidence</p>

            <h3 className="text-3xl font-bold text-indigo-600 mt-2">
              {scorecard.hiringConfidence}%
            </h3>
          </div>

          <div className="bg-gray-50 rounded-2xl p-5">
            <p className="text-sm text-gray-500">Interviewers</p>

            <h3 className="text-3xl font-bold text-gray-900 mt-2">
              {scorecard.totalInterviewers}
            </h3>
          </div>
        </div>

        {/* PROGRESS BAR */}

        <div>
          <div className="flex justify-between mb-2">
            <p className="text-sm font-medium text-gray-700">Hiring Strength</p>

            <p className="text-sm text-gray-500">
              {scorecard.hiringConfidence}%
            </p>
          </div>

          <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 rounded-full transition-all duration-500"
              style={{
                width: `${scorecard.hiringConfidence}%`,
              }}
            />
          </div>
        </div>

        {/* BREAKDOWN */}

        <div>
          <h3 className="text-sm font-semibold text-gray-800 mb-4">
            Recommendation Breakdown
          </h3>

          <div className="space-y-3">
            {Object.entries(scorecard.recommendationBreakdown).map(
              ([key, value]) => (
                <div
                  key={key}
                  className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3"
                >
                  <span className="text-sm text-gray-700 capitalize">
                    {key.replace(/([A-Z])/g, " $1")}
                  </span>

                  <span className="font-semibold text-gray-900">{value}</span>
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HiringScorecardPanel;
