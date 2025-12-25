import express from "express";
import { protect } from "../middleware/auth";
import {
  getAnalyticsOverview,
  getOrdersChart,
  getRevenueChart,
  getUsersChart,
  getAllAnalytics,
} from "../controllers/analytics.controller";

const router = express.Router();

// Tất cả routes cần authentication
router.use(protect);

// Lấy tổng quan
router.get("/overview", getAnalyticsOverview);

// Lấy biểu đồ đơn hàng
router.get("/orders", getOrdersChart);

// Lấy biểu đồ doanh thu
router.get("/revenue", getRevenueChart);

// Lấy biểu đồ người dùng
router.get("/users", getUsersChart);

// Lấy tất cả dữ liệu analytics (gộp tất cả)
router.get("/all", getAllAnalytics);

export default router;
