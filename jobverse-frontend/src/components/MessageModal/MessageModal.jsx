import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import socket from "../../socket";

const MessageModal = ({ userData, closeModal }) => {
  const [message, setMessage] = useState("");

  // ✅ GET LOGGED-IN USER
  const currentUser = JSON.parse(localStorage.getItem("userInfo"));

  const handleSendMessage = async () => {
    // ✅ VALIDATION
    if (!message.trim()) {
      toast.error("Message cannot be empty ❌");
      return;
    }

    try {
      // ✅ SAVE IN DATABASE
      const res = await axios.post(
        "http://localhost:4000/api/conversation/add-conversation",
        {
          receiverId: userData._id,
          message: message,
        },
        { withCredentials: true },
      );

      console.log(res.data); // ✅ FIXED unused var error

      // ✅ SOCKET EMIT (AFTER SAVE)
      socket.emit("sendMessage", {
        sender: {
          _id: currentUser._id,
          f_name: currentUser.f_name,
          profilePic: currentUser.profilePic,
        },

        receiverId: userData._id,

        text: message,
      });

      toast.success("Message sent successfully ✅");
      setMessage("");
      closeModal();
    } catch (error) {
      console.log("SEND MESSAGE ERROR:", error);
      toast.error("Failed to send message ❌");
    }
  };

  return (
    <div className="my-5">
      <div className="w-full mb-4">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="p-2 mt-1 w-full border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
          rows={10}
          placeholder="Type your message..."
        ></textarea>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSendMessage}
          type="button"
          className="bg-blue-900 hover:bg-blue-950 text-white px-5 py-2 rounded-xl transition duration-200"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default MessageModal;