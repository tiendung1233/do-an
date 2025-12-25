import mongoose, { Document, Schema } from "mongoose";

// Hạng thành viên
export type MembershipTier = "none" | "bronze" | "silver" | "gold";

// Ngưỡng tổng tiền đơn hàng để đạt hạng
export const MEMBERSHIP_THRESHOLDS: { [key in MembershipTier]: number } = {
  none: 0,
  bronze: 10000000,  // 10 triệu
  silver: 20000000,  // 20 triệu
  gold: 30000000,    // 30 triệu
};

// % cashback bonus mặc định theo hạng (cộng thêm vào mỗi đơn)
export const MEMBERSHIP_CASHBACK_BONUS: { [key in MembershipTier]: number } = {
  none: 0,
  bronze: 1,   // +1%
  silver: 2,   // +2%
  gold: 3,     // +3%
};

// Voucher thưởng khi đạt hạng mới
export const MEMBERSHIP_VOUCHER_REWARD: { [key in MembershipTier]: number } = {
  none: 0,
  bronze: 2,   // 2%
  silver: 3,   // 3%
  gold: 5,     // 5%
};

// Thông tin hiển thị hạng
export const MEMBERSHIP_INFO: { [key in MembershipTier]: { name: string; nameVi: string; color: string } } = {
  none: { name: "None", nameVi: "Chưa có hạng", color: "#9CA3AF" },
  bronze: { name: "Bronze", nameVi: "Đồng", color: "#CD7F32" },
  silver: { name: "Silver", nameVi: "Bạc", color: "#C0C0C0" },
  gold: { name: "Gold", nameVi: "Vàng", color: "#FFD700" },
};

// Helper: Tính hạng dựa trên tổng tiền
export function calculateMembershipTier(totalSpent: number): MembershipTier {
  if (totalSpent >= MEMBERSHIP_THRESHOLDS.gold) return "gold";
  if (totalSpent >= MEMBERSHIP_THRESHOLDS.silver) return "silver";
  if (totalSpent >= MEMBERSHIP_THRESHOLDS.bronze) return "bronze";
  return "none";
}

// Helper: Lấy hạng tiếp theo
export function getNextTier(currentTier: MembershipTier): MembershipTier | null {
  switch (currentTier) {
    case "none": return "bronze";
    case "bronze": return "silver";
    case "silver": return "gold";
    case "gold": return null;  // Đã max
  }
}

// Helper: Tính tiền còn thiếu để lên hạng tiếp theo
export function getAmountToNextTier(totalSpent: number, currentTier: MembershipTier): number {
  const nextTier = getNextTier(currentTier);
  if (!nextTier) return 0;
  return Math.max(0, MEMBERSHIP_THRESHOLDS[nextTier] - totalSpent);
}

// Interface lịch sử thăng hạng
export interface IMembershipHistory extends Document {
  userId: mongoose.Types.ObjectId;
  previousTier: MembershipTier;
  newTier: MembershipTier;
  totalSpentAtUpgrade: number;
  voucherAwarded?: mongoose.Types.ObjectId;  // ID voucher được thưởng
  createdAt: Date;
}

const MembershipHistorySchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    previousTier: {
      type: String,
      enum: ["none", "bronze", "silver", "gold"],
      required: true,
    },
    newTier: {
      type: String,
      enum: ["none", "bronze", "silver", "gold"],
      required: true,
    },
    totalSpentAtUpgrade: {
      type: Number,
      required: true,
    },
    voucherAwarded: {
      type: Schema.Types.ObjectId,
      ref: "Voucher",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

MembershipHistorySchema.index({ userId: 1 });

export default mongoose.model<IMembershipHistory>("MembershipHistory", MembershipHistorySchema);
