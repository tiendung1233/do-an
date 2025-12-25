import { Request, Response } from "express";
import SpinWheel, { SPIN_MILESTONES, SPIN_PRIZES } from "../models/spinWheel.model";
import User from "../models/user.model";
import PurchaseHistory from "../models/purchaseHistory.model";
import Voucher from "../models/voucher.model";

// Lấy thông tin vòng quay của user
export const getSpinWheelInfo = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any)?._id?.toString();
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Tìm hoặc tạo mới spin wheel cho user
    let spinWheel = await SpinWheel.findOne({ userId });
    if (!spinWheel) {
      spinWheel = await SpinWheel.create({ userId });
    }

    // Lấy số đơn hàng đã duyệt của user
    const approvedOrders = await PurchaseHistory.countDocuments({
      userId,
      status: "Đã duyệt",
    });

    // Tìm mốc tiếp theo
    const nextMilestone = SPIN_MILESTONES.find(
      (m) => m.orders > spinWheel!.lastMilestoneReached && m.orders > approvedOrders
    );

    res.json({
      success: true,
      data: {
        availableSpins: spinWheel.availableSpins,
        totalSpins: spinWheel.totalSpins,
        totalSpinsUsed: spinWheel.totalSpinsUsed,
        totalCashWon: spinWheel.totalCashWon,
        totalVouchersWon: spinWheel.totalVouchersWon,
        approvedOrders,
        lastMilestoneReached: spinWheel.lastMilestoneReached,
        nextMilestone: nextMilestone
          ? {
              orders: nextMilestone.orders,
              spins: nextMilestone.spins,
              ordersNeeded: nextMilestone.orders - approvedOrders,
            }
          : null,
        milestones: SPIN_MILESTONES,
        prizes: SPIN_PRIZES,
        recentHistory: spinWheel.spinHistory.slice(-10).reverse(),
      },
    });
  } catch (error) {
    console.error("Error getting spin wheel info:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

// Thực hiện quay
export const spin = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any)?._id?.toString();
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const spinWheel = await SpinWheel.findOne({ userId });
    if (!spinWheel) {
      return res.status(404).json({ success: false, message: "Không tìm thấy thông tin vòng quay" });
    }

    if (spinWheel.availableSpins <= 0) {
      return res.status(400).json({ success: false, message: "Bạn không còn lượt quay nào" });
    }

    // Tính toán giải thưởng dựa trên xác suất
    const prize = calculatePrize();

    // Xử lý giải thưởng
    let voucherCode: string | undefined;

    if (prize.type === "cash") {
      // Cộng tiền vào tài khoản user (field money)
      await User.findByIdAndUpdate(userId, {
        $inc: { money: prize.value },
      });
      spinWheel.totalCashWon += prize.value;
    } else if (prize.type === "voucher") {
      // Tạo voucher cho user
      const voucher = await createVoucherForUser(userId, prize.value);
      voucherCode = voucher.code;
      spinWheel.totalVouchersWon += 1;
    }

    // Cập nhật lịch sử quay
    spinWheel.spinHistory.push({
      spunAt: new Date(),
      prizeType: prize.type as "cash" | "voucher" | "luck",
      prizeValue: prize.value,
      voucherCode,
    });

    spinWheel.availableSpins -= 1;
    spinWheel.totalSpinsUsed += 1;

    await spinWheel.save();

    res.json({
      success: true,
      data: {
        prize: {
          ...prize,
          voucherCode,
        },
        remainingSpins: spinWheel.availableSpins,
      },
    });
  } catch (error) {
    console.error("Error spinning:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

// Kiểm tra và tặng lượt quay khi đạt mốc
export const checkAndAwardSpins = async (userId: string): Promise<{ awarded: boolean; spins: number; milestone: number }> => {
  try {
    // Lấy số đơn hàng đã duyệt
    const approvedOrders = await PurchaseHistory.countDocuments({
      userId,
      status: "Đã duyệt",
    });

    // Tìm hoặc tạo spin wheel
    let spinWheel = await SpinWheel.findOne({ userId });
    if (!spinWheel) {
      spinWheel = await SpinWheel.create({ userId });
    }

    // Kiểm tra các mốc chưa đạt
    const unclaimedMilestones = SPIN_MILESTONES.filter(
      (m) => m.orders <= approvedOrders && m.orders > spinWheel!.lastMilestoneReached
    );

    if (unclaimedMilestones.length === 0) {
      return { awarded: false, spins: 0, milestone: 0 };
    }

    // Lấy mốc cao nhất đạt được
    const highestMilestone = unclaimedMilestones[unclaimedMilestones.length - 1];

    // Tính tổng số lượt quay được thưởng từ các mốc chưa nhận
    const totalSpinsAwarded = unclaimedMilestones.reduce((sum, m) => sum + m.spins, 0);

    // Cập nhật spin wheel
    spinWheel.availableSpins += totalSpinsAwarded;
    spinWheel.totalSpins += totalSpinsAwarded;
    spinWheel.lastMilestoneReached = highestMilestone.orders;
    await spinWheel.save();

    return {
      awarded: true,
      spins: totalSpinsAwarded,
      milestone: highestMilestone.orders,
    };
  } catch (error) {
    console.error("Error checking and awarding spins:", error);
    return { awarded: false, spins: 0, milestone: 0 };
  }
};

// Lấy lịch sử quay
export const getSpinHistory = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any)?._id?.toString();
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const spinWheel = await SpinWheel.findOne({ userId });
    if (!spinWheel) {
      return res.json({ success: true, data: [] });
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const history = spinWheel.spinHistory
      .slice()
      .reverse()
      .slice(skip, skip + limit);

    res.json({
      success: true,
      data: history,
      total: spinWheel.spinHistory.length,
      page,
      pages: Math.ceil(spinWheel.spinHistory.length / limit),
    });
  } catch (error) {
    console.error("Error getting spin history:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

// Helper: Tính toán giải thưởng dựa trên xác suất
function calculatePrize() {
  const totalProbability = SPIN_PRIZES.reduce((sum, p) => sum + p.probability, 0);
  const random = Math.random() * totalProbability;

  let cumulative = 0;
  for (const prize of SPIN_PRIZES) {
    cumulative += prize.probability;
    if (random <= cumulative) {
      return prize;
    }
  }

  // Fallback to luck
  return SPIN_PRIZES.find((p) => p.type === "luck") || SPIN_PRIZES[SPIN_PRIZES.length - 1];
}

// Helper: Tạo voucher cho user
async function createVoucherForUser(userId: string, percentage: number) {
  const code = `SPIN${Date.now()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30); // Hết hạn sau 30 ngày

  const voucher = await Voucher.create({
    userId,
    code,
    percentage,
    source: "spin_wheel",
    status: "active",
    expiresAt,
  });

  return voucher;
}

// Admin: Tặng lượt quay thủ công
export const adminAwardSpins = async (req: Request, res: Response) => {
  try {
    if (!req.user || (req.user as any).role <= 0) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const { userId, spins, reason } = req.body;

    if (!userId || !spins || spins <= 0) {
      return res.status(400).json({ success: false, message: "Thiếu thông tin" });
    }

    let spinWheel = await SpinWheel.findOne({ userId });
    if (!spinWheel) {
      spinWheel = await SpinWheel.create({ userId });
    }

    spinWheel.availableSpins += spins;
    spinWheel.totalSpins += spins;
    await spinWheel.save();

    res.json({
      success: true,
      message: `Đã tặng ${spins} lượt quay cho user`,
      data: {
        availableSpins: spinWheel.availableSpins,
        totalSpins: spinWheel.totalSpins,
      },
    });
  } catch (error) {
    console.error("Error awarding spins:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};
