"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const LeaderboardRewardSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
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
    month: {
        type: Number,
        required: true,
        min: 1,
        max: 12,
    },
    year: {
        type: Number,
        required: true,
    },
    rank: {
        type: Number,
        required: true,
        min: 1,
        max: 3,
    },
    type: {
        type: String,
        enum: ["cashback", "referral"],
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    rewardAmount: {
        type: Number,
        required: true,
    },
    rewardStatus: {
        type: String,
        enum: ["pending", "claimed", "expired"],
        default: "pending",
    },
    claimedAt: {
        type: Date,
    },
}, {
    timestamps: true,
});
// Compound index để đảm bảo mỗi user chỉ có 1 reward cho mỗi loại trong mỗi tháng
LeaderboardRewardSchema.index({ userId: 1, month: 1, year: 1, type: 1 }, { unique: true });
exports.default = mongoose_1.default.model("LeaderboardReward", LeaderboardRewardSchema);
