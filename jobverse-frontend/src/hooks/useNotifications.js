import { useContext } from "react";
import NotificationContext from "../context/AppNotificationContext";

const useNotifications = () => {
  return useContext(NotificationContext);
};

export default useNotifications;
