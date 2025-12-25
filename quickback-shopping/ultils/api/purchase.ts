import { apiCall } from "../func/api";

export interface PurchaseHistoryItem {
  _id: string;
  productName: string;
  price: number;
  productLink: string;
  cashbackPercentage: number;
  cashback: number;
  quantity: number;
  purchaseDate: string;
  status: "Đang xử lý" | "Đã duyệt" | "Hủy";
  transaction_id: string;
  // Membership bonus
  membershipBonusPercent?: number;
  membershipBonusAmount?: number;
  // Voucher bonus
  voucherUsed?: boolean;
  voucherCode?: string;
  voucherBonusPercent?: number;
  bonusCashback?: number;
}

// Interface cho admin tạo đơn hàng
export interface AdminCreatePurchaseData {
  userId: string;
  productName: string;
  price: number;
  productLink: string;
  cashbackPercentage: number;
  quantity: number;
  status?: "Đang xử lý" | "Đã duyệt" | "Hủy";
  transaction_id?: string;
}

export interface AdminPurchaseHistoryItem {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  } | string;
  productName: string;
  price: number;
  productLink: string;
  cashbackPercentage: number;
  cashback: number;
  quantity: number;
  status: string;
  transaction_id: string;
  purchaseDate: string;
  createdAt: string;
  // Membership bonus
  membershipBonusPercent?: number;
  membershipBonusAmount?: number;
  // Voucher bonus
  voucherUsed?: boolean;
  voucherCode?: string;
  voucherBonusPercent?: number;
  bonusCashback?: number;
}

export interface AdminGetAllPurchaseResponse {
  purchaseHistory: AdminPurchaseHistoryItem[];
  total: number;
  page: number;
  pages: number;
}

interface GetPurchaseResponse {
  purchaseHistory: PurchaseHistoryItem[];
  total: number;
  pag: number;
}

export const getPurchase = async (
  token: string,
  page: number,
  signal?: AbortSignal
): Promise<GetPurchaseResponse> => {
  return apiCall<GetPurchaseResponse>(
    `/api/purchase-history?page=${page}`,
    "GET",
    undefined,
    token,
    signal
  );
};

export const getReport = async (
  token: string,
  data: any,
  signal?: AbortSignal
): Promise<any> => {
  return apiCall<any>(
    `/api/purchase-history/admin`,
    "POST",
    data,
    token,
    signal
  );
};

// Admin: Tạo đơn hàng mới
export const adminCreatePurchase = async (
  token: string,
  data: AdminCreatePurchaseData,
  signal?: AbortSignal
): Promise<any> => {
  return apiCall<any>(
    `/api/purchase-history/admin-create`,
    "POST",
    data,
    token,
    signal
  );
};

// Admin: Lấy tất cả đơn hàng
export const adminGetAllPurchase = async (
  token: string,
  page: number = 1,
  limit: number = 20,
  search?: string,
  signal?: AbortSignal
): Promise<AdminGetAllPurchaseResponse> => {
  let url = `/api/purchase-history/admin-all?page=${page}&limit=${limit}`;
  if (search) {
    url += `&search=${encodeURIComponent(search)}`;
  }
  return apiCall<AdminGetAllPurchaseResponse>(url, "GET", undefined, token, signal);
};
