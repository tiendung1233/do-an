"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminMarkMessagesAsRead = exports.getUnreadCount = exports.closeConversation = exports.adminSendMessage = exports.getConversationMessages = exports.getAllConversations = exports.markMessagesAsRead = exports.getUserConversation = exports.sendMessage = void 0;
const conversation_model_1 = __importDefault(require("../models/conversation.model"));
const message_model_1 = __importDefault(require("../models/message.model"));
// ==================== USER APIs ====================
// Send message (user)
const sendMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { content, conversationId } = req.body;
        const user = req.user;
        if (!content || !content.trim()) {
            return res.status(400).json({ message: "Nội dung tin nhắn không được để trống" });
        }
        let conversation;
        // If conversationId exists, find the conversation
        if (conversationId) {
            conversation = yield conversation_model_1.default.findOne({
                _id: conversationId,
                userId: user._id,
            });
            if (!conversation) {
                return res.status(404).json({ message: "Không tìm thấy cuộc hội thoại" });
            }
        }
        else {
            // Create new conversation or find existing one for this user
            conversation = yield conversation_model_1.default.findOne({ userId: user._id });
            if (!conversation) {
                conversation = yield conversation_model_1.default.create({
                    userId: user._id,
                    userName: user.name || user.email,
                    userEmail: user.email,
                    userImage: user.image,
                    status: "open",
                });
            }
        }
        // Reopen conversation if it was closed
        if (conversation.status === "closed") {
            conversation.status = "open";
        }
        // Create message
        const message = yield message_model_1.default.create({
            conversationId: conversation._id,
            senderId: user._id,
            senderType: "user",
            content: content.trim(),
            isRead: false,
        });
        // Update conversation
        conversation.lastMessage = content.trim();
        conversation.lastMessageAt = new Date();
        conversation.adminUnreadCount += 1;
        yield conversation.save();
        res.status(201).json({
            message: message,
            conversation: conversation,
        });
    }
    catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ message: "Lỗi server, vui lòng thử lại sau" });
    }
});
exports.sendMessage = sendMessage;
// Get user's conversation
const getUserConversation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const conversation = yield conversation_model_1.default.findOne({ userId: user._id });
        if (!conversation) {
            return res.status(200).json({
                conversation: null,
                messages: [],
            });
        }
        const messages = yield message_model_1.default.find({ conversationId: conversation._id })
            .sort({ createdAt: 1 })
            .lean();
        res.status(200).json({
            conversation,
            messages,
        });
    }
    catch (error) {
        console.error("Error getting conversation:", error);
        res.status(500).json({ message: "Lỗi server, vui lòng thử lại sau" });
    }
});
exports.getUserConversation = getUserConversation;
// Mark messages as read (user reads admin messages)
const markMessagesAsRead = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { conversationId } = req.params;
        const user = req.user;
        const conversation = yield conversation_model_1.default.findOne({
            _id: conversationId,
            userId: user._id,
        });
        if (!conversation) {
            return res.status(404).json({ message: "Không tìm thấy cuộc hội thoại" });
        }
        // Mark all admin messages as read
        yield message_model_1.default.updateMany({
            conversationId: conversation._id,
            senderType: "admin",
            isRead: false,
        }, { isRead: true });
        // Reset unread count for user
        conversation.unreadCount = 0;
        yield conversation.save();
        res.status(200).json({ success: true });
    }
    catch (error) {
        console.error("Error marking messages as read:", error);
        res.status(500).json({ message: "Lỗi server, vui lòng thử lại sau" });
    }
});
exports.markMessagesAsRead = markMessagesAsRead;
// ==================== ADMIN APIs ====================
// Get all conversations (admin)
const getAllConversations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const admin = req.user;
        // Check if user is admin (role > 0)
        if (!admin || admin.role <= 0) {
            return res.status(403).json({ message: "Không có quyền truy cập" });
        }
        const conversations = yield conversation_model_1.default.find()
            .sort({ lastMessageAt: -1 })
            .lean();
        res.status(200).json(conversations);
    }
    catch (error) {
        console.error("Error getting conversations:", error);
        res.status(500).json({ message: "Lỗi server, vui lòng thử lại sau" });
    }
});
exports.getAllConversations = getAllConversations;
// Get conversation messages (admin)
const getConversationMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { conversationId } = req.params;
        const admin = req.user;
        // Check if user is admin
        if (!admin || admin.role <= 0) {
            return res.status(403).json({ message: "Không có quyền truy cập" });
        }
        const conversation = yield conversation_model_1.default.findById(conversationId);
        if (!conversation) {
            return res.status(404).json({ message: "Không tìm thấy cuộc hội thoại" });
        }
        const messages = yield message_model_1.default.find({ conversationId })
            .sort({ createdAt: 1 })
            .lean();
        res.status(200).json(messages);
    }
    catch (error) {
        console.error("Error getting messages:", error);
        res.status(500).json({ message: "Lỗi server, vui lòng thử lại sau" });
    }
});
exports.getConversationMessages = getConversationMessages;
// Send message (admin)
const adminSendMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { conversationId } = req.params;
        const { content } = req.body;
        const admin = req.user;
        // Check if user is admin
        if (!admin || admin.role <= 0) {
            return res.status(403).json({ message: "Không có quyền truy cập" });
        }
        if (!content || !content.trim()) {
            return res.status(400).json({ message: "Nội dung tin nhắn không được để trống" });
        }
        const conversation = yield conversation_model_1.default.findById(conversationId);
        if (!conversation) {
            return res.status(404).json({ message: "Không tìm thấy cuộc hội thoại" });
        }
        // Create message
        const message = yield message_model_1.default.create({
            conversationId: conversation._id,
            senderId: admin._id,
            senderType: "admin",
            content: content.trim(),
            isRead: false,
        });
        // Update conversation
        conversation.lastMessage = content.trim();
        conversation.lastMessageAt = new Date();
        conversation.unreadCount += 1;
        conversation.status = "open";
        yield conversation.save();
        res.status(201).json({ message });
    }
    catch (error) {
        console.error("Error sending admin message:", error);
        res.status(500).json({ message: "Lỗi server, vui lòng thử lại sau" });
    }
});
exports.adminSendMessage = adminSendMessage;
// Close conversation (admin)
const closeConversation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { conversationId } = req.params;
        const admin = req.user;
        // Check if user is admin
        if (!admin || admin.role <= 0) {
            return res.status(403).json({ message: "Không có quyền truy cập" });
        }
        const conversation = yield conversation_model_1.default.findById(conversationId);
        if (!conversation) {
            return res.status(404).json({ message: "Không tìm thấy cuộc hội thoại" });
        }
        conversation.status = "closed";
        yield conversation.save();
        res.status(200).json({ success: true });
    }
    catch (error) {
        console.error("Error closing conversation:", error);
        res.status(500).json({ message: "Lỗi server, vui lòng thử lại sau" });
    }
});
exports.closeConversation = closeConversation;
// Get unread count (admin)
const getUnreadCount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const admin = req.user;
        // Check if user is admin
        if (!admin || admin.role <= 0) {
            return res.status(403).json({ message: "Không có quyền truy cập" });
        }
        const result = yield conversation_model_1.default.aggregate([
            {
                $group: {
                    _id: null,
                    totalUnread: { $sum: "$adminUnreadCount" },
                },
            },
        ]);
        const count = result.length > 0 ? result[0].totalUnread : 0;
        res.status(200).json({ count });
    }
    catch (error) {
        console.error("Error getting unread count:", error);
        res.status(500).json({ message: "Lỗi server, vui lòng thử lại sau" });
    }
});
exports.getUnreadCount = getUnreadCount;
// Mark messages as read (admin reads user messages)
const adminMarkMessagesAsRead = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { conversationId } = req.params;
        const admin = req.user;
        // Check if user is admin
        if (!admin || admin.role <= 0) {
            return res.status(403).json({ message: "Không có quyền truy cập" });
        }
        const conversation = yield conversation_model_1.default.findById(conversationId);
        if (!conversation) {
            return res.status(404).json({ message: "Không tìm thấy cuộc hội thoại" });
        }
        // Mark all user messages as read
        yield message_model_1.default.updateMany({
            conversationId: conversation._id,
            senderType: "user",
            isRead: false,
        }, { isRead: true });
        // Reset admin unread count
        conversation.adminUnreadCount = 0;
        yield conversation.save();
        res.status(200).json({ success: true });
    }
    catch (error) {
        console.error("Error marking messages as read:", error);
        res.status(500).json({ message: "Lỗi server, vui lòng thử lại sau" });
    }
});
exports.adminMarkMessagesAsRead = adminMarkMessagesAsRead;
