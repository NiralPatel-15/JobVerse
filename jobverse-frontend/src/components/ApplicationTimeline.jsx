import React, { useEffect, useState, useCallback } from "react";

import axios from "../api/axiosConfig";

const ApplicationTimeline = ({ applicationId }) => {
  const [timeline, setTimeline] = useState([]);

  const [loading, setLoading] = useState(true);

  // =========================================
  // FETCH TIMELINE
  // =========================================

  const fetchTimeline = useCallback(async () => {
    try {
      setLoading(true);

      const token =
        localStorage.getItem("token") || localStorage.getItem("recruiterToken");

      const res = await axios.get(`/applications/timeline/${applicationId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(res.data);

      setTimeline(res.data.timeline || []);
    } catch (err) {
      console.log("TIMELINE ERROR:", err);
    } finally {
      setLoading(false);
    }
  }, [applicationId]);

  // =========================================
  // LOAD TIMELINE
  // =========================================

  useEffect(() => {
    if (applicationId) {
      fetchTimeline();
    }
  }, [fetchTimeline, applicationId]);

  // =========================================
  // LOADING UI
  // =========================================

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
        <p className="text-gray-500">Loading timeline...</p>
      </div>
    );
  }

  // =========================================
  // EMPTY STATE
  // =========================================

  if (!timeline.length) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-xl font-semibold mb-4">Application Timeline</h2>

        <p className="text-gray-500">No timeline activity found.</p>
      </div>
    );
  }

  // =========================================
  // MAIN UI
  // =========================================

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
      <h2 className="text-xl font-semibold mb-6">Application Timeline</h2>

      <div className="space-y-6">
        {timeline.map((item, index) => (
          <div key={item._id} className="flex gap-4">
            {/* TIMELINE DOT */}
            <div className="flex flex-col items-center">
              <div className="w-4 h-4 rounded-full bg-blue-500" />

              {index !== timeline.length - 1 && (
                <div className="w-[2px] flex-1 bg-gray-200 mt-1" />
              )}
            </div>

            {/* CONTENT */}
            <div className="pb-6">
              <h3 className="font-semibold text-gray-800">{item.title}</h3>

              <p className="text-gray-600 text-sm mt-1">{item.description}</p>

              <p className="text-xs text-gray-400 mt-2">
                {new Date(item.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApplicationTimeline;