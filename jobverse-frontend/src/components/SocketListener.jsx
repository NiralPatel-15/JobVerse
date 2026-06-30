import { useEffect } from "react";
import socket from "../socket";
import { toastInfo } from "../utils/toast";

const SocketListener = () => {
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if (!user?._id) return;

    socket.emit("addUser", user._id);

    const handleNotification = (data) => {
      console.log("LIVE NOTIFICATION:", data);

      toastInfo(
        data.title || `${data.sender?.f_name || "Someone"} ${data.action}`,
      );

      window.dispatchEvent(new Event("notificationUpdated"));
    };

    socket.on("newNotification", handleNotification);

    return () => {
      socket.off("newNotification", handleNotification);
    };
  }, []);

  return null;
};

export default SocketListener;