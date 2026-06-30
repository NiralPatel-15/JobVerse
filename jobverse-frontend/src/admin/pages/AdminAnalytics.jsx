import { useEffect, useState } from "react";
import axios from "../../api/axiosConfig";
import AdminLayout from "../components/AdminLayout";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import { FaUsers, FaBriefcase, FaUserTie, FaFlag } from "react-icons/fa";

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"];

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [topRecruiters, setTopRecruiters] = useState([]);
  const [mostAppliedJobs, setMostAppliedJobs] = useState([]);
  

  // ================= FETCH =================

  useEffect(() => {
    const loadAnalyticsData = async () => {
      try {
        const token = localStorage.getItem("adminToken");

        const [analyticsRes, recruitersRes, jobsRes] = await Promise.all([
          axios.get("/analytics/platform"),

          axios.get("/admin/analytics/top-recruiters", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),

          axios.get("/admin/analytics/most-applied-jobs", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        setAnalytics(analyticsRes.data);
        setTopRecruiters(recruitersRes.data);
        setMostAppliedJobs(jobsRes.data);
      } catch (error) {
        console.log(error);
      }
    };

    loadAnalyticsData();
  }, []);

  // ================= LOADING =================

  if (!analytics) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-screen bg-[#f1f5f9]">
          <div className="text-slate-900 text-2xl font-semibold">
            Loading Analytics...
          </div>
        </div>
      </AdminLayout>
    );
  }

  // ================= DATA =================

  const stats = analytics.stats;

  const userGrowthData = analytics.userGrowth.map((item) => ({
    name: `${item._id.month}/${item._id.year}`,
    users: item.users,
  }));

  const jobGrowthData = analytics.jobGrowth.map((item) => ({
    name: `${item._id.month}/${item._id.year}`,
    jobs: item.jobs,
  }));

  const reportPieData = analytics.reportStats.map((item) => ({
    name: item._id,
    value: item.count,
  }));

  const jobStatusData = analytics.jobStatusStats.map((item) => ({
    name: item._id,
    value: item.count,
  }));

  const applicationData =
    analytics?.monthlyApplications?.map((item) => ({
      name: `${item._id.month}/${item._id.year}`,
      applications: item.applications,
    })) || [];

  return (
    <AdminLayout>
      <div className="space-y-6 text-slate-900">
        {/* HEADER */}

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Analytics Dashboard
            </h1>

            <p className="text-slate-400 mt-1">
              Monitor platform growth and insights
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="bg-slate-800 hover:bg-slate-700 transition px-4 py-2 rounded-xl text-sm text-white border border-slate-700">
              Last 30 Days
            </button>

            <button className="bg-blue-600 hover:bg-blue-700 transition px-4 py-2 rounded-xl text-sm text-white">
              Export PDF
            </button>
          </div>
        </div>

        {/* STATS */}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
          <StatCard
            title="Users"
            value={stats.totalUsers}
            icon={<FaUsers />}
            color="bg-blue-500"
          />

          <StatCard
            title="Recruiters"
            value={stats.totalRecruiters}
            icon={<FaUserTie />}
            color="bg-emerald-500"
          />

          <StatCard
            title="Jobs"
            value={stats.totalJobs}
            icon={<FaBriefcase />}
            color="bg-orange-500"
          />

          <StatCard
            title="Reports"
            value={stats.totalReports}
            icon={<FaFlag />}
            color="bg-red-500"
          />
        </div>

        {/* CHARTS */}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* USER GROWTH */}
          <ChartCard title="User Growth">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />

                <XAxis dataKey="name" stroke="#94a3b8" />

                <YAxis stroke="#94a3b8" />

                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                />

                <Bar dataKey="users" fill="#3B82F6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
          {/* JOB GROWTH */}
          <ChartCard title="Job Growth">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={jobGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />

                <XAxis dataKey="name" stroke="#94a3b8" />

                <YAxis stroke="#94a3b8" />

                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                />

                <Bar dataKey="jobs" fill="#10B981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* MONTHLY APPLICATIONS */}

          <ChartCard title="Monthly Applications">
            {applicationData.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={applicationData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />

                  <XAxis dataKey="name" stroke="#64748b" />

                  <YAxis stroke="#64748b" />

                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #e2e8f0",
                      borderRadius: "12px",
                      color: "#0f172a",
                    }}
                  />

                  <Bar
                    dataKey="applications"
                    fill="#8B5CF6"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[260px] flex items-center justify-center text-slate-400">
                No application data available
              </div>
            )}
          </ChartCard>

          {/* REPORTS */}
          <ChartCard title="Reports Overview">
            {reportPieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={reportPieData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                  >
                    {reportPieData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>

                  <Tooltip />

                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <NoData />
            )}
          </ChartCard>
          {/* JOB STATUS */}
          <ChartCard title="Job Status">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={jobStatusData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                >
                  {jobStatusData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>

                <Tooltip />

                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>

      {/* =========================================
   TOP RECRUITERS LEADERBOARD
========================================= */}

      <div className="mt-8 bg-white rounded-3xl shadow-sm border border-gray-100 p-6 overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Top Recruiters</h2>

            <p className="text-gray-500 text-sm mt-1">
              Recruiters with highest applications
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">
                  Recruiter
                </th>

                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">
                  Email
                </th>

                <th className="text-center py-4 px-4 text-sm font-semibold text-gray-600">
                  Jobs Posted
                </th>

                <th className="text-center py-4 px-4 text-sm font-semibold text-gray-600">
                  Applications
                </th>

                <th className="text-center py-4 px-4 text-sm font-semibold text-gray-600">
                  Performance
                </th>
              </tr>
            </thead>

            <tbody>
              {topRecruiters.map((recruiter, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-50 hover:bg-gray-50 transition"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                        {recruiter.recruiterName?.charAt(0)}
                      </div>

                      <div>
                        <p className="font-semibold text-gray-800">
                          {recruiter.recruiterName}
                        </p>

                        <p className="text-sm text-gray-500">
                          Rank #{index + 1}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-4 text-gray-600">
                    {recruiter.recruiterEmail}
                  </td>

                  <td className="py-4 px-4 text-center">
                    <span className="px-4 py-2 rounded-xl bg-blue-100 text-blue-700 font-semibold text-sm">
                      {recruiter.totalJobs}
                    </span>
                  </td>

                  <td className="py-4 px-4 text-center">
                    <span className="px-4 py-2 rounded-xl bg-green-100 text-green-700 font-semibold text-sm">
                      {recruiter.totalApplications}
                    </span>
                  </td>

                  <td className="py-4 px-4">
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-indigo-500 h-3 rounded-full"
                        style={{
                          width: `${Math.min(
                            recruiter.totalApplications,
                            100,
                          )}%`,
                        }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* =========================================
   MOST APPLIED JOBS
========================================= */}

      <div className="mt-8 bg-white rounded-3xl shadow-sm border border-gray-100 p-6 overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Most Applied Jobs
            </h2>

            <p className="text-gray-500 text-sm mt-1">
              Jobs receiving highest applications
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {mostAppliedJobs.map((job, index) => (
            <div
              key={index}
              className="border border-gray-100 rounded-2xl p-5 hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">
                    {job.jobTitle}
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">{job.company}</p>

                  <p className="text-sm text-gray-400 mt-1">{job.location}</p>
                </div>

                <div className="px-4 py-2 rounded-xl bg-indigo-100 text-indigo-700 font-bold text-sm">
                  #{index + 1}
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Applications</p>

                  <h2 className="text-3xl font-bold text-gray-800 mt-1">
                    {job.totalApplications}
                  </h2>
                </div>

                <div className="text-right">
                  <p className="text-sm text-gray-500">Status</p>

                  <span
                    className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold ${
                      job.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {job.status}
                  </span>
                </div>
              </div>

              <div className="mt-5">
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-indigo-500 h-3 rounded-full"
                    style={{
                      width: `${Math.min(job.totalApplications * 10, 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

// ================= STAT CARD =================

const StatCard = ({ title, value, icon, color }) => {
  return (
    <div className="relative overflow-hidden bg-[#0f172a] border border-white/5 rounded-2xl p-5 shadow-xl hover:border-blue-500/30 transition-all duration-300">
      <div className={`absolute top-0 left-0 w-full h-1 ${color}`} />

      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-400 text-sm">{title}</p>

          <h2 className="text-3xl font-bold text-white mt-3">{value}</h2>

          <span className="inline-flex mt-3 text-xs px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400">
            Active
          </span>
        </div>

        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-2xl text-white">
          {icon}
        </div>
      </div>
    </div>
  );
};

// ================= CHART CARD =================

const ChartCard = ({ title, children }) => {
  return (
    <div className="bg-[#0f172a] border border-white/5 rounded-2xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-white">{title}</h2>

        <button className="text-sm text-slate-400 hover:text-white">
          View More
        </button>
      </div>

      {children}
    </div>
  );
};

// ================= NO DATA =================

const NoData = () => {
  return (
    <div className="h-[260px] flex items-center justify-center text-slate-400 text-lg">
      No analytics data available
    </div>
  );
};

export default AdminAnalytics;
