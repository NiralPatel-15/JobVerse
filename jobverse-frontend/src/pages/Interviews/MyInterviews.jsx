import { useEffect, useState } from "react";
import axios from "../../api/axiosConfig";

const MyInterviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const res = await axios.get("/interview-schedules/my-interviews");

        setInterviews(res.data.interviews || []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 pt-24">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-24 pb-10">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">My Interviews</h1>

          <p className="text-gray-500 mt-2">
            Track all your scheduled interviews
          </p>
        </div>

        {interviews.length === 0 ? (
          <div className="bg-white rounded-3xl border p-12 text-center">
            <div className="text-5xl mb-4">🎯</div>

            <h3 className="text-xl font-semibold">No Interviews Scheduled</h3>

            <p className="text-gray-500 mt-2">
              Recruiters haven't scheduled any interviews yet.
            </p>
          </div>
        ) : (
          interviews.map((interview) => (
            <div
              key={interview._id}
              className="
                bg-white
                border
                border-gray-200
                rounded-3xl
                p-6
                mb-5
                shadow-sm
                hover:shadow-md
                transition
              "
            >
              <div className="flex justify-between items-start flex-wrap gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {interview.application?.job?.title}
                  </h2>

                  <p className="text-gray-500 mt-1">
                    {interview.application?.job?.company}
                  </p>
                </div>

                <span
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    interview.status === "Completed"
                      ? "bg-green-100 text-green-700"
                      : interview.status === "Cancelled"
                        ? "bg-red-100 text-red-700"
                        : interview.status === "Rescheduled"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-indigo-100 text-indigo-700"
                  }`}
                >
                  {interview.status}
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div>
                  <p className="text-sm text-gray-500">Interview Round</p>

                  <h3 className="font-semibold text-lg">{interview.round}</h3>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Scheduled Date & Time</p>

                  <h3 className="font-semibold text-lg">
                    {new Date(interview.scheduledDate).toLocaleString()}
                  </h3>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Duration</p>

                  <h3 className="font-semibold">
                    {interview.durationMinutes} Minutes
                  </h3>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Timezone</p>

                  <h3 className="font-semibold">{interview.timezone}</h3>
                </div>
              </div>

              {interview.notes && (
                <div className="mt-6 bg-gray-50 p-4 rounded-2xl">
                  <p className="text-sm text-gray-500 mb-1">Instructions</p>

                  <p className="text-gray-700">{interview.notes}</p>
                </div>
              )}

              {interview.meetingLink && interview.status !== "Cancelled" && (
                <div className="mt-6">
                  <a
                    href={interview.meetingLink}
                    target="_blank"
                    rel="noreferrer"
                    className="
                        inline-flex
                        items-center
                        px-6
                        py-3
                        rounded-2xl
                        bg-indigo-600
                        hover:bg-indigo-500
                        text-white
                        font-medium
                        transition
                      "
                  >
                    Join Interview
                  </a>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyInterviews;