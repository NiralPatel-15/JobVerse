import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { getAllReportsAPI, updateReportStatusAPI } from "../../api/admin";
import { toast } from "react-toastify";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaShieldAlt,
  FaFlag,
} from "react-icons/fa";

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // =====================================
  // FETCH REPORTS
  // =====================================

  const fetchReports = async () => {
    try {
      const res = await getAllReportsAPI();
      setReports(res.data.reports || []);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // =====================================
  // UPDATE STATUS
  // =====================================

  const updateStatus = async (id, status) => {
    try {
      await updateReportStatusAPI(id, status);

      toast.success(`Report ${status}`);
      fetchReports();
    } catch (error) {
      console.log(error);
      toast.error("Status update failed");
    }
  };

  // =====================================
  // STATS
  // =====================================

  const totalReports = reports.length;

  const pendingReports = reports.filter(
    (report) => report.status === "pending",
  ).length;

  const resolvedReports = reports.filter(
    (report) => report.status === "resolved",
  ).length;

  const dismissedReports = reports.filter(
    (report) => report.status === "dismissed",
  ).length;

  return (
    <AdminLayout>
      {/* HEADER */}

      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          Reports Management
        </h1>

        <p className="text-gray-500 mt-2">
          Review and moderate reported jobs and recruiters.
        </p>
      </div>

      {/* STATS */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        <div className="bg-white border rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Reports</p>
              <h3 className="text-3xl font-bold mt-1">{totalReports}</h3>
            </div>

            <FaFlag className="text-3xl text-blue-500" />
          </div>
        </div>

        <div className="bg-white border rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <h3 className="text-3xl font-bold mt-1">{pendingReports}</h3>
            </div>

            <FaClock className="text-3xl text-yellow-500" />
          </div>
        </div>

        <div className="bg-white border rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Resolved</p>
              <h3 className="text-3xl font-bold mt-1">{resolvedReports}</h3>
            </div>

            <FaCheckCircle className="text-3xl text-green-500" />
          </div>
        </div>

        <div className="bg-white border rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Dismissed</p>
              <h3 className="text-3xl font-bold mt-1">{dismissedReports}</h3>
            </div>

            <FaTimesCircle className="text-3xl text-red-500" />
          </div>
        </div>
      </div>

      {/* CONTENT */}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-10">
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        ) : reports.length === 0 ? (
          <div className="p-16 text-center">
            <FaShieldAlt className="mx-auto text-5xl text-gray-300 mb-4" />

            <h3 className="text-xl font-semibold text-gray-700">
              No reports available
            </h3>

            <p className="text-gray-500 mt-2">
              All reported content has been reviewed.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px]">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="text-left px-6 py-4 text-xs uppercase tracking-wider font-semibold text-gray-600">
                    Reporter
                  </th>

                  <th className="text-left px-6 py-4 text-xs uppercase tracking-wider font-semibold text-gray-600">
                    Job
                  </th>

                  <th className="text-left px-6 py-4 text-xs uppercase tracking-wider font-semibold text-gray-600">
                    Recruiter
                  </th>

                  <th className="text-left px-6 py-4 text-xs uppercase tracking-wider font-semibold text-gray-600">
                    Reason
                  </th>

                  <th className="text-left px-6 py-4 text-xs uppercase tracking-wider font-semibold text-gray-600">
                    Description
                  </th>

                  <th className="text-left px-6 py-4 text-xs uppercase tracking-wider font-semibold text-gray-600">
                    Status
                  </th>

                  <th className="text-left px-6 py-4 text-xs uppercase tracking-wider font-semibold text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {reports.map((report) => (
                  <tr
                    key={report._id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    {/* REPORTER */}

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            report.reporter?.profilePic ||
                            "https://ui-avatars.com/api/?name=User"
                          }
                          alt="Reporter"
                          onError={(e) => {
                            e.target.src =
                              "https://ui-avatars.com/api/?name=User";
                          }}
                          className="w-12 h-12 rounded-full object-cover border"
                        />

                        <div>
                          <h3 className="font-semibold text-gray-800">
                            {report.reporter?.f_name}
                          </h3>

                          <p className="text-sm text-gray-500">
                            {report.reporter?.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* JOB */}

                    <td className="px-6 py-4">
                      <h3 className="font-semibold text-gray-800">
                        {report.reportedJob?.title}
                      </h3>

                      <p className="text-sm text-gray-500">
                        {report.reportedJob?.company}
                      </p>
                    </td>

                    {/* RECRUITER */}

                    <td className="px-6 py-4">
                      <h3 className="font-semibold text-gray-800">
                        {report.reportedRecruiter?.f_name}
                      </h3>

                      <p className="text-sm text-gray-500">
                        {report.reportedRecruiter?.email}
                      </p>
                    </td>

                    {/* REASON */}

                    <td className="px-6 py-4 font-medium text-gray-700">
                      {report.reason}
                    </td>

                    {/* DESCRIPTION */}

                    <td className="px-6 py-4 max-w-[250px]">
                      <p
                        title={report.description}
                        className="text-sm text-gray-600 line-clamp-3"
                      >
                        {report.description}
                      </p>
                    </td>

                    {/* STATUS */}

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                          report.status === "resolved"
                            ? "bg-green-100 text-green-700"
                            : report.status === "dismissed"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {report.status === "resolved" && <FaCheckCircle />}
                        {report.status === "dismissed" && <FaTimesCircle />}
                        {report.status === "pending" && <FaClock />}

                        {report.status}
                      </span>
                    </td>

                    {/* ACTIONS */}

                    <td className="px-6 py-4">
                      {report.status === "pending" ? (
                        <div className="flex gap-2 flex-wrap">
                          <button
                            onClick={() => updateStatus(report._id, "resolved")}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
                          >
                            <FaCheckCircle />
                            Resolve
                          </button>

                          <button     
                            onClick={() =>
                              updateStatus(report._id, "dismissed")
                            }
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
                          >
                            <FaTimesCircle />
                            Dismiss
                          </button>
                        </div>
                      ) : (
                        <span className="text-sm font-medium text-gray-500">
                          Already {report.status}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Reports;