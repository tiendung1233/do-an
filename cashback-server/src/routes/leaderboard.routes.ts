import { Router } from "express";
import {
  getTopCashbackEarners,
  getTopReferrers,
  getAllTimeLeaderboard,
  distributeMonthlyRewards,
  getRewardHistory,
  getMyRewards,
  getMyRanking,
} from "../controllers/leaderboard.controller";
import { protect } from "../middleware/auth";

const router = Router();

// Public routes (vẫn cần login)
router.get("/cashback", protect, getTopCashbackEarners);
router.get("/referral", protect, getTopReferrers);
router.get("/all-time", protect, getAllTimeLeaderboard);
router.get("/my-ranking", protect, getMyRanking);
router.get("/my-rewards", protect, getMyRewards);

// Admin routes
router.get("/rewards", protect, getRewardHistory);
router.post("/distribute-rewards", protect, distributeMonthlyRewards);

export default router;
