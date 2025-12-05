"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chat_controller_1 = require("../controllers/chat.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// ==================== USER ROUTES ====================
router.post("/send", auth_1.protect, chat_controller_1.sendMessage);
router.get("/conversation", auth_1.protect, chat_controller_1.getUserConversation);
router.put("/read/:conversationId", auth_1.protect, chat_controller_1.markMessagesAsRead);
// ==================== ADMIN ROUTES ====================
router.get("/admin/conversations", auth_1.protect, chat_controller_1.getAllConversations);
router.get("/admin/messages/:conversationId", auth_1.protect, chat_controller_1.getConversationMessages);
router.post("/admin/send/:conversationId", auth_1.protect, chat_controller_1.adminSendMessage);
router.put("/admin/close/:conversationId", auth_1.protect, chat_controller_1.closeConversation);
router.get("/admin/unread-count", auth_1.protect, chat_controller_1.getUnreadCount);
router.put("/admin/read/:conversationId", auth_1.protect, chat_controller_1.adminMarkMessagesAsRead);
exports.default = router;
