import { useEffect, useState } from "react";

import {
  Briefcase,
  UserCheck,
  Calendar,
  XCircle,
  TrendingUp,
  Activity,
  Target,
  BarChart3,
} from "lucide-react";

import { getRecruiterAnalytics } from "../../services/analyticsService";

import ApplicationsTrendChart from "../../components/Recruiter/analytics/ApplicationsTrendChart";
import HiringPipelineChart from "../../components/Recruiter/analytics/HiringPipelineChart";

const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const response = await getRecruiterAnalytics();
        setAnalytics(response.analytics);
      } catch (error) {
        console.error("Analytics fetch error:", error);
      }
    };

    loadAnalytics();
  }, []);

  if (!analytics) {
    return (
      <div className="min-h-screen bg-slate-50 pt-24 px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 animate-pulse">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-36 rounded-3xl bg-white border border-slate-200"
            />
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mt-8 animate-pulse">
          <div className="h-96 rounded-3xl bg-white border border-slate-200" />
          <div className="h-96 rounded-3xl bg-white border border-slate-200" />
        </div>
      </div>
    );
  }

  const summary = analytics.summary;

  const hiringSuccess =
    summary.totalApplications > 0
      ? Math.round((summary.hired / summary.totalApplications) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-slate-50 pt-24 px-6 pb-10">
      {/* HEADER */}

      <div className="relative overflow-hidden bg-white border border-slate-200 rounded-3xl shadow-sm p-8 mb-8">
        <div className="absolute top-0 right-0 w-72 h-72 bg-blue-50 rounded-full blur-3xl" />

        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium mb-4">
              <BarChart3 size={16} />
              Analytics Center
            </div>

            <h1 className="text-4xl font-bold text-slate-900">
              Recruitment Analytics
            </h1>

            <p className="text-slate-500 mt-2 max-w-2xl">
              Monitor hiring performance, recruitment funnel efficiency,
              candidate progression, and overall ATS productivity.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 px-5 py-3 rounded-2xl">
            <TrendingUp size={20} className="text-emerald-600" />

            <div>
              <p className="text-sm font-semibold text-emerald-700">
                Hiring Analytics Active
              </p>

              <p className="text-xs text-emerald-600">
                Real-time recruitment insights
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* KPI SECTION */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-5">
        <AnalyticsCard
          title="Applications"
          value={summary.totalApplications}
          icon={<Briefcase size={22} />}
          color="bg-blue-600"
        />

        <AnalyticsCard
          title="Shortlisted"
          value={summary.shortlisted}
          icon={<UserCheck size={22} />}
          color="bg-violet-600"
        />

        <AnalyticsCard
          title="Interviews"
          value={summary.interviews}
          icon={<Calendar size={22} />}
          color="bg-cyan-600"
        />

        <AnalyticsCard
          title="Rejected"
          value={summary.rejected}
          icon={<XCircle size={22} />}
          color="bg-red-600"
        />

        <AnalyticsCard
          title="Hired"
          value={summary.hired}
          icon={<TrendingUp size={22} />}
          color="bg-emerald-600"
        />
      </div>

      {/* CHARTS */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5">
          <ApplicationsTrendChart data={analytics.monthlyApplications || []} />
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5">
          <HiringPipelineChart summary={summary} />
        </div>
      </div>

      {/* PERFORMANCE + INSIGHTS */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* PERFORMANCE */}

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center">
              <Activity size={20} className="text-blue-600" />
            </div>

            <div>
              <h2 className="font-bold text-slate-900 text-lg">
                Recruiter Performance
              </h2>

              <p className="text-sm text-slate-500">
                Hiring productivity metrics
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <PerformanceItem
              label="Application Response Rate"
              value="92%"
              percentage={92}
            />

            <PerformanceItem
              label="Interview Conversion"
              value="68%"
              percentage={68}
            />

            <PerformanceItem
              label="Hiring Efficiency"
              value="87%"
              percentage={87}
            />

            <PerformanceItem
              label="Recruiter Activity"
              value="95%"
              percentage={95}
            />
          </div>
        </div>

        {/* ATS INSIGHTS */}

        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="font-bold text-slate-900 text-xl">ATS Insights</h2>

              <p className="text-sm text-slate-500">
                Recruitment funnel overview
              </p>
            </div>

            <Target className="text-slate-400" />
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            <InsightCard
              title="Total Pipeline"
              value={summary.totalApplications}
              subtitle="Candidates in ATS"
            />

            <InsightCard
              title="Interview Ready"
              value={summary.interviews}
              subtitle="Active interview stage"
            />

            <InsightCard
              title="Hiring Success"
              value={`${hiringSuccess}%`}
              subtitle="Overall conversion rate"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

/* KPI CARD */

const AnalyticsCard = ({ title, value, icon, color }) => {
  return (
    <div className="group bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 p-6">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>

          <h2 className="text-4xl font-bold text-slate-900 mt-4">{value}</h2>
        </div>

        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white ${color}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

/* PERFORMANCE */

const PerformanceItem = ({ label, value, percentage }) => {
  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="text-sm text-slate-600">{label}</span>

        <span className="font-semibold text-slate-900">{value}</span>
      </div>

      <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
        <div
          className="h-full rounded-full bg-blue-600"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

/* INSIGHT CARD */

const InsightCard = ({ title, value, subtitle }) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 hover:bg-white transition-all">
      <p className="text-sm text-slate-500">{title}</p>

      <h3 className="text-3xl font-bold text-slate-900 mt-3">{value}</h3>

      <p className="text-sm text-slate-500 mt-2">{subtitle}</p>
    </div>
  );
};

export default AnalyticsDashboard;
