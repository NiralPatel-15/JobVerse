import { useEffect, useState, useCallback } from "react";

import axios from "../../api/axiosConfig";

const ModerationDashboard = () => {
  const [jobs, setJobs] = useState([]);

  const [loading, setLoading] = useState(true);

  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);

      const res = await axios.get("/moderation/flagged");

      setJobs(res.data);
    } catch (err) {
      console.error("Failed to fetch moderation jobs", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const overrideAction = async (jobId, action) => {
    try {
      await axios.post("/moderation/override", {
        jobId,
        action,
      });

      fetchJobs();
    } catch (err) {
      console.error("Override failed", err);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">AI Moderation Dashboard</h1>

      {loading ? (
        <div className="text-center py-10">Loading moderation queue...</div>
      ) : jobs.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-6">
          No flagged jobs found.
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((log) => (
            <div
              key={log._id}
              className="bg-white rounded-2xl shadow-md p-5 border"
            >
              <div className="flex flex-col lg:flex-row lg:justify-between gap-6">
                <div className="flex-1">
                  <h2 className="font-bold text-2xl">{log.job?.title}</h2>

                  <p className="text-gray-500 mt-1">
                    Recruiter: {log.recruiter?.name}
                  </p>

                  <p className="mt-3 text-red-500 font-medium">{log.reason}</p>

                  <div className="flex flex-wrap gap-4 mt-4">
                    <div className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">
                      Toxicity: {log.toxicityScore}
                    </div>

                    <div className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
                      Spam: {log.spamScore}
                    </div>

                    <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                      AI Score: {log.aiScore}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <button
                    onClick={() => overrideAction(log.job._id, "APPROVED")}
                    className="bg-green-500 hover:bg-green-600 transition text-white px-5 py-2 rounded-xl font-medium"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => overrideAction(log.job._id, "REJECTED")}
                    className="bg-red-500 hover:bg-red-600 transition text-white px-5 py-2 rounded-xl font-medium"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ModerationDashboard;