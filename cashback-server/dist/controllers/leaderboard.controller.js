"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyRanking = exports.getMyRewards = exports.getRewardHistory = exports.distributeMonthlyRewards = exports.getAllTimeLeaderboard = exports.getTopReferrers = exports.getTopCashbackEarners = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const purchaseHistory_model_1 = __importDefault(require("../models/purchaseHistory.model"));
const leaderboardReward_model_1 = __importDefault(require("../models/leaderboardReward.model"));
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
const getTopCashbackEarners = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { month, year } = req.query;
        const currentDate = new Date();
        const targetMonth = month ? parseInt(month) : currentDate.getMonth() + 1;
        const targetYear = year ? parseInt(year) : currentDate.getFullYear();
        // Tính ngày đầu và cuối tháng
        const startDate = new Date(targetYear, targetMonth - 1, 1);
        const endDate = new Date(targetYear, targetMonth, 0, 23, 59, 59);
        // Aggregate để tính tổng cashback theo user trong tháng
        const topEarners = yield purchaseHistory_model_1.default.aggregate([
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
                    totalPurchases: { $sum: 1 },
                },
            },
            {
                $sort: { totalCashback: -1 },
            },
            {
                $limit: 10,
            },
            {
                $lookup: {
                    from: "users",
                    let: { userIdStr: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: [{ $toString: "$_id" }, "$$userIdStr"],
                                },
                            },
                        },
                    ],
                    as: "userInfo",
                },
            },
            {
                $unwind: {
                    path: "$userInfo",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    _id: 1,
                    totalCashback: 1,
                    totalPurchases: 1,
                    userName: "$userInfo.name",
                    userEmail: "$userInfo.email",
                    userImage: "$userInfo.image",
                },
            },
        ]);
        // Thêm rank cho mỗi user
        const rankedEarners = topEarners.map((earner, index) => (Object.assign(Object.assign({}, earner), { rank: index + 1, reward: index < 3 ? REWARD_CONFIG.cashback[(index + 1)] : 0 })));
        res.json({
            success: true,
            month: targetMonth,
            year: targetYear,
            leaderboard: rankedEarners,
        });
    }
    catch (error) {
        console.error("Error getting top cashback earners:", error);
        res.status(500).json({ success: false, message: "Lỗi server" });
    }
});
exports.getTopCashbackEarners = getTopCashbackEarners;
// Lấy bảng xếp hạng người giới thiệu
const getTopReferrers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { month, year } = req.query;
        const currentDate = new Date();
        const targetMonth = month ? parseInt(month) : currentDate.getMonth() + 1;
        const targetYear = year ? parseInt(year) : currentDate.getFullYear();
        // Tính ngày đầu và cuối tháng
        const startDate = new Date(targetYear, targetMonth - 1, 1);
        const endDate = new Date(targetYear, targetMonth, 0, 23, 59, 59);
        // Lấy tất cả users đăng ký trong tháng với inviteCode
        const usersWithInviteCode = yield user_model_1.default.find({
            createdAt: { $gte: startDate, $lte: endDate },
            inviteCode: { $exists: true, $nin: [null, ""] },
        }).select("inviteCode");
        // Đếm số lượng referrals cho mỗi inviteCode
        const referralCounts = {};
        usersWithInviteCode.forEach((user) => {
            const code = user.inviteCode;
            if (code) {
                referralCounts[code] = (referralCounts[code] || 0) + 1;
            }
        });
        // Tìm users có inviteCode và map với số lượng referrals
        const allUsers = yield user_model_1.default.find({
            email: { $in: Object.keys(referralCounts) },
        }).select("_id name email image");
        const referrersData = allUsers
            .map((user) => ({
            userId: user._id,
            userName: user.name,
            userEmail: user.email,
            userImage: user.image,
            referralCount: referralCounts[user.email] || 0,
        }))
            .filter((r) => r.referralCount > 0)
            .sort((a, b) => b.referralCount - a.referralCount)
            .slice(0, 10);
        // Thêm rank
        const rankedReferrers = referrersData.map((referrer, index) => (Object.assign(Object.assign({}, referrer), { rank: index + 1, reward: index < 3 ? REWARD_CONFIG.referral[(index + 1)] : 0 })));
        res.json({
            success: true,
            month: targetMonth,
            year: targetYear,
            leaderboard: rankedReferrers,
        });
    }
    catch (error) {
        console.error("Error getting top referrers:", error);
        res.status(500).json({ success: false, message: "Lỗi server" });
    }
});
exports.getTopReferrers = getTopReferrers;
// Lấy bảng xếp hạng tổng hợp (all-time)
const getAllTimeLeaderboard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Top cashback all-time
        const topCashback = yield user_model_1.default.find({ role: { $ne: 1 } })
            .sort({ total: -1 })
            .limit(10)
            .select("_id name email image total");
        // Top referrers all-time - đếm số users có inviteCode trỏ đến email của user
        const allUsers = yield user_model_1.default.find({
            inviteCode: { $exists: true, $nin: [null, ""] },
        }).select("inviteCode");
        const referralCounts = {};
        allUsers.forEach((user) => {
            const code = user.inviteCode;
            if (code) {
                referralCounts[code] = (referralCounts[code] || 0) + 1;
            }
        });
        const usersWithReferrals = yield user_model_1.default.find({
            email: { $in: Object.keys(referralCounts) },
            role: { $ne: 1 },
        }).select("_id name email image");
        const topReferrers = usersWithReferrals
            .map((user) => ({
            _id: user._id,
            name: user.name,
            email: user.email,
            image: user.image,
            referralCount: referralCounts[user.email] || 0,
        }))
            .filter((r) => r.referralCount > 0)
            .sort((a, b) => b.referralCount - a.referralCount)
            .slice(0, 10);
        res.json({
            success: true,
            topCashback: topCashback.map((user, index) => ({
                rank: index + 1,
                userId: user._id,
                userName: user.name,
                userEmail: user.email,
                userImage: user.image,
                totalCashback: user.total,
            })),
            topReferrers: topReferrers.map((user, index) => ({
                rank: index + 1,
                userId: user._id,
                userName: user.name,
                userEmail: user.email,
                userImage: user.image,
                referralCount: user.referralCount,
            })),
        });
    }
    catch (error) {
        console.error("Error getting all-time leaderboard:", error);
        res.status(500).json({ success: false, message: "Lỗi server" });
    }
});
exports.getAllTimeLeaderboard = getAllTimeLeaderboard;
// Phát thưởng cho top 3 (Admin only)
const distributeMonthlyRewards = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { month, year } = req.body;
        const user = req.user;
        // Kiểm tra quyền admin
        if (user.role !== 1) {
            return res.status(403).json({ success: false, message: "Không có quyền truy cập" });
        }
        const targetMonth = month || new Date().getMonth(); // Tháng trước
        const targetYear = year || new Date().getFullYear();
        // Kiểm tra xem đã phát thưởng chưa
        const existingRewards = yield leaderboardReward_model_1.default.findOne({
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
        const topCashback = yield purchaseHistory_model_1.default.aggregate([
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
        // Lấy top 3 referrers
        const usersInMonth = yield user_model_1.default.find({
            createdAt: { $gte: startDate, $lte: endDate },
            inviteCode: { $exists: true, $nin: [null, ""] },
        }).select("inviteCode");
        const referralCounts = {};
        usersInMonth.forEach((u) => {
            const code = u.inviteCode;
            if (code) {
                referralCounts[code] = (referralCounts[code] || 0) + 1;
            }
        });
        const topReferrerEmails = Object.entries(referralCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 3);
        const rewards = [];
        // Tạo rewards cho top cashback
        for (let i = 0; i < topCashback.length; i++) {
            const userData = yield user_model_1.default.findById(topCashback[i]._id);
            if (userData) {
                const reward = new leaderboardReward_model_1.default({
                    userId: userData._id,
                    userName: userData.name,
                    userEmail: userData.email,
                    userImage: userData.image,
                    month: targetMonth,
                    year: targetYear,
                    rank: i + 1,
                    type: "cashback",
                    amount: topCashback[i].totalCashback,
                    rewardAmount: REWARD_CONFIG.cashback[(i + 1)],
                });
                yield reward.save();
                // Cộng tiền thưởng vào tài khoản user
                yield user_model_1.default.findByIdAndUpdate(userData._id, {
                    $inc: { money: REWARD_CONFIG.cashback[(i + 1)] },
                });
                rewards.push(reward);
            }
        }
        // Tạo rewards cho top referrers
        for (let i = 0; i < topReferrerEmails.length; i++) {
            const [email, count] = topReferrerEmails[i];
            const userData = yield user_model_1.default.findOne({ email });
            if (userData) {
                const reward = new leaderboardReward_model_1.default({
                    userId: userData._id,
                    userName: userData.name,
                    userEmail: userData.email,
                    userImage: userData.image,
                    month: targetMonth,
                    year: targetYear,
                    rank: i + 1,
                    type: "referral",
                    amount: count,
                    rewardAmount: REWARD_CONFIG.referral[(i + 1)],
                });
                yield reward.save();
                // Cộng tiền thưởng vào tài khoản user
                yield user_model_1.default.findByIdAndUpdate(userData._id, {
                    $inc: { money: REWARD_CONFIG.referral[(i + 1)] },
                });
                rewards.push(reward);
            }
        }
        res.json({
            success: true,
            message: `Đã phát thưởng cho ${rewards.length} người dùng`,
            rewards,
        });
    }
    catch (error) {
        console.error("Error distributing rewards:", error);
        res.status(500).json({ success: false, message: "Lỗi server" });
    }
});
exports.distributeMonthlyRewards = distributeMonthlyRewards;
// Lấy lịch sử phần thưởng
const getRewardHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { month, year, type } = req.query;
        const query = {};
        if (month)
            query.month = parseInt(month);
        if (year)
            query.year = parseInt(year);
        if (type)
            query.type = type;
        const rewards = yield leaderboardReward_model_1.default.find(query)
            .sort({ year: -1, month: -1, rank: 1 })
            .limit(50);
        res.json({
            success: true,
            rewards,
        });
    }
    catch (error) {
        console.error("Error getting reward history:", error);
        res.status(500).json({ success: false, message: "Lỗi server" });
    }
});
exports.getRewardHistory = getRewardHistory;
// Lấy phần thưởng của user hiện tại
const getMyRewards = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const rewards = yield leaderboardReward_model_1.default.find({ userId: user._id })
            .sort({ year: -1, month: -1 })
            .limit(20);
        res.json({
            success: true,
            rewards,
        });
    }
    catch (error) {
        console.error("Error getting user rewards:", error);
        res.status(500).json({ success: false, message: "Lỗi server" });
    }
});
exports.getMyRewards = getMyRewards;
// Lấy thứ hạng của user hiện tại
const getMyRanking = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const user = req.user;
        const { month, year } = req.query;
        const currentDate = new Date();
        const targetMonth = month ? parseInt(month) : currentDate.getMonth() + 1;
        const targetYear = year ? parseInt(year) : currentDate.getFullYear();
        const startDate = new Date(targetYear, targetMonth - 1, 1);
        const endDate = new Date(targetYear, targetMonth, 0, 23, 59, 59);
        // Tính cashback của user trong tháng
        const userCashback = yield purchaseHistory_model_1.default.aggregate([
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
        const myCashback = ((_a = userCashback[0]) === null || _a === void 0 ? void 0 : _a.totalCashback) || 0;
        // Tính rank dựa trên số người có cashback cao hơn
        const higherCashbackCount = yield purchaseHistory_model_1.default.aggregate([
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
        const cashbackRank = (((_b = higherCashbackCount[0]) === null || _b === void 0 ? void 0 : _b.count) || 0) + 1;
        // Đếm số referrals của user trong tháng
        const myReferrals = yield user_model_1.default.countDocuments({
            createdAt: { $gte: startDate, $lte: endDate },
            inviteCode: user.email,
        });
        // Tính rank referral
        const allReferralCounts = yield user_model_1.default.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate, $lte: endDate },
                    inviteCode: { $exists: true, $nin: [null, ""] },
                },
            },
            {
                $group: {
                    _id: "$inviteCode",
                    count: { $sum: 1 },
                },
            },
            {
                $match: {
                    count: { $gt: myReferrals },
                },
            },
            {
                $count: "count",
            },
        ]);
        const referralRank = myReferrals > 0 ? (((_c = allReferralCounts[0]) === null || _c === void 0 ? void 0 : _c.count) || 0) + 1 : null;
        res.json({
            success: true,
            month: targetMonth,
            year: targetYear,
            cashback: {
                amount: myCashback,
                rank: cashbackRank,
            },
            referral: {
                count: myReferrals,
                rank: referralRank,
            },
        });
    }
    catch (error) {
        console.error("Error getting my ranking:", error);
        res.status(500).json({ success: false, message: "Lỗi server" });
    }
});
exports.getMyRanking = getMyRanking;
