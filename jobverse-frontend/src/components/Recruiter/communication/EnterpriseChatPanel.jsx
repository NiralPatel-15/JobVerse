import { useEffect, useRef, useState } from "react";

import communicationSocket from "../../../socket/communicationSocket";
import axios from "../../../api/axiosConfig";

const EnterpriseChatPanel = ({ conversationId, currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [typingUser, setTypingUser] = useState(null);

  const bottomRef = useRef(null);

  // =====================================
  // SOCKET EVENTS
  // =====================================

  useEffect(() => {
    if (!conversationId || !currentUser) return;

    communicationSocket.emit("join-conversation", conversationId);

    const handleNewMessage = (data) => {
      setMessages((prev) => {
        const exists = prev.some((msg) => msg._id === data._id);

        if (exists) return prev;

        return [...prev, data];
      });
    };

    const handleTyping = ({ userId }) => {
      if (userId !== currentUser._id) {
        setTypingUser(userId);
      }
    };

    const handleStopTyping = () => {
      setTypingUser(null);
    };

    const handleMessagesSeen = ({ userId }) => {
      setMessages((prev) =>
        prev.map((msg) => {
          const alreadySeen = (msg.seenBy || []).some(
            (id) => id.toString() === userId.toString(),
          );

          if (msg.sender?._id !== userId && !alreadySeen) {
            return {
              ...msg,
              seenBy: [...(msg.seenBy || []), userId],
            };
          }

          return msg;
        }),
      );
    };

    communicationSocket.on("communication:new-message", handleNewMessage);

    communicationSocket.on("typing", handleTyping);

    communicationSocket.on("stop-typing", handleStopTyping);

    communicationSocket.on("messages-seen-updated", handleMessagesSeen);

    return () => {
      communicationSocket.off("communication:new-message", handleNewMessage);

      communicationSocket.off("typing", handleTyping);

      communicationSocket.off("stop-typing", handleStopTyping);

      communicationSocket.off("messages-seen-updated", handleMessagesSeen);
    };
  }, [conversationId, currentUser]);

  // =====================================
  // LOAD MESSAGES + MARK SEEN
  // =====================================

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `/communication/messages/${conversationId}`,
        );

        setMessages(res.data);

        await axios.patch(`/communication/messages/${conversationId}/seen`);

        communicationSocket.emit("messages-seen", {
          conversationId,
          userId: currentUser._id,
        });
      } catch (error) {
        console.error(error);
      }
    };

    if (conversationId && currentUser) {
      fetchMessages();
    }
  }, [conversationId, currentUser]);

  // =====================================
  // AUTO SCROLL
  // =====================================

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  // =====================================
  // SEND MESSAGE
  // =====================================

  const handleSend = () => {
    if (!message.trim()) return;

    communicationSocket.emit("communication:send-message", {
      conversationId,
      sender: currentUser._id,
      content: message.trim(),
      messageType: "text",
    });

    communicationSocket.emit("stop-typing", {
      conversationId,
      userId: currentUser._id,
    });

    setMessage("");
  };

  return (
    <div className="flex flex-col h-[600px] bg-white border rounded-2xl shadow">
      {/* HEADER */}

      <div className="border-b px-5 py-4">
        <h2 className="font-semibold text-lg">Enterprise Communication Hub</h2>

        <p className="text-sm text-gray-500">Real-time ATS messaging</p>
      </div>

      {/* MESSAGES */}

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`max-w-[75%] px-4 py-3 rounded-2xl ${
              msg.sender?._id === currentUser._id
                ? "ml-auto bg-blue-600 text-white"
                : "bg-gray-100 text-gray-900"
            }`}
          >
            <p className="text-xs font-semibold mb-1">{msg.sender?.name}</p>

            <p className="text-sm">{msg.content}</p>

            {msg.sender?._id === currentUser._id && (
              <div
                className={`text-[11px] mt-2 ${
                  msg.sender?._id === currentUser._id
                    ? "text-blue-100"
                    : "text-gray-400"
                }`}
              >
                {msg.seenBy?.length > 1 ? "Seen" : "Delivered"}
              </div>
            )}
          </div>
        ))}

        <div ref={bottomRef} />
      </div>

      {/* TYPING */}

      {typingUser && (
        <div className="px-4 py-2 text-xs text-gray-500">
          Recruiter is typing...
        </div>
      )}

      {/* INPUT */}

      <div className="border-t p-4 flex gap-3">
        <input
          type="text"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);

            communicationSocket.emit("typing", {
              conversationId,
              userId: currentUser._id,
            });
          }}
          placeholder="Send enterprise message..."
          className="flex-1 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleSend}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-xl transition"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default EnterpriseChatPanel;