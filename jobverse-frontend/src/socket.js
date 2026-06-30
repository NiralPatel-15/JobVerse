import { io } from "socket.io-client";

const socket = io("https://jobverse-api.onrender.com", {
  withCredentials: true,
  transports: ["websocket"],
  reconnection: true,
});

socket.on("connect", () => {
  console.log("Connected:", socket.id);
});

socket.on("disconnect", () => {
  console.log("Disconnected");
});

socket.on("getUsers", (users) => {
  console.log("Online users:", users);
});

export default socket;
