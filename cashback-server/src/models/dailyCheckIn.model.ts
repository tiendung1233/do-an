import mongoose, { Document, Schema } from "mongoose";

export interface IDailyCheckIn extends Document {
  userId: mongoose.Types.ObjectId;
  weekStartDate: Date;           // Ngày bắt đầu tuần (để reset)
  checkInDays: number[];         // Mảng các ngày đã điểm danh (1-7)
  currentStreak: number;         // Số ngày điểm danh liên tiếp trong tuần
  lastCheckInDate: Date;         // Ngày điểm danh gần nhất
  createdAt: Date;
  updatedAt: Date;
}

// Bảng % voucher theo ngày điểm danh
export const CHECKIN_REWARDS: { [key: number]: number } = {
  1: 1,   // Ngày 1: 1%
  2: 2,   // Ngày 2: 2%
  3: 3,   // Ngày 3: 3%
  4: 4,   // Ngày 4: 4%
  5: 5,   // Ngày 5: 5%
  6: 6,   // Ngày 6: 6%
  7: 7,   // Ngày 7: 7%
};

// Helper: Lấy ngày đầu tuần (Thứ 2)
export function getWeekStartDate(date: Date = new Date()): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Thứ 2 là ngày đầu tuần
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

// Helper: Kiểm tra cùng ngày
export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

// Helper: Lấy số ngày trong tuần (1 = Thứ 2, 7 = Chủ nhật)
export function getDayOfWeek(date: Date = new Date()): number {
  const day = date.getDay();
  return day === 0 ? 7 : day; // Chủ nhật = 7
}

const DailyCheckInSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    weekStartDate: {
      type: Date,
      required: true,
    },
    checkInDays: {
      type: [Number],
      default: [],
    },
    currentStreak: {
      type: Number,
      default: 0,
    },
    lastCheckInDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Index để query nhanh
DailyCheckInSchema.index({ userId: 1, weekStartDate: 1 }, { unique: true });

export default mongoose.model<IDailyCheckIn>("DailyCheckIn", DailyCheckInSchema);
