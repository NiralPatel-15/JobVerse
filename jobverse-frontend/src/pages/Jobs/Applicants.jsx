import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../api/axiosConfig";
import { toast } from "react-toastify";

const Applicants = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [apps, setApps] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const filteredApps = apps.filter((app) =>
    app.user?.f_name?.toLowerCase().includes(search.toLowerCase()),
  );

  // =========================================
  // FETCH APPLICANTS
  // =========================================

  const fetchApps = useCallback(async () => {
    try {
      // ✅ FIXED TOKEN
      const token = localStorage.getItem("token");

      const res = await axios.get(`/applications/job/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("APPLICATION:", res.data?.[0]);
      const sortedApps = [...(res.data || [])].sort(
        (a, b) => (b.atsScore || 0) - (a.atsScore || 0),
      );

      setApps(sortedApps);
    } catch (err) {
      console.error("FETCH APPLICANTS ERROR:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  // =========================================
  // LOAD DATA
  // =========================================

  useEffect(() => {
    if (id) {
      fetchApps();
    }
  }, [fetchApps, id]);

  // =========================================
  // UPDATE STATUS
  // =========================================

  const updateStatus = async (appId, status) => {
    try {
      // ✅ FIXED TOKEN
      const token = localStorage.getItem("token");

      await axios.put(
        `/applications/status/${appId}`,
        {
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // ✅ UPDATE LOCAL STATE
      setApps((prev) =>
        prev.map((a) => (a._id === appId ? { ...a, status } : a)),
      );
    } catch (err) {
      console.error("UPDATE STATUS ERROR:", err);

      toast.error(err?.response?.data?.message || "Failed to update status");
    }
  };

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return <div className="mt-24 text-center">Loading...</div>;
  }

  // =========================================
  // MAIN UI
  // =========================================

  return (
    <div className="min-h-screen bg-[#f4f6f8] pt-24 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        {/* HEADER */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Applicants Dashboard
            </h1>

            <p className="text-gray-500 mt-1">
              Manage candidates and hiring workflow
            </p>
          </div>

          <input
            type="text"
            placeholder="Search candidate..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-80 px-4 py-3 rounded-2xl border border-gray-200"
          />
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="bg-white rounded-2xl border shadow-sm p-5">
            <p className="text-sm text-gray-500">Total Applicants</p>

            <h3 className="text-3xl font-bold mt-2">{apps.length}</h3>
          </div>

          <div className="bg-white rounded-2xl border shadow-sm p-5">
            <p className="text-sm text-gray-500">Shortlisted</p>

            <h3 className="text-3xl font-bold text-yellow-600 mt-2">
              {apps.filter((a) => a.status === "shortlisted").length}
            </h3>
          </div>

          <div className="bg-white rounded-2xl border shadow-sm p-5">
            <p className="text-sm text-gray-500">Interview</p>

            <h3 className="text-3xl font-bold text-purple-600 mt-2">
              {apps.filter((a) => a.status === "interview").length}
            </h3>
          </div>

          <div className="bg-white rounded-2xl border shadow-sm p-5">
            <p className="text-sm text-gray-500">Hired</p>

            <h3 className="text-3xl font-bold text-green-600 mt-2">
              {
                apps.filter(
                  (a) => a.status === "accepted" || a.status === "hired",
                ).length
              }
            </h3>
          </div>
        </div>

        {/* EMPTY */}
        {filteredApps.length === 0 ? (
          <div className="bg-white border rounded-3xl p-12 text-center">
            <h3 className="text-xl font-semibold text-gray-800">
              No Applicants Yet
            </h3>

            <p className="text-gray-500 mt-2">
              Candidates will appear here once they apply.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredApps.map((app, index) => (
              <div
                key={app._id}
                className="bg-white border border-gray-200 rounded-3xl shadow-sm p-6 hover:shadow-md transition"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  {/* LEFT */}
                  <div className="flex items-center gap-5">
                    <img
                      src={app.user?.profilePic || "/user.png"}
                      alt=""
                      className="w-20 h-20 rounded-full object-cover border-2 border-indigo-500"
                    />

                    <div>
                      <div className="inline-flex items-center gap-2 mb-2">
                        <span className="bg-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full">
                          Rank #{index + 1}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {app.user?.f_name}
                      </h3>

                      <p className="text-gray-500">{app.user?.email}</p>

                      {app.matchedSkills?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {app.matchedSkills.slice(0, 5).map((skill, index) => (
                            <span
                              key={index}
                              className="
          px-2
          py-1
          rounded-full
          bg-green-50
          text-green-700
          text-xs
          font-medium
        "
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2 mt-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            app.status === "accepted" || app.status === "hired"
                              ? "bg-green-100 text-green-700"
                              : app.status === "rejected"
                                ? "bg-red-100 text-red-700"
                                : app.status === "shortlisted"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : app.status === "interview"
                                    ? "bg-purple-100 text-purple-700"
                                    : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {app.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* ATS SCORES */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-50 rounded-2xl p-4">
                      <p className="text-xs text-gray-500">ATS Score</p>

                      <h4 className="text-xl font-bold">
                        {app.atsScore || 0}%
                      </h4>

                      <div className="mt-2 h-2 bg-gray-200 rounded-full">
                        <div
                          className={`h-2 rounded-full ${
                            app.atsScore >= 80
                              ? "bg-green-500"
                              : app.atsScore >= 60
                                ? "bg-yellow-500"
                                : "bg-red-500"
                          }`}
                          style={{
                            width: `${app.atsScore || 0}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-4">
                      <p className="text-xs text-gray-500">Skills</p>

                      <h4 className="text-xl font-bold">
                        {app.skillsScore || 0}
                      </h4>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-4">
                      <p className="text-xs text-gray-500">Experience</p>

                      <h4 className="text-xl font-bold">
                        {app.experienceScore || 0}
                      </h4>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-4">
                      <p className="text-xs text-gray-500">Resume</p>

                      <h4 className="text-xl font-bold">
                        {app.resumeQualityScore || 0}
                      </h4>
                    </div>
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="flex flex-wrap gap-3 mt-6">
                  <a
                    href={app.resume}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition"
                  >
                    View Resume
                  </a>

                  <button
                    onClick={() =>
                      navigate(`/recruiter/applications/${app._id}/workspace`)
                    }
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl transition"
                  >
                    Open ATS Workspace
                  </button>

                  <button
                    onClick={() => updateStatus(app._id, "accepted")}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl transition"
                  >
                    Accept
                  </button>

                  <button
                    onClick={() => updateStatus(app._id, "rejected")}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl transition"
                  >
                    Reject
                  </button>

                  <button
                    onClick={() => updateStatus(app._id, "shortlisted")}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-xl transition"
                  >
                    Shortlist
                  </button>

                  <button
                    onClick={() => updateStatus(app._id, "interview")}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl transition"
                  >
                    Interview
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default Applicants;
