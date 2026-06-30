import { useEffect, useState } from "react";

import axios from "../../api/axiosConfig";

const MyApplications = () => {
  const [apps, setApps] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const res = await axios.get("/application/me");

        setApps(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchApps();
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto mt-24 px-4">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-32 bg-gray-100 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-24 pb-10">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">My Applications</h1>

          <p className="text-gray-500 mt-2">
            Track all jobs you've applied for
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <div className="bg-white rounded-2xl p-5 border shadow-sm">
            <p className="text-sm text-gray-500">Applied Jobs</p>
            <h3 className="text-3xl font-bold mt-2">{apps.length}</h3>
          </div>

          <div className="bg-white rounded-2xl p-5 border shadow-sm">
            <p className="text-sm text-gray-500">Accepted</p>
            <h3 className="text-3xl font-bold text-green-600 mt-2">
              {apps.filter((a) => a.status === "accepted").length}
            </h3>
          </div>

          <div className="bg-white rounded-2xl p-5 border shadow-sm">
            <p className="text-sm text-gray-500">Pending</p>
            <h3 className="text-3xl font-bold text-yellow-600 mt-2">
              {apps.filter((a) => a.status === "pending").length}
            </h3>
          </div>
        </div>

        {apps.length === 0 ? (
          <div className="bg-white rounded-3xl border p-12 text-center">
            <div className="text-5xl mb-4">📄</div>

            <h3 className="text-xl font-semibold">No Applications Yet</h3>

            <p className="text-gray-500 mt-2">
              Start applying to jobs and track them here.
            </p>
          </div>
        ) : (
          apps.map((app) => (
            <div
              key={app._id}
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
              <div className="flex flex-col sm:flex-row items-start gap-5">
                <img
                  src={app.job?.image || "/job-placeholder.jpg"}
                  alt=""
                  className="
w-24
h-24
rounded-2xl
object-cover
border
border-gray-200
"
                />

                <div>
                  <h3 className="font-bold text-lg">{app.job?.title}</h3>

                  <p className="text-gray-500">{app.job?.company}</p>

                  <p className="text-sm text-gray-400">{app.job?.location}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    Applied on {new Date(app.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-3">
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    app.status === "accepted"
                      ? "bg-green-100 text-green-700"
                      : app.status === "rejected"
                        ? "bg-red-100 text-red-700"
                        : app.status === "interview"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {app.status?.charAt(0).toUpperCase() + app.status?.slice(1)}
                </span>

                {app.status === "interview" && (
                  <a
                    href="/interviews"
                    className="px-4 py-1 bg-indigo-600 text-white rounded-lg text-sm"
                  >
                    View Interview
                  </a>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyApplications;