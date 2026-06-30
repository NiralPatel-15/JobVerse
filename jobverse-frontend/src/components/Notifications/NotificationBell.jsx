import { useState } from "react";
import { Bell } from "lucide-react";

import useNotifications from "../../hooks/useNotifications";
import NotificationDropdown from "./NotificationDropdown";

const NotificationBell = () => {
  const [open, setOpen] = useState(false);

  const { unreadCount } = useNotifications();

  return (
    <div className="relative">
      <button onClick={() => setOpen((prev) => !prev)} className="relative">
        <Bell size={22} />

        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && <NotificationDropdown onClose={() => setOpen(false)} />}
    </div>
  );
};

export default NotificationBell;
