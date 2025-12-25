import { Schema, model, Document } from "mongoose";

// Interface cho lịch sử quay
interface ISpinHistory {
  spunAt: Date;
  prizeType: "cash" | "voucher" | "luck";
  prizeValue: number; // Giá trị tiền hoặc % voucher
  voucherCode?: string;
}

// Interface chính
interface ISpinWheel extends Document {
  userId: string;
  availableSpins: number; // Số lượt quay còn lại
  totalSpins: number; // Tổng số lượt quay đã nhận
  totalSpinsUsed: number; // Tổng số lượt đã quay
  lastMilestoneReached: number; // Mốc đơn hàng cuối cùng đã đạt
  spinHistory: ISpinHistory[];
  totalCashWon: number; // Tổng tiền mặt đã thắng
  totalVouchersWon: number; // Tổng số voucher đã thắng
  createdAt: Date;
  updatedAt: Date;
}

const SpinHistorySchema = new Schema<ISpinHistory>({
  spunAt: { type: Date, default: Date.now },
  prizeType: {
    type: String,
    enum: ["cash", "voucher", "luck"],
    required: true,
  },
  prizeValue: { type: Number, default: 0 },
  voucherCode: { type: String },
});

const SpinWheelSchema = new Schema<ISpinWheel>(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    availableSpins: {
      type: Number,
      default: 0,
    },
    totalSpins: {
      type: Number,
      default: 0,
    },
    totalSpinsUsed: {
      type: Number,
      default: 0,
    },
    lastMilestoneReached: {
      type: Number,
      default: 0,
    },
    spinHistory: [SpinHistorySchema],
    totalCashWon: {
      type: Number,
      default: 0,
    },
    totalVouchersWon: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Cấu hình các mốc đơn hàng và lượt quay tương ứng
export const SPIN_MILESTONES: { orders: number; spins: number }[] = [
  { orders: 3, spins: 2 },
  { orders: 5, spins: 4 },
  { orders: 8, spins: 6 },
  { orders: 10, spins: 8 },
  { orders: 15, spins: 10 },
  { orders: 20, spins: 12 },
  { orders: 30, spins: 15 },
  { orders: 50, spins: 20 },
];

// Cấu hình giải thưởng vòng quay
export const SPIN_PRIZES = [
  { id: 1, type: "cash", value: 5000, label: "5.000đ", probability: 15, color: "#FFD700" },
  { id: 2, type: "cash", value: 10000, label: "10.000đ", probability: 10, color: "#FF6B6B" },
  { id: 3, type: "cash", value: 20000, label: "20.000đ", probability: 5, color: "#4ECDC4" },
  { id: 4, type: "cash", value: 50000, label: "50.000đ", probability: 2, color: "#45B7D1" },
  { id: 5, type: "voucher", value: 5, label: "Voucher 5%", probability: 15, color: "#96CEB4" },
  { id: 6, type: "voucher", value: 10, label: "Voucher 10%", probability: 10, color: "#FFEAA7" },
  { id: 7, type: "voucher", value: 15, label: "Voucher 15%", probability: 5, color: "#DDA0DD" },
  { id: 8, type: "luck", value: 0, label: "Chúc may mắn", probability: 38, color: "#95A5A6" },
];

const SpinWheel = model<ISpinWheel>("SpinWheel", SpinWheelSchema);

export default SpinWheel;
