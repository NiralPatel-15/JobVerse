import { useEffect, useState, useCallback } from "react";

import { getTalentMatches } from "../../../api/talentMatchApi";

const TalentMatchDashboard = ({ jobId }) => {
  const [matches, setMatches] = useState([]);

  const [loading, setLoading] = useState(true);

  const fetchMatches = useCallback(async () => {
    try {
      const data = await getTalentMatches(jobId);

      setMatches(data.matches);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow p-6">
        Loading talent matches...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">AI Talent Match Engine</h2>

        <div className="text-sm text-gray-500">{matches.length} Candidates</div>
      </div>

      <div className="space-y-5">
        {matches.map((item) => (
          <div key={item.applicationId} className="border rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">
                  {item.candidate?.name || "Candidate"}
                </h3>

                <p className="text-sm text-gray-500">
                  Hiring Confidence:
                  <span className="ml-2 font-medium">
                    {item.hiringConfidence}
                  </span>
                </p>
              </div>

              <div className="text-right">
                <div className="text-3xl font-bold text-indigo-600">
                  {item.matchScore}%
                </div>

                <div className="text-xs text-gray-500">Match Score</div>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="font-medium text-green-600 mb-2">
                Matched Skills
              </h4>

              <div className="flex flex-wrap gap-2">
                {item.matchedSkills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <h4 className="font-medium text-red-500 mb-2">Missing Skills</h4>

              <div className="flex flex-wrap gap-2">
                {item.missingSkills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TalentMatchDashboard;
