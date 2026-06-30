import React from "react";

const getStatusStyle = (status) => {
  switch (status?.toLowerCase()) {
    case "accepted":
    case "hired":
      return "bg-green-100 text-green-700";

    case "rejected":
      return "bg-red-100 text-red-700";

    case "shortlisted":
      return "bg-purple-100 text-purple-700";

    default:
      return "bg-yellow-100 text-yellow-700";
  }
};

const RecentApplicants = ({ applicants }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-gray-900">Recent Applicants</h2>

        <span className="text-sm text-gray-500">
          {applicants.length} Applicants
        </span>
      </div>

      {applicants.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          No recent applicants found
        </div>
      ) : (
        <div className="space-y-4">
          {applicants.map((app) => (
            <div
              key={app._id}
              className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center font-semibold text-blue-700">
                    {app.user?.f_name?.charAt(0)?.toUpperCase() || "U"}
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {app.user?.f_name}
                    </h3>

                    <p className="text-sm text-gray-500">{app.user?.email}</p>

                    <p className="text-sm text-gray-600 mt-1">
                      Applied for{" "}
                      <span className="font-medium">{app.job?.title}</span>
                    </p>
                  </div>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                    app.status,
                  )}`}
                >
                  {app.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentApplicants;
