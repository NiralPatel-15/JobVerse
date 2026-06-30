import { useEffect, useState, useCallback } from "react";

import { io } from "socket.io-client";

import { getShortlistRecommendations } from "../../../api/shortlistApi";

const AIShortlistDashboard = ({ jobId }) => {
  const [candidates, setCandidates] = useState([]);

  const [loading, setLoading] = useState(true);

  const fetchRecommendations = useCallback(async () => {
    try {
      const data = await getShortlistRecommendations(jobId);

      setCandidates(data.recommendations);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_URL);

    socket.emit("joinJobRoom", jobId);

    socket.on("shortlistUpdated", () => {
      fetchRecommendations();
    });

    return () => {
      socket.disconnect();
    };
  }, [jobId, fetchRecommendations]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow p-6">
        Loading AI shortlist...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">AI Shortlist Recommendations</h2>

        <div className="text-sm text-gray-500">
          {candidates.length} Candidates
        </div>
      </div>

      <div className="space-y-4">
        {candidates.map((candidate) => (
          <div
            key={candidate._id}
            className="border rounded-xl p-4 hover:shadow-md transition"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">
                  {candidate.candidate?.name || "Candidate"}
                </h3>

                <p className="text-sm text-gray-500">
                  Recommendation:
                  <span className="ml-2 font-medium">
                    {candidate.recommendation}
                  </span>
                </p>
              </div>

              <div className="text-right">
                <div className="text-3xl font-bold text-blue-600">
                  {candidate.fitScore}
                </div>

                <div className="text-xs text-gray-500">Hiring Fit Score</div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 mt-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">ATS Score</p>

                <p className="font-semibold">{candidate.atsScore}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">Resume Score</p>

                <p className="font-semibold">{candidate.resumeScore}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">Interview</p>

                <p className="font-semibold">{candidate.interviewScore}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">Skill Match</p>

                <p className="font-semibold">{candidate.skillMatch}%</p>
              </div>
            </div>

            {candidate.risks.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium text-red-500 mb-2">Risk Analysis</h4>

                <div className="flex flex-wrap gap-2">
                  {candidate.risks.map((risk, index) => (
                    <span
                      key={index}
                      className="bg-red-100 text-red-600 text-xs px-3 py-1 rounded-full"
                    >
                      {risk}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIShortlistDashboard;