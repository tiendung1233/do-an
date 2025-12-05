import { apiCall } from "../func/api";

export interface IMessage {
  _id: string;
  conversationId: string;
  senderId: string;
  senderType: "user" | "admin";
  content: string;
  createdAt: string;
  isRead: boolean;
}

export interface IConversation {
  _id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userImage?: string;
  lastMessage?: string;
  lastMessageAt?: string;
  unreadCount: number;
  status: "open" | "closed";
  createdAt: string;
  updatedAt: string;
}

export interface ISendMessagePayload {
  content: string;
  conversationId?: string;
}

export interface IConversationResponse {
  conversation: IConversation;
  messages: IMessage[];
}

// User APIs
export const sendMessage = async (
  token: string,
  data: ISendMessagePayload
): Promise<{ message: IMessage; conversation: IConversation }> => {
  return apiCall("/api/chat/send", "POST", data, token);
};

export const getUserConversation = async (
  token: string
): Promise<IConversationResponse> => {
  return apiCall("/api/chat/conversation", "GET", undefined, token);
};

export const markMessagesAsRead = async (
  token: string,
  conversationId: string
): Promise<{ success: boolean }> => {
  return apiCall(`/api/chat/read/${conversationId}`, "PUT", undefined, token);
};

// Admin APIs
export const getAllConversations = async (
  token: string
): Promise<IConversation[]> => {
  return apiCall("/api/chat/admin/conversations", "GET", undefined, token);
};

export const getConversationMessages = async (
  token: string,
  conversationId: string
): Promise<IMessage[]> => {
  return apiCall(
    `/api/chat/admin/messages/${conversationId}`,
    "GET",
    undefined,
    token
  );
};

export const adminSendMessage = async (
  token: string,
  conversationId: string,
  content: string
): Promise<{ message: IMessage }> => {
  return apiCall(
    `/api/chat/admin/send/${conversationId}`,
    "POST",
    { content },
    token
  );
};

export const closeConversation = async (
  token: string,
  conversationId: string
): Promise<{ success: boolean }> => {
  return apiCall(
    `/api/chat/admin/close/${conversationId}`,
    "PUT",
    undefined,
    token
  );
};

export const getUnreadCount = async (
  token: string
): Promise<{ count: number }> => {
  return apiCall("/api/chat/admin/unread-count", "GET", undefined, token);
};
