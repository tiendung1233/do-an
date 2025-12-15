import { Request, Response } from "express";
import User from "../models/user.model";
import PurchaseHistory from "../models/purchaseHistory.model";
import LeaderboardReward from "../models/leaderboardReward.model";
import ReferralReward from "../models/referralReward.model";

// Cấu hình phần thưởng cho top 3
const REWARD_CONFIG = {
  cashback: {
    1: 100000, // Top 1: 100k
    2: 50000, // Top 2: 50k
    3: 30000, // Top 3: 30k
  },
  referral: {
    1: 150000, // Top 1: 150k
    2: 80000, // Top 2: 80k
    3: 50000, // Top 3: 50k
  },
};

// Lấy bảng xếp hạng cashback theo tháng
export const getTopCashbackEarners = async (req: Request, res: Response) => {
  try {
    const { month, year } = req.query;
    const currentDate = new Date();
    const targetMonth = month ? parseInt(month as string) : currentDate.getMonth() + 1;
    const targetYear = year ? parseInt(year as string) : currentDate.getFullYear();

    // Tính ngày đầu và cuối tháng
    const startDate = new Date(targetYear, targetMonth - 1, 1);
    const endDate = new Date(targetYear, targetMonth, 0, 23, 59, 59, 999);

    console.log("Query params:", { targetMonth, targetYear, startDate, endDate });

    // Debug: Xem tất cả purchase history
    const allPurchases = await PurchaseHistory.find({}).limit(5);
    console.log("Sample purchases:", allPurchases.map(p => ({
      userId: p.userId,
      status: p.status,
      purchaseDate: p.purchaseDate,
      cashback: p.cashback
    })));

    // Aggregate để tính tổng cashback theo user trong tháng
    // Bỏ filter status để lấy tất cả
    const topEarners = await PurchaseHistory.aggregate([
      {
        $match: {
          purchaseDate: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: "$userId",
          totalCashback: { $sum: "$cashback" },
          totalPurchases: { $sum: 1 },
        },
      },
      {
        $sort: { totalCashback: -1 },
      },
      {
        $limit: 10,
      },
    ]);

    console.log("Top earners from aggregate:", topEarners);

    // Lấy thông tin user cho từng earner
    const rankedEarners = await Promise.all(
      topEarners.map(async (earner, index) => {
        const user = await User.findById(earner._id).select("name email image");
        return {
          rank: index + 1,
          userId: earner._id,
          totalCashback: earner.totalCashback,
          totalPurchases: earner.totalPurchases,
          userName: user?.name || "Unknown",
          userEmail: user?.email || "",
          userImage: user?.image || null,
          reward: index < 3 ? REWARD_CONFIG.cashback[(index + 1) as 1 | 2 | 3] : 0,
        };
      })
    );

    res.json({
      success: true,
      month: targetMonth,
      year: targetYear,
      leaderboard: rankedEarners,
    });
  } catch (error) {
    console.error("Error getting top cashback earners:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

// Lấy bảng xếp hạng người giới thiệu
export const getTopReferrers = async (req: Request, res: Response) => {
  try {
    const { month, year } = req.query;
    const currentDate = new Date();
    const targetMonth = month ? parseInt(month as string) : currentDate.getMonth() + 1;
    const targetYear = year ? parseInt(year as string) : currentDate.getFullYear();

    // Tính ngày đầu và cuối tháng
    const startDate = new Date(targetYear, targetMonth - 1, 1);
    const endDate = new Date(targetYear, targetMonth, 0, 23, 59, 59, 999);

    // Dùng ReferralReward model để đếm số người giới thiệu trong tháng
    const topReferrers = await ReferralReward.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: "$referrerId",
          referralCount: { $sum: 1 },
          completedCount: {
            $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
          },
          totalEarned: {
            $sum: {
              $cond: [{ $eq: ["$status", "completed"] }, "$rewardAmount", 0],
            },
          },
        },
      },
      {
        $sort: { referralCount: -1 },
      },
      {
        $limit: 10,
      },
    ]);

    // Lấy thông tin user cho từng referrer
    const rankedReferrers = await Promise.all(
      topReferrers.map(async (referrer, index) => {
        const user = await User.findById(referrer._id).select("name email image");
        return {
          rank: index + 1,
          userId: referrer._id,
          userName: user?.name || "Unknown",
          userEmail: user?.email || "",
          userImage: user?.image || null,
          referralCount: referrer.referralCount,
          completedCount: referrer.completedCount,
          totalEarned: referrer.totalEarned,
          reward: index < 3 ? REWARD_CONFIG.referral[(index + 1) as 1 | 2 | 3] : 0,
        };
      })
    );

    res.json({
      success: true,
      month: targetMonth,
      year: targetYear,
      leaderboard: rankedReferrers,
    });
  } catch (error) {
    console.error("Error getting top referrers:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

// Lấy bảng xếp hạng tổng hợp (all-time)
export const getAllTimeLeaderboard = async (req: Request, res: Response) => {
  try {
    // Top cashback all-time - lấy user có total > 0 hoặc money > 0
    const topCashback = await User.find({
      role: { $ne: 1 },
      $or: [{ total: { $gt: 0 } }, { money: { $gt: 0 } }]
    })
      .sort({ total: -1, money: -1 })
      .limit(10)
      .select("_id name email image total money");

    // Top referrers all-time - dùng ReferralReward model
    const topReferrersData = await ReferralReward.aggregate([
      {
        $group: {
          _id: "$referrerId",
          referralCount: { $sum: 1 },
          completedCount: {
            $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
          },
          totalEarned: {
            $sum: {
              $cond: [{ $eq: ["$status", "completed"] }, "$rewardAmount", 0],
            },
          },
        },
      },
      {
        $sort: { referralCount: -1 },
      },
      {
        $limit: 10,
      },
    ]);

    // Lấy thông tin user cho topReferrers
    const topReferrers = await Promise.all(
      topReferrersData.map(async (referrer) => {
        const user = await User.findById(referrer._id).select("name email image");
        return {
          _id: referrer._id,
          name: user?.name || "Unknown",
          email: user?.email || "",
          image: user?.image || null,
          referralCount: referrer.referralCount,
          completedCount: referrer.completedCount,
          totalEarned: referrer.totalEarned,
        };
      })
    );

    res.json({
      success: true,
      topCashback: topCashback.map((user, index) => ({
        rank: index + 1,
        userId: user._id,
        userName: user.name,
        userEmail: user.email,
        userImage: user.image,
        totalCashback: user.total || user.money || 0,
      })),
      topReferrers: topReferrers.map((user, index) => ({
        rank: index + 1,
        userId: user._id,
        userName: user.name,
        userEmail: user.email,
        userImage: user.image,
        referralCount: user.referralCount,
        completedCount: user.completedCount,
        totalEarned: user.totalEarned,
      })),
    });
  } catch (error) {
    console.error("Error getting all-time leaderboard:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

// Phát thưởng cho top 3 (Admin only)
export const distributeMonthlyRewards = async (req: Request, res: Response) => {
  try {
    const { month, year } = req.body;
    const user = (req as any).user;

    // Kiểm tra quyền admin
    if (user.role !== 1) {
      return res.status(403).json({ success: false, message: "Không có quyền truy cập" });
    }

    const targetMonth = month || new Date().getMonth(); // Tháng trước
    const targetYear = year || new Date().getFullYear();

    // Kiểm tra xem đã phát thưởng chưa
    const existingRewards = await LeaderboardReward.findOne({
      month: targetMonth,
      year: targetYear,
    });

    if (existingRewards) {
      return res.status(400).json({
        success: false,
        message: "Đã phát thưởng cho tháng này rồi",
      });
    }

    // Lấy top 3 cashback
    const startDate = new Date(targetYear, targetMonth - 1, 1);
    const endDate = new Date(targetYear, targetMonth, 0, 23, 59, 59);

    const topCashback = await PurchaseHistory.aggregate([
      {
        $match: {
          purchaseDate: { $gte: startDate, $lte: endDate },
          status: "Đã duyệt",
        },
      },
      {
        $group: {
          _id: "$userId",
          totalCashback: { $sum: "$cashback" },
        },
      },
      { $sort: { totalCashback: -1 } },
      { $limit: 3 },
    ]);

    // Lấy top 3 referrers từ ReferralReward model
    const topReferrersData = await ReferralReward.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: "$referrerId",
          referralCount: { $sum: 1 },
        },
      },
      { $sort: { referralCount: -1 } },
      { $limit: 3 },
    ]);

    const rewards: any[] = [];

    // Tạo rewards cho top cashback
    for (let i = 0; i < topCashback.length; i++) {
      const userData = await User.findById(topCashback[i]._id);
      if (userData) {
        const reward = new LeaderboardReward({
          userId: userData._id,
          userName: userData.name,
          userEmail: userData.email,
          userImage: userData.image,
          month: targetMonth,
          year: targetYear,
          rank: i + 1,
          type: "cashback",
          amount: topCashback[i].totalCashback,
          rewardAmount: REWARD_CONFIG.cashback[(i + 1) as 1 | 2 | 3],
        });
        await reward.save();

        // Cộng tiền thưởng vào tài khoản user
        await User.findByIdAndUpdate(userData._id, {
          $inc: { money: REWARD_CONFIG.cashback[(i + 1) as 1 | 2 | 3] },
        });

        rewards.push(reward);
      }
    }

    // Tạo rewards cho top referrers
    for (let i = 0; i < topReferrersData.length; i++) {
      const referrerData = topReferrersData[i];
      const userData = await User.findById(referrerData._id);
      if (userData) {
        const reward = new LeaderboardReward({
          userId: userData._id,
          userName: userData.name,
          userEmail: userData.email,
          userImage: userData.image,
          month: targetMonth,
          year: targetYear,
          rank: i + 1,
          type: "referral",
          amount: referrerData.referralCount,
          rewardAmount: REWARD_CONFIG.referral[(i + 1) as 1 | 2 | 3],
        });
        await reward.save();

        // Cộng tiền thưởng vào tài khoản user
        await User.findByIdAndUpdate(userData._id, {
          $inc: { money: REWARD_CONFIG.referral[(i + 1) as 1 | 2 | 3] },
        });

        rewards.push(reward);
      }
    }

    res.json({
      success: true,
      message: `Đã phát thưởng cho ${rewards.length} người dùng`,
      rewards,
    });
  } catch (error) {
    console.error("Error distributing rewards:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

// Lấy lịch sử phần thưởng
export const getRewardHistory = async (req: Request, res: Response) => {
  try {
    const { month, year, type } = req.query;

    const query: any = {};
    if (month) query.month = parseInt(month as string);
    if (year) query.year = parseInt(year as string);
    if (type) query.type = type;

    const rewards = await LeaderboardReward.find(query)
      .sort({ year: -1, month: -1, rank: 1 })
      .limit(50);

    res.json({
      success: true,
      rewards,
    });
  } catch (error) {
    console.error("Error getting reward history:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

// Lấy phần thưởng của user hiện tại
export const getMyRewards = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    const rewards = await LeaderboardReward.find({ userId: user._id })
      .sort({ year: -1, month: -1 })
      .limit(20);

    res.json({
      success: true,
      rewards,
    });
  } catch (error) {
    console.error("Error getting user rewards:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

// Lấy thứ hạng của user hiện tại
export const getMyRanking = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { month, year } = req.query;
    const currentDate = new Date();
    const targetMonth = month ? parseInt(month as string) : currentDate.getMonth() + 1;
    const targetYear = year ? parseInt(year as string) : currentDate.getFullYear();

    const startDate = new Date(targetYear, targetMonth - 1, 1);
    const endDate = new Date(targetYear, targetMonth, 0, 23, 59, 59);

    // Tính cashback của user trong tháng
    const userCashback = await PurchaseHistory.aggregate([
      {
        $match: {
          userId: user._id.toString(),
          purchaseDate: { $gte: startDate, $lte: endDate },
          status: "Đã duyệt",
        },
      },
      {
        $group: {
          _id: null,
          totalCashback: { $sum: "$cashback" },
        },
      },
    ]);

    const myCashback = userCashback[0]?.totalCashback || 0;

    // Tính rank dựa trên số người có cashback cao hơn
    const higherCashbackCount = await PurchaseHistory.aggregate([
      {
        $match: {
          purchaseDate: { $gte: startDate, $lte: endDate },
          status: "Đã duyệt",
        },
      },
      {
        $group: {
          _id: "$userId",
          totalCashback: { $sum: "$cashback" },
        },
      },
      {
        $match: {
          totalCashback: { $gt: myCashback },
        },
      },
      {
        $count: "count",
      },
    ]);

    const cashbackRank = (higherCashbackCount[0]?.count || 0) + 1;

    // Đếm số referrals của user trong tháng (dùng ReferralReward model)
    const myReferralsCount = await ReferralReward.countDocuments({
      referrerId: user._id,
      createdAt: { $gte: startDate, $lte: endDate },
    });

    // Tính rank referral dựa trên ReferralReward
    const allReferralCounts = await ReferralReward.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: "$referrerId",
          count: { $sum: 1 },
        },
      },
      {
        $match: {
          count: { $gt: myReferralsCount },
        },
      },
      {
        $count: "count",
      },
    ]);

    const referralRank = myReferralsCount > 0 ? (allReferralCounts[0]?.count || 0) + 1 : null;

    res.json({
      success: true,
      month: targetMonth,
      year: targetYear,
      cashback: {
        amount: myCashback,
        rank: cashbackRank,
      },
      referral: {
        count: myReferralsCount,
        rank: referralRank,
      },
    });
  } catch (error) {
    console.error("Error getting my ranking:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};
