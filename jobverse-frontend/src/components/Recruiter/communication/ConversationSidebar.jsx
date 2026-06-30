import { useState } from "react";

const ConversationSidebar = ({
  conversations = [],
  selectedConversation,
  setSelectedConversation,
  onlineUsers = [],
  currentUser,
  unreadCounts = {},
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredConversations = conversations.filter((conversation) =>
    conversation?.participants?.some((participant) =>
      participant?.name?.toLowerCase().includes(searchTerm.toLowerCase()),
    ),
  );

  return (
    <div className="w-[350px] bg-white border-r flex flex-col">
      {/* HEADER */}

      <div className="p-5 border-b">
        <h2 className="text-2xl font-bold">Communication Hub</h2>

        <p className="text-sm text-gray-500 mt-1">Enterprise ATS Messaging</p>
      </div>

      {/* SEARCH */}

      <div className="p-3 border-b">
        <input
          type="text"
          placeholder="Search conversations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* CONVERSATIONS */}

      <div className="flex-1 overflow-y-auto">
        {filteredConversations.map((conversation) => {
          const active = selectedConversation?._id === conversation._id;

          const participant =
            conversation?.participants?.find(
              (p) => p?._id !== currentUser?._id,
            ) || {};

          const isOnline =
            Array.isArray(onlineUsers) &&
            onlineUsers.includes(participant?._id);

          const unreadCount = unreadCounts?.[conversation._id] || 0;

          return (
            <button
              key={conversation._id}
              onClick={() => setSelectedConversation(conversation)}
              className={`w-full text-left p-4 border-b transition ${
                active ? "bg-blue-50" : "hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-3">
                {/* PROFILE */}

                <div className="relative">
                  <img
                    src={participant?.profilePicture || "/default-avatar.png"}
                    alt="profile"
                    className="w-12 h-12 rounded-full object-cover"
                  />

                  {isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                  )}
                </div>

                {/* CONTENT */}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm truncate">
                      {participant?.name || participant?.email || "Recruiter"}
                    </h3>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">ATS</span>

                      {unreadCount > 0 && (
                        <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                          {unreadCount}
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-gray-500 truncate mt-1">
                    {conversation?.lastMessage || "Start conversation"}
                  </p>

                  <p
                    className={`text-xs mt-1 ${
                      isOnline ? "text-green-500" : "text-gray-400"
                    }`}
                  >
                    {isOnline ? "Online" : "Offline"}
                  </p>
                </div>
              </div>
            </button>
          );
        })}

        {filteredConversations.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            No conversations found
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationSidebar;