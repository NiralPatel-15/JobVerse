import { useEffect, useState, useCallback } from "react";

import axios from "../../../api/axiosConfig";

import CandidateInsightsModal from "./CandidateInsightsModal";

const RankedCandidatesTable = ({ jobId }) => {
  const [candidates, setCandidates] = useState([]);

  const [loading, setLoading] = useState(true);

  // INSIGHTS MODAL STATE
  const [selectedApplication, setSelectedApplication] = useState(null);

  const [openInsights, setOpenInsights] = useState(false);

  const fetchRankings = useCallback(async () => {
    if (!jobId) return;

    try {
      setLoading(true);

      const response = await axios.get(`/scoring/job/${jobId}/rankings`);

      setCandidates(response.data.candidates || []);
    } catch (error) {
      console.error("Failed to fetch rankings:", error);
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    fetchRankings();
  }, [fetchRankings]);

  const getBadgeColor = (recommendation) => {
    switch (recommendation) {
      case "Highly Recommended":
        return "bg-green-100 text-green-700";

      case "Recommended":
        return "bg-blue-100 text-blue-700";

      case "Average":
        return "bg-yellow-100 text-yellow-700";

      default:
        return "bg-red-100 text-red-700";
    }
  };

  if (loading) {
    return <div className="p-6">Loading rankings...</div>;
  }

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Candidate Rankings
            </h2>

            <p className="text-sm text-gray-500">
              ATS intelligent ranking engine
            </p>
          </div>
        </div>

        {candidates.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No ranked candidates found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 text-left text-sm text-gray-500">
                  <th className="pb-4">Rank</th>

                  <th className="pb-4">Candidate</th>

                  <th className="pb-4">Final Score</th>

                  <th className="pb-4">Skills</th>

                  <th className="pb-4">Experience</th>

                  <th className="pb-4">Resume Quality</th>

                  <th className="pb-4">Recommendation</th>

                  <th className="pb-4">Insights</th>
                </tr>
              </thead>

              <tbody>
                {candidates.map((candidate) => (
                  <tr
                    key={candidate._id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition"
                  >
                    <td className="py-4">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-semibold">
                        #{candidate.rankingPosition}
                      </div>
                    </td>

                    <td className="py-4">
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {candidate.candidateId?.name}
                        </h3>

                        <p className="text-sm text-gray-500">
                          {candidate.candidateId?.email}
                        </p>
                      </div>
                    </td>

                    <td className="py-4">
                      <div className="font-bold text-lg text-indigo-600">
                        {candidate.scores?.finalScore}
                      </div>
                    </td>

                    <td className="py-4">{candidate.scores?.skills}%</td>

                    <td className="py-4">{candidate.scores?.experience}%</td>

                    <td className="py-4">{candidate.scores?.resumeQuality}%</td>

                    <td className="py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getBadgeColor(
                          candidate.recommendation,
                        )}`}
                      >
                        {candidate.recommendation}
                      </span>
                    </td>

                    {/* INSIGHTS BUTTON */}
                    <td className="py-4">
                      <button
                        onClick={() => {
                          setSelectedApplication(candidate.applicationId);

                          setOpenInsights(true);
                        }}
                        className="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition"
                      >
                        View Insights
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL */}
      <CandidateInsightsModal
        applicationId={selectedApplication}
        isOpen={openInsights}
        onClose={() => setOpenInsights(false)}
      />
    </>
  );
};

export default RankedCandidatesTable;