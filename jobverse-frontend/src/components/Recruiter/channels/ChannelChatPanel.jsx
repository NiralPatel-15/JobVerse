import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { getChannelMessages } from "../../../services/channelService";

import channelSocket from "../../../socket/channelSocket";

import ChannelMessageInput from "./ChannelMessageInput";

const ChannelChatPanel = ({ selectedChannel }) => {
  const [messages, setMessages] = useState([]);

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!selectedChannel) return;

    const fetchMessages = async () => {
      try {
        const res = await getChannelMessages(selectedChannel._id);

        setMessages(res.data.messages || []);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMessages();
  }, [selectedChannel]);

  useEffect(() => {
    if (!selectedChannel) return;

    channelSocket.emit("joinChannelRoom", selectedChannel._id);

    return () => {
      channelSocket.emit("leaveChannelRoom", selectedChannel._id);
    };
  }, [selectedChannel]);

  useEffect(() => {
    const handleChannelMessage = (message) => {
      setMessages((prev) => [...prev, message]);
    };

    channelSocket.on("channelMessage", handleChannelMessage);

    return () => {
      channelSocket.off("channelMessage", handleChannelMessage);
    };
  }, []);

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
      <div className="flex-1 flex items-center justify-center">
        Select a Channel
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* HEADER */}
      <div className="p-4 border-b bg-white">
        <h2 className="text-xl font-semibold">#{selectedChannel.name}</h2>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="text-gray-500 text-center mt-10">No messages yet</div>
        ) : (
          messages.map((message) => (
            <div key={message._id} className="mb-4">
              <div className="font-semibold">
                {message.sender?.f_name ||
                  message.sender?.email ||
                  "Unknown User"}
              </div>

              <div>{message.content}</div>
            </div>
          ))
        )}
      </div>

      <ChannelMessageInput onSend={handleSendMessage} />
    </div>
  );
};

export default ChannelChatPanel;
