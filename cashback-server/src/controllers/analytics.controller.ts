import { Request, Response } from "express";
import PurchaseHistory from "../models/purchaseHistory.model";
import User from "../models/user.model";

// Helper: Lấy ngày bắt đầu theo khoảng thời gian
const getStartDate = (period: string): Date => {
  const now = new Date();
  switch (period) {
    case "7d":
      return new Date(now.setDate(now.getDate() - 7));
    case "30d":
      return new Date(now.setDate(now.getDate() - 30));
    case "90d":
      return new Date(now.setDate(now.getDate() - 90));
    case "1y":
      return new Date(now.setFullYear(now.getFullYear() - 1));
    default:
      return new Date(now.setDate(now.getDate() - 30));
  }
};

// Helper: Format ngày theo group
const getDateFormat = (period: string): string => {
  switch (period) {
    case "7d":
      return "%Y-%m-%d"; // Theo ngày
    case "30d":
      return "%Y-%m-%d"; // Theo ngày
    case "90d":
      return "%Y-%U"; // Theo tuần
    case "1y":
      return "%Y-%m"; // Theo tháng
    default:
      return "%Y-%m-%d";
  }
};

// Lấy tổng quan analytics
export const getAnalyticsOverview = async (req: Request, res: Response) => {
  try {
    // Kiểm tra quyền admin
    if (!req.user || (req.user as any).role <= 0) {
      return res.status(403).json({ error: "Forbidden: Insufficient role" });
    }

    const { period = "30d" } = req.query;
    const startDate = getStartDate(period as string);

    // Tổng số đơn hàng
    const totalOrders = await PurchaseHistory.countDocuments({
      purchaseDate: { $gte: startDate },
    });

    // Tổng số đơn đã duyệt
    const approvedOrders = await PurchaseHistory.countDocuments({
      purchaseDate: { $gte: startDate },
      status: "Đã duyệt",
    });

    // Tổng doanh thu (giá trị đơn hàng đã duyệt)
    const revenueResult = await PurchaseHistory.aggregate([
      {
        $match: {
          purchaseDate: { $gte: startDate },
          status: "Đã duyệt",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$price" },
          totalCashback: { $sum: "$cashback" },
        },
      },
    ]);

    const totalRevenue = revenueResult[0]?.totalRevenue || 0;
    const totalCashback = revenueResult[0]?.totalCashback || 0;

    // Tổng số người dùng mới
    const newUsers = await User.countDocuments({
      createdAt: { $gte: startDate },
    });

    // Tổng số người dùng
    const totalUsers = await User.countDocuments();

    res.json({
      success: true,
      overview: {
        totalOrders,
        approvedOrders,
        totalRevenue,
        totalCashback,
        newUsers,
        totalUsers,
        period,
      },
    });
  } catch (error) {
    console.error("Error getting analytics overview:", error);
    res.status(500).json({ success: false, message: "Loi server" });
  }
};

// Lấy dữ liệu biểu đồ đơn hàng
export const getOrdersChart = async (req: Request, res: Response) => {
  try {
    if (!req.user || (req.user as any).role <= 0) {
      return res.status(403).json({ error: "Forbidden: Insufficient role" });
    }

    const { period = "30d" } = req.query;
    const startDate = getStartDate(period as string);
    const dateFormat = getDateFormat(period as string);

    const ordersData = await PurchaseHistory.aggregate([
      {
        $match: {
          purchaseDate: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: dateFormat, date: "$purchaseDate" } },
            status: "$status",
          },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: "$_id.date",
          total: { $sum: "$count" },
          approved: {
            $sum: {
              $cond: [{ $eq: ["$_id.status", "Đã duyệt"] }, "$count", 0],
            },
          },
          pending: {
            $sum: {
              $cond: [{ $eq: ["$_id.status", "Đang xử lý"] }, "$count", 0],
            },
          },
          cancelled: {
            $sum: {
              $cond: [{ $eq: ["$_id.status", "Hủy"] }, "$count", 0],
            },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      success: true,
      chartData: ordersData.map((item) => ({
        date: item._id,
        total: item.total,
        approved: item.approved,
        pending: item.pending,
        cancelled: item.cancelled,
      })),
    });
  } catch (error) {
    console.error("Error getting orders chart:", error);
    res.status(500).json({ success: false, message: "Loi server" });
  }
};

