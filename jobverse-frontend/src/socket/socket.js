import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_API_URL || "https://jobverse-api.onrender.com", {
  withCredentials: true,
  transports: ["websocket"],
});

export default socket;
