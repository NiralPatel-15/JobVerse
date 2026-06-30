import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  FileText,
  BarChart3,
  GraduationCap,
  MessageSquare,
  Sparkles,
  X,
  Send,
  Copy,
  Check,
  RotateCcw,
  Menu,
} from "lucide-react";
import { useMemo } from "react";
import MarkdownMessage from "./MarkdownMessage";
import AISidebar from "./AISidebar";

import { chatAI, recommendJobs, resumeReview } from "../../services/aiService";
import { toast } from "react-toastify";

const CONVERSATIONS_STORAGE_KEY = "jobverse_ai_conversations";
const AIAssistantModal = ({ onClose }) => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Thinking...");
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [lastPrompt, setLastPrompt] = useState("");
  const [regenerating, setRegenerating] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentTool, setCurrentTool] = useState("chat");
  const [showClearDialog, setShowClearDialog] = useState(false);
  const navigate = useNavigate();

  const [conversations, setConversations] = useState(() => {
    const saved = localStorage.getItem(CONVERSATIONS_STORAGE_KEY);

    try {
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [currentConversationId, setCurrentConversationId] = useState(null);

  const currentConversation =
    conversations.find((c) => c.id === currentConversationId) || null;

  const chat = useMemo(() => {
    return currentConversation?.messages ?? [];
  }, [currentConversation]);

  const [showQuickActions, setShowQuickActions] = useState(chat.length === 0);

  useEffect(() => {
    localStorage.setItem(
      CONVERSATIONS_STORAGE_KEY,
      JSON.stringify(conversations),
    );
  }, [conversations]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }, 100);

    return () => clearTimeout(timeout);
  }, [chat, loading]);

  const quickActions = [
    {
      title: "Recommend Jobs",
      icon: <Briefcase size={18} />,
    },
    {
      title: "Resume Review",
      icon: <FileText size={18} />,
    },
    {
      title: "ATS Optimization",
      icon: <BarChart3 size={18} />,
    },
    {
      title: "Interview Questions",
      icon: <MessageSquare size={18} />,
    },
    {
      title: "Career Guidance",
      icon: <GraduationCap size={18} />,
    },
  ];

  const handleToolSelect = (tool) => {
    setCurrentTool(tool);

    switch (tool) {
      case "jobs":
        handleRecommendJobs();
        break;

      case "resume":
        fileInputRef.current?.click();
        break;

      case "ats":
        sendMessage("ATS Optimization");
        break;

      case "interview":
        sendMessage("Interview Questions");
        break;

      case "career":
        sendMessage("Career Guidance");
        break;

      default:
        break;
    }
  };

  const createConversation = (firstMessage = "") => {
    const conversation = {
      id: crypto.randomUUID(),
      title: firstMessage.substring(0, 35) || "New Chat",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [],
    };

    setConversations((prev) => [conversation, ...prev]);

    setCurrentConversationId(conversation.id);

    return conversation;
  };

  const updateConversationMessages = (conversationId, updater) => {
    setConversations((prev) =>
      prev.map((conversation) => {
        if (conversation.id !== conversationId) return conversation;

        const messages =
          typeof updater === "function"
            ? updater(conversation.messages)
            : updater;

        return {
          ...conversation,
          messages,
          updatedAt: new Date().toISOString(),
        };
      }),
    );
  };

  const loadConversation = (conversationId) => {
    setCurrentConversationId(conversationId);
    setShowQuickActions(false);
  };

  const handleNewChat = () => {
    const conversation = createConversation();

    setCurrentConversationId(conversation.id);
    setMessage("");
    setShowQuickActions(true);
  };

  const clearChat = () => {
    if (currentConversationId) {
      const updated = conversations.filter(
        (conversation) => conversation.id !== currentConversationId,
      );

      setConversations(updated);
    }

    setCurrentConversationId(null);
    setMessage("");
    setLastPrompt("");
    setCurrentTool("chat");
    setShowQuickActions(true);
    setShowClearDialog(false);
  };

  const sendMessage = async (customMessage = null) => {
    const finalMessage = customMessage || message;

    if (!finalMessage.trim() || loading) return;

    setLastPrompt(finalMessage);

    let conversationId = currentConversationId;

    // Create new conversation if none is selected
    if (!conversationId) {
      const conversation = createConversation(finalMessage);
      conversationId = conversation.id;
    }

    const userMsg = {
      sender: "user",
      text: finalMessage,
    };
const updatedUserMessages = [...chat, userMsg];

updateConversationMessages(conversationId, updatedUserMessages);

    setLoading(true);
    setLoadingMessage("JobVerse AI is thinking...");
    setShowQuickActions(false);

    try {
      const res = await chatAI(finalMessage);

      const updatedMessages = [
        ...updatedUserMessages,
        {
          sender: "ai",
          text: res.reply,
        },
      ];

      updateConversationMessages(conversationId, updatedMessages);
    } catch (error) {
      console.error(error);

      const updatedMessages = [
        ...updatedUserMessages,
        {
          sender: "ai",
          text: " Failed to connect with AI assistant.",
        },
      ];

      updateConversationMessages(conversationId, updatedMessages);
    }

    setLoading(false);
    setMessage("");
  };

  const handleRecommendJobs = async () => {
    let conversationId = currentConversationId;

    if (!conversationId) {
      const conversation = createConversation("Job Recommendations");
      conversationId = conversation.id;
    }

    try {
      setLoadingMessage("Finding the best jobs for you...");
      setLoading(true);
      setShowQuickActions(false);

      const data = await recommendJobs();

      const updatedMessages = [
        ...chat,
        {
          sender: "user",
          text: "Recommend Jobs",
        },
        {
          sender: "ai",
          text: "# Job Recommendations\n\nBased on your profile, here are your best matching jobs.",
        },
        {
          sender: "jobs",
          jobs: data.recommendations || [],
        },
      ];

      updateConversationMessages(conversationId, updatedMessages);
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  const handleResumeReview = async (event) => {

    let conversationId = currentConversationId;

    if (!conversationId) {
      const conversation = createConversation("Resume Review");
      conversationId = conversation.id;
    }
    const file = event.target.files?.[0];

    if (!file) return;

    setLoadingMessage("Analyzing your resume...");
    setLoading(true);
    setShowQuickActions(false);

    try {
      const data = await resumeReview(file);

      const updatedMessages = [
        ...chat,
        {
          sender: "ai",
          text: data.review,
        },
      ];

      updateConversationMessages(conversationId, updatedMessages);
    } catch (error) {
      console.error(error);

      const updatedMessages = [
        ...chat,
        {
          sender: "ai",
          text: "Unable to analyze your resume. Please upload a valid PDF or DOCX file.",
        },
      ];

      updateConversationMessages(conversationId, updatedMessages);
    }

    setLoading(false);

    // Allow selecting the same file again later
    event.target.value = "";
  };

  const getMatchColor = (score) => {
    if (score >= 80) return "bg-green-100 text-green-700";

    if (score >= 60) return "bg-yellow-100 text-yellow-700";

    return "bg-red-100 text-red-700";
  };

  const copyMessage = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);

      setCopiedIndex(index);

      toast.success("Copied to clipboard");

      setTimeout(() => {
        setCopiedIndex(null);
      }, 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const regenerateResponse = async () => {
    if (!lastPrompt || regenerating) return;

    setRegenerating(true);
    setLoadingMessage("Regenerating response...");
    setLoading(true);

    try {
      const res = await chatAI(lastPrompt);

      ((prev) => {
        const updated = [...prev];

        // Replace the last AI message
        for (let i = updated.length - 1; i >= 0; i--) {
          if (updated[i].sender === "ai") {
            updated[i] = {
              sender: "ai",
              text: res.reply,
            };
            break;
          }
        }

        return updated;
      });
    } catch {
      toast.setChaterror("Failed to regenerate response");
    }

    setLoading(false);
    setRegenerating(false);
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-[9999] flex justify-end">
      <div className="relative w-[900px] max-w-[95vw] h-full bg-white shadow-2xl flex flex-col">
        <AISidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          currentTool={currentTool}
          onSelectTool={handleToolSelect}
          onClearChat={() => setShowClearDialog(true)}
          conversations={conversations}
          currentConversationId={currentConversationId}
          onSelectConversation={loadConversation}
          onNewChat={handleNewChat}
        />
        {/* HEADER */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white border-b border-white/10 shadow-lg">
          <div className="flex items-center justify-between px-6 py-4">
            {/* Left */}
            <div className="flex items-center gap-4">
              {/* Hamburger */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="
          h-11
          w-11
          rounded-xl
          bg-white/10
          hover:bg-white/20
          transition
          flex
          items-center
          justify-center
        "
              >
                <Menu size={22} />
              </button>

              {/* Logo + Title */}
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles size={22} className="text-blue-200" />

                  <h2 className="text-2xl font-bold tracking-tight">
                    JobVerse AI
                  </h2>

                  <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-medium text-emerald-200 border border-emerald-400/30">
                    Online
                  </span>
                </div>

                <p className="mt-1 text-sm text-blue-100">
                  Career Copilot • Resume • ATS • Jobs • Interviews
                </p>
              </div>
            </div>

            {/* Right */}
            <button
              onClick={onClose}
              className="
        h-11
        w-11
        rounded-xl
        hover:bg-white/15
        transition
        flex
        items-center
        justify-center
      "
            >
              <X size={22} />
            </button>
          </div>
        </div>

        {/* WELCOME CARD */}
        {/* HOME */}
        {chat.length === 0 && showQuickActions && (
          <div className="flex-1 flex flex-col justify-center items-center px-10 py-16 bg-gray-50">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg mb-6">
              <Sparkles size={30} className="text-white" />
            </div>

            <h2 className="text-3xl font-bold text-gray-900">JobVerse AI</h2>

            <p className="mt-2 text-gray-500 text-center max-w-lg">
              Your AI Career Copilot. Get resume reviews, ATS optimization,
              interview preparation, career guidance, and personalized job
              recommendations.
            </p>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
              {quickActions.map((action) => (
                <button
                  key={action.title}
                  onClick={() => {
                    if (action.title === "Recommend Jobs") {
                      handleRecommendJobs();
                    } else if (action.title === "Resume Review") {
                      fileInputRef.current?.click();
                    } else {
                      sendMessage(action.title);
                    }
                  }}
                  className="group rounded-2xl border bg-white p-5 text-left hover:border-blue-500 hover:shadow-lg transition-all"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="rounded-xl bg-blue-50 p-3 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition">
                      {action.icon}
                    </div>

                    <h4 className="font-semibold">{action.title}</h4>
                  </div>

                  <p className="text-sm text-gray-500">
                    Start instantly with AI assistance.
                  </p>
                </button>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {[
                "Review my resume",
                "Find remote jobs",
                "Prepare for HR interview",
                "Improve ATS score",
              ].map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => sendMessage(prompt)}
                  className="rounded-full border px-4 py-2 text-sm hover:bg-blue-50 hover:border-blue-500 transition"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        <input
          disabled={loading}
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleResumeReview}
          className="hidden disabled:bg-gray-100 disabled:cursor-not-allowed"
        />

        {/* CHAT AREA */}
        {chat.length > 0 && (
          <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6 bg-gray-50">
            {chat.map((msg, index) => {
              if (msg.sender === "jobs") {
                return (
                  <div key={index} className="space-y-3 mb-4">
                    {msg.jobs.map((job) => (
                      <div
                        key={job._id}
                        className="bg-white border rounded-xl p-4 shadow-sm hover:border-blue-500 transition"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-lg">
                              {job.title}
                            </h4>

                            <p className="text-sm text-gray-500">
                              {job.company}
                            </p>

                            <p className="text-sm text-gray-500">
                              {job.location}
                            </p>
                          </div>

                          <div
                            className={`
    inline-flex
    items-center
    justify-center
    px-3
    py-1
    rounded-full
    text-xs
    font-semibold
    whitespace-nowrap
    h-8
    ${getMatchColor(job.matchScore)}
  `}
                          >
                            {job.matchScore}% Match
                          </div>
                        </div>

                        {job.matchedSkills?.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {job.matchedSkills.map((skill) => (
                              <span
                                key={skill}
                                className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="mt-4 flex gap-2">
                          <button
                            onClick={() => {
                              onClose();
                              setTimeout(
                                () => navigate(`/job/${job._id}`),
                                100,
                              );
                            }}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                          >
                            View Job
                          </button>

                          <button
                            onClick={() => {
                              onClose();
                              setTimeout(
                                () => navigate(`/apply/${job._id}`),
                                100,
                              );
                            }}
                            className="border border-green-600 text-green-600 px-4 py-2 rounded-lg"
                          >
                            Apply Now
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              }

              return (
                <div
                  key={index}
                  className={`mb-6 flex ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`relative ${
                      msg.sender === "user"
                        ? "inline-block max-w-fit rounded-2xl bg-blue-600 text-white shadow-lg px-5 py-3"
                        : "w-full bg-white border border-gray-200 shadow-md group rounded-2xl p-6"
                    }`}
                  >
                    {msg.sender === "ai" && (
                      <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                        <button
                          onClick={() => regenerateResponse()}
                          className="bg-gray-100 hover:bg-gray-200 rounded-lg p-2"
                          title="Regenerate"
                        >
                          <RotateCcw size={16} />
                        </button>

                        <button
                          onClick={() => copyMessage(msg.text, index)}
                          className="bg-gray-100 hover:bg-gray-200 rounded-lg p-2"
                          title="Copy"
                        >
                          {copiedIndex === index ? (
                            <Check size={16} className="text-green-600" />
                          ) : (
                            <Copy size={16} />
                          )}
                        </button>
                      </div>
                    )}

                    {msg.sender === "user" ? (
                      <span className="text-white font-medium whitespace-pre-wrap">
                        {msg.text}
                      </span>
                    ) : (
                      <>
                        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100">
                          <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
                            <Sparkles size={18} className="text-white" />
                          </div>

                          <div>
                            <h4 className="font-semibold text-gray-900">
                              JobVerse AI
                            </h4>

                            <p className="text-xs text-gray-500">
                              AI Career Copilot
                            </p>
                          </div>
                        </div>

                        <MarkdownMessage content={msg.text} />
                      </>
                    )}
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex items-start gap-3 mb-4">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold">
                  AI
                </div>

                <div className="bg-white border rounded-2xl shadow-sm px-4 py-3 max-w-md">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"></span>
                      <span
                        className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></span>
                      <span
                        className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"
                        style={{ animationDelay: "0.4s" }}
                      ></span>
                    </div>

                    <span className="text-sm font-medium text-blue-700">
                      JobVerse AI
                    </span>
                  </div>

                  <p className="text-sm text-gray-600">{loadingMessage}</p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* INPUT */}
        <div className="border-t p-4">
          <div className="flex gap-2">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Ask about jobs, ATS score, resume, interview..."
              className="
                flex-1
                border
                rounded-xl
                px-4
                py-3
                focus:outline-none
                focus:ring-2
                focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed
              "
            />

            <button
              disabled={loading || !message.trim()}
              onClick={() => sendMessage()}
              className="
    bg-blue-600
    text-white
    px-5
    rounded-xl
    hover:bg-blue-700
    transition
    disabled:opacity-50
    disabled:cursor-not-allowed
  "
            >
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <Send size={18} />
              )}
            </button>
          </div>
        </div>
      </div>

      {showClearDialog && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-[100]">
          <div className="w-[420px] rounded-2xl bg-white shadow-2xl p-6">
            <h3 className="text-xl font-bold">Clear Conversation?</h3>

            <p className="mt-2 text-gray-500">
              This will permanently remove the current conversation. This action
              cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowClearDialog(false)}
                className="px-5 py-2 rounded-xl border"
              >
                Cancel
              </button>

              <button
                onClick={clearChat}
                className="px-5 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700"
              >
                Clear Chat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAssistantModal;
