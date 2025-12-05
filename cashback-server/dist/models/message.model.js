"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const MessageSchema = new mongoose_1.Schema({
    conversationId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Conversation",
        required: true,
    },
    senderId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    senderType: {
        type: String,
        enum: ["user", "admin"],
        required: true,
    },
    content: {
        type: String,
        required: true,
        trim: true,
    },
    isRead: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });
// Index for faster queries
MessageSchema.index({ conversationId: 1, createdAt: -1 });
const Message = (0, mongoose_1.model)("Message", MessageSchema);
exports.default = Message;
