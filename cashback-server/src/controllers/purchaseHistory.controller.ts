import { Request, Response } from "express";
import PurchaseHistory from "../models/purchaseHistory.model";
import User from "../models/user.model";
import { extractId } from "../ultils/func";
import { updateMembershipTier } from "./membership.controller";
import { checkAndAwardSpins } from "./spinWheel.controller";
import { MEMBERSHIP_CASHBACK_BONUS, MembershipTier } from "../models/membership.model";

export const savePurchaseHistory = async (req: Request, res: Response) => {
  try {
    const { productName, price, productLink, cashbackPercentage, quantity } =
      req.body;

    if (
      !productName ||
      !price ||
      !productLink ||
      !cashbackPercentage ||
      !quantity
    ) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields." });
    }

    const purchaseHistory = await PurchaseHistory.create({
      userId: (req?.user as any)._id,
      productName,
      price,
      productLink,
      cashbackPercentage,
      quantity,
    });

    res.status(201).json(purchaseHistory);
  } catch (error) {
    console.error("Error saving purchase history:", error);
    res.status(500).json({ message: "Server error, please try again later." });
  }
};

export const getPurchaseHistory = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = 20;

    const total = await PurchaseHistory.countDocuments({
      userId: (req?.user as any)._id,
    });

    const purchaseHistory = await PurchaseHistory.find({
      userId: (req?.user as any)._id,
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    res.json({
      page,
      pages: Math.ceil(total / limit),
      total,
      purchaseHistory,
    });
  } catch (error) {
    console.error("Error fetching purchase history:", error);
    res.status(500).json({ message: "Server error, please try again later." });
  }
};

interface APIData {
  merchant: string;
  status: number;
  transaction_time: string;
  transaction_value: number;
  product_quantity: number;
  transaction_id: string;
  click_url: string;
  utm_source: string;
  product_price: number;
  reason_rejected?: string;
  commission: number | 0;
}

interface APIResponse {
  total: number;
  data: APIData[];
}

const fetchDataFromAPI = async (params: {
  utm_source?: string;
  merchant?: string;
  limit?: number;
  status?: number;
}): Promise<APIResponse> => {
  const { utm_source, merchant, limit, status } = params;

  let apiUrl = "https://api.accesstrade.vn/v1/transactions?";
  apiUrl += `since=2021-01-01T00:00:00Z&until=2026-01-03T00`;
  if (utm_source) apiUrl += `&utm_source=${utm_source}`;
  if (merchant) apiUrl += `&merchant=${merchant}`;
  if (limit) apiUrl += `&limit=${limit}`;
  if (status !== undefined) apiUrl += `&status=${status}`;

  const response = await fetch(apiUrl, {
    headers: {
      Authorization: "Token b2YarfQvCZooDdHSNMIJoQYwawTP_cqY",
    },
  });

  if (!response.ok) {
    console.error("API call failed", response.statusText);
    throw new Error("Failed to fetch data from API");
  }

  return response.json();
};

const saveToDatabase = async (data: APIData[]) => {
  for (const item of data) {
    if (item.utm_source) {
      const existingRecord = await PurchaseHistory.findOne({
        transaction_id: item.transaction_id,
      });

      if (!existingRecord) {
        const user = await User.findById(item.utm_source);

        // Tinh cashback co ban + membership bonus
        let totalCashback = item.commission;
        let membershipBonusPercent = 0;
        let membershipBonusAmount = 0;
        if (user && item.status === 1) {
          const membershipTier = (user.membershipTier || "none") as MembershipTier;
          membershipBonusPercent = MEMBERSHIP_CASHBACK_BONUS[membershipTier];
          membershipBonusAmount = (item.transaction_value * membershipBonusPercent) / 100;
          totalCashback += membershipBonusAmount;
        }

        const newRecord = new PurchaseHistory({
          userId: item.utm_source,
          productName: item.merchant,
          price: item.transaction_value,
          productLink: item.click_url,
          cashbackPercentage: 0,
          cashback: totalCashback,
          quantity: item.product_quantity,
          purchaseDate: new Date(item.transaction_time),
          transaction_id: item.transaction_id,
          status:
            item.status === 1
              ? "Đã duyệt"
              : item.status === 0
              ? "Đang xử lý"
              : "Hủy",
          // Lưu membership bonus info
          membershipBonusPercent: membershipBonusPercent,
          membershipBonusAmount: membershipBonusAmount,
        });
        await newRecord.save();

        if (user && item.status === 1) {
          user.money! += totalCashback;
          await user.save();

          // Check membership upgrade
          try {
            await updateMembershipTier(item.utm_source);
          } catch (err) {
            console.error("Error updating membership tier:", err);
          }

          // Check và tặng lượt quay nếu đạt mốc
          try {
            await checkAndAwardSpins(item.utm_source);
          } catch (err) {
            console.error("Error checking spin award:", err);
          }
        }
      }
    }
  }
};

