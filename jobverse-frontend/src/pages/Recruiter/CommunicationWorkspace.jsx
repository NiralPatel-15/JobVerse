import { useEffect, useState } from "react";

import axios from "../../api/axiosConfig";

import ConversationSidebar from "../../components/Recruiter/communication/ConversationSidebar";

import EnterpriseChatPanel from "../../components/Recruiter/communication/EnterpriseChatPanel";

import communicationSocket from "../../socket/communicationSocket";

import ConversationSearchBar from "../../components/Recruiter/communication/ConversationSearchBar";

const CommunicationWorkspace = () => {
  const [conversations, setConversations] = useState([]);

  const [searchResults, setSearchResults] = useState([]);

  const [selectedConversation, setSelectedConversation] = useState(null);

  const [currentUser, setCurrentUser] = useState(null);

  const [onlineUsers, setOnlineUsers] = useState([]);

  const [typingUsers, setTypingUsers] = useState({});

  const [unreadCounts, setUnreadCounts] = useState({});

  const [searchTerm, setSearchTerm] = useState("");

  // =====================================
  // FETCH USER + SOCKET EVENTS
  // =====================================

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/auth/me");

        const user = res.data.user;

        setCurrentUser(user);

        communicationSocket.emit("join-user", user._id);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUser();

    communicationSocket.on("online-users", (users) => {
      setOnlineUsers(users);
    });

    communicationSocket.on("typing", ({ conversationId, userId }) => {
      setTypingUsers((prev) => ({
        ...prev,
        [conversationId]: userId,
      }));
    });

    communicationSocket.on("stop-typing", ({ conversationId }) => {
      setTypingUsers((prev) => {
        const updated = { ...prev };

        delete updated[conversationId];

        return updated;
      });
    });

    communicationSocket.on(
      "unread-count-updated",
      ({ conversationId, unreadCount }) => {
        setUnreadCounts((prev) => ({
          ...prev,
          [conversationId]: unreadCount,
        }));
      },
    );

    return () => {
      communicationSocket.off("online-users");
      communicationSocket.off("typing");
      communicationSocket.off("stop-typing");
      communicationSocket.off("unread-count-updated");
    };
  }, []);

  // =====================================
  // FETCH CONVERSATIONS
  // =====================================

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await axios.get("/communication/conversations");

        setConversations(res.data);

        if (res.data.length > 0) {
          setSelectedConversation(res.data[0]);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchConversations();
  }, []);

  // =====================================
  // SEARCH CONVERSATIONS
  // =====================================

  useEffect(() => {
    if (!searchTerm.trim()) return;

    const handler = setTimeout(async () => {
      try {
        const res = await axios.get(
          `/communication/search?query=${searchTerm}`,
        );

        setSearchResults(res.data.conversations || []);
      } catch (error) {
        console.error(error);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    const fetchUnreadCounts = async () => {
      try {
        const res = await axios.get("/communication/unread-counts");

        const countsMap = {};

        if (res.data?.unreadCounts) {
          res.data.unreadCounts.forEach((item) => {
            countsMap[item.conversationId] = item.unreadCount;
          });
        }

        setUnreadCounts(countsMap);
      } catch (error) {
        console.error(error);
      }
    };

    if (currentUser) {
      fetchUnreadCounts();
    }
  }, [currentUser]);

  useEffect(() => {
    const markConversationRead = async () => {
      if (!selectedConversation) return;

      try {
        await axios.patch(
          `/communication/conversations/${selectedConversation._id}/read`,
        );

        setUnreadCounts((prev) => ({
          ...prev,
          [selectedConversation._id]: 0,
        }));
      } catch (error) {
        console.error(error);
      }
    };

    markConversationRead();
  }, [selectedConversation]);
  
  const displayedConversations = searchTerm.trim()
    ? searchResults
    : conversations;

  return (
    <div className="h-screen bg-gray-100 flex overflow-hidden">
      {/* SIDEBAR */}

      <div className="w-[350px] bg-white border-r flex flex-col">
        <ConversationSearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        <ConversationSidebar
          conversations={displayedConversations}
          selectedConversation={selectedConversation}
          setSelectedConversation={setSelectedConversation}
          onlineUsers={onlineUsers}
          currentUser={currentUser}
          unreadCounts={unreadCounts}
        />
      </div>

      {/* CHAT PANEL */}

      <div className="flex-1 p-4">
        {selectedConversation && currentUser && (
          <EnterpriseChatPanel
            conversationId={selectedConversation._id}
            currentUser={currentUser}
            typingUsers={typingUsers}
          />
        )}
      </div>
    </div>
  );
};

export default CommunicationWorkspace;