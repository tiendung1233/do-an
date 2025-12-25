import { Request, Response } from "express";
import mongoose from "mongoose";
import User, { MembershipTier } from "../models/user.model";
import MembershipHistory, {
  calculateMembershipTier,
  getNextTier,
  getAmountToNextTier,
  MEMBERSHIP_THRESHOLDS,
  MEMBERSHIP_CASHBACK_BONUS,
  MEMBERSHIP_VOUCHER_REWARD,
  MEMBERSHIP_INFO,
} from "../models/membership.model";
import Voucher, { generateVoucherCode } from "../models/voucher.model";
import PurchaseHistory from "../models/purchaseHistory.model";

// Lấy thông tin membership của user
export const getMyMembership = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any)._id;

    const user = await User.findById(userId).select(
      "membershipTier totalSpent name"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Khong tim thay user",
      });
    }

    // Tính tổng tiền từ các đơn hàng đã duyệt (thay vì lấy từ user.totalSpent)
    const result = await PurchaseHistory.aggregate([
      {
        $match: {
          userId: userId.toString(),
          status: "Đã duyệt",
        },
      },
      {
        $group: {
          _id: null,
          totalSpent: { $sum: "$price" },
        },
      },
    ]);

    const totalSpent = result[0]?.totalSpent || 0;
    const currentTier = user.membershipTier || "none";
    const nextTier = getNextTier(currentTier);
    const amountToNext = getAmountToNextTier(totalSpent, currentTier);

    // Tính % tiến trình đến hạng tiếp theo
    let progressPercent = 100;
    if (nextTier) {
      const currentThreshold = MEMBERSHIP_THRESHOLDS[currentTier];
      const nextThreshold = MEMBERSHIP_THRESHOLDS[nextTier];
      const range = nextThreshold - currentThreshold;
      const progress = totalSpent - currentThreshold;
      progressPercent = Math.min(100, Math.round((progress / range) * 100));
    }

    res.json({
      success: true,
      membership: {
        tier: currentTier,
        tierInfo: MEMBERSHIP_INFO[currentTier],
        totalSpent: totalSpent,
        cashbackBonus: MEMBERSHIP_CASHBACK_BONUS[currentTier],
        nextTier,
        nextTierInfo: nextTier ? MEMBERSHIP_INFO[nextTier] : null,
        amountToNextTier: amountToNext,
        progressPercent,
      },
      thresholds: MEMBERSHIP_THRESHOLDS,
      bonuses: MEMBERSHIP_CASHBACK_BONUS,
      voucherRewards: MEMBERSHIP_VOUCHER_REWARD,
      tierInfo: MEMBERSHIP_INFO,
    });
  } catch (error) {
    console.error("Error getting membership:", error);
    res.status(500).json({ success: false, message: "Loi server" });
  }
};

// Cập nhật membership tier (gọi khi đơn hàng được duyệt)
export const updateMembershipTier = async (userId: string): Promise<{
  upgraded: boolean;
  previousTier: MembershipTier;
  newTier: MembershipTier;
  voucherCode?: string;
}> => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  // Tính tổng tiền từ các đơn hàng đã duyệt
  const result = await PurchaseHistory.aggregate([
    {
      $match: {
        userId: userId,
        status: "Đã duyệt",
      },
    },
    {
      $group: {
        _id: null,
        totalSpent: { $sum: "$price" },
      },
    },
  ]);

  const totalSpent = result[0]?.totalSpent || 0;
  const previousTier = (user.membershipTier || "none") as MembershipTier;
  const newTier = calculateMembershipTier(totalSpent);

  // Cập nhật user
  user.totalSpent = totalSpent;
  user.membershipTier = newTier;
  await user.save();

  // Kiểm tra có thăng hạng không
  const tierOrder: MembershipTier[] = ["none", "bronze", "silver", "gold"];
  const previousIndex = tierOrder.indexOf(previousTier);
  const newIndex = tierOrder.indexOf(newTier);

  if (newIndex > previousIndex) {
    // Thăng hạng - tạo voucher thưởng
    const voucherPercentage = MEMBERSHIP_VOUCHER_REWARD[newTier];

    // Tạo voucher hết hạn sau 30 ngày
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    let voucherCode = generateVoucherCode();
    let attempts = 0;
    while (attempts < 100) {
      const existing = await Voucher.findOne({ code: voucherCode });
      if (!existing) break;
      voucherCode = generateVoucherCode();
      attempts++;
    }

    const voucher = await Voucher.create({
      userId: user._id,
      code: voucherCode,
      percentage: voucherPercentage,
      dayNumber: 0,  // 0 = voucher thăng hạng
      status: "active",
      expiresAt,
    });

    // Lưu lịch sử thăng hạng
    await MembershipHistory.create({
      userId: user._id,
      previousTier,
      newTier,
      totalSpentAtUpgrade: totalSpent,
      voucherAwarded: voucher._id,
    });

    return {
      upgraded: true,
      previousTier,
      newTier,
      voucherCode,
    };
  }

  return {
    upgraded: false,
    previousTier,
    newTier,
  };
};

// API endpoint để check và update membership
export const checkMembershipUpgrade = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any)._id;

    const result = await updateMembershipTier(userId.toString());

    if (result.upgraded) {
      res.json({
        success: true,
        upgraded: true,
        message: `Chuc mung! Ban da thang hang len ${MEMBERSHIP_INFO[result.newTier].nameVi}!`,
        previousTier: result.previousTier,
        newTier: result.newTier,
        tierInfo: MEMBERSHIP_INFO[result.newTier],
        voucherCode: result.voucherCode,
        voucherPercentage: MEMBERSHIP_VOUCHER_REWARD[result.newTier],
      });
    } else {
      res.json({
        success: true,
        upgraded: false,
        message: "Chua du dieu kien thang hang",
        currentTier: result.newTier,
      });
    }
  } catch (error) {
    console.error("Error checking membership upgrade:", error);
    res.status(500).json({ success: false, message: "Loi server" });
  }
};

// Lấy lịch sử thăng hạng
export const getMembershipHistory = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any)._id;

    const history = await MembershipHistory.find({ userId })
      .populate("voucherAwarded", "code percentage status")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      history: history.map((h) => ({
        _id: h._id,
        previousTier: h.previousTier,
        previousTierInfo: MEMBERSHIP_INFO[h.previousTier],
        newTier: h.newTier,
        newTierInfo: MEMBERSHIP_INFO[h.newTier],
        totalSpentAtUpgrade: h.totalSpentAtUpgrade,
        voucherAwarded: h.voucherAwarded,
        createdAt: h.createdAt,
      })),
    });
  } catch (error) {
    console.error("Error getting membership history:", error);
    res.status(500).json({ success: false, message: "Loi server" });
  }
};

// Lấy bảng thông tin hạng (public)
export const getMembershipInfo = async (_req: Request, res: Response) => {
  try {
    const tiers = ["bronze", "silver", "gold"] as MembershipTier[];

    const info = tiers.map((tier) => ({
      tier,
      ...MEMBERSHIP_INFO[tier],
      threshold: MEMBERSHIP_THRESHOLDS[tier],
      cashbackBonus: MEMBERSHIP_CASHBACK_BONUS[tier],
      voucherReward: MEMBERSHIP_VOUCHER_REWARD[tier],
    }));

    res.json({
      success: true,
      tiers: info,
    });
  } catch (error) {
    console.error("Error getting membership info:", error);
    res.status(500).json({ success: false, message: "Loi server" });
  }
};
