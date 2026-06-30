import { useEffect, useState, useCallback } from "react";
import AdminLayout from "../components/AdminLayout";
import Swal from "sweetalert2";
import {
  getAllJobsAdminAPI,
  deleteJobAdminAPI,
  updateJobStatusAdminAPI,
} from "../../api/admin";
import {
  FaTrash,
  FaSearch,
  FaBriefcase,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaMapMarkerAlt,
  FaBuilding,
  FaUserTie,
} from "react-icons/fa";

import { toast } from "react-toastify";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);

  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [aiFilter, setAiFilter] = useState("all");

  const stats = {
    total: jobs.length,
    pending: jobs.filter((j) => j.status === "pending").length,
    approved: jobs.filter((j) => j.status === "approved").length,
    rejected: jobs.filter((j) => j.status === "rejected").length,
  };
  // ====================================
  // FETCH JOBS
  // ====================================

  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);

      const res = await getAllJobsAdminAPI(
        page,
        search,
        statusFilter,
        aiFilter,
      );

      setJobs(res.data.jobs);

      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error(error);

      toast.error("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter, aiFilter]);

  useEffect(() => {
    const loadJobs = async () => {
      await fetchJobs();
    };

    loadJobs();
  }, [fetchJobs]);

  // ====================================
  // DELETE JOB
  // ====================================

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete Job?",
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Delete",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteJobAdminAPI(id);

      toast.success("Job deleted successfully");

      fetchJobs();
    } catch (error) {
      console.error(error);

      toast.error("Delete failed");
    }
  };

  // ====================================
  // UPDATE STATUS
  // ====================================

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateJobStatusAdminAPI(id, status);

      toast.success(`Job ${status}`);

      fetchJobs();
    } catch (error) {
      console.error(error);

      toast.error("Status update failed");
    }
  };

  return (
    <AdminLayout>
      {/* HEADER */}

      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Job Moderation</h1>

            <p className="text-gray-500 mt-2 text-lg">
              Review, approve and manage every job posted on JobVerse.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 xl:grid-cols-4 gap-5 mt-8">
          <div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Jobs</p>
                <h2 className="text-3xl font-bold mt-2">{stats.total}</h2>
              </div>

              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <FaBriefcase className="text-blue-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white border border-yellow-200 shadow-sm p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Pending</p>
                <h2 className="text-3xl font-bold mt-2">{stats.pending}</h2>
              </div>

              <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
                <FaClock className="text-yellow-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white border border-green-200 shadow-sm p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Approved</p>
                <h2 className="text-3xl font-bold">{stats.approved}</h2>
              </div>

              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                <FaCheckCircle className="text-green-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white border border-red-200 shadow-sm p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Rejected</p>
                <h2 className="text-3xl font-bold">{stats.rejected}</h2>
              </div>

              <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                <FaTimesCircle className="text-red-600 text-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Search */}

          <div className="flex-1">
            <div className="flex items-center rounded-xl border border-gray-200 px-4 py-3 bg-gray-50 focus-within:bg-white focus-within:border-blue-500 transition">
              <FaSearch className="text-gray-400 mr-3" />

              <input
                type="text"
                placeholder="Search by job title, company or location..."
                value={search}
                onChange={(e) => {
                  setPage(1);
                  setSearch(e.target.value);
                }}
                className="w-full bg-transparent outline-none"
              />
            </div>
          </div>

          {/* Status */}

          <select
            value={statusFilter}
            onChange={(e) => {
              setPage(1);
              setStatusFilter(e.target.value);
            }}
            className="px-4 py-3 rounded-xl border border-gray-200 bg-white font-medium shadow-sm hover:border-blue-500 transition"
          >
            <option value="all">All Status</option>
            <option value="pending"> Pending</option>
            <option value="approved"> Approved</option>
            <option value="rejected"> Rejected</option>
          </select>

          {/* AI */}

          <select
            value={aiFilter}
            onChange={(e) => {
              setPage(1);
              setAiFilter(e.target.value);
            }}
            className="px-4 py-3 rounded-xl border border-gray-200 bg-white font-medium shadow-sm hover:border-blue-500 transition"
          >
            <option value="all">All AI Results</option>
            <option value="Safe"> Safe</option>
            <option value="Needs Review"> Needs Review</option>
            <option value="Spam"> Spam</option>
          </select>
        </div>
      </div>

      {/* TABLE */}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-lg font-medium">
            Loading jobs...
          </div>
        ) : jobs.length === 0 ? (
          <div className="p-10 text-center text-gray-500">No jobs found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-xs uppercase tracking-wider font-semibold text-gray-500 text-left">
                    Job
                  </th>

                  <th className="px-6 py-4 text-xs uppercase tracking-wider font-semibold text-gray-500 text-left">
                    Recruiter
                  </th>

                  <th className="px-6 py-4 text-xs uppercase tracking-wider font-semibold text-gray-500 text-left">
                    Location
                  </th>

                  <th className="px-6 py-4 text-xs uppercase tracking-wider font-semibold text-gray-500 text-left">
                    Type
                  </th>

                  <th className="px-6 py-4 text-xs uppercase tracking-wider font-semibold text-gray-500 text-left">
                    Status
                  </th>

                  <th className="px-6 py-4 text-xs uppercase tracking-wider font-semibold text-gray-500 text-left">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {jobs.map((job) => (
                  <tr
                    key={job._id}
                    className="border-t hover:bg-blue-50/40 transition-all duration-200"
                  >
                    {/* JOB */}

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={job.image || "/job-placeholder.png"}
                          alt={job.title}
                          onError={(e) => {
                            e.target.src = "/job-placeholder.png";
                          }}
                          className="w-12 h-12 rounded-lg border border-gray-200 object-cover"
                        />

                        <div>
                          <h2 className="font-semibold text-gray-800">
                            {job.title}
                          </h2>

                          <p className="text-sm text-gray-500">{job.company}</p>
                        </div>
                      </div>
                    </td>

                    {/* RECRUITER */}

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={job.recruiter?.profilePic || "/user.png"}
                          alt=""
                          className="w-10 h-10 rounded-full object-cover"
                        />

                        <div>
                          <p className="font-medium">{job.recruiter?.f_name}</p>

                          <p className="text-sm text-gray-500">
                            {job.recruiter?.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* LOCATION */}

                    <td className="px-6 py-4">{job.location}</td>

                    {/* TYPE */}

                    <td className="px-6 py-4">
                      <span className="inline-flex items-center whitespace-nowrap rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-semibold text-blue-700">
                        {job.jobType}
                      </span>
                    </td>

                    {/* STATUS */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold capitalize
      ${
        job.status === "approved"
          ? "bg-green-100 text-green-700"
          : job.status === "rejected"
            ? "bg-red-100 text-red-700"
            : "bg-amber-100 text-amber-700"
      }`}
                      >
                        {job.status}
                      </span>
                    </td>

                    {/* ACTIONS */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-2 w-28">
                        <button
                          onClick={() =>
                            handleStatusUpdate(job._id, "approved")
                          }
                          className="h-9 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition"
                        >
                          ✓ Approve
                        </button>

                        <button
                          onClick={() =>
                            handleStatusUpdate(job._id, "rejected")
                          }
                          className="h-9 rounded-lg bg-amber-500 text-white text-sm font-medium hover:bg-amber-600 transition"
                        >
                          ✕ Reject
                        </button>

                        <button
                          onClick={() => handleDelete(job._id)}
                          className="h-9 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition flex items-center justify-center gap-2"
                        >
                          <FaTrash size={12} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* PAGINATION */}

      <div className="flex justify-center items-center gap-4 mt-8">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-5 py-2 bg-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-300 transition"
        >
          Prev
        </button>

        <div className="px-4 py-2 bg-white rounded-xl border font-semibold">
          {page} / {totalPages}
        </div>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="px-5 py-2 bg-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-300 transition"
        >
          Next
        </button>
      </div>
    </AdminLayout>
  );
};

export default Jobs;