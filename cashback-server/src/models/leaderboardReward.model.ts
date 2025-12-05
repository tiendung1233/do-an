import mongoose, { Document, Schema } from "mongoose";

export interface ILeaderboardReward extends Document {
  userId: Schema.Types.ObjectId;
  userName: string;
  userEmail: string;
  userImage?: string;
  month: number;
  year: number;
  rank: number;
  type: "cashback" | "referral";
  amount: number;
  rewardAmount: number;
  rewardStatus: "pending" | "claimed" | "expired";
  claimedAt?: Date;
}

const LeaderboardRewardSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
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
  },
  {
    timestamps: true,
  }
);

// Compound index để đảm bảo mỗi user chỉ có 1 reward cho mỗi loại trong mỗi tháng
LeaderboardRewardSchema.index(
  { userId: 1, month: 1, year: 1, type: 1 },
  { unique: true }
);

export default mongoose.model<ILeaderboardReward>(
  "LeaderboardReward",
  LeaderboardRewardSchema
);
