import mongoose, { Document, Schema } from "mongoose";

export interface IReferralReward extends Document {
  referrerId: mongoose.Types.ObjectId;      // Người giới thiệu (nhận thưởng)
  referredUserId: mongoose.Types.ObjectId;  // Người được giới thiệu
  referralNumber: number;                    // Số thứ tự người được giới thiệu (1, 2, 3)
  rewardAmount: number;                      // Số tiền thưởng (20k, 50k, 70k)
  status: "pending" | "completed";           // pending: chờ mua hàng, completed: đã nhận thưởng
  completedAt?: Date;                        // Ngày nhận thưởng
  createdAt: Date;
  updatedAt: Date;
}

// Bảng thưởng theo số người giới thiệu
export const REFERRAL_REWARDS: { [key: number]: number } = {
  1: 20000,   // Người thứ 1: 20k
  2: 50000,   // Người thứ 2: 50k
  3: 70000,   // Người thứ 3: 70k
};

// Thưởng mặc định từ người thứ 4 trở đi
export const DEFAULT_REFERRAL_REWARD = 30000;  // 30k

// Helper function để lấy số tiền thưởng theo số thứ tự
export const getRewardAmount = (referralNumber: number): number => {
  return REFERRAL_REWARDS[referralNumber] || DEFAULT_REFERRAL_REWARD;
};

const ReferralRewardSchema: Schema = new Schema(
  {
    referrerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    referredUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    referralNumber: {
      type: Number,
      required: true,
      min: 1,
    },
    rewardAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Index để query nhanh
ReferralRewardSchema.index({ referrerId: 1, status: 1 });
ReferralRewardSchema.index({ referredUserId: 1 });

// Unique constraint: Mỗi người chỉ được giới thiệu 1 lần
ReferralRewardSchema.index({ referredUserId: 1 }, { unique: true });

export default mongoose.model<IReferralReward>("ReferralReward", ReferralRewardSchema);
