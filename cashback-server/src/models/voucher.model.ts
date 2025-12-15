import mongoose, { Document, Schema } from "mongoose";

export interface IVoucher extends Document {
  userId: mongoose.Types.ObjectId;
  code: string;                    // Mã voucher unique (VD: VCH-ABC123)
  percentage: number;              // % được cộng thêm (1-7%)
  dayNumber: number;               // Ngày điểm danh nhận được voucher (1-7)
  status: "active" | "used" | "expired";
  usedOnPurchaseId?: mongoose.Types.ObjectId;  // ID đơn hàng đã dùng voucher
  usedAt?: Date;                   // Ngày sử dụng
  expiresAt: Date;                 // Ngày hết hạn (cuối tuần)
  createdAt: Date;
  updatedAt: Date;
}

// Helper: Tạo mã voucher unique
export function generateVoucherCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "VCH-";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

const VoucherSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
    },
    percentage: {
      type: Number,
      required: true,
      min: 1,
      max: 7,
    },
    dayNumber: {
      type: Number,
      required: true,
      min: 1,
      max: 7,
    },
    status: {
      type: String,
      enum: ["active", "used", "expired"],
      default: "active",
    },
    usedOnPurchaseId: {
      type: Schema.Types.ObjectId,
      ref: "PurchaseHistory",
      default: null,
    },
    usedAt: {
      type: Date,
      default: null,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index để query nhanh
VoucherSchema.index({ userId: 1, status: 1 });
VoucherSchema.index({ code: 1 }, { unique: true });
VoucherSchema.index({ expiresAt: 1 });

export default mongoose.model<IVoucher>("Voucher", VoucherSchema);
