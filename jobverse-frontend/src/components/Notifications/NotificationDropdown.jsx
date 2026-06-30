import NotificationItem from "./NotificationItem";

import useNotifications from "../../hooks/useNotifications";

const NotificationDropdown = ({ onClose }) => {
  const { notifications, loading, markAsRead, markAllAsRead } =
    useNotifications();

  const handleRead = async (id) => {
    await markAsRead(id);
  };

  const handleReadAll = async () => {
    await markAllAsRead();
  };

  return (
    <div className="absolute right-0 mt-2 w-96 bg-white shadow-xl border rounded-lg z-50">
      <div className="flex justify-between items-center p-4 border-b">
        <h3 className="font-semibold text-lg">Notifications</h3>

        {notifications.length > 0 && (
          <button
            onClick={handleReadAll}
            className="text-blue-600 text-sm hover:text-blue-800"
          >
            Mark All Read
          </button>
        )}
      </div>

      <div className="max-h-96 overflow-y-auto">
        {loading ? (
          <div className="p-4 text-center text-gray-500">Loading...</div>
        ) : notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No Notifications</div>
        ) : (
          notifications.map((notification) => (
            <NotificationItem
              key={notification._id}
              notification={notification}
              onRead={handleRead}
            />
          ))
        )}
      </div>

      <div className="border-t p-2">
        <button
          onClick={onClose}
          className="w-full text-sm text-gray-600 hover:text-black"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default NotificationDropdown;
