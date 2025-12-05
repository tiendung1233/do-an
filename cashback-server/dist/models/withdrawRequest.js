"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WithdrawRequest = void 0;
const mongoose_1 = require("mongoose");
const WithdrawRequestSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    isVerify: { type: Boolean, default: false },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
    },
    verificationCode: { type: String, required: true },
    expiresAt: { type: Date, required: true },
}, {
    timestamps: true,
});
exports.WithdrawRequest = (0, mongoose_1.model)("WithdrawRequest", WithdrawRequestSchema);
