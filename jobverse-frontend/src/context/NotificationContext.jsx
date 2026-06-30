import { useEffect, useState, useCallback } from "react";
import NotificationContext from "./AppNotificationContext";

import {
  getNotifications,
  getUnreadCount,
  markAsRead as apiMarkAsRead,
  markAllAsRead as apiMarkAllAsRead,
} from "../api/notificationApi";

import notificationSocket from "../socket/notificationSocket";

const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);

      const user = localStorage.getItem("userInfo");
      if (!user) return;

      const data = await getNotifications();

      setNotifications(data.notifications || []);
    } catch (err) {
      if (err?.response?.status !== 401) {
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const user = localStorage.getItem("userInfo");
      if (!user) return;

      const data = await getUnreadCount();

      setUnreadCount(data?.count || 0);
    } catch (err) {
      if (err?.response?.status !== 401) {
        console.error(err);
      }
    }
  }, []);

  const markAsRead = async (id) => {
    try {
      await apiMarkAsRead(id);

      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)),
      );

      setUnreadCount((prev) => Math.max(prev - 1, 0));
    } catch (err) {
      console.error(err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await apiMarkAllAsRead();

      setNotifications((prev) =>
        prev.map((n) => ({
          ...n,
          isRead: true,
        })),
      );

      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const user = localStorage.getItem("userInfo");

    if (!user) return;

    fetchNotifications();
    fetchUnreadCount();
  }, [fetchNotifications, fetchUnreadCount]);

  useEffect(() => {
    const user = localStorage.getItem("userInfo");

    if (!user) return;

    const handleNotification = (notification) => {
      setNotifications((prev) => [notification, ...prev]);

      if (!notification.isRead) {
        setUnreadCount((prev) => prev + 1);
      }
    };

    notificationSocket.on("notification:new", handleNotification);

    return () => {
      notificationSocket.off("notification:new", handleNotification);
    };
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,

        fetchNotifications,
        fetchUnreadCount,

        markAsRead,
        markAllAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export { NotificationProvider };
