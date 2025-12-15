import { Router } from "express";
import {
  getCheckInStatus,
  doCheckIn,
  getCheckInHistory,
  getCheckInRewards,
} from "../controllers/checkIn.controller";
import { protect } from "../middleware/auth";

const router = Router();

// Public routes
router.get("/rewards", getCheckInRewards); // Lấy bảng phần thưởng

// Protected routes (cần đăng nhập)
router.get("/status", protect, getCheckInStatus);    // Lấy trạng thái điểm danh
router.post("/do", protect, doCheckIn);              // Thực hiện điểm danh
router.get("/history", protect, getCheckInHistory);  // Lịch sử điểm danh

export default router;
