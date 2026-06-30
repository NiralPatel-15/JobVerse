import { useEffect, useState } from "react";
import {
  Briefcase,
  Users,
  FileText,
  CheckCircle,
  XCircle,
  Award,
} from "lucide-react";

import { getRecruiterDashboard } from "../../services/recruiterService";

import DashboardCard from "../../components/Recruiter/DashboardCard";
import PostedJobsTable from "../../components/Recruiter/PostedJobsTable";
import RecentApplicants from "../../components/Recruiter/RecentApplicants";
import QuickActions from "../../components/Recruiter/QuickActions";

const RecruiterDashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await getRecruiterDashboard();
        setData(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchDashboard();
  }, []);

  if (!data) {
    return (
      <div className="p-6 min-h-screen bg-slate-50">
        <div className="animate-pulse">
          <div className="h-10 w-64 bg-gray-200 rounded mb-8"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-5">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl h-32 shadow-sm"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900">
          Recruiter Dashboard
        </h1>

        <p className="text-slate-500 mt-2">
          Manage jobs, applicants, interviews, offers and hiring activities.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-5 mb-8">
        <DashboardCard
          title="Total Jobs"
          value={data.stats.totalJobs}
          icon={Briefcase}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
        />

        <DashboardCard
          title="Applicants"
          value={data.stats.totalApplicants}
          icon={Users}
          iconBg="bg-purple-100"
          iconColor="text-purple-600"
        />

        <DashboardCard
          title="Offers Sent"
          value={data.stats.offerSentCount}
          icon={FileText}
          iconBg="bg-cyan-100"
          iconColor="text-cyan-600"
        />

        <DashboardCard
          title="Accepted"
          value={data.stats.acceptedCount}
          icon={CheckCircle}
          iconBg="bg-green-100"
          iconColor="text-green-600"
        />

        <DashboardCard
          title="Rejected"
          value={data.stats.rejectedCount}
          icon={XCircle}
          iconBg="bg-red-100"
          iconColor="text-red-600"
        />

        <DashboardCard
          title="Hired"
          value={data.stats.hiredCount}
          icon={Award}
          iconBg="bg-yellow-100"
          iconColor="text-yellow-600"
        />
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PostedJobsTable jobs={data.jobs} />
        </div>

        <div>
          <QuickActions />
        </div>
      </div>

      {/* Recent Applicants */}
      <div className="mt-6">
        <RecentApplicants applicants={data.recentApplicants} />
      </div>
    </div>
  );
};

export default RecruiterDashboard;