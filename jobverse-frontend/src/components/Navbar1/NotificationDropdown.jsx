import { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";
import useNotifications from "../../hooks/useNotifications";

const NotificationDropdown = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotifications();

  const [open, setOpen] = useState(false);

  const dropdownRef = useRef();

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (!dropdownRef.current?.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, []);

  const handleRead = async (id) => {
    try {
      await markAsRead(id);
    } catch (error) {
      console.error(error);
    }
  };

  const handleMarkAll = async () => {
    try {
      await markAllAsRead();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell */}
      <button onClick={() => setOpen(!open)} className="relative">
        <Bell className="w-6 h-6 text-gray-700" />

        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-3 w-[360px] bg-white shadow-2xl rounded-2xl border z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <h2 className="font-semibold text-lg">Notifications</h2>

            {notifications.length > 0 && (
              <button
                onClick={handleMarkAll}
                className="text-sm text-blue-600 hover:underline"
              >
                Mark all
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-[450px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No notifications
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item._id}
                  onClick={() => handleRead(item._id)}
                  className={`flex gap-3 p-4 border-b cursor-pointer hover:bg-gray-50 transition ${
                    !item.isRead ? "bg-blue-50" : "bg-white"
                  }`}
                >
                  <img
                    src={item.sender?.profilePic || "/default.png"}
                    alt=""
                    className="w-12 h-12 rounded-full object-cover"
                  />

                  <div className="flex-1">
                    <p className="text-sm text-gray-800">
                      <span className="font-semibold">
                        {item.sender?.f_name || "System"}
                      </span>{" "}
                      {item.action}
                    </p>

                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(item.createdAt).toLocaleString()}
                    </p>
                  </div>

                  {!item.isRead && (
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
