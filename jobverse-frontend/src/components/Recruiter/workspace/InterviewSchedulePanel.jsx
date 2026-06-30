import { useEffect, useState, useCallback } from "react";

import axios from "../../../api/axiosConfig";

import socket from "../../../socket";

const InterviewSchedulePanel = ({ applicationId }) => {
  const [schedules, setSchedules] = useState([]);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    round: "Technical",
    scheduledDate: "",
    durationMinutes: 60,
    timezone: "Asia/Kolkata",
    meetingLink: "",
    notes: "",
  });

  // =========================================
  // FETCH SCHEDULES
  // =========================================

  const fetchSchedules = useCallback(async () => {
    try {
      const res = await axios.get(`/interview-schedules/${applicationId}`);

      setSchedules(res.data.schedules);
    } catch (error) {
      console.log(error);
    }
  }, [applicationId]);

  const completeInterview = async (id) => {
    try {
      const res = await axios.put(`/interview-schedules/${id}/complete`);

      console.log("COMPLETE RESPONSE:", res.data);

      setSchedules((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, status: "Completed" } : item,
        ),
      );
    } catch (error) {
      console.log("COMPLETE ERROR:", error);
    }
  };

  const cancelInterview = async (id) => {
    try {
      const res = await axios.put(`/interview-schedules/${id}/cancel`);

      console.log("CANCEL RESPONSE:", res.data);

      setSchedules((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, status: "Cancelled" } : item,
        ),
      );
    } catch (error) {
      console.log("CANCEL ERROR:", error);
    }
  };

  // =========================================
  // CREATE SCHEDULE
  // =========================================

  const createSchedule = async () => {
    try {
      setLoading(true);

      const res = await axios.post("/interview-schedules/schedule", {
        applicationId,
        ...formData,
      });

      setSchedules((prev) => [res.data.schedule, ...prev]);

      setFormData({
        round: "Technical",
        scheduledDate: "",
        durationMinutes: 60,
        timezone: "Asia/Kolkata",
        meetingLink: "",
        notes: "",
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // SOCKET EVENTS
  // =========================================

  useEffect(() => {
    fetchSchedules();

    socket.emit("joinApplicationRoom", applicationId);

    socket.on("interviewScheduled", (newSchedule) => {
      setSchedules((prev) => [newSchedule, ...prev]);
    });

    return () => {
      socket.off("interviewScheduled");
    };
  },[applicationId, fetchSchedules]);

  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
      {/* HEADER */}

      <div className="border-b border-gray-100 px-6 py-5">
        <h2 className="text-lg font-semibold text-gray-900">
          Interview Scheduling
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Enterprise interview orchestration
        </p>
      </div>

      {/* FORM */}

      <div className="p-6 border-b border-gray-100 space-y-4">
        {/* ROUND */}

        <div>
          <label className="text-sm font-medium text-gray-700">
            Interview Round
          </label>

          <select
            value={formData.round}
            onChange={(e) =>
              setFormData({
                ...formData,
                round: e.target.value,
              })
            }
            className="w-full mt-2 border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="HR">HR</option>

            <option value="Technical">Technical</option>

            <option value="Managerial">Managerial</option>

            <option value="Final">Final</option>
          </select>
        </div>

        {/* DATE */}

        <div>
          <label className="text-sm font-medium text-gray-700">
            Scheduled Date
          </label>

          <input
            type="datetime-local"
            value={formData.scheduledDate}
            onChange={(e) =>
              setFormData({
                ...formData,
                scheduledDate: e.target.value,
              })
            }
            className="w-full mt-2 border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* DURATION */}

        <div>
          <label className="text-sm font-medium text-gray-700">
            Duration (Minutes)
          </label>

          <input
            type="number"
            value={formData.durationMinutes}
            onChange={(e) =>
              setFormData({
                ...formData,
                durationMinutes: e.target.value,
              })
            }
            className="w-full mt-2 border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* MEETING LINK */}

        <div>
          <label className="text-sm font-medium text-gray-700">
            Meeting Link
          </label>

          <input
            type="text"
            placeholder="https://meet.google.com/..."
            value={formData.meetingLink}
            onChange={(e) =>
              setFormData({
                ...formData,
                meetingLink: e.target.value,
              })
            }
            className="w-full mt-2 border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* NOTES */}

        <div>
          <label className="text-sm font-medium text-gray-700">Notes</label>

          <textarea
            rows={4}
            value={formData.notes}
            onChange={(e) =>
              setFormData({
                ...formData,
                notes: e.target.value,
              })
            }
            className="w-full mt-2 border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            placeholder="Interview instructions..."
          />
        </div>

        {/* BUTTON */}

        <button
          onClick={createSchedule}
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-2xl font-medium transition"
        >
          {loading ? "Scheduling..." : "Schedule Interview"}
        </button>
      </div>

      {/* SCHEDULE LIST */}

      <div className="p-6">
        <h3 className="text-sm font-semibold text-gray-800 mb-4">
          Scheduled Interviews
        </h3>

        <div className="space-y-4">
          {schedules.length === 0 && (
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 text-sm text-gray-500">
              No interviews scheduled yet
            </div>
          )}

          {schedules.map((schedule) => (
            <div
              key={schedule._id}
              className="border border-gray-200 rounded-2xl p-5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {schedule.round} Round
                  </h4>

                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(schedule.scheduledDate).toLocaleString()}
                  </p>
                </div>

                <div className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-semibold">
                  {schedule.status}
                </div>
              </div>

              <div className="mt-4 space-y-2 text-sm">
                <p className="text-gray-600">
                  Duration:{" "}
                  <span className="font-medium text-gray-900">
                    {schedule.durationMinutes} mins
                  </span>
                </p>

                <p className="text-gray-600">
                  Timezone:{" "}
                  <span className="font-medium text-gray-900">
                    {schedule.timezone}
                  </span>
                </p>

                {schedule.meetingLink && (
                  <a
                    href={schedule.meetingLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block text-indigo-600 hover:text-indigo-500 font-medium"
                  >
                    Join Meeting
                  </a>
                )}

                {schedule.notes && (
                  <div className="bg-gray-50 rounded-xl p-3 mt-3 text-gray-700">
                    {schedule.notes}
                  </div>
                )}

                {schedule.status !== "Completed" &&
                  schedule.status !== "Cancelled" && (
                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={() => completeInterview(schedule._id)}
                        className="px-4 py-2 bg-green-600 text-white rounded-xl text-sm"
                      >
                        Complete
                      </button>

                      <button
                        onClick={() => cancelInterview(schedule._id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InterviewSchedulePanel;
