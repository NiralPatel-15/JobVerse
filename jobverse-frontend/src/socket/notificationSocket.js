import { io } from "socket.io-client";

const notificationSocket = io(import.meta.env.VITE_SOCKET_URL, {
  withCredentials: true,
});

export default notificationSocket;
