import { Router } from "express";
import {
  sendMessage,
  getUserConversation,
  markMessagesAsRead,
  getAllConversations,
  getConversationMessages,
  adminSendMessage,
  closeConversation,
  getUnreadCount,
  adminMarkMessagesAsRead,
} from "../controllers/chat.controller";
import { protect } from "../middleware/auth";

const router = Router();

// ==================== USER ROUTES ====================
router.post("/send", protect, sendMessage);
router.get("/conversation", protect, getUserConversation);
router.put("/read/:conversationId", protect, markMessagesAsRead);

// ==================== ADMIN ROUTES ====================
router.get("/admin/conversations", protect, getAllConversations);
router.get("/admin/messages/:conversationId", protect, getConversationMessages);
router.post("/admin/send/:conversationId", protect, adminSendMessage);
router.put("/admin/close/:conversationId", protect, closeConversation);
router.get("/admin/unread-count", protect, getUnreadCount);
router.put("/admin/read/:conversationId", protect, adminMarkMessagesAsRead);

export default router;
