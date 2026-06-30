import React, { useEffect, useState, useCallback } from "react";
import ProfileCard from "../../components/ProfileCard/ProfileCard";
import Advertisment from "../../components/Advertisment/Advertisment";
import Card from "../../components/Card/Card";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import socket from "../../socket";
import { handleNotificationNavigation } from "../../utils/notificationNavigation";

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [clickedId, setClickedId] = useState(null);

  const navigate = useNavigate();
  const BASE_URL = "http://localhost:4000";

  // ✅ MEMOIZED MESSAGE FUNCTION
  const getMessage = useCallback((item) => {
    switch (item.type) {
      case "like":
        return "liked your post";
      case "comment":
        return "commented on your post";
      case "message":
        return "sent you a message";
      case "profile":
        return "viewed your profile";
      case "post":
        return "interacted with your post";
      case "connection":
        return "accepted your connection request";
      case "request":
        return "sent you a connection request";

      case "jobApplication":
        return item.action;

      case "applicationStatus":
        return item.action || "application status updated";

      case "jobApproved":
        return "your job was approved";

      case "jobRejected":
        return "your job was rejected";

      case "jobReported":
        return "your job received reports";

      case "recruiterApproved":
        return "approved your recruiter account";

      case "recruiterRejected":
        return "rejected your recruiter account";
      default:
        return item.action || "did something";
    }
  }, []);

  // ✅ FETCH NOTIFICATIONS
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);

        const res = await axios.get(`${BASE_URL}/api/notification`, {
          withCredentials: true,
        });

        const data = res.data?.notifications || [];

        // ✅ SORT (latest first)
        const sorted = data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );

        setNotifications(sorted);
      } catch (err) {
        toast.error(
          err.response?.data?.error || "Failed to load notifications",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // ✅ REALTIME NOTIFICATIONS
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if (!user?._id) return;

    socket.emit("addUser", user._id);

    socket.on("newNotification", (data) => {
      setNotifications((prev) => [data, ...prev]);

      // ✅ UPDATE NAVBAR COUNT
      window.dispatchEvent(new Event("notificationUpdated"));
    });

    return () => {
      socket.off("newNotification");
    };
  }, []);

  // ✅ HANDLE CLICK
  const handleNotificationClick = async (item) => {
    if (!item?._id || clickedId === item._id) return;

    try {
      setClickedId(item._id);

      await axios.put(
        `${BASE_URL}/api/notification/isRead`,
        { notificationId: item._id },
        { withCredentials: true },
      );

      // ✅ UPDATE UI
      setNotifications((prev) =>
        prev.map((n) => (n._id === item._id ? { ...n, isRead: true } : n)),
      );

      // ✅ UPDATE NAVBAR
      window.dispatchEvent(new Event("notificationUpdated"));

      // ✅ NEW CENTRALIZED NAVIGATION
      handleNotificationNavigation(item, navigate);
    } catch (err) {
      toast.error(err.response?.data?.error || "Something went wrong");
    } finally {
      setClickedId(null);
    }
  };

  return (
   <div
  className="
px-4
lg:px-10
xl:px-40
pt-24
pb-10
flex
flex-col
lg:flex-row
gap-5
bg-gray-100
min-h-screen
"
>
      {/* LEFT */}
      <div className="w-[25%] hidden md:flex flex-col gap-4 py-5 sticky top-24 h-fit">
        <ProfileCard />
      </div>

      {/* CENTER */}
      <div className="w-full lg:w-[55%]">
        <Card padding={0}>
          {/* HEADER */}
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Notifications
              </h1>

              <p className="text-sm text-gray-500 mt-1">
                Stay updated with activity across JobVerse
              </p>
            </div>

            <div className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-xl font-semibold">
              {notifications.length}
            </div>
          </div>

          {/* LOADING */}
          {loading && (
            <div className="p-6 space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-20 bg-gray-100 rounded-2xl animate-pulse"
                />
              ))}
            </div>
          )}

          {/* LIST */}
          {!loading && notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <div className="p-16 text-center">
                <div className="text-5xl mb-4">🔔</div>

                <h3 className="text-xl font-semibold text-gray-800">
                  No Notifications
                </h3>

                <p className="text-gray-500 mt-2">You're all caught up.</p>
              </div>
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item._id}
                onClick={() => handleNotificationClick(item)}
                className={`
mx-4
my-3
rounded-2xl
border
cursor-pointer
flex
gap-4
items-start
p-5 
transition-all
duration-300
hover:shadow-md
${!item.isRead ? "bg-indigo-50 border-indigo-200" : "bg-white border-gray-200"}
`}
              >
                <div className="relative">
                  <img
                    src={item.sender?.profilePic || "/user.png"}
                    alt="user"
                    className="rounded-full w-14 h-14 object-cover"
                  />

                  {!item.isRead && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-indigo-600 rounded-full"></span>
                  )}
                </div>

                <div className="flex-1">
                  {/* TITLE */}

                  <p className="font-semibold text-sm text-gray-800">
                    {item.title ||
                      `${
                        item.sender?.firstname ||
                        item.sender?.f_name ||
                        "Someone"
                      } ${getMessage(item)}`}
                  </p>

                  {/* MESSAGE */}

                  <p className="text-sm text-gray-600 mt-1">
                    {item.message || ""}
                  </p>

                  {/* DATE */}

                  <p className="text-xs text-gray-500 mt-2">
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleDateString()
                      : ""}
                  </p>
                </div>
              </div>
            ))
          )}
        </Card>
      </div>

      {/* RIGHT */}
      <div className="w-[25%] hidden md:block">
        <div className="sticky top-24">
          <Advertisment />
        </div>
      </div>
    </div>
  );
};

export default Notification;
