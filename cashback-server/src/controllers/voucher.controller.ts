import { Request, Response } from "express";
import mongoose from "mongoose";
import Voucher from "../models/voucher.model";
import PurchaseHistory from "../models/purchaseHistory.model";
import User from "../models/user.model";

// Lấy danh sách voucher của user
export const getMyVouchers = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any)._id;
    const { status } = req.query;

    const query: any = { userId };
    if (status && ["active", "used", "expired"].includes(status as string)) {
      query.status = status;
    }

    // Cập nhật voucher hết hạn trước khi query
    await Voucher.updateMany(
      {
        userId,
        status: "active",
        expiresAt: { $lt: new Date() },
      },
      { status: "expired" }
    );

    const vouchers = await Voucher.find(query)
      .sort({ createdAt: -1 })
      .populate("usedOnPurchaseId", "productName price cashback");

    // Thống kê
    const stats = {
      total: vouchers.length,
      active: vouchers.filter((v) => v.status === "active").length,
      used: vouchers.filter((v) => v.status === "used").length,
      expired: vouchers.filter((v) => v.status === "expired").length,
    };

    res.json({
      success: true,
      vouchers,
      stats,
    });
  } catch (error) {
    console.error("Error getting vouchers:", error);
    res.status(500).json({ success: false, message: "Loi server" });
  }
};

// Lấy chi tiết voucher theo code
export const getVoucherByCode = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any)._id;
    const { code } = req.params;

    const voucher = await Voucher.findOne({
      userId,
      code: code.toUpperCase(),
    });

    if (!voucher) {
      return res.status(404).json({
        success: false,
        message: "Khong tim thay voucher",
      });
    }

    // Kiểm tra hết hạn
    if (voucher.status === "active" && voucher.expiresAt < new Date()) {
      voucher.status = "expired";
      await voucher.save();
    }

    res.json({
      success: true,
      voucher,
    });
  } catch (error) {
    console.error("Error getting voucher:", error);
    res.status(500).json({ success: false, message: "Loi server" });
  }
};

// Áp dụng voucher vào đơn hàng đã hoàn tiền
export const applyVoucher = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any)._id;
    const { voucherCode, purchaseId } = req.body;

    if (!voucherCode || !purchaseId) {
      return res.status(400).json({
        success: false,
        message: "Thieu ma voucher hoac ID don hang",
      });
    }

    // Tìm voucher
    const voucher = await Voucher.findOne({
      userId,
      code: voucherCode.toUpperCase(),
    });

    if (!voucher) {
      return res.status(404).json({
        success: false,
        message: "Khong tim thay voucher",
      });
    }

    // Kiểm tra voucher còn active không
    if (voucher.status === "used") {
      return res.status(400).json({
        success: false,
        message: "Voucher da duoc su dung",
      });
    }

    if (voucher.status === "expired" || voucher.expiresAt < new Date()) {
      voucher.status = "expired";
      await voucher.save();
      return res.status(400).json({
        success: false,
        message: "Voucher da het han",
      });
    }

    // Tìm đơn hàng
    const purchase = await PurchaseHistory.findOne({
      _id: purchaseId,
      userId,
    });

    if (!purchase) {
      return res.status(404).json({
        success: false,
        message: "Khong tim thay don hang",
      });
    }

    // Kiểm tra đơn hàng đã được duyệt chưa
    if (purchase.status !== "Đã duyệt") {
      return res.status(400).json({
        success: false,
        message: "Don hang chua duoc duyet, khong the ap dung voucher",
      });
    }

    // Kiểm tra đơn hàng đã dùng voucher chưa
    if (purchase.voucherUsed) {
      return res.status(400).json({
        success: false,
        message: "Don hang nay da su dung voucher roi",
      });
    }

    // Tính tiền bonus từ voucher
    const bonusCashback = Math.round((purchase.cashback * voucher.percentage) / 100);

    // Cập nhật đơn hàng
    purchase.voucherUsed = true;
    purchase.voucherCode = voucher.code;
    purchase.voucherBonusPercent = voucher.percentage;
    purchase.bonusCashback = bonusCashback;
    await purchase.save();

    // Cập nhật voucher
    voucher.status = "used";
    voucher.usedOnPurchaseId = purchase._id as mongoose.Types.ObjectId;
    voucher.usedAt = new Date();
    await voucher.save();

    // Cộng tiền bonus vào tài khoản user
    const user = await User.findById(userId);
    if (user) {
      user.money = (user.money || 0) + bonusCashback;
      await user.save();
    }

    res.json({
      success: true,
      message: `Ap dung voucher thanh cong! Ban nhan them ${bonusCashback.toLocaleString("vi-VN")}d`,
      bonusCashback,
      purchase: {
        _id: purchase._id,
        productName: purchase.productName,
        cashback: purchase.cashback,
        bonusCashback: purchase.bonusCashback,
        voucherCode: purchase.voucherCode,
      },
    });
  } catch (error) {
    console.error("Error applying voucher:", error);
    res.status(500).json({ success: false, message: "Loi server" });
  }
};

// Validate voucher (kiểm tra trước khi áp dụng)
export const validateVoucher = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any)._id;
    const { voucherCode, purchaseId } = req.body;

    if (!voucherCode) {
      return res.json({
        valid: false,
        message: "Vui long nhap ma voucher",
      });
    }

    const voucher = await Voucher.findOne({
      userId,
      code: voucherCode.toUpperCase(),
    });

    if (!voucher) {
      return res.json({
        valid: false,
        message: "Ma voucher khong ton tai",
      });
    }

    if (voucher.status === "used") {
      return res.json({
        valid: false,
        message: "Voucher da duoc su dung",
      });
    }

    if (voucher.status === "expired" || voucher.expiresAt < new Date()) {
      return res.json({
        valid: false,
        message: "Voucher da het han",
      });
    }

    // Nếu có purchaseId, kiểm tra luôn đơn hàng
    if (purchaseId) {
      const purchase = await PurchaseHistory.findOne({
        _id: purchaseId,
        userId,
      });

      if (!purchase) {
        return res.json({
          valid: false,
          message: "Khong tim thay don hang",
        });
      }

      if (purchase.status !== "Đã duyệt") {
        return res.json({
          valid: false,
          message: "Don hang chua duoc duyet",
        });
      }

      if (purchase.voucherUsed) {
        return res.json({
          valid: false,
          message: "Don hang da su dung voucher",
        });
      }

      // Tính tiền bonus
      const bonusCashback = Math.round((purchase.cashback * voucher.percentage) / 100);

      return res.json({
        valid: true,
        voucher: {
          code: voucher.code,
          percentage: voucher.percentage,
        },
        estimatedBonus: bonusCashback,
        message: `Voucher +${voucher.percentage}% - Du kien nhan them ${bonusCashback.toLocaleString("vi-VN")}d`,
      });
    }

    res.json({
      valid: true,
      voucher: {
        code: voucher.code,
        percentage: voucher.percentage,
        expiresAt: voucher.expiresAt,
      },
      message: `Voucher hop le: +${voucher.percentage}%`,
    });
  } catch (error) {
    console.error("Error validating voucher:", error);
    res.status(500).json({ success: false, message: "Loi server" });
  }
};
