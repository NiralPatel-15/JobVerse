const CollaborationSidebar = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-3xl shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-5">
        Recruiter Collaboration
      </h2>

      <div className="space-y-4">
        {/* Recruiter 1 */}
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 hover:shadow-sm transition">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-gray-800">Aman HR</p>

            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>

          <p className="text-sm text-green-600 mt-2">Online</p>
        </div>

        {/* Recruiter 2 */}
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 hover:shadow-sm transition">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-gray-800">Priya Recruiter</p>

            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          </div>

          <p className="text-sm text-yellow-600 mt-2">Viewing candidate</p>
        </div>
      </div>
    </div>
  );
};

export default CollaborationSidebar;