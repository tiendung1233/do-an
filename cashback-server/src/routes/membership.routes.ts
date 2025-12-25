import { Router } from "express";
import {
  getMyMembership,
  checkMembershipUpgrade,
  getMembershipHistory,
  getMembershipInfo,
} from "../controllers/membership.controller";
import { protect } from "../middleware/auth";

const router = Router();

// Public routes
router.get("/info", getMembershipInfo);  // Lấy bảng thông tin hạng

// Protected routes (cần đăng nhập)
router.get("/my-membership", protect, getMyMembership);       // Lấy membership của user
router.post("/check-upgrade", protect, checkMembershipUpgrade);  // Check và update hạng
router.get("/history", protect, getMembershipHistory);        // Lịch sử thăng hạng

export default router;
