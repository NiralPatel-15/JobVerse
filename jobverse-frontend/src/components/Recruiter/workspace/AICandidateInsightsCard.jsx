import React from "react";

const getRecommendationColor = (recommendation) => {
  switch (recommendation) {
    case "STRONG_MATCH":
      return "bg-green-100 text-green-700";

    case "GOOD_MATCH":
      return "bg-blue-100 text-blue-700";

    case "AVERAGE_MATCH":
      return "bg-yellow-100 text-yellow-700";

    case "WEAK_MATCH":
      return "bg-red-100 text-red-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
};

const AICandidateInsightsCard = ({ scoreData }) => {
  if (!scoreData) return null;

  return (
    <div className="bg-white rounded-2xl border shadow-sm p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-2xl font-bold">AI Candidate Insights</h2>

          <p className="text-gray-500 mt-1">Enterprise AI scoring engine</p>
        </div>

        <div className="text-center">
          <div className="text-4xl font-bold text-indigo-600">
            {scoreData.overallScore}%
          </div>

          <div className="text-sm text-gray-500">Match Score</div>
        </div>
      </div>

      <div className="mb-6">
        <span
          className={`px-4 py-2 rounded-full text-sm font-semibold ${getRecommendationColor(
            scoreData.recommendation,
          )}`}
        >
          {scoreData.recommendation.replace("_", " ")}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 rounded-xl p-4">
          <h3 className="font-semibold mb-3">Matched Skills</h3>

          <div className="flex flex-wrap gap-2">
            {scoreData.matchedSkills?.map((skill) => (
              <span
                key={skill}
                className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-4">
          <h3 className="font-semibold mb-3">Missing Skills</h3>

          <div className="flex flex-wrap gap-2">
            {scoreData.missingSkills?.map((skill) => (
              <span
                key={skill}
                className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-indigo-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-indigo-600">
            {scoreData.skillMatchScore}%
          </div>

          <div className="text-sm text-gray-500 mt-1">Skill Match</div>
        </div>

        <div className="bg-blue-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {scoreData.experienceScore}%
          </div>

          <div className="text-sm text-gray-500 mt-1">Experience</div>
        </div>

        <div className="bg-purple-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">
            {scoreData.keywordScore}%
          </div>

          <div className="text-sm text-gray-500 mt-1">Keywords</div>
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-lg mb-3">AI Insights</h3>

        <div className="space-y-2">
          {scoreData.aiInsights?.map((insight, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-lg px-4 py-3 text-gray-700"
            >
              {insight}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AICandidateInsightsCard;
