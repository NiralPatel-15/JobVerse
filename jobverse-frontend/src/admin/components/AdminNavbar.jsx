import { FaBars } from "react-icons/fa";

const AdminNavbar = ({ setSidebarOpen }) => {
  const admin = JSON.parse(localStorage.getItem("adminData"));

  return (
    <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
      {/* Mobile Menu */}
      <button
        className="lg:hidden text-2xl"
        onClick={() => setSidebarOpen(true)}
      >
        <FaBars />
      </button>

      {/* Title */}
      <h1 className="text-2xl font-bold">Admin Panel</h1>

      {/* Admin Info */}
      <div className="flex items-center gap-3">
        <img
          src={admin?.profilePic}
          alt=""
          className="w-10 h-10 rounded-full object-cover"
        />

        <div>
          <p className="font-semibold">{admin?.f_name}</p>

          <p className="text-sm text-gray-500">Administrator</p>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
