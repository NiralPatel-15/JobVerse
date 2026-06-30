import axios from "./axiosConfig";

// ✅ GET ALL NOTIFICATIONS
export const getNotifications = async () => {
  const res = await axios.get("/notification");

  return res.data;
};

// ✅ UNREAD COUNT
export const getUnreadCount = async () => {
  const res = await axios.get("/notification/activeNotification");

  return res.data;
};

// ✅ MARK SINGLE
export const markAsRead = async (notificationId) => {
  const res = await axios.put("/notification/isRead", {
    notificationId,
  });

  return res.data;
};

// ✅ MARK ALL
export const markAllAsRead = async () => {
  const res = await axios.put("/notification/mark-all");

  return res.data;
};
