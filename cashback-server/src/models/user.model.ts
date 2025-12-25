import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import { ITree, TreeSchema } from "./tree.model";

export type MembershipTier = "none" | "bronze" | "silver" | "gold";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  accountBank?: string;
  bankName?: string;
  googleId?: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  image?: string;
  inviteCode?: string;
  referralCode?: string;  // Mã giới thiệu unique của user (VD: QB1A2B3C)
  referredBy?: mongoose.Types.ObjectId;  // ID người đã giới thiệu user này
  money: number;
  trees?: ITree[];
  freeSpins?: number;
  lastSpinDate?: Date;
  spinToken?: string;
  spinStartTime?: Date;
  secretBoxesCollected?: number;
  isVerified?: boolean;
  verificationRequestsCount?: number;
  lastVerificationRequest?: Date;
  role?: number;
  total: number;
  moneyByEvent: {
    tree: number;
    wheel: number;
  };
  // Membership fields
  membershipTier: MembershipTier;
  totalSpent: number;  // Tổng tiền đã chi tiêu (các đơn hàng đã duyệt)
  comparePassword?(candidatePassword: string): Promise<boolean>;
}

// Function tạo mã giới thiệu unique
export function generateReferralCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'QB';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    accountBank: { type: String },
    bankName: { type: String },
    googleId: { type: String },
    phoneNumber: { type: String, unique: true },
    address: { type: String },
    city: { type: String },
    inviteCode: { type: String },
    referralCode: { type: String, unique: true, sparse: true },  // Mã giới thiệu unique
    referredBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },  // Người đã giới thiệu
    image: { type: String, default: null },
    money: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    trees: [TreeSchema],
    freeSpins: { type: Number, default: 1 },
    lastSpinDate: { type: Date },
    spinToken: { type: String, default: null },
    spinStartTime: { type: Date },
    secretBoxesCollected: { type: Number, default: 0 },
    moneyByEvent: {
      tree: { type: Number, default: 0 },
      wheel: { type: Number, default: 0 },
    },
    isVerified: { type: Boolean, default: false },
    verificationRequestsCount: {
      type: Number,
      default: 0,
    },
    lastVerificationRequest: {
      type: Date,
      default: null,
    },
    role: {
      type: Number,
      default: 0,
    },
    // Membership fields
    membershipTier: {
      type: String,
      enum: ["none", "bronze", "silver", "gold"],
      default: "none",
    },
    totalSpent: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();
  if (this.password) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

UserSchema.methods.comparePassword = function (candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password!);
};

export default mongoose.model<IUser>("User", UserSchema);
