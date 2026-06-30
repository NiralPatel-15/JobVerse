import React from "react";

const NotificationCard = ({ notification }) => {
  return (
    <div
      className={`p-4 rounded-2xl border mb-3 transition-all duration-300 ${
        notification.isRead ? "bg-white" : "bg-blue-50 border-blue-200"
      }`}
    >
      <div className="flex items-start gap-3">
        <img
          src={notification?.sender?.profilePic || "/default.png"}
          alt=""
          className="w-12 h-12 rounded-full object-cover"
        />

        <div className="flex-1">
          <h3 className="font-semibold text-gray-800">{notification.title}</h3>

          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>

          <p className="text-xs text-gray-400 mt-2">
            {new Date(notification.createdAt).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;
  