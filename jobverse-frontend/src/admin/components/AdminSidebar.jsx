import {
  FaUsers,
  FaBriefcase,
  FaUserTie,
  FaChartBar,
  FaHome,
  FaFlag,
  FaKey,
  FaSignOutAlt,
} from "react-icons/fa";

import { Link, useLocation, useNavigate } from "react-router-dom";

import { adminLogoutAPI } from "../../api/admin";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const AdminSidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await adminLogoutAPI();

      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminData");

      toast.success("Logged out successfully.");

      navigate("/admin/login", {
        replace: true,
      });
    } catch (error) {
      console.error(error);

      toast.error(error?.response?.data?.message || "Logout failed.");
    }
  };

  const menus = [
    {
      name: "Dashboard",
      icon: <FaHome />,
      path: "/admin/dashboard",
    },
    {
      name: "Users",
      icon: <FaUsers />,
      path: "/admin/users",
    },
    {
      name: "Recruiters",
      icon: <FaUserTie />,
      path: "/admin/recruiters",
    },
    {
      name: "Jobs",
      icon: <FaBriefcase />,
      path: "/admin/jobs",
    },
    {
      name: "Analytics",
      icon: <FaChartBar />,
      path: "/admin/analytics",
    },
    {
      name: "Reports",
      icon: <FaFlag />,
      path: "/admin/reports",
    },
  ];

  return (
    <>
      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static top-0 left-0 z-50
          w-64 h-screen bg-gray-900 text-white
          transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* Logo */}
        <div className="p-6 text-2xl font-bold border-b border-gray-700">
          JobVerse Admin
        </div>

        {/* Menus */}
        <div className="mt-6 flex flex-col gap-2 px-3">
          {menus.map((menu, index) => (
            <Link
              key={index}
              to={menu.path}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg
                transition-all duration-200
                ${
                  location.pathname === menu.path
                    ? "bg-blue-600"
                    : "hover:bg-gray-800"
                }
              `}
            >
              {menu.icon}
              <span>{menu.name}</span>
            </Link>
          ))}
        </div>

        <div className="absolute bottom-6 left-0 w-full px-3 space-y-2">
          <Link
            to="/admin/change-password"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition"
          >
            <FaKey />
            <span>Change Password</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-600 hover:text-white transition"
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
