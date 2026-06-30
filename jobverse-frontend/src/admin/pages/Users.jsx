import { useEffect, useState, useCallback } from "react";
import AdminLayout from "../components/AdminLayout";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import {
  getAllUsersAPI,
  toggleUserStatusAPI,
  deleteUserAPI,
} from "../../api/admin";

const Users = () => {
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);

  // ====================================
  // FETCH USERS
  // ====================================
  const fetchUsers = useCallback(
    async (currentPage = page, currentSearch = search) => {
      try {
        setLoading(true);

        const res = await getAllUsersAPI(currentPage, currentSearch);

        setUsers(res.data.users);
        setTotalPages(res.data.totalPages);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    },
    [page, search],
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUsers();
  }, [fetchUsers]);

  // ====================================
  // BLOCK / UNBLOCK
  // ====================================
  const handleToggleStatus = async (id) => {
    try {
      await toggleUserStatusAPI(id);

      toast.success("User status updated");

      fetchUsers();
    } catch (error) {
      console.error(error);

      toast.error("Failed to update user status");
    }
  };

  // ====================================
  // DELETE USER
  // ====================================
  const handleDeleteUser = async (id) => {
    const result = await Swal.fire({
      title: "Delete User?",
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Delete",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteUserAPI(id);

      toast.success("User deleted successfully");

      fetchUsers();
    } catch (error) {
      console.error(error);

      toast.error("Failed to delete user");
    }
  };

  return (
    <AdminLayout>
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Manage Users</h1>

          <p className="text-gray-500 mt-1">Manage all platform users</p>
        </div>

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="
w-full md:w-80
px-4 py-3
border border-gray-200
rounded-xl
bg-white
focus:outline-none
focus:ring-2
focus:ring-blue-500
focus:border-blue-500
transition-all
"
        />
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Total Users: {users.length}</h2>
      </div>

      {/* LOADING */}
      {loading ? (
        <div className="bg-white rounded-2xl border p-10 text-center">
          <p className="text-lg font-medium text-gray-600">Loading users...</p>
        </div>
      ) : (
        <>
          {/* TABLE */}
          {/* TABLE */}
          {users.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
              <h3 className="text-lg font-semibold text-gray-700">
                No users found
              </h3>

              <p className="text-gray-500 mt-2">
                Try adjusting your search criteria.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      User
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
                  {users.map((user) => (
                    <tr
                      key={user._id}
                      className="border-t hover:bg-gray-50 transition-colors"
                    >
                      {/* USER */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={user.profilePic || "/user.png"}
                            alt={user.f_name}
                            onError={(e) => {
                              e.target.src = "/user.png";
                            }}
                            className="w-12 h-12 rounded-full object-cover"
                          />

                          <div>
                            <p className="font-semibold">{user.f_name}</p>
                            <p className="text-sm text-gray-500">{user.role}</p>
                          </div>
                        </div>
                      </td>

                      {/* EMAIL */}
                      <td className="px-6 py-4">{user.email}</td>

                      {/* STATUS */}
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            user.status === "active"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {user.status === "active" ? "Active" : "Blocked"}
                        </span>
                      </td>

                      {/* ACTIONS */}
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => handleToggleStatus(user._id)}
                            className={`px-4 py-2 rounded-lg text-white font-medium transition-all hover:shadow-md ${
                              user.status === "active"
                                ? "bg-yellow-500 hover:bg-yellow-600"
                                : "bg-green-600 hover:bg-green-700"
                            }`}
                          >
                            {user.status === "active" ? "Block" : "Unblock"}
                          </button>

                          <button
                            onClick={() => handleDeleteUser(user._id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-all hover:shadow-md"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* PAGINATION */}
          <div className="flex justify-center gap-3 mt-8">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="
px-4 py-2
bg-white
border
border-gray-200
rounded-xl
font-medium
hover:bg-gray-50
transition-all
disabled:opacity-50
disabled:cursor-not-allowed
"
            >
              Prev
            </button>

            <span className="px-4 py-2">
              Page {page} of {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="
px-4 py-2
bg-white
border
border-gray-200
rounded-xl
font-medium
hover:bg-gray-50
transition-all
disabled:opacity-50
disabled:cursor-not-allowed
"
            >
              Next
            </button>
          </div>
        </>
      )}
    </AdminLayout>
  );
};;

export default Users;
