import { useEffect, useState, useCallback } from "react";

import { getPriorityQueue } from "../../../api/priorityQueueApi";

const RecruiterPriorityQueue = ({ jobId }) => {
  const [queue, setQueue] = useState([]);

  const [loading, setLoading] = useState(true);

  const fetchQueue = useCallback(async () => {
    try {
      const data = await getPriorityQueue(jobId);

      setQueue(data.queue);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    fetchQueue();
  }, [fetchQueue]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow p-6">
        Loading recruiter queue...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Recruiter Priority Queue</h2>

        <div className="text-sm text-gray-500">{queue.length} Candidates</div>
      </div>

      <div className="space-y-4">
        {queue.map((item) => (
          <div
            key={item._id}
            className="border rounded-xl p-4 hover:shadow-md transition"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">
                  {item.candidate?.name || "Candidate"}
                </h3>

                <p className="text-sm text-gray-500">Status: {item.status}</p>
              </div>

              <div className="text-right">
                <div
                  className={`text-sm px-3 py-1 rounded-full inline-block ${
                    item.priority === "HIGH"
                      ? "bg-red-100 text-red-600"
                      : item.priority === "MEDIUM"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {item.priority}
                </div>

                <div className="mt-2 text-2xl font-bold text-indigo-600">
                  {item.urgencyScore}
                </div>

                <div className="text-xs text-gray-500">Urgency Score</div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {item.reasons.map((reason, index) => (
                <span
                  key={index}
                  className="bg-indigo-100 text-indigo-700 text-xs px-3 py-1 rounded-full"
                >
                  {reason}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecruiterPriorityQueue;
