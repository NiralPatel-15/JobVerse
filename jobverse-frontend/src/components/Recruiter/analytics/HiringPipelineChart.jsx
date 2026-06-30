const HiringPipelineChart = ({ summary }) => {
  const applications = summary.totalApplications || 0;

  const stages = [
    {
      label: "Applications",
      value: applications,
      color: "bg-blue-600",
    },
    {
      label: "Shortlisted",
      value: summary.shortlisted,
      color: "bg-violet-600",
    },
    {
      label: "Interviews",
      value: summary.interviews,
      color: "bg-cyan-600",
    },
    {
      label: "Hired",
      value: summary.hired,
      color: "bg-emerald-600",
    },
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 h-full">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-slate-900">Hiring Pipeline</h2>

        <p className="text-sm text-slate-500 mt-1">
          Candidate progression through recruitment stages
        </p>
      </div>

      <div className="space-y-6">
        {stages.map((stage) => {
          const percentage =
            applications > 0
              ? Math.round((stage.value / applications) * 100)
              : 0;

          return (
            <div key={stage.label}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-slate-700">
                  {stage.label}
                </span>

                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-900">
                    {stage.value}
                  </span>

                  <span className="text-sm text-slate-500">{percentage}%</span>
                </div>
              </div>

              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`${stage.color} h-full rounded-full transition-all duration-700`}
                  style={{
                    width: `${percentage}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 pt-6 border-t border-slate-200">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-50 rounded-2xl p-4">
            <p className="text-sm text-slate-500">Conversion Rate</p>

            <h3 className="text-2xl font-bold text-slate-900 mt-2">
              {applications > 0
                ? Math.round((summary.hired / applications) * 100)
                : 0}
              %
            </h3>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4">
            <p className="text-sm text-slate-500">Interview Success</p>

            <h3 className="text-2xl font-bold text-slate-900 mt-2">
              {summary.interviews > 0
                ? Math.round((summary.hired / summary.interviews) * 100)
                : 0}
              %
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HiringPipelineChart;
