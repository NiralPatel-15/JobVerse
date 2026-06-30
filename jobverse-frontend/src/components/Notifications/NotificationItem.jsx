const NotificationItem = ({ notification, onRead }) => {
  return (
    <div
      onClick={() => onRead(notification._id)}
      className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
        !notification.isRead ? "bg-blue-50" : ""
      }`}
    >
      <div className="font-medium">{notification.title}</div>

      <div className="text-sm text-gray-600">{notification.message}</div>

      <div className="text-xs text-gray-400 mt-1">
        {new Date(notification.createdAt).toLocaleString()}
      </div>
    </div>
  );
};

export default NotificationItem; 
