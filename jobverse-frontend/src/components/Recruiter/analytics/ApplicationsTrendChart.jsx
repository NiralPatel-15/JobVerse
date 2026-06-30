import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const MONTHS = [
  "",
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const ApplicationsTrendChart = ({ data }) => {
  const formattedData = data.map((item) => ({
    month: MONTHS[item._id.month],
    applications: item.count,
  }));

  const totalApplications = formattedData.reduce(
    (acc, item) => acc + item.applications,
    0,
  );

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 h-full">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Application Trends
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Monthly application volume
          </p>
        </div>

        <div className="text-right">
          <p className="text-xs text-slate-500">Total Applications</p>

          <p className="text-2xl font-bold text-slate-900">
            {totalApplications}
          </p>
        </div>
      </div>

      {formattedData.length === 0 ? (
        <div className="h-[320px] flex items-center justify-center text-slate-500">
          No application data available
        </div>
      ) : (
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={formattedData}>
              <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" />

              <XAxis
                dataKey="month"
                tick={{ fill: "#64748b", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                tick={{ fill: "#64748b", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
                }}
              />

              <Line
                type="monotone"
                dataKey="applications"
                stroke="#2563eb"
                strokeWidth={3}
                dot={{
                  r: 4,
                }}
                activeDot={{
                  r: 7,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default ApplicationsTrendChart;