// Lấy dữ liệu biểu đồ doanh thu
export const getRevenueChart = async (req: Request, res: Response) => {
  try {
    if (!req.user || (req.user as any).role <= 0) {
      return res.status(403).json({ error: "Forbidden: Insufficient role" });
    }

    const { period = "30d" } = req.query;
    const startDate = getStartDate(period as string);
    const dateFormat = getDateFormat(period as string);

    const revenueData = await PurchaseHistory.aggregate([
      {
        $match: {
          purchaseDate: { $gte: startDate },
          status: "Đã duyệt",
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: dateFormat, date: "$purchaseDate" } },
          revenue: { $sum: "$price" },
          cashback: { $sum: "$cashback" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      success: true,
      chartData: revenueData.map((item) => ({
        date: item._id,
        revenue: item.revenue,
        cashback: item.cashback,
        orders: item.orders,
      })),
    });
  } catch (error) {
    console.error("Error getting revenue chart:", error);
    res.status(500).json({ success: false, message: "Loi server" });
  }
};

// Lấy dữ liệu biểu đồ người dùng
export const getUsersChart = async (req: Request, res: Response) => {
  try {
    if (!req.user || (req.user as any).role <= 0) {
      return res.status(403).json({ error: "Forbidden: Insufficient role" });
    }

    const { period = "30d" } = req.query;
    const startDate = getStartDate(period as string);
    const dateFormat = getDateFormat(period as string);

    const usersData = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: dateFormat, date: "$createdAt" } },
          newUsers: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Tính tổng tích lũy
    let cumulativeTotal = await User.countDocuments({
      createdAt: { $lt: startDate },
    });

    const chartData = usersData.map((item) => {
      cumulativeTotal += item.newUsers;
      return {
        date: item._id,
        newUsers: item.newUsers,
        totalUsers: cumulativeTotal,
      };
    });

    res.json({
      success: true,
      chartData,
    });
  } catch (error) {
    console.error("Error getting users chart:", error);
    res.status(500).json({ success: false, message: "Loi server" });
  }
};

// Lấy tất cả dữ liệu analytics
export const getAllAnalytics = async (req: Request, res: Response) => {
  try {
    if (!req.user || (req.user as any).role <= 0) {
      return res.status(403).json({ error: "Forbidden: Insufficient role" });
    }

    const { period = "30d" } = req.query;
    const startDate = getStartDate(period as string);
    const dateFormat = getDateFormat(period as string);

    // Overview
    const [totalOrders, approvedOrders, newUsers, totalUsers] = await Promise.all([
      PurchaseHistory.countDocuments({ purchaseDate: { $gte: startDate } }),
      PurchaseHistory.countDocuments({ purchaseDate: { $gte: startDate }, status: "Đã duyệt" }),
      User.countDocuments({ createdAt: { $gte: startDate } }),
      User.countDocuments(),
    ]);

    const revenueResult = await PurchaseHistory.aggregate([
      {
        $match: {
          purchaseDate: { $gte: startDate },
          status: "Đã duyệt",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$price" },
          totalCashback: { $sum: "$cashback" },
        },
      },
    ]);

    // Orders chart
    const ordersData = await PurchaseHistory.aggregate([
      { $match: { purchaseDate: { $gte: startDate } } },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: dateFormat, date: "$purchaseDate" } },
            status: "$status",
          },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: "$_id.date",
          total: { $sum: "$count" },
          approved: {
            $sum: { $cond: [{ $eq: ["$_id.status", "Đã duyệt"] }, "$count", 0] },
          },
          pending: {
            $sum: { $cond: [{ $eq: ["$_id.status", "Đang xử lý"] }, "$count", 0] },
          },
          cancelled: {
            $sum: { $cond: [{ $eq: ["$_id.status", "Hủy"] }, "$count", 0] },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Revenue chart
    const revenueData = await PurchaseHistory.aggregate([
      { $match: { purchaseDate: { $gte: startDate }, status: "Đã duyệt" } },
      {
        $group: {
          _id: { $dateToString: { format: dateFormat, date: "$purchaseDate" } },
          revenue: { $sum: "$price" },
          cashback: { $sum: "$cashback" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Users chart
    const usersData = await User.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: dateFormat, date: "$createdAt" } },
          newUsers: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    let cumulativeTotal = await User.countDocuments({ createdAt: { $lt: startDate } });
    const usersChartData = usersData.map((item) => {
      cumulativeTotal += item.newUsers;
      return {
        date: item._id,
        newUsers: item.newUsers,
        totalUsers: cumulativeTotal,
      };
    });

    res.json({
      success: true,
      overview: {
        totalOrders,
        approvedOrders,
        totalRevenue: revenueResult[0]?.totalRevenue || 0,
        totalCashback: revenueResult[0]?.totalCashback || 0,
        newUsers,
        totalUsers,
        period,
      },
      ordersChart: ordersData.map((item) => ({
        date: item._id,
        total: item.total,
        approved: item.approved,
        pending: item.pending,
        cancelled: item.cancelled,
      })),
      revenueChart: revenueData.map((item) => ({
        date: item._id,
        revenue: item.revenue,
        cashback: item.cashback,
        orders: item.orders,
      })),
      usersChart: usersChartData,
    });
  } catch (error) {
    console.error("Error getting all analytics:", error);
    res.status(500).json({ success: false, message: "Loi server" });
  }
};
