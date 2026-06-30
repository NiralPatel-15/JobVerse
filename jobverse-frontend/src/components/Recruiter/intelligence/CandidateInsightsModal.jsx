import { useEffect, useState, useCallback } from "react";
import axios from "../../../api/axiosConfig";

const CandidateInsightsModal = ({ applicationId, isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState(null);

  useEffect(() => {
    if (isOpen && applicationId) {
      fetchInsights();
    }
  }, [applicationId, isOpen, fetchInsights]);

  const fetchInsights = useCallback(async () => {
    try {
      setLoading(true);

      const res = await axios.get(`/intelligence/${applicationId}`);

      setData(res.data.insights);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [applicationId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-900 rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* HEADER */}
        <div className="flex justify-between items-center p-6 border-b border-zinc-200 dark:border-zinc-800">
          <div>
            <h2 className="text-2xl font-bold">ATS Candidate Intelligence</h2>

            <p className="text-sm text-zinc-500 mt-1">
              Enterprise AI recruiter insights
            </p>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200"
          >
            Close
          </button>
        </div>

        {loading ? (
          <div className="p-10 text-center">Loading insights...</div>
        ) : data ? (
          <div className="p-6 space-y-6">
            {/* SCORE GRID */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <ScoreCard title="ATS Score" value={data.atsScore} />

              <ScoreCard title="Skills" value={data.skillsScore} />

              <ScoreCard title="Experience" value={data.experienceScore} />

              <ScoreCard
                title="Resume Quality"
                value={data.resumeQualityScore}
              />
            </div>

            {/* SKILLS */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-zinc-50 dark:bg-zinc-800 rounded-2xl p-5">
                <h3 className="font-semibold text-lg mb-4 text-green-600">
                  Matched Skills
                </h3>

                <div className="flex flex-wrap gap-2">
                  {data.matchedSkills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-zinc-50 dark:bg-zinc-800 rounded-2xl p-5">
                <h3 className="font-semibold text-lg mb-4 text-red-600">
                  Missing Skills
                </h3>

                <div className="flex flex-wrap gap-2">
                  {data.missingSkills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* STRENGTHS + WEAKNESSES */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-zinc-50 dark:bg-zinc-800 rounded-2xl p-5">
                <h3 className="font-semibold text-lg mb-4">
                  Candidate Strengths
                </h3>

                <ul className="space-y-2">
                  {data.strengths.map((item, index) => (
                    <li
                      key={index}
                      className="text-sm text-zinc-700 dark:text-zinc-300"
                    >
                      • {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-zinc-50 dark:bg-zinc-800 rounded-2xl p-5">
                <h3 className="font-semibold text-lg mb-4">
                  Candidate Weaknesses
                </h3>

                <ul className="space-y-2">
                  {data.weaknesses.map((item, index) => (
                    <li
                      key={index}
                      className="text-sm text-zinc-700 dark:text-zinc-300"
                    >
                      • {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* ATS REASONING */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-3xl p-6">
              <h3 className="text-xl font-bold mb-3">ATS Reasoning</h3>

              <p className="leading-relaxed text-sm">{data.atsReasoning}</p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

const ScoreCard = ({ title, value }) => {
  return (
    <div className="bg-zinc-50 dark:bg-zinc-800 rounded-2xl p-5">
      <p className="text-sm text-zinc-500">{title}</p>

      <h2 className="text-3xl font-bold mt-2">{value}%</h2>
    </div>
  );
};

export default CandidateInsightsModal;
