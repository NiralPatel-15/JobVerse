import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { getChannelMessages } from "../../../services/channelService";

import channelSocket from "../../../socket/channelSocket";

import ChannelMessageInput from "./ChannelMessageInput";

const ChannelChatPanel = ({ selectedChannel, onShowMembers }) => {
  const [messages, setMessages] = useState([]);

  const { user } = useSelector((state) => state.auth);

  // Load previous messages
  useEffect(() => {
    if (!selectedChannel) return;

    const fetchMessages = async () => {
      try {
        const res = await getChannelMessages(selectedChannel._id);

        setMessages(res.data.messages || []);
      } catch (error) {
        console.error("Failed to load messages:", error);
      }
    };

    fetchMessages();
  }, [selectedChannel]);

  // Join / Leave channel room
  useEffect(() => {
    if (!selectedChannel) return;

    channelSocket.emit("joinChannelRoom", selectedChannel._id);

    return () => {
      channelSocket.emit("leaveChannelRoom", selectedChannel._id);
    };
  }, [selectedChannel]);

  // Listen for realtime messages
  useEffect(() => {
    const handleChannelMessage = (message) => {
      setMessages((prev) => [...prev, message]);
    };

    channelSocket.on("channelMessage", handleChannelMessage);

    return () => {
      channelSocket.off("channelMessage", handleChannelMessage);
    };
  }, []);

  // Send message
  const handleSendMessage = (content) => {
    if (!selectedChannel || !user) return;

    channelSocket.emit("sendChannelMessage", {
      channelId: selectedChannel._id,
      senderId: user._id,
      content,
    });
  };

  if (!selectedChannel) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Collaboration Channels</h2>

          <p className="text-gray-500 mt-2">
            Select a channel to start chatting
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* HEADER */}
      <div className="p-4 border-b flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">#{selectedChannel.name}</h2>

          <p className="text-sm text-gray-500">
            {selectedChannel?.description}
          </p>
        </div>

        <button
          onClick={onShowMembers}
          className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
        >
          Members
        </button>
      </div>

      {/* MESSAGE AREA */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">No messages yet</div>
        ) : (
          messages.map((message) => (
            <div key={message._id} className="mb-4">
              <div className="font-semibold">
                {message.sender?.f_name ||
                  message.sender?.email ||
                  "Unknown User"}
              </div>

              <div className="bg-gray-100 rounded-lg p-3 mt-1 inline-block">
                {message.content}
              </div>
            </div>
          ))
        )}
      </div>

      {/* MESSAGE INPUT */}
      <ChannelMessageInput onSend={handleSendMessage} />
    </div>
  );
};

export default ChannelChatPanel;