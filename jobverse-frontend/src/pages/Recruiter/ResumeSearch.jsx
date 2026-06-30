import { useCallback, useEffect, useState } from "react";
import axios from "../../api/axiosConfig";

const ResumeSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchResumes = useCallback(async () => {
    try {
      setLoading(true);

      const res = await axios.get(`/resume/search?query=${query}`);

      setResults(res.data.resumes || []);
    } catch (error) {
      console.error("Resume search error:", error);
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    searchResumes();
  }, [searchResumes]);

  return (
    <div className="p-6">
      <div className="bg-zinc-900 rounded-xl p-5 border border-zinc-800">
        <h1 className="text-2xl font-bold text-white mb-4">
          AI Candidate Search
        </h1>

        <input
          type="text"
          placeholder="Search skills, companies, roles..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-3 rounded-lg bg-zinc-800 text-white outline-none"
        />

        <button
          onClick={searchResumes}
          className="mt-4 bg-blue-600 hover:bg-blue-700 transition px-5 py-2 rounded-lg text-white"
        >
          Search
        </button>
      </div>

      <div className="mt-6">
        {loading ? (
          <div className="text-zinc-400">Searching resumes...</div>
        ) : (
          <div className="grid gap-4">
            {results.length > 0 ? (
              results.map((resume) => (
                <div
                  key={resume._id}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl p-5"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-semibold text-white">
                        {resume.parsedData?.basics?.fullName}
                      </h2>

                      <p className="text-zinc-400 mt-1">
                        {resume.metadata?.currentRole}
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="text-green-400 text-xl font-bold">
                        {resume.aiInsights?.overallScore}%
                      </div>

                      <p className="text-zinc-500 text-sm">AI Score</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-4">
                    {resume.parsedData?.skills?.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-zinc-800 rounded-full text-sm text-zinc-300"
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-zinc-500">No resumes found</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeSearch;