"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const leaderboard_controller_1 = require("../controllers/leaderboard.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Public routes (vẫn cần login)
router.get("/cashback", auth_1.protect, leaderboard_controller_1.getTopCashbackEarners);
router.get("/referral", auth_1.protect, leaderboard_controller_1.getTopReferrers);
router.get("/all-time", auth_1.protect, leaderboard_controller_1.getAllTimeLeaderboard);
router.get("/my-ranking", auth_1.protect, leaderboard_controller_1.getMyRanking);
router.get("/my-rewards", auth_1.protect, leaderboard_controller_1.getMyRewards);
// Admin routes
router.get("/rewards", auth_1.protect, leaderboard_controller_1.getRewardHistory);
router.post("/distribute-rewards", auth_1.protect, leaderboard_controller_1.distributeMonthlyRewards);
exports.default = router;
