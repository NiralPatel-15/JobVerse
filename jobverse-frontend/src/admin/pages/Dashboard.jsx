import { useEffect, useState } from "react";

import { FaUsers, FaBriefcase, FaUserTie, FaFileAlt } from "react-icons/fa";

import DashboardCard from "../components/DashboardCard";
import AdminLayout from "../components/AdminLayout";

import { getDashboardStatsAPI } from "../../api/admin";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRecruiters: 0,
    totalJobs: 0,
    totalApplications: 0,
  });

  const [loading, setLoading] = useState(true);

  // ====================================
  // FETCH STATS
  // ====================================
  const fetchStats = async () => {
    try {
      const res = await getDashboardStatsAPI();

      setStats(res.data.stats);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-2xl font-semibold">Loading Dashboard...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>

        <p className="text-gray-500 mt-1">Welcome back, Admin</p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <DashboardCard
          title="Job Seekers"
          value={stats.totalUsers}
          icon={<FaUsers size={28} />}
          color="bg-blue-500"
        />

        <DashboardCard
          title="Recruiters"
          value={stats.totalRecruiters}
          icon={<FaUserTie size={28} />}
          color="bg-green-500"
        />

        <DashboardCard
          title="Jobs"
          value={stats.totalJobs}
          icon={<FaBriefcase size={28} />}
          color="bg-purple-500"
        />

        <DashboardCard
          title="Applications"
          value={stats.totalApplications}
          icon={<FaFileAlt size={28} />}
          color="bg-red-500"
        />
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
