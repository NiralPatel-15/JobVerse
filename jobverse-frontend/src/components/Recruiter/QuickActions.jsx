import React from "react";
import { Link } from "react-router-dom";
import { Briefcase, Settings } from "lucide-react";

const QuickActions = () => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-5">Quick Actions</h2>

      <div className="space-y-4">
        <Link
          to="/jobs/post"
          className="block p-4 rounded-xl border border-blue-100 bg-blue-50 hover:bg-blue-100 transition-all duration-300"
        >
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 text-white p-2 rounded-lg">
              <Briefcase size={20} />
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">Post New Job</h3>

              <p className="text-sm text-gray-500">
                Create and publish a new job opening
              </p>
            </div>
          </div>
        </Link>

        <Link
          to="/jobs"
          className="block p-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all duration-300"
        >
          <div className="flex items-center gap-3">
            <div className="bg-slate-800 text-white p-2 rounded-lg">
              <Settings size={20} />
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">Manage Jobs</h3>

              <p className="text-sm text-gray-500">
                View and manage all posted jobs
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default QuickActions;
