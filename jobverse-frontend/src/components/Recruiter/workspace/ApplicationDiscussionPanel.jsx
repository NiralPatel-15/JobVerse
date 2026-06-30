import { useEffect, useState, useCallback } from "react";

import axios from "../../../api/axiosConfig";

import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_BACKEND_URL);

const ApplicationDiscussionPanel = ({ applicationId }) => {
  const [discussions, setDiscussions] = useState([]);

  const [message, setMessage] = useState("");

  const [replyInputs, setReplyInputs] = useState({});

  // =====================================
  // FETCH DISCUSSIONS
  // =====================================

  const fetchDiscussions = useCallback(async () => {
    try {
      const { data } = await axios.get(
        `/application-discussions/${applicationId}`,
      );

      setDiscussions(data.discussions);
    } catch (error) {
      console.log(error);
    }
  }, [applicationId]);

  // =====================================
  // SOCKET + INITIAL FETCH
  // =====================================

  useEffect(() => {
    const initializeDiscussion = async () => {
      await fetchDiscussions();

      socket.emit("joinApplicationRoom", applicationId);
    };

    initializeDiscussion();

    const handleDiscussionAdded = (discussion) => {
      setDiscussions((prev) => [discussion, ...prev]);
    };

    const handleReplyAdded = (updatedDiscussion) => {
      setDiscussions((prev) =>
        prev.map((discussion) =>
          discussion._id === updatedDiscussion._id
            ? updatedDiscussion
            : discussion,
        ),
      );
    };

    socket.on("discussionAdded", handleDiscussionAdded);

    socket.on("discussionReplyAdded", handleReplyAdded);

    return () => {
      socket.off("discussionAdded", handleDiscussionAdded);

      socket.off("discussionReplyAdded", handleReplyAdded);
    };
  }, [applicationId, fetchDiscussions]);

  // =====================================
  // ADD DISCUSSION
  // =====================================

  const handleAddDiscussion = async () => {
    if (!message.trim()) return;

    try {
      await axios.post("/application-discussions", {
        applicationId,
        message,
      });

      setMessage("");

      // Immediately reload discussions
      fetchDiscussions();

      setMessage("");
    } catch (error) {
      console.log(error);
    }
  };

  // =====================================
  // ADD REPLY
  // =====================================

  const handleReply = async (discussionId) => {
    const reply = replyInputs[discussionId];

    if (!reply?.trim()) return;

    try {
      await axios.post(`/application-discussions/reply/${discussionId}`, {
        message: reply,
      });

      fetchDiscussions();

      setReplyInputs((prev) => ({
        ...prev,
        [discussionId]: "",
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const highlightMentions = (text) => {
    return text.split(/(@\w+)/g).map((part, index) =>
      part.startsWith("@") ? (
        <span key={index} className="text-blue-600 font-semibold">
          {part}
        </span>
      ) : (
        part
      ),
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border p-5">
      <h2 className="text-lg font-semibold mb-4">Recruiter Discussions</h2>

      {/* Add Discussion */}

      <div className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="Start discussion..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black"
        />

        <button
          onClick={handleAddDiscussion}
          className="bg-black hover:bg-gray-800 transition text-white px-5 rounded-xl"
        >
          Send
        </button>
      </div>

      {/* Discussion List */}

      <div className="space-y-5 max-h-[700px] overflow-y-auto pr-1">
        {discussions.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500">No discussions yet</p>

            <p className="text-sm text-gray-400 mt-1">
              Start collaboration with your hiring team
            </p>
          </div>
        )}
        {discussions.map((discussion) => (
          <div
            key={discussion._id}
            className="border rounded-2xl p-4 bg-gray-50"
          >
            {/* Sender */}

            <div className="flex items-center gap-3 mb-3">
              <img
                src={discussion.sender?.profilePic}
                alt=""
                className="w-10 h-10 rounded-full object-cover"
              />

              <div>
                <h4 className="font-semibold">{discussion.sender?.f_name}</h4>

                <div className="flex items-center gap-2">
                  <p className="text-xs text-gray-500 capitalize">
                    {discussion.sender?.role}
                  </p>

                  <span className="text-xs text-gray-400">
                    • {new Date(discussion.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Message */}

            <p className="text-sm text-gray-700">
              {highlightMentions(discussion.message)}
            </p>

            {/* Replies */}

            <div className="mt-4 ml-6 space-y-3">
              {discussion.replies.map((reply) => (
                <div key={reply._id} className="bg-white border rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <img
                      src={reply.sender?.profilePic}
                      alt=""
                      className="w-8 h-8 rounded-full object-cover"
                    />

                    <div>
                      <span className="font-medium text-sm block">
                        {reply.sender?.f_name}
                      </span>

                      <span className="text-xs text-gray-400">
                        {new Date(reply.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-700">
                    {highlightMentions(reply.message)}
                  </p>
                </div>
              ))}
            </div>

            {/* Reply Input */}

            <div className="flex gap-2 mt-4">
              <input
                type="text"
                placeholder="Write reply..."
                value={replyInputs[discussion._id] || ""}
                onChange={(e) =>
                  setReplyInputs((prev) => ({
                    ...prev,
                    [discussion._id]: e.target.value,
                  }))
                }
                className="flex-1 border rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black"
              />

              <button
                onClick={() => handleReply(discussion._id)}
                className="bg-black hover:bg-gray-800 transition text-white px-4 rounded-xl text-sm"
              >
                Reply
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApplicationDiscussionPanel;
