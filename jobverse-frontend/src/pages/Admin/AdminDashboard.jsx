const AdminDashboard = () => {
  return (
    <div className="max-w-7xl mx-auto p-6 md:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>

        <p className="mt-2 text-gray-600">
          Welcome to the JobVerse Administration Panel
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="bg-white border rounded-2xl shadow-sm p-6">
          <p className="text-sm text-gray-500">Total Users</p>
          <h2 className="text-3xl font-bold mt-2">--</h2>
        </div>

        <div className="bg-white border rounded-2xl shadow-sm p-6">
          <p className="text-sm text-gray-500">Recruiters</p>
          <h2 className="text-3xl font-bold mt-2">--</h2>
        </div>

        <div className="bg-white border rounded-2xl shadow-sm p-6">
          <p className="text-sm text-gray-500">Jobs Posted</p>
          <h2 className="text-3xl font-bold mt-2">--</h2>
        </div>

        <div className="bg-white border rounded-2xl shadow-sm p-6">
          <p className="text-sm text-gray-500">Reports</p>
          <h2 className="text-3xl font-bold mt-2">--</h2>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border rounded-2xl shadow-sm p-6 hover:shadow-md transition-all">
            <h3 className="font-semibold text-lg">Manage Users</h3>

            <p className="text-gray-500 mt-2 text-sm">
              View, block, unblock, and manage platform users.
            </p>
          </div>

          <div className="bg-white border rounded-2xl shadow-sm p-6 hover:shadow-md transition-all">
            <h3 className="font-semibold text-lg">Recruiter Approvals</h3>

            <p className="text-gray-500 mt-2 text-sm">
              Review recruiter applications and approvals.
            </p>
          </div>

          <div className="bg-white border rounded-2xl shadow-sm p-6 hover:shadow-md transition-all">
            <h3 className="font-semibold text-lg">Reports Center</h3>

            <p className="text-gray-500 mt-2 text-sm">
              Review and resolve reported jobs and recruiters.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
