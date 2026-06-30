import {
  MessageSquare,
  Briefcase,
  FileText,
  BarChart3,
  GraduationCap,
  Trash2,
  X,
} from "lucide-react";

const tools = [
  {
    key: "chat",
    label: "AI Chat",
    icon: MessageSquare,
  },
  {
    key: "jobs",
    label: "Job Recommendations",
    icon: Briefcase,
  },
  {
    key: "resume",
    label: "Resume Review",
    icon: FileText,
  },
  {
    key: "ats",
    label: "ATS Optimization",
    icon: BarChart3,
  },
  {
    key: "interview",
    label: "Interview Questions",
    icon: MessageSquare,
  },
  {
    key: "career",
    label: "Career Guidance",
    icon: GraduationCap,
  },
];

const AISidebar = ({
  open,
  onClose,
  onSelectTool,
  onClearChat,
  currentTool = "chat",
  conversations = [],
  currentConversationId,
  onSelectConversation,
  onNewChat,
}) => {
  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20 z-40" onClick={onClose} />

      {/* Sidebar */}
      <div
        className="
          absolute
          left-0
          top-0
          bottom-0
          w-80
          bg-white
          border-r
          shadow-xl
          z-50
          flex
          flex-col
        "
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b">
          <div>
            <h2 className="font-bold text-lg">AI Assistant</h2>
            <p className="text-xs text-gray-500">Enterprise AI Workspace</p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>

        {/* AI Tools */}
        <div className="p-4">
          <p className="text-xs uppercase text-gray-400 font-semibold mb-3">
            AI Tools
          </p>

          <div className="space-y-0.5">
            {tools.map((tool) => {
              const Icon = tool.icon;

              return (
                <button
                  key={tool.key}
                  onClick={() => {
                    onSelectTool(tool.key);
                    onClose();
                  }}
                  className={`w-full flex items-center gap-3 rounded-xl px-4 py-2.5 transition
                    ${
                      currentTool === tool.key
                        ? "bg-blue-50 text-blue-600 font-semibold"
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                >
                  <Icon size={18} />

                  <span>{tool.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t my-2" />

        {/* Recent Chats Placeholder */}
        {/* New Chat */}
        <div className="px-4 pt-4">
          <button
            onClick={() => {
              onNewChat();
              onClose();
            }}
            className="w-full rounded-xl bg-blue-600 text-white py-3 font-medium hover:bg-blue-700 transition"
          >
            + New Chat
          </button>
        </div>

        <div className="border-t mt-4 mb-2" />

        {/* Recent Chats */}
        {/* Recent Chats */}
        <div className="flex-1 min-h-0 px-4 py-3 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Recent Chats
            </p>

            <span className="text-xs text-gray-400">
              {conversations.length}
            </span>
          </div>

          {conversations.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-gray-200 p-6 text-center">
              <p className="font-medium text-gray-500">No conversations yet</p>

              <p className="text-xs text-gray-400 mt-2">
                Start a new AI conversation
              </p>
            </div>
          ) : (
            <div className="space-y-3 pb-6">
              {conversations.map((conversation) => {
                const active = currentConversationId === conversation.id;

                const toolName =
                  conversation.type === "resume"
                    ? "Resume Review"
                    : conversation.type === "jobs"
                      ? "Job Recommendations"
                      : conversation.type === "ats"
                        ? "ATS Optimization"
                        : conversation.type === "career"
                          ? "Career Guidance"
                          : conversation.type === "interview"
                            ? "Interview Questions"
                            : "AI Chat";

                return (
                  <button
                    key={conversation.id}
                    onClick={() => {
                      onSelectConversation(conversation.id);
                      onClose();
                    }}
                    className={`
              w-full
              rounded-2xl
              border
              p-4
              text-left
              transition-all
              duration-200

              ${
                active
                  ? "border-blue-500 bg-blue-50 shadow-md"
                  : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-md hover:-translate-y-0.5"
              }
            `}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-gray-900 truncate text-[15px]">
                          {conversation.title}
                        </h3>

                        <p className="mt-2 text-xs font-medium text-blue-600">
                          {toolName}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {new Date(conversation.updatedAt).toLocaleString()}
                        </p>
                      </div>

                      {active && (
                        <div className="h-3 w-3 rounded-full bg-blue-600 mt-1"></div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>da

        <div className="mt-auto border-t p-4">
          <button
            onClick={onClearChat}
            className="
    w-full
    flex
    items-center
    gap-3
    rounded-xl
    border
    border-red-200
    text-red-600
    hover:bg-red-50
    px-4
    py-3
    transition
  "
          >
            <Trash2 size={18} />
            Clear Chat
          </button>
        </div>
      </div>
    </>
  );
};

export default AISidebar;
