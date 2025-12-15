import { Request, Response } from "express";
import DailyCheckIn, {
  CHECKIN_REWARDS,
  getWeekStartDate,
  isSameDay,
  getDayOfWeek,
} from "../models/dailyCheckIn.model";
import Voucher, { generateVoucherCode } from "../models/voucher.model";

// Lấy trạng thái điểm danh của user
export const getCheckInStatus = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any)._id;
    const today = new Date();
    const weekStart = getWeekStartDate(today);
    const currentDayOfWeek = getDayOfWeek(today);

    // Tìm hoặc tạo record check-in cho tuần này
    let checkIn = await DailyCheckIn.findOne({
      userId,
      weekStartDate: weekStart,
    });

    // Nếu chưa có record cho tuần này, tạo mới
    if (!checkIn) {
      checkIn = await DailyCheckIn.create({
        userId,
        weekStartDate: weekStart,
        checkInDays: [],
        currentStreak: 0,
        lastCheckInDate: null,
      });
    }

    // Kiểm tra đã điểm danh hôm nay chưa
    const hasCheckedInToday = checkIn.lastCheckInDate
      ? isSameDay(checkIn.lastCheckInDate, today)
      : false;

    // Tạo danh sách các ngày với trạng thái
    const days = [];
    for (let i = 1; i <= 7; i++) {
      days.push({
        day: i,
        percentage: CHECKIN_REWARDS[i],
        isCheckedIn: checkIn.checkInDays.includes(i),
        isToday: i === currentDayOfWeek,
        canCheckIn: i === currentDayOfWeek && !hasCheckedInToday,
      });
    }

    res.json({
      success: true,
      weekStartDate: weekStart,
      currentStreak: checkIn.currentStreak,
      checkInDays: checkIn.checkInDays,
      hasCheckedInToday,
      currentDayOfWeek,
      days,
    });
  } catch (error) {
    console.error("Error getting check-in status:", error);
    res.status(500).json({ success: false, message: "Loi server" });
  }
};

// Thực hiện điểm danh
export const doCheckIn = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any)._id;
    const today = new Date();
    const weekStart = getWeekStartDate(today);
    const currentDayOfWeek = getDayOfWeek(today);

    // Tìm hoặc tạo record check-in cho tuần này
    let checkIn = await DailyCheckIn.findOne({
      userId,
      weekStartDate: weekStart,
    });

    if (!checkIn) {
      checkIn = await DailyCheckIn.create({
        userId,
        weekStartDate: weekStart,
        checkInDays: [],
        currentStreak: 0,
        lastCheckInDate: null,
      });
    }

    // Kiểm tra đã điểm danh hôm nay chưa
    if (checkIn.lastCheckInDate && isSameDay(checkIn.lastCheckInDate, today)) {
      return res.status(400).json({
        success: false,
        message: "Ban da diem danh hom nay roi",
      });
    }

    // Kiểm tra ngày đã điểm danh chưa
    if (checkIn.checkInDays.includes(currentDayOfWeek)) {
      return res.status(400).json({
        success: false,
        message: "Ngay nay da duoc diem danh",
      });
    }

    // Thêm ngày hiện tại vào danh sách đã điểm danh
    checkIn.checkInDays.push(currentDayOfWeek);
    checkIn.currentStreak = checkIn.checkInDays.length;
    checkIn.lastCheckInDate = today;
    await checkIn.save();

    // Tạo voucher cho user
    const percentage = CHECKIN_REWARDS[currentDayOfWeek];

    // Tính ngày hết hạn (cuối tuần - Chủ nhật 23:59:59)
    const expiresAt = new Date(weekStart);
    expiresAt.setDate(expiresAt.getDate() + 6); // Chủ nhật
    expiresAt.setHours(23, 59, 59, 999);

    // Tạo mã voucher unique
    let voucherCode = generateVoucherCode();
    let attempts = 0;
    while (attempts < 100) {
      const existing = await Voucher.findOne({ code: voucherCode });
      if (!existing) break;
      voucherCode = generateVoucherCode();
      attempts++;
    }

    const voucher = await Voucher.create({
      userId,
      code: voucherCode,
      percentage,
      dayNumber: currentDayOfWeek,
      status: "active",
      expiresAt,
    });

    res.json({
      success: true,
      message: `Diem danh thanh cong! Ban nhan duoc voucher ${percentage}%`,
      checkIn: {
        currentStreak: checkIn.currentStreak,
        checkInDays: checkIn.checkInDays,
      },
      voucher: {
        code: voucher.code,
        percentage: voucher.percentage,
        expiresAt: voucher.expiresAt,
      },
    });
  } catch (error) {
    console.error("Error doing check-in:", error);
    res.status(500).json({ success: false, message: "Loi server" });
  }
};

// Lấy lịch sử điểm danh
export const getCheckInHistory = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any)._id;

    const history = await DailyCheckIn.find({ userId })
      .sort({ weekStartDate: -1 })
      .limit(10);

    res.json({
      success: true,
      history,
    });
  } catch (error) {
    console.error("Error getting check-in history:", error);
    res.status(500).json({ success: false, message: "Loi server" });
  }
};

// Lấy bảng phần thưởng điểm danh
export const getCheckInRewards = async (_req: Request, res: Response) => {
  try {
    const rewards = Object.entries(CHECKIN_REWARDS).map(([day, percentage]) => ({
      day: parseInt(day),
      percentage,
      label: `Ngay ${day}`,
    }));

    res.json({
      success: true,
      rewards,
    });
  } catch (error) {
    console.error("Error getting check-in rewards:", error);
    res.status(500).json({ success: false, message: "Loi server" });
  }
};