// Admin tạo đơn hàng thủ công cho user
export const adminCreatePurchaseHistory = async (
  req: Request,
  res: Response
) => {
  try {
    // Kiểm tra quyền admin
    if (!req.user || (req.user as any).role <= 0) {
      return res.status(403).json({ error: "Forbidden: Insufficient role" });
    }

    const {
      userId,
      productName,
      price,
      productLink,
      cashbackPercentage,
      quantity,
      status = "Đang xử lý",
      transaction_id,
    } = req.body;

    // Validate required fields
    if (!userId || !productName || !price || !productLink || !quantity) {
      return res.status(400).json({
        message: "Vui lòng điền đầy đủ thông tin: userId, productName, price, productLink, quantity",
      });
    }

    // Validate price và quantity
    if (price <= 0 || quantity <= 0) {
      return res.status(400).json({
        message: "Giá và số lượng phải lớn hơn 0",
      });
    }

    // Validate cashbackPercentage
    const cashbackPercent = cashbackPercentage || 0;
    if (cashbackPercent < 0 || cashbackPercent > 100) {
      return res.status(400).json({
        message: "Phần trăm hoàn tiền phải từ 0 đến 100",
      });
    }

    // Validate status
    const validStatuses = ["Đang xử lý", "Đã duyệt", "Hủy"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Trạng thái không hợp lệ. Chọn: Đang xử lý, Đã duyệt, hoặc Hủy",
      });
    }

    // Kiểm tra user tồn tại
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    // Tính cashback cơ bản
    let cashback = (price * quantity * cashbackPercent) / 100;

    // Cộng thêm bonus từ membership tier
    const membershipTier = (user.membershipTier || "none") as MembershipTier;
    const membershipBonus = MEMBERSHIP_CASHBACK_BONUS[membershipTier];
    const membershipBonusAmount = (price * quantity * membershipBonus) / 100;
    const totalCashback = cashback + membershipBonusAmount;

    // Tạo transaction_id nếu không có
    const transId = transaction_id || `ADMIN-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;

    // Tạo purchase history
    const purchaseHistory = await PurchaseHistory.create({
      userId,
      productName,
      price,
      productLink,
      cashbackPercentage: cashbackPercent,
      cashback: totalCashback,
      quantity,
      status,
      transaction_id: transId,
      purchaseDate: new Date(),
      // Lưu membership bonus info
      membershipBonusPercent: membershipBonus,
      membershipBonusAmount: membershipBonusAmount,
    });

    // Nếu status là "Đã duyệt", cộng tiền cho user và check membership upgrade
    let membershipUpgrade = null;
    let spinAward = null;
    if (status === "Đã duyệt") {
      user.money = (user.money || 0) + totalCashback;
      await user.save();

      // Check và update membership tier
      try {
        membershipUpgrade = await updateMembershipTier(userId);
      } catch (err) {
        console.error("Error updating membership tier:", err);
      }

      // Check và tặng lượt quay nếu đạt mốc
      try {
        spinAward = await checkAndAwardSpins(userId);
      } catch (err) {
        console.error("Error checking spin award:", err);
      }
    }

    res.status(201).json({
      message: "Tạo đơn hàng thành công",
      purchaseHistory,
      userMoneyUpdated: status === "Đã duyệt",
      membershipBonus: membershipBonusAmount,
      membershipUpgrade,
      spinAward,
    });
  } catch (error) {
    console.error("Error creating purchase history:", error);
    res.status(500).json({ message: "Lỗi server, vui lòng thử lại sau" });
  }
};

// Admin lấy tất cả đơn hàng
export const adminGetAllPurchaseHistory = async (
  req: Request,
  res: Response
) => {
  try {
    // Kiểm tra quyền admin
    if (!req.user || (req.user as any).role <= 0) {
      return res.status(403).json({ error: "Forbidden: Insufficient role" });
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const search = req.query.search as string;

    // Build query
    let query: any = {};
    if (search) {
      query.$or = [
        { productName: { $regex: search, $options: "i" } },
        { transaction_id: { $regex: search, $options: "i" } },
      ];
    }

    const total = await PurchaseHistory.countDocuments(query);

    const purchaseHistory = await PurchaseHistory.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .populate("userId", "name email");

    res.json({
      page,
      pages: Math.ceil(total / limit),
      total,
      purchaseHistory,
    });
  } catch (error) {
    console.error("Error fetching all purchase history:", error);
    res.status(500).json({ message: "Lỗi server, vui lòng thử lại sau" });
  }
};

export const fetchAndSaveDataAffiliate = async (
  req: Request,
  res: Response
) => {
  try {
    if (!req.user || (req.user as any).role <= 0) {
      return res.status(403).json({ error: "Forbidden: Insufficient role" });
    }

    const { utm_source, merchant, limit, status } = req.body;
    const apiResponse = await fetchDataFromAPI({
      utm_source: utm_source && `j:"${utm_source}"`,
      merchant,
      limit,
      status,
    });

    const userData = await Promise.all(
      apiResponse.data.map(async (item) => {
        const userId = extractId(item.utm_source);
        const user = userId
          ? await User.findById(userId).select("name email")
          : null;

        return {
          ...item,
          userName: user?.name || "Không xác định",
          email: user?.email || "Không xác định",
        };
      })
    );

    const transformedData = apiResponse.data.map((item) => ({
      merchant: item.merchant,
      status: item.status,
      transaction_time: item.transaction_time,
      transaction_value: item.transaction_value,
      product_quantity: item.product_quantity,
      transaction_id: item.transaction_id,
      click_url: item.click_url,
      utm_source: extractId(item.utm_source),
      product_price: item.product_price,
      commission: item.commission,
      reason_rejected: item.reason_rejected,
    }));

    await saveToDatabase(transformedData);

    res.status(200).json({
      total: apiResponse.total,
      userData: userData,
    });
  } catch (error) {
    console.error("Error fetching, transforming, or saving data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
