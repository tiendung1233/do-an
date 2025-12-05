"use client";

import { useState, useEffect, useRef } from "react";
import {
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  UserCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
  MagnifyingGlassIcon,
  InboxIcon,
} from "@heroicons/react/24/outline";
import Cookies from "js-cookie";
import {
  getAllConversations,
  getConversationMessages,
  adminSendMessage,
  closeConversation,
  markMessagesAsRead,
  IMessage,
  IConversation,
} from "@/ultils/api/chat";
import { useToast } from "@/context/toastContext";

export default function ChatAdmin() {
  const token = Cookies.get("authToken");
  const { addToast } = useToast();
  const [conversations, setConversations] = useState<IConversation[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<IConversation | null>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (token) {
      fetchConversations();
    }
  }, []);

  // Polling for new messages and conversations
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (token) {
      interval = setInterval(() => {
        fetchConversations();
        if (selectedConversation) {
          fetchMessages(selectedConversation._id);
        }
      }, 5000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [selectedConversation]);

  const fetchConversations = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await getAllConversations(token);
      if (data) {
        setConversations(data);
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    if (!token) return;
    setLoadingMessages(true);
    try {
      const data = await getConversationMessages(token, conversationId);
      if (data) {
        setMessages(data);
        // Mark messages as read by admin
        await markMessagesAsRead(token, conversationId);
        // Update unread count in conversations list
        setConversations((prev) =>
          prev.map((conv) =>
            conv._id === conversationId ? { ...conv, unreadCount: 0 } : conv
          )
        );
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSelectConversation = async (conversation: IConversation) => {
    setSelectedConversation(conversation);
    await fetchMessages(conversation._id);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !token || !selectedConversation || sending)
      return;

    setSending(true);
    try {
      const data = await adminSendMessage(
        token,
        selectedConversation._id,
        inputValue.trim()
      );

      if (data?.message) {
        setMessages((prev) => [...prev, data.message]);
        setInputValue("");
        // Update last message in conversations list
        setConversations((prev) =>
          prev.map((conv) =>
            conv._id === selectedConversation._id
              ? {
                  ...conv,
                  lastMessage: data.message.content,
                  lastMessageAt: data.message.createdAt,
                }
              : conv
          )
        );
        addToast("Đã gửi tin nhắn", "success");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      addToast("Lỗi khi gửi tin nhắn", "error");
    } finally {
      setSending(false);
    }
  };

  const handleCloseConversation = async () => {
    if (!token || !selectedConversation) return;

    try {
      const result = await closeConversation(token, selectedConversation._id);
      if (result?.success) {
        setConversations((prev) =>
          prev.map((conv) =>
            conv._id === selectedConversation._id
              ? { ...conv, status: "closed" }
              : conv
          )
        );
        setSelectedConversation({
          ...selectedConversation,
          status: "closed",
        });
        addToast("Đã đóng cuộc trò chuyện", "success");
      }
    } catch (error) {
      console.error("Error closing conversation:", error);
      addToast("Lỗi khi đóng cuộc trò chuyện", "error");
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Hôm nay";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Hôm qua";
    } else {
      return date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    }
  };

  const formatLastMessage = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Vừa xong";
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;
    return date.toLocaleDateString("vi-VN");
  };

  // Filter conversations
  const filteredConversations = conversations.filter(
    (conv) =>
      conv.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.userEmail?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group messages by date
  const groupedMessages = messages.reduce(
    (groups: { [key: string]: IMessage[] }, message) => {
      const date = new Date(message.createdAt).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
      return groups;
    },
    {}
  );

  const totalUnread = conversations.reduce(
    (sum, conv) => sum + (conv.unreadCount || 0),
    0
  );

  return (
    <div className="flex h-[calc(100vh-300px)] min-h-[500px] rounded-2xl overflow-hidden border border-secondary-200/50 dark:border-secondary-700/50">
      {/* Conversations List */}
      <div className="w-80 flex-shrink-0 bg-white/60 dark:bg-secondary-800/60 backdrop-blur-xl border-r border-secondary-200/50 dark:border-secondary-700/50 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-secondary-200/50 dark:border-secondary-700/50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ChatBubbleLeftRightIcon className="w-5 h-5 text-primary-500" />
              <h2 className="font-semibold text-secondary-900 dark:text-white">
                Tin nhắn
              </h2>
              {totalUnread > 0 && (
                <span className="px-2 py-0.5 text-xs font-semibold bg-error-500 text-white rounded-full">
                  {totalUnread}
                </span>
              )}
            </div>
          </div>
          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-secondary-100/50 dark:bg-secondary-700/50 border-0 text-sm text-secondary-900 dark:text-white placeholder:text-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
            />
          </div>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto">
          {loading && conversations.length === 0 ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full" />
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-secondary-500">
              <InboxIcon className="w-8 h-8 mb-2" />
              <p className="text-sm">Chưa có tin nhắn</p>
            </div>
          ) : (
            filteredConversations.map((conv) => (
              <div
                key={conv._id}
                onClick={() => handleSelectConversation(conv)}
                className={`p-4 border-b border-secondary-100 dark:border-secondary-700/50 cursor-pointer hover:bg-secondary-50 dark:hover:bg-secondary-700/30 transition-colors ${
                  selectedConversation?._id === conv._id
                    ? "bg-primary-50 dark:bg-primary-900/20 border-l-2 border-l-primary-500"
                    : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    {conv.userImage ? (
                      <img
                        src={conv.userImage}
                        alt=""
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                        <UserCircleIcon className="w-6 h-6 text-primary-500" />
                      </div>
                    )}
                    {conv.status === "open" && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success-500 rounded-full border-2 border-white dark:border-secondary-800" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-sm text-secondary-900 dark:text-white truncate">
                        {conv.userName || "Khách"}
                      </h3>
                      <span className="text-xs text-secondary-400">
                        {formatLastMessage(conv.lastMessageAt)}
                      </span>
                    </div>
                    <p className="text-xs text-secondary-500 truncate mt-0.5">
                      {conv.userEmail}
                    </p>
                    <p className="text-sm text-secondary-600 dark:text-secondary-400 truncate mt-1">
                      {conv.lastMessage || "Chưa có tin nhắn"}
                    </p>
                  </div>
                  {conv.unreadCount > 0 && (
                    <span className="flex-shrink-0 w-5 h-5 bg-primary-500 text-white text-xs rounded-full flex items-center justify-center">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-secondary-50/50 dark:bg-secondary-900/50">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 bg-white/60 dark:bg-secondary-800/60 backdrop-blur-xl border-b border-secondary-200/50 dark:border-secondary-700/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {selectedConversation.userImage ? (
                  <img
                    src={selectedConversation.userImage}
                    alt=""
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                    <UserCircleIcon className="w-6 h-6 text-primary-500" />
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-secondary-900 dark:text-white">
                    {selectedConversation.userName || "Khách"}
                  </h3>
                  <p className="text-xs text-secondary-500">
                    {selectedConversation.userEmail}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {selectedConversation.status === "open" ? (
                  <button
                    onClick={handleCloseConversation}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary-100 dark:bg-secondary-700 text-secondary-600 dark:text-secondary-400 text-sm hover:bg-secondary-200 dark:hover:bg-secondary-600 transition-colors"
                  >
                    <XCircleIcon className="w-4 h-4" />
                    Đóng
                  </button>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary-100 dark:bg-secondary-700 text-secondary-500 text-sm">
                    <CheckCircleIcon className="w-4 h-4" />
                    Đã đóng
                  </span>
                )}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {loadingMessages ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full" />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-secondary-500">
                  <ChatBubbleLeftRightIcon className="w-12 h-12 mb-2" />
                  <p>Chưa có tin nhắn</p>
                </div>
              ) : (
                Object.entries(groupedMessages).map(([date, msgs]) => (
                  <div key={date}>
                    {/* Date Separator */}
                    <div className="flex items-center justify-center mb-4">
                      <span className="px-3 py-1 rounded-full bg-secondary-200/50 dark:bg-secondary-700/50 text-xs text-secondary-500">
                        {formatDate(msgs[0].createdAt)}
                      </span>
                    </div>
                    {/* Messages */}
                    {msgs.map((message) => (
                      <div
                        key={message._id}
                        className={`flex mb-3 ${
                          message.senderType === "admin"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div className="max-w-[70%]">
                          <div
                            className={`px-4 py-2.5 rounded-2xl ${
                              message.senderType === "admin"
                                ? "bg-primary-500 text-white rounded-br-md"
                                : "bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white rounded-bl-md shadow-sm border border-secondary-200/50 dark:border-secondary-700/50"
                            }`}
                          >
                            <p className="text-sm whitespace-pre-wrap break-words">
                              {message.content}
                            </p>
                          </div>
                          <p
                            className={`text-xs text-secondary-400 mt-1 ${
                              message.senderType === "admin"
                                ? "text-right"
                                : "text-left"
                            }`}
                          >
                            {formatTime(message.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            {selectedConversation.status === "open" ? (
              <form
                onSubmit={handleSendMessage}
                className="p-4 bg-white/60 dark:bg-secondary-800/60 backdrop-blur-xl border-t border-secondary-200/50 dark:border-secondary-700/50"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Nhập tin nhắn..."
                    className="flex-1 px-4 py-2.5 rounded-xl bg-secondary-100 dark:bg-secondary-700 border-0 text-sm text-secondary-900 dark:text-white placeholder:text-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                    disabled={sending}
                  />
                  <button
                    type="submit"
                    disabled={!inputValue.trim() || sending}
                    className="p-2.5 rounded-xl bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {sending ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <PaperAirplaneIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-4 bg-secondary-100 dark:bg-secondary-800 text-center text-sm text-secondary-500">
                Cuộc trò chuyện đã được đóng
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-secondary-500">
            <div className="w-20 h-20 rounded-full bg-secondary-100 dark:bg-secondary-800 flex items-center justify-center mb-4">
              <ChatBubbleLeftRightIcon className="w-10 h-10" />
            </div>
            <h3 className="font-semibold text-secondary-900 dark:text-white mb-2">
              Chọn cuộc trò chuyện
            </h3>
            <p className="text-sm">
              Chọn một cuộc trò chuyện từ danh sách bên trái để bắt đầu
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
