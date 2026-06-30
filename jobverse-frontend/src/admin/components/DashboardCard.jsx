const DashboardCard = ({ title, value, icon, color }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>

        <h2 className="text-3xl font-bold mt-2">{value}</h2>
      </div>

      <div className={`text-white p-4 rounded-xl ${color}`}>{icon}</div>
    </div>
  );
};

export default DashboardCard;
