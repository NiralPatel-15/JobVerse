import { useEffect, useState } from "react";

import { useParams, useNavigate } from "react-router-dom";

import axios from "../../api/axiosConfig";

import { createReportAPI } from "../../api/report";

import { toast } from "react-toastify";

const JobDetails = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [job, setJob] = useState(null);

  const [applied, setApplied] = useState(false);

  const [loading, setLoading] = useState(true);

  const [showReportModal, setShowReportModal] = useState(false);

  const [reason, setReason] = useState("");

  const [description, setDescription] = useState("");

  const user = JSON.parse(localStorage.getItem("userInfo") || "null");

  // =====================================
  // FETCH JOB
  // =====================================
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axios.get(`/job/${id}`);

        setJob(res.data);
      } catch (err) {
        console.log("JOB FETCH ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  // =====================================
  // CHECK APPLIED
  // =====================================
  useEffect(() => {
    const checkApplied = async () => {
      try {
        const res = await axios.get("/application/me");

        const alreadyApplied = res.data.some((app) => app.job?._id === id);

        setApplied(alreadyApplied);
      } catch (err) {
        console.log(err);
      }
    };

    if (user) {
      checkApplied();
    }
  }, [id, user]);

  // =====================================
  // APPLY JOB
  // =====================================
  const applyJob = () => {
    if (!user) {
      toast.error("Please login first");

      return;
    }

    navigate(`/apply/${id}`);
  };

  // =====================================
  // REPORT JOB
  // =====================================
  const handleReport = async () => {
    if (!reason) {
      toast.error("Please select reason");

      return;
    }

    try {
      await createReportAPI({
        reportedJob: job._id,

        reportedRecruiter: job.recruiter?._id,

        reason,
        description,
      });

      toast.success("Report submitted");

      setShowReportModal(false);

      setReason("");

      setDescription("");
    } catch (error) {
      console.log(error);

      toast.error("Failed to submit report");
    }
  };

  // =====================================
  // LOADING
  // =====================================
  if (loading) {
    return (
      <div className="mt-24 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // =====================================
  // NO JOB
  // =====================================
  if (!job) {
    return (
      <div className="mt-24 text-center text-lg font-semibold">
        Job not found
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen py-24 px-4">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-md overflow-hidden">
          {/* IMAGE */}
          <div className="relative">
            <img
              src={job.image}
              alt="job"
              className="w-full h-80 object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

            <div className="absolute bottom-6 left-6 text-white">
              <h1 className="text-4xl font-bold">{job.title}</h1>
              <p className="text-lg opacity-90">{job.company}</p>
              <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-sm">
                Verified Employer
              </div>
            </div>
          </div>

          {/* CONTENT */}
          <div className="p-8">
            {/* INFO GRID */}
            <div className="grid sm:grid-cols-2 gap-4 mt-8">
              <div className="bg-white border border-gray-200 shadow-sm p-5 rounded-2xl hover:shadow-md transition">
                <p className="text-gray-500 text-sm">Location</p>

                <h3 className="font-semibold text-lg">{job.location}</h3>
              </div>

              <div className="bg-white border border-gray-200 shadow-sm p-5 rounded-2xl hover:shadow-md transition">
                <p className="text-gray-500 text-sm">Salary</p>

                <h3 className="font-bold text-3xl text-green-600">
                  ₹ {job.salary}
                </h3>
              </div>

              <div className="bg-white border border-gray-200 shadow-sm p-5 rounded-2xl hover:shadow-md transition">
                <p className="text-gray-500 text-sm">Experience</p>

                <h3 className="font-semibold text-lg">{job.experience}</h3>
              </div>

              <div className="bg-white border border-gray-200 shadow-sm p-5 rounded-2xl hover:shadow-md transition">
                <p className="text-gray-500 text-sm">Job Type</p>

                <h3 className="font-semibold text-lg">
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    {job.jobType}
                  </span>
                </h3>
              </div>
            </div>

            {/* SKILLS */}
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4">Required Skills</h2>

              <div className="flex flex-wrap gap-3">
                {job.skills?.map((skill, index) => (
                  <span
                    key={index}
                    className="
bg-indigo-50
text-indigo-700
px-4
py-2
rounded-full
text-sm
font-semibold
border
border-indigo-100
hover:bg-indigo-100
transition
"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="mt-10">
              <h2 className="text-2xl font-bold mb-4">Job Description</h2>

              <p className="text-gray-700 leading-8 text-[15px]">
                {job.description}
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="space-y-6">
          {/* ACTION CARD */}
          <div className="bg-white rounded-2xl shadow-md p-6 sticky top-24">
            <div className="flex items-center justify-between mb-6 pb-6 border-b">
              <h2 className="text-2xl font-bold">Job Actions</h2>
            </div>

            {/* USER APPLY */}
            {user?.role === "user" && (
              <button
                onClick={applyJob}
                disabled={applied}
                className={`w-full py-3 rounded-xl font-semibold transition
                ${
                  applied
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {applied ? "Already Applied" : "Apply Now"}
              </button>
            )}

            {/* RECRUITER */}
            {user?.role === "recruiter" && (
              <button
                onClick={() => navigate(`/recruiter/job/${id}/applicants`)}
                className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold transition"
              >
                View Applicants
              </button>
            )}

            {/* REPORT */}
            <button
              onClick={() => setShowReportModal(true)}
              className="w-full mt-4 py-3 rounded-xl border border-red-500 text-red-500 hover:bg-red-500 hover:text-white font-semibold transition"
            >
              Report Job
            </button>

            {/* EXTRA INFO */}
            <div className="mt-8 border-t pt-6 space-y-4">
              <div>
                <p className="text-gray-500 text-sm">Work Mode</p>

                <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  {job.workMode}
                </span>
              </div>

              <div>
                <p className="text-gray-500 text-sm">Posted On</p>

                <h3 className="font-semibold">
                  {new Date(job.createdAt).toLocaleDateString()}
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* REPORT MODAL */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 px-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 animate-fadeIn">
            <h2 className="text-2xl font-bold mb-6">Report Job</h2>

            {/* REASON */}
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              <option value="">Select reason</option>

              <option value="Fake Job">Fake Job</option>

              <option value="Spam">Spam</option>

              <option value="Fraud">Fraud</option>

              <option value="Inappropriate">Inappropriate</option>
            </select>

            {/* DESCRIPTION */}
            <textarea
              placeholder="Describe issue..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-3 h-32 mb-6 focus:outline-none focus:ring-2 focus:ring-red-400"
            />

            {/* BUTTONS */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowReportModal(false)}
                className="px-5 py-2 rounded-xl border"
              >
                Cancel
              </button>

              <button
                onClick={handleReport}
                className="px-5 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white"
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetails;
