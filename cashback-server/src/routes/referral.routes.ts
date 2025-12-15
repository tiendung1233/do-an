import { Router } from "express";
import {
  getMyReferralCode,
  getMyReferrals,
  checkAndRewardReferrals,
  validateReferralCode,
  getRewardTable,
} from "../controllers/referral.controller";
import { protect } from "../middleware/auth";

const router = Router();

// Public routes
router.post("/validate", validateReferralCode);  // Validate mã khi đăng ký
router.get("/reward-table", getRewardTable);     // Lấy bảng thưởng

// Protected routes (cần đăng nhập)
router.get("/my-code", protect, getMyReferralCode);           // Lấy mã giới thiệu của mình
router.get("/my-referrals", protect, getMyReferrals);         // Danh sách người đã giới thiệu
router.post("/check-rewards", protect, checkAndRewardReferrals);  // Check và nhận thưởng

export default router;
