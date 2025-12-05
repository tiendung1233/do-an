"use client";

import { useState, useEffect, useRef } from "react";
import {
  ChatBubbleLeftRightIcon,
  XMarkIcon,
  PaperAirplaneIcon,
  MinusIcon,
} from "@heroicons/react/24/outline";
import { ChatBubbleLeftRightIcon as ChatBubbleLeftRightIconSolid } from "@heroicons/react/24/solid";
import Cookies from "js-cookie";
import {
  sendMessage,
  getUserConversation,
  markMessagesAsRead,
  IMessage,
  IConversation,
} from "@/ultils/api/chat";

interface ChatPopupProps {
  isAuthenticated: boolean | null;
}

export default function ChatPopup({ isAuthenticated }: ChatPopupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [conversation, setConversation] = useState<IConversation | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const token = Cookies.get("authToken");
  const userId = Cookies.get("id");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized && token) {
      fetchConversation();
    }
  }, [isOpen, isMinimized]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Polling for new messages every 5 seconds when chat is open
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isOpen && !isMinimized && token && conversation) {
      interval = setInterval(() => {
        fetchConversation();
      }, 5000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isOpen, isMinimized, conversation]);

  const fetchConversation = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await getUserConversation(token);
      if (data) {
        setConversation(data.conversation);
        setMessages(data.messages || []);
        // Mark messages as read
        if (data.conversation?._id) {
          await markMessagesAsRead(token, data.conversation._id);
          setUnreadCount(0);
        }
      }
    } catch (error) {
      console.error("Error fetching conversation:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !token || sending) return;

    setSending(true);
    try {
      const data = await sendMessage(token, {
        content: inputValue.trim(),
        conversationId: conversation?._id,
      });

      if (data?.message) {
        setMessages((prev) => [...prev, data.message]);
        setConversation(data.conversation);
        setInputValue("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSending(false);
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

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-primary hover:shadow-primary-lg transition-all duration-300 hover:scale-105"
        >
          <ChatBubbleLeftRightIconSolid className="w-7 h-7" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-error-500 rounded-full text-xs flex items-center justify-center font-semibold">
              {unreadCount}
            </span>
          )}
        </button>
      )}

      {/* Chat Popup */}
      {isOpen && (
        <div
          className={`fixed bottom-6 right-6 z-50 w-[360px] max-w-[calc(100vw-48px)] bg-white dark:bg-secondary-900 rounded-2xl shadow-2xl border border-secondary-200/50 dark:border-secondary-700/50 overflow-hidden transition-all duration-300 ${
            isMinimized ? "h-14" : "h-[500px] max-h-[calc(100vh-100px)]"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <ChatBubbleLeftRightIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Hỗ trợ khách hàng</h3>
                <p className="text-xs text-primary-100">
                  Thường trả lời trong vài phút
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
              >
                <MinusIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages Area */}
              <div className="flex-1 h-[calc(100%-130px)] overflow-y-auto p-4 space-y-4 bg-secondary-50 dark:bg-secondary-900">
                {loading && messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full"></div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center px-4">
                    <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-4">
                      <ChatBubbleLeftRightIcon className="w-8 h-8 text-primary-500" />
                    </div>
                    <h4 className="font-semibold text-secondary-900 dark:text-white mb-2">
                      Xin chào!
                    </h4>
                    <p className="text-sm text-secondary-500">
                      Hãy gửi tin nhắn để bắt đầu cuộc trò chuyện với đội ngũ hỗ
                      trợ của chúng tôi.
                    </p>
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
                            message.senderType === "user"
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-[80%] ${
                              message.senderType === "user"
                                ? "order-2"
                                : "order-1"
                            }`}
                          >
                            <div
                              className={`px-4 py-2.5 rounded-2xl ${
                                message.senderType === "user"
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
                                message.senderType === "user"
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
              <form
                onSubmit={handleSendMessage}
                className="p-3 bg-white dark:bg-secondary-800 border-t border-secondary-200/50 dark:border-secondary-700/50"
              >
                <div className="flex items-center gap-2">
                  <input
                    ref={inputRef}
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
            </>
          )}
        </div>
      )}
    </>
  );
}
