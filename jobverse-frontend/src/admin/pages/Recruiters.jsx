import { useEffect, useState } from "react";

import AdminLayout from "../components/AdminLayout";

import { getAllRecruitersAPI, updateRecruiterStatusAPI } from "../../api/admin";

const Recruiters = () => {
  const [recruiters, setRecruiters] = useState([]);

  const [loading, setLoading] = useState(true);

  // ====================================
  // FETCH RECRUITERS
  // ====================================
  const fetchRecruiters = async () => {
    try {
      const res = await getAllRecruitersAPI();

      setRecruiters(res.data.recruiters);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecruiters();
  }, []);

  // ====================================
  // UPDATE STATUS
  // ====================================
  const handleStatusUpdate = async (id, recruiterStatus) => {
    try {
      await updateRecruiterStatusAPI(id, recruiterStatus);

      fetchRecruiters();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AdminLayout>
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Recruiters</h1>

        <p className="text-gray-500 mt-1">Manage recruiter approvals</p>
      </div>

      {/* LOADING */}
      {loading ? (
        <div className="bg-white rounded-2xl border p-10 text-center">
          <p className="text-lg font-medium text-gray-600">
            Loading recruiters...
          </p>
        </div>
      ) : recruiters.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <h3 className="text-lg font-semibold text-gray-700">
            No recruiters found
          </h3>

          <p className="text-gray-500 mt-2">
            Recruiter applications will appear here.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Recruiter
                </th>

                <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Company
                </th>

                <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Email
                </th>

                <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Status
                </th>

                <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {recruiters.map((recruiter) => (
                <tr
                  key={recruiter._id}
                  className="border-t hover:bg-gray-50 transition-colors"
                >
                  {/* RECRUITER */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={recruiter.profilePic}
                        alt=""
                        className="w-12 h-12 rounded-full object-cover"
                      />

                      <div>
                        <p className="font-semibold">{recruiter.f_name}</p>
                        <p className="text-sm text-gray-500">Recruiter</p>
                      </div>
                    </div>
                  </td>

                  {/* COMPANY */}
                  <td className="px-6 py-4">
                    {recruiter.curr_company || "N/A"}
                  </td>

                  {/* EMAIL */}
                  <td className="px-6 py-4">{recruiter.email}</td>

                  {/* STATUS */}
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        recruiter.recruiterStatus === "approved"
                          ? "bg-green-100 text-green-700"
                          : recruiter.recruiterStatus === "rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {recruiter.recruiterStatus}
                    </span>
                  </td>

                  {/* ACTIONS */}
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() =>
                          handleStatusUpdate(recruiter._id, "approved")
                        }
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-all hover:shadow-md"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() =>
                          handleStatusUpdate(recruiter._id, "rejected")
                        }
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-all hover:shadow-md"
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
};

export default Recruiters;
