import { Request, Response } from "express";
import Conversation from "../models/conversation.model";
import Message from "../models/message.model";

// ==================== USER APIs ====================

// Send message (user)
export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { content, conversationId } = req.body;
    const user = req.user as any;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: "Nội dung tin nhắn không được để trống" });
    }

    let conversation;

    // If conversationId exists, find the conversation
    if (conversationId) {
      conversation = await Conversation.findOne({
        _id: conversationId,
        userId: user._id,
      });

      if (!conversation) {
        return res.status(404).json({ message: "Không tìm thấy cuộc hội thoại" });
      }
    } else {
      // Create new conversation or find existing one for this user
      conversation = await Conversation.findOne({ userId: user._id });

      if (!conversation) {
        conversation = await Conversation.create({
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
    const message = await Message.create({
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
    await conversation.save();

    res.status(201).json({
      message: message,
      conversation: conversation,
    });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Lỗi server, vui lòng thử lại sau" });
  }
};

// Get user's conversation
export const getUserConversation = async (req: Request, res: Response) => {
  try {
    const user = req.user as any;

    const conversation = await Conversation.findOne({ userId: user._id });

    if (!conversation) {
      return res.status(200).json({
        conversation: null,
        messages: [],
      });
    }

    const messages = await Message.find({ conversationId: conversation._id })
      .sort({ createdAt: 1 })
      .lean();

    res.status(200).json({
      conversation,
      messages,
    });
  } catch (error) {
    console.error("Error getting conversation:", error);
    res.status(500).json({ message: "Lỗi server, vui lòng thử lại sau" });
  }
};

// Mark messages as read (user reads admin messages)
export const markMessagesAsRead = async (req: Request, res: Response) => {
  try {
    const { conversationId } = req.params;
    const user = req.user as any;

    const conversation = await Conversation.findOne({
      _id: conversationId,
      userId: user._id,
    });

    if (!conversation) {
      return res.status(404).json({ message: "Không tìm thấy cuộc hội thoại" });
    }

    // Mark all admin messages as read
    await Message.updateMany(
      {
        conversationId: conversation._id,
        senderType: "admin",
        isRead: false,
      },
      { isRead: true }
    );

    // Reset unread count for user
    conversation.unreadCount = 0;
    await conversation.save();

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error marking messages as read:", error);
    res.status(500).json({ message: "Lỗi server, vui lòng thử lại sau" });
  }
};

// ==================== ADMIN APIs ====================

// Get all conversations (admin)
export const getAllConversations = async (req: Request, res: Response) => {
  try {
    const admin = req.user as any;

    // Check if user is admin (role > 0)
    if (!admin || admin.role <= 0) {
      return res.status(403).json({ message: "Không có quyền truy cập" });
    }

    const conversations = await Conversation.find()
      .sort({ lastMessageAt: -1 })
      .lean();

    res.status(200).json(conversations);
  } catch (error) {
    console.error("Error getting conversations:", error);
    res.status(500).json({ message: "Lỗi server, vui lòng thử lại sau" });
  }
};

// Get conversation messages (admin)
export const getConversationMessages = async (req: Request, res: Response) => {
  try {
    const { conversationId } = req.params;
    const admin = req.user as any;

    // Check if user is admin
    if (!admin || admin.role <= 0) {
      return res.status(403).json({ message: "Không có quyền truy cập" });
    }

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({ message: "Không tìm thấy cuộc hội thoại" });
    }

    const messages = await Message.find({ conversationId })
      .sort({ createdAt: 1 })
      .lean();

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error getting messages:", error);
    res.status(500).json({ message: "Lỗi server, vui lòng thử lại sau" });
  }
};

// Send message (admin)
export const adminSendMessage = async (req: Request, res: Response) => {
  try {
    const { conversationId } = req.params;
    const { content } = req.body;
    const admin = req.user as any;

    // Check if user is admin
    if (!admin || admin.role <= 0) {
      return res.status(403).json({ message: "Không có quyền truy cập" });
    }

    if (!content || !content.trim()) {
      return res.status(400).json({ message: "Nội dung tin nhắn không được để trống" });
    }

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({ message: "Không tìm thấy cuộc hội thoại" });
    }

    // Create message
    const message = await Message.create({
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
    await conversation.save();

    res.status(201).json({ message });
  } catch (error) {
    console.error("Error sending admin message:", error);
    res.status(500).json({ message: "Lỗi server, vui lòng thử lại sau" });
  }
};

// Close conversation (admin)
export const closeConversation = async (req: Request, res: Response) => {
  try {
    const { conversationId } = req.params;
    const admin = req.user as any;

    // Check if user is admin
    if (!admin || admin.role <= 0) {
      return res.status(403).json({ message: "Không có quyền truy cập" });
    }

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({ message: "Không tìm thấy cuộc hội thoại" });
    }

    conversation.status = "closed";
    await conversation.save();

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error closing conversation:", error);
    res.status(500).json({ message: "Lỗi server, vui lòng thử lại sau" });
  }
};

// Get unread count (admin)
export const getUnreadCount = async (req: Request, res: Response) => {
  try {
    const admin = req.user as any;

    // Check if user is admin
    if (!admin || admin.role <= 0) {
      return res.status(403).json({ message: "Không có quyền truy cập" });
    }

    const result = await Conversation.aggregate([
      {
        $group: {
          _id: null,
          totalUnread: { $sum: "$adminUnreadCount" },
        },
      },
    ]);

    const count = result.length > 0 ? result[0].totalUnread : 0;

    res.status(200).json({ count });
  } catch (error) {
    console.error("Error getting unread count:", error);
    res.status(500).json({ message: "Lỗi server, vui lòng thử lại sau" });
  }
};

// Mark messages as read (admin reads user messages)
export const adminMarkMessagesAsRead = async (req: Request, res: Response) => {
  try {
    const { conversationId } = req.params;
    const admin = req.user as any;

    // Check if user is admin
    if (!admin || admin.role <= 0) {
      return res.status(403).json({ message: "Không có quyền truy cập" });
    }

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({ message: "Không tìm thấy cuộc hội thoại" });
    }

    // Mark all user messages as read
    await Message.updateMany(
      {
        conversationId: conversation._id,
        senderType: "user",
        isRead: false,
      },
      { isRead: true }
    );

    // Reset admin unread count
    conversation.adminUnreadCount = 0;
    await conversation.save();

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error marking messages as read:", error);
    res.status(500).json({ message: "Lỗi server, vui lòng thử lại sau" });
  }
};
