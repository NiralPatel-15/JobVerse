import { useEffect, useState } from "react";
import axios from "../../api/axiosConfig"; // ✅ FIXED
import { Link } from "react-router-dom";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("userInfo"));
  } catch {
    user = null;
  }

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res =
          user?.role === "recruiter"
            ? await axios.get("/job/my-jobs")
            : await axios.get("/job");

        setJobs(Array.isArray(res.data) ? res.data : res.data.jobs || []);
      } catch (err) {
        console.log("JOB FETCH ERROR:", err);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [user?.role]);

  const filteredJobs = jobs.filter(
    (job) =>
      job.title?.toLowerCase().includes(search.toLowerCase()) ||
      job.company?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-[#f4f6f8] pt-24 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Jobs Dashboard</h1>

            <p className="text-gray-500 mt-1">
              Manage and monitor job postings
            </p>
          </div>

          {user?.role === "recruiter" && (
            <Link
              to="/jobs/post"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-2xl font-medium transition"
            >
              + Post Job
            </Link>
          )}
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="bg-white rounded-2xl border p-5 shadow-sm">
            <p className="text-sm text-gray-500">Total Jobs</p>
            <h3 className="text-3xl font-bold mt-2">{jobs.length}</h3>
          </div>

          <div className="bg-white rounded-2xl border p-5 shadow-sm">
            <p className="text-sm text-gray-500">Remote Jobs</p>
            <h3 className="text-3xl font-bold text-indigo-600 mt-2">
              {jobs.filter((job) => job.workMode === "Remote").length}
            </h3>
          </div>

          <div className="bg-white rounded-2xl border p-5 shadow-sm">
            <p className="text-sm text-gray-500">Full Time</p>
            <h3 className="text-3xl font-bold text-green-600 mt-2">
              {jobs.filter((job) => job.jobType === "Full-Time").length}
            </h3>
          </div>

          <div className="bg-white rounded-2xl border p-5 shadow-sm">
            <p className="text-sm text-gray-500">Internships</p>
            <h3 className="text-3xl font-bold text-orange-600 mt-2">
              {jobs.filter((job) => job.jobType === "Internship").length}
            </h3>
          </div>
        </div>

        {/* SEARCH */}
        <div className="bg-white border rounded-2xl shadow-sm p-4 mb-8">
          <input
            type="text"
            placeholder="Search jobs by title or company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full outline-none"
          />
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="bg-white rounded-3xl border p-10 text-center">
            <div className="p-10">
              <div className="animate-pulse h-16 bg-gray-100 rounded-xl mb-3"></div>
              <div className="animate-pulse h-16 bg-gray-100 rounded-xl mb-3"></div>
              <div className="animate-pulse h-16 bg-gray-100 rounded-xl"></div>
            </div>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="bg-white rounded-3xl border p-10 text-center">
            <div className="p-12 text-center">
              <div className="text-5xl mb-3">📋</div>

              <h3 className="text-xl font-semibold">No Jobs Found</h3>

              <p className="text-gray-500 mt-2">No jobs match your search.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredJobs.map((job) => (
              <Link
                key={job._id}
                to={`/job/${job._id}`}
                className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition"
              >
                <div>
                  <img
  src={job.image || "/job-placeholder.jpg"}
  alt={job.title}
  className="
    w-full
    h-44
    object-cover
    rounded-2xl
    mb-4
  "
/>


                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900">
                      {job.title}
                    </h3>

                    <p className="text-gray-600 mt-1">{job.company}</p>

                    <p className="text-sm text-gray-500 mt-1">{job.location}</p>

                    <div className="flex flex-wrap gap-2 mt-4">
                      <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-medium">
                        {job.jobType}
                      </span>

                      <span className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-xs font-medium">
                        {job.workMode}
                      </span>
                    </div>

                    <div className="mt-4 text-sm text-gray-400">
                      Posted {new Date(job.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;
