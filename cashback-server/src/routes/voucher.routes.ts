import { Router } from "express";
import {
  getMyVouchers,
  getVoucherByCode,
  applyVoucher,
  validateVoucher,
} from "../controllers/voucher.controller";
import { protect } from "../middleware/auth";

const router = Router();

// All routes require authentication
router.get("/my-vouchers", protect, getMyVouchers);        // Lấy danh sách voucher
router.get("/:code", protect, getVoucherByCode);           // Lấy chi tiết voucher
router.post("/validate", protect, validateVoucher);        // Validate voucher
router.post("/apply", protect, applyVoucher);              // Áp dụng voucher vào đơn hàng

export default router;
