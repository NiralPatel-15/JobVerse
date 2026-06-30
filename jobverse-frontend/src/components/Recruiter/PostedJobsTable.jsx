import React from "react";
import { Briefcase } from "lucide-react";

const getStatusStyle = (status) => {
  switch (status?.toLowerCase()) {
    case "approved":
      return "bg-green-100 text-green-700";

    case "rejected":
      return "bg-red-100 text-red-700";

    default:
      return "bg-yellow-100 text-yellow-700";
  }
};

const PostedJobsTable = ({ jobs }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Posted Jobs</h2>

          <p className="text-sm text-gray-500 mt-1">
            Track and manage all active job postings
          </p>
        </div>

        <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
          {jobs.length} Jobs
        </span>
      </div>

      {jobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="bg-blue-100 p-4 rounded-full mb-4">
            <Briefcase className="text-blue-600" size={28} />
          </div>

          <h3 className="font-semibold text-gray-900">No Jobs Posted Yet</h3>

          <p className="text-gray-500 text-sm mt-1">
            Create your first job posting to start hiring.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[750px]">
            <thead>
              <tr className="border-b border-gray-200 text-left">
                <th className="pb-4 text-sm font-semibold text-gray-600">
                  Job Title
                </th>

                <th className="pb-4 text-sm font-semibold text-gray-600">
                  Company
                </th>

                <th className="pb-4 text-sm font-semibold text-gray-600">
                  Location
                </th>

                <th className="pb-4 text-sm font-semibold text-gray-600">
                  Type
                </th>

                <th className="pb-4 text-sm font-semibold text-gray-600">
                  Status
                </th>

                <th className="pb-4 text-sm font-semibold text-gray-600">
                  Posted
                </th>
              </tr>
            </thead>

            <tbody>
              {jobs.map((job) => (
                <tr
                  key={job._id}
                  className="border-b border-gray-100 hover:bg-slate-50 transition-all duration-200"
                >
                  <td className="py-5">
                    <div>
                      <p className="font-semibold text-gray-900">{job.title}</p>
                    </div>
                  </td>

                  <td className="py-5 text-gray-600">{job.company}</td>

                  <td className="py-5 text-gray-600">{job.location}</td>

                  <td className="py-5">
                    <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
                      {job.jobType}
                    </span>
                  </td>

                  <td className="py-5">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(
                        job.status,
                      )}`}
                    >
                      {job.status}
                    </span>
                  </td>

                  <td className="py-5 text-gray-500">
                    {new Date(job.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PostedJobsTable;
