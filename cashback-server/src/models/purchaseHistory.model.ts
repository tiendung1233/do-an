import { Schema, model, Document } from "mongoose";

interface IPurchaseHistory extends Document {
  userId: string;
  productName: string;
  price: number;
  productLink: string;
  cashbackPercentage: number;
  cashback: number;
  quantity: number;
  purchaseDate: Date;
  status: "Đang xử lý" | "Đã duyệt" | "Hủy";
  transaction_id: string;
  // Membership bonus fields
  membershipBonusPercent: number;
  membershipBonusAmount: number;
  // Voucher fields
  voucherUsed: boolean;
  voucherCode?: string;
  voucherBonusPercent: number;
  bonusCashback: number;
}

const PurchaseHistorySchema = new Schema<IPurchaseHistory>({
  userId: {
    type: String,
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  productLink: {
    type: String,
    required: true,
  },
  cashbackPercentage: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  cashback: {
    type: Number,
    default: 0,
  },
  purchaseDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    required: true,
    default: "Đang xử lý",
  },
  transaction_id: {
    type: String,
    required: true,
  },
  // Membership bonus fields
  membershipBonusPercent: {
    type: Number,
    default: 0,
  },
  membershipBonusAmount: {
    type: Number,
    default: 0,
  },
  // Voucher fields
  voucherUsed: {
    type: Boolean,
    default: false,
  },
  voucherCode: {
    type: String,
    default: null,
  },
  voucherBonusPercent: {
    type: Number,
    default: 0,
  },
  bonusCashback: {
    type: Number,
    default: 0,
  },
});

const PurchaseHistory = model<IPurchaseHistory>(
  "PurchaseHistory",
  PurchaseHistorySchema
);

export default PurchaseHistory;
