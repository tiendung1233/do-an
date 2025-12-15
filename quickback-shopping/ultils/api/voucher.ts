import { apiCall } from "../func/api";

// Interfaces
export interface Voucher {
  _id: string;
  userId: string;
  code: string;
  percentage: number;
  dayNumber: number;
  status: "active" | "used" | "expired";
  usedOnPurchaseId?: {
    _id: string;
    productName: string;
    price: number;
    cashback: number;
  };
  usedAt?: string;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface VoucherStats {
  total: number;
  active: number;
  used: number;
  expired: number;
}

export interface GetMyVouchersResponse {
  success: boolean;
  vouchers: Voucher[];
  stats: VoucherStats;
}

export interface ValidateVoucherResponse {
  valid: boolean;
  voucher?: {
    code: string;
    percentage: number;
    expiresAt?: string;
  };
  estimatedBonus?: number;
  message: string;
}

export interface ApplyVoucherResponse {
  success: boolean;
  message: string;
  bonusCashback: number;
  purchase: {
    _id: string;
    productName: string;
    cashback: number;
    bonusCashback: number;
    voucherCode: string;
  };
}

// API Functions

// Lấy danh sách voucher của user
export const getMyVouchers = async (
  token: string,
  status?: "active" | "used" | "expired",
  signal?: AbortSignal
): Promise<GetMyVouchersResponse> => {
  const url = status
    ? `/api/voucher/my-vouchers?status=${status}`
    : "/api/voucher/my-vouchers";
  return apiCall<GetMyVouchersResponse>(url, "GET", undefined, token, signal);
};

// Lấy chi tiết voucher theo code
export const getVoucherByCode = async (
  token: string,
  code: string,
  signal?: AbortSignal
): Promise<{ success: boolean; voucher: Voucher }> => {
  return apiCall<{ success: boolean; voucher: Voucher }>(
    `/api/voucher/${code}`,
    "GET",
    undefined,
    token,
    signal
  );
};

// Validate voucher (kiểm tra trước khi áp dụng)
export const validateVoucher = async (
  token: string,
  voucherCode: string,
  purchaseId?: string,
  signal?: AbortSignal
): Promise<ValidateVoucherResponse> => {
  return apiCall<ValidateVoucherResponse>(
    "/api/voucher/validate",
    "POST",
    { voucherCode, purchaseId },
    token,
    signal
  );
};

// Áp dụng voucher vào đơn hàng
export const applyVoucher = async (
  token: string,
  voucherCode: string,
  purchaseId: string,
  signal?: AbortSignal
): Promise<ApplyVoucherResponse> => {
  return apiCall<ApplyVoucherResponse>(
    "/api/voucher/apply",
    "POST",
    { voucherCode, purchaseId },
    token,
    signal
  );
};
