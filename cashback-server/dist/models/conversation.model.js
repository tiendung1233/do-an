"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ConversationSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
    },
    userName: {
        type: String,
        required: true,
    },
    userEmail: {
        type: String,
        required: true,
    },
    userImage: {
        type: String,
    },
    lastMessage: {
        type: String,
    },
    lastMessageAt: {
        type: Date,
    },
    unreadCount: {
        type: Number,
        default: 0,
    },
    adminUnreadCount: {
        type: Number,
        default: 0,
    },
    status: {
        type: String,
        enum: ["open", "closed"],
        default: "open",
    },
}, { timestamps: true });
const Conversation = (0, mongoose_1.model)("Conversation", ConversationSchema);
exports.default = Conversation;
