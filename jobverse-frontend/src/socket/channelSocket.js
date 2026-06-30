import { io } from "socket.io-client";

const channelSocket = io(import.meta.env.VITE_BACKEND_URL, {
  withCredentials: true,
});

export default channelSocket;
