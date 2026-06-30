import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ProfileDropdown = ({ user, onClose }) => {
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // ✅ close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!dropdownRef.current?.contains(e.target)) {
        onClose && onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  // ✅ ESC key close
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        onClose && onClose();
      }
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // ✅ View Profile
  const handleViewProfile = () => {
    if (user?._id) {
      navigate(`/profile/${user._id}`);
      onClose && onClose();
    } else {
      toast.error("User not found");
    }
  };

  // ✅ FIXED LOGOUT
  const handleLogout = async () => {
    try {
      await fetch(
        `${import.meta.env.VITE_API_URL || "https://jobverse-api.onrender.com"}/api/user/logout`,
        {
          method: "POST",
          credentials: "include",
        },
      );
    } catch (err) {
      console.log(err);
    }

    // ✅ CLEAR STORAGE
    localStorage.removeItem("userInfo");
    localStorage.removeItem("isLogin");
    sessionStorage.clear();

    // ✅ CLOSE DROPDOWN
    onClose && onClose();

    // ✅ MESSAGE
    toast.success("Logged out successfully");

    // ✅ REDIRECT (NO FLASH)
    navigate("/login", { replace: true });
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 mt-2 w-72 bg-white shadow-xl rounded-xl border z-50"
    >
      {/* USER INFO */}
      <div className="p-4 border-b">
        <div className="flex gap-3 items-center">
          <img
            src={user?.profilePic || "/user.png"}
            alt="profile"
            onError={(e) => (e.target.src = "/user.png")}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <div className="font-semibold">{user?.f_name || "User"}</div>
            <div className="text-sm text-gray-500">
              {user?.headline || "Headline"}
            </div>
          </div>
        </div>

        <button
          onClick={handleViewProfile}
          className="mt-3 w-full border rounded-full py-1 hover:bg-gray-100"
        >
          View Profile
        </button>
      </div>

      {/* MENU */}
      <div className="p-2 text-sm">
        <div className="px-3 py-2 hover:bg-gray-100 cursor-pointer rounded">
          Settings & Privacy
        </div>
        <div className="px-3 py-2 hover:bg-gray-100 cursor-pointer rounded">
          Help
        </div>
        <div className="px-3 py-2 hover:bg-gray-100 cursor-pointer rounded">
          Language
        </div>
      </div>

      {/* LOGOUT */}
      <div className="border-t p-2">
        <div
          onClick={handleLogout}
          className="px-3 py-2 hover:bg-gray-100 cursor-pointer rounded text-red-500"
        >
          Logout
        </div>
      </div>
    </div>
  );
};

export default React.memo(ProfileDropdown);
