import React, { useEffect, useState, useCallback } from "react";
import { useRef } from "react";
import Card from "../../components/Card/Card";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Conversation from "../../components/Conversation/Conversation";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ImageIcon from "@mui/icons-material/Image";
import Advertisment from "../../components/Advertisment/Advertisment";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import socket from "../../socket";

const Messages = () => {

  const [conversations, setConversations] = useState([]);
  const [ownData, setOwnData] = useState(null);
  const [activeConvId, setActiveConcId] = useState(null);
  const [selectedConvDetails, setSelectedConvDetails] = useState(null);

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageLink, setImageLink] = useState(null);
  const [messageText, setMessageText] = useState("");

  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = React.useRef(null);
  const [typingUser, setTypingUser] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (activeConvId) {
      socket.emit("joinConversation", activeConvId);
    }
  }, [activeConvId]);
  
  const handleSelectedConv = (id, item) => {
    setActiveConcId(id);
    const otherUser = item.members.find((user) => user._id !== ownData?._id);
    setSelectedConvDetails(otherUser);
  };

  const fetchMessages = useCallback(async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/message/${activeConvId}`,
        { withCredentials: true }
      );
      setMessages(Array.isArray(res.data.messages) ? res.data.messages : []);
    } catch (err) {
      console.log(err);
      toast.error("something went wrong");
    }
  }, [activeConvId]);

  useEffect(() => {
    if (activeConvId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchMessages();
    }
  }, [activeConvId, fetchMessages]);

  const fetchConversationOnLoad = async (ownId) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/conversation/get-conversation`,
        { withCredentials: true }
      );

      const convs = res.data.conversations || [];
      setConversations(convs);

      if (convs.length > 0) {
        setActiveConcId(convs[0]._id);
        const otherUser = convs[0].members.find(
          (user) => user._id !== ownId
        );
        setSelectedConvDetails(otherUser);
      }
    } catch (err) {
      console.log(err);
      toast.error("something went wrong");
    }
  };

  const handleInputImage = async (e) => {
    const files = e.target.files;
    const data = new FormData();

    data.append("file", files[0]);
    data.append("upload_preset", "linkedInClone");

    setLoading(true);

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dllvqskon/image/upload",
        data
      );

      setImageLink(response.data.url);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (loading) return;
    
    if (!ownData?._id) return;

    if (!messageText.trim() && !imageLink) return; // ✅ prevent empty

    if (!selectedConvDetails?._id) return; // ✅ safety

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/message/`,
        {
          conversation: activeConvId,
          message: messageText,
          picture: imageLink,
        },
        { withCredentials: true },
      );

      setMessages((prev) => [...prev, res.data]);

      socket.emit("sendMessage", {
        sender: {
          _id: ownData._id,
          f_name: ownData.f_name || ownData.firstname,

          profilePic: ownData.profilePic,
        },

        receiverId: selectedConvDetails._id,

        text: messageText,
      });

      setMessageText("");
      setImageLink(null);
    } catch (err) {
      console.log(err);
      toast.error("something went wrong");
    }
  };

  // ✅ Load user
  useEffect(() => {
    const userData = localStorage.getItem("userInfo");
    const parsedUser = userData ? JSON.parse(userData) : null;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOwnData(parsedUser);

    if (parsedUser?._id) {
      fetchConversationOnLoad(parsedUser._id);
    }
  }, []);

  // ✅ Add user to socket
  useEffect(() => {
    socket.on("getMessage", (data) => {
      console.log("Incoming:", data);

      if (String(selectedConvDetails?._id) === String(data.sender?._id)) {
        setMessages((prev) => [
          ...prev,
          {
            sender: data.sender,
            text: data.text,
            createdAt: data.createdAt,
          },
        ]);
      }
    });

    return () => {
      socket.off("getMessage");
    };
  }, [selectedConvDetails]);

  // ✅ RECEIVE MESSAGE (FIXED - no nesting)
  useEffect(() => {
    socket.on("getMessage", (data) => {
      console.log("Incoming:", data);

      if (String(selectedConvDetails?._id) === String(data.sender?._id)) {
        setMessages((prev) => [
          ...prev,
          {
            sender: data.sender,
            text: data.text,
            createdAt: data.createdAt,
          },
        ]);
      }
    });

    return () => {
      socket.off("getMessage");
    };
  }, [selectedConvDetails]);

  // ✅ GET ONLINE USERS (SEPARATE)
  useEffect(() => {
    socket.on("getUsers", (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.off("getUsers");
    };
  }, []);

  useEffect(() => {
    socket.on("typing", ({ senderId }) => {
      if (senderId !== ownData?._id) {
        setIsTyping(true);

        // ✅ set user name
        if (selectedConvDetails?._id === senderId) {
          setTypingUser(selectedConvDetails?.f_name);
        }
      }
    });

    socket.on("stopTyping", ({ senderId }) => {
      if (senderId !== ownData?._id) {
        setIsTyping(false);
        setTypingUser(null);
      }
    });

    return () => {
      socket.off("typing");
      socket.off("stopTyping");
    };
  }, [ownData, selectedConvDetails]);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  return (
    <div className="px-5 xl:px-40 w-full mt-16 bg-gray-100">
      <div className="flex gap-5 items-start">
        <div className="w-full md:w-[70%] pt-5">
          <Card padding={0}>
            <div className="px-5 py-3 font-semibold text-lg border-b border-gray-300">
              Messaging
            </div>
            <div className="px-5 py-3 border-b border-gray-300">
              <div className="bg-green-800 hover:bg-green-900 text-white px-3 py-1 rounded-2xl w-fit flex items-center gap-2 font-semibold cursor-pointer">
                Focused
                <ArrowDropDownIcon />
              </div>
            </div>

            <div className="flex h-[75vh]">
              <div className="w-[40%] border-r border-gray-300 overflow-y-auto">
                {conversations.map((item, index) => {
                  return (
                    <Conversation
                      activeConvId={activeConvId}
                      handleSelectedConv={handleSelectedConv}
                      item={item}
                      key={item._id || index}
                      ownData={ownData}
                      onlineUsers={onlineUsers}
                    />
                  );
                })}
              </div>

              {/* ✅ REST UI SAME AS YOURS — NO CHANGE */}

              <div className="w-[60%] flex flex-col">
                <div className="px-4 py-3 border-b border-gray-300 flex justify-between items-center bg-white">
                  <div>
                    <p className="text-sm font-semibold">
                      {selectedConvDetails?.f_name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {selectedConvDetails?.headline}
                    </p>
                  </div>
                  <MoreHorizIcon />
                </div>

                <div className="flex-1 overflow-y-auto">
                  <div className="px-6 py-6 border-b border-gray-300">
                    <img
                      src={selectedConvDetails?.profilePic || "/user.png"}
                      alt="user"
                      className="w-14 h-14 rounded-full mb-3"
                    />
                    <p className="text-sm font-semibold">
                      {selectedConvDetails?.f_name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {selectedConvDetails?.headline}
                    </p>
                  </div>

                  {messages?.length > 0 ? (
                    messages.map((item, index) => (
                      <div
                        key={item._id || index}
                        className="flex gap-3 p-4 border-b border-gray-300"
                      >
                        <img
                          className="w-8 h-8 rounded-full"
                          src={item?.sender?.profilePic || "/user.png"}
                          alt="user"
                        />
                        <div>
                          <div className="font-semibold">
                            {item?.sender?.f_name || item?.sender?.firstname}
                          </div>
                          <div className="mt-2">{item?.text}</div>

                          {item?.picture && (
                            <div className="my-2">
                              <img
                                className="w-60 h-45 rounded mt-2"
                                src={item?.picture}
                                alt="message"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-gray-500">No messages yet</div>
                  )}
                  <div ref={messagesEndRef}></div>
                </div>

                {isTyping && (
                  <div className="px-3 py-2 text-sm text-gray-500 italic flex items-center gap-2">
                    <span>{typingUser} is typing</span>

                    <div className="flex gap-1">
                      <span className="dot"></span>
                      <span className="dot"></span>
                      <span className="dot"></span>
                    </div>
                  </div>
                )}

                <div className="p-3 border-t border-gray-300 bg-white">
                  <textarea
                    value={messageText}
                    onChange={(e) => {
                      setMessageText(e.target.value);

                      socket.emit("typing", {
                        conversationId: activeConvId,
                        senderId: ownData?._id,
                      });

                      if (typingTimeoutRef.current) {
                        clearTimeout(typingTimeoutRef.current);
                      }

                      typingTimeoutRef.current = setTimeout(() => {
                        socket.emit("stopTyping", {
                          conversationId: activeConvId,
                          senderId: ownData?._id,
                        });
                      }, 1000);
                    }}
                    rows={3}
                    className="bg-gray-200 outline-none rounded-xl text-sm w-full p-3"
                    placeholder="Write a message"
                  />
                </div>

                <div className="p-3 flex justify-between items-center border-t border-gray-200 bg-white">
                  <div>
                    <label htmlFor="messageImage" className="cursor-pointer">
                      <ImageIcon />
                    </label>
                    <input
                      id="messageImage"
                      type="file"
                      onChange={handleInputImage}
                      className="hidden"
                    />
                  </div>

                  {!loading && (
                    <div
                      onClick={handleSendMessage}
                      className="px-4 py-1 cursor-pointer rounded-2xl bg-blue-950 text-white"
                    >
                      Send
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="my-5 sticky top-20">
          <Advertisment />
        </div>
      </div>
    </div>
  );
};

export default Messages;