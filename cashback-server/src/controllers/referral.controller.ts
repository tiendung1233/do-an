import { Request, Response } from "express";
import User, { generateReferralCode } from "../models/user.model";
import ReferralReward, { REFERRAL_REWARDS, DEFAULT_REFERRAL_REWARD } from "../models/referralReward.model";
import PurchaseHistory from "../models/purchaseHistory.model";

// Lấy mã giới thiệu của user hiện tại
export const getMyReferralCode = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any)._id;
    const user = await User.findById(userId).select("referralCode");

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    // Nếu chưa có mã, tạo mới
    if (!user.referralCode) {
      let code = generateReferralCode();
      let attempts = 0;

      // Đảm bảo mã unique
      while (attempts < 100) {
        const existing = await User.findOne({ referralCode: code });
        if (!existing) break;
        code = generateReferralCode();
        attempts++;
      }

      user.referralCode = code;
      await user.save();
    }

    res.json({ referralCode: user.referralCode });
  } catch (error) {
    console.error("Error getting referral code:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Lấy danh sách người đã giới thiệu
export const getMyReferrals = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any)._id;

    // Lấy tất cả referral rewards của user
    const referrals = await ReferralReward.find({ referrerId: userId })
      .populate("referredUserId", "name email image createdAt")
      .sort({ createdAt: -1 });

    // Thống kê
    const stats = {
      total: referrals.length,
      pending: referrals.filter((r) => r.status === "pending").length,
      completed: referrals.filter((r) => r.status === "completed").length,
      totalEarned: referrals
        .filter((r) => r.status === "completed")
        .reduce((sum, r) => sum + r.rewardAmount, 0),
    };

    res.json({ referrals, stats });
  } catch (error) {
    console.error("Error getting referrals:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Check và cộng thưởng khi login
export const checkAndRewardReferrals = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any)._id;

    // Tìm tất cả referral rewards pending của user
    const pendingRewards = await ReferralReward.find({
      referrerId: userId,
      status: "pending",
    });

    if (pendingRewards.length === 0) {
      return res.json({ rewarded: false, amount: 0, message: "Không có thưởng mới" });
    }

    let totalRewarded = 0;
    const rewardedReferrals: string[] = [];

    for (const reward of pendingRewards) {
      // Check xem người được giới thiệu đã có đơn hàng chưa
      const hasPurchase = await PurchaseHistory.findOne({
        userId: reward.referredUserId,
      });

      if (hasPurchase) {
        // Cộng tiền thưởng cho người giới thiệu
        const user = await User.findById(userId);
        if (user) {
          user.money = (user.money || 0) + reward.rewardAmount;
          await user.save();

          // Cập nhật trạng thái reward
          reward.status = "completed";
          reward.completedAt = new Date();
          await reward.save();

          totalRewarded += reward.rewardAmount;

          // Lấy tên người được giới thiệu
          const referredUser = await User.findById(reward.referredUserId).select("name");
          rewardedReferrals.push(referredUser?.name || "Người dùng");
        }
      }
    }

    if (totalRewarded > 0) {
      res.json({
        rewarded: true,
        amount: totalRewarded,
        referrals: rewardedReferrals,
        message: `Chúc mừng! Bạn nhận được ${totalRewarded.toLocaleString("vi-VN")}đ từ giới thiệu bạn bè!`,
      });
    } else {
      res.json({
        rewarded: false,
        amount: 0,
        message: "Người bạn giới thiệu chưa phát sinh đơn hàng",
      });
    }
  } catch (error) {
    console.error("Error checking referral rewards:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Validate mã giới thiệu (dùng khi đăng ký)
export const validateReferralCode = async (req: Request, res: Response) => {
  try {
    const { referralCode } = req.body;

    if (!referralCode) {
      return res.json({ valid: false, message: "Mã giới thiệu trống" });
    }

    const referrer = await User.findOne({ referralCode: referralCode.toUpperCase() });

    if (!referrer) {
      return res.json({ valid: false, message: "Mã giới thiệu không tồn tại" });
    }

    res.json({
      valid: true,
      referrerName: referrer.name,
      message: `Mã giới thiệu của ${referrer.name}`,
    });
  } catch (error) {
    console.error("Error validating referral code:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Lấy bảng thưởng
export const getRewardTable = async (req: Request, res: Response) => {
  try {
    const rewardTable = Object.entries(REFERRAL_REWARDS).map(([number, amount]) => ({
      referralNumber: parseInt(number),
      rewardAmount: amount,
      label: `Nguoi thu ${number}`,
    }));

    // Thêm thông tin cho người thứ 4+
    rewardTable.push({
      referralNumber: 4,
      rewardAmount: DEFAULT_REFERRAL_REWARD,
      label: "Nguoi thu 4 tro di",
    });

    res.json({
      rewards: rewardTable,
      defaultReward: DEFAULT_REFERRAL_REWARD,
    });
  } catch (error) {
    console.error("Error getting reward table:", error);
    res.status(500).json({ message: "Loi server" });
  }
};
