import express from "express";
import { protect } from "../middleware/auth";
import {
  getSpinWheelInfo,
  spin,
  getSpinHistory,
  adminAwardSpins,
} from "../controllers/spinWheel.controller";

const router = express.Router();

// Tất cả routes cần authentication
router.use(protect);

// Lấy thông tin vòng quay (số lượt, giải thưởng, mốc...)
router.get("/info", getSpinWheelInfo);

// Thực hiện quay
router.post("/spin", spin);

// Lấy lịch sử quay
router.get("/history", getSpinHistory);

// Admin: Tặng lượt quay
router.post("/admin/award", adminAwardSpins);

export default router;
