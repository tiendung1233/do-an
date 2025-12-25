import { apiCall } from "../func/api";

// Interfaces
export interface SpinPrize {
  id: number;
  type: "cash" | "voucher" | "luck";
  value: number;
  label: string;
  probability: number;
  color: string;
}

export interface SpinMilestone {
  orders: number;
  spins: number;
}

export interface SpinHistoryItem {
  spunAt: string;
  prizeType: "cash" | "voucher" | "luck";
  prizeValue: number;
  voucherCode?: string;
}

export interface NextMilestone {
  orders: number;
  spins: number;
  ordersNeeded: number;
}

export interface SpinWheelInfo {
  availableSpins: number;
  totalSpins: number;
  totalSpinsUsed: number;
  totalCashWon: number;
  totalVouchersWon: number;
  approvedOrders: number;
  lastMilestoneReached: number;
  nextMilestone: NextMilestone | null;
  milestones: SpinMilestone[];
  prizes: SpinPrize[];
  recentHistory: SpinHistoryItem[];
}

export interface SpinResult {
  prize: SpinPrize & { voucherCode?: string };
  remainingSpins: number;
}

export interface SpinWheelInfoResponse {
  success: boolean;
  data: SpinWheelInfo;
}

export interface SpinResultResponse {
  success: boolean;
  data: SpinResult;
}

export interface SpinHistoryResponse {
  success: boolean;
  data: SpinHistoryItem[];
  total: number;
  page: number;
  pages: number;
}

// API Functions

// Lấy thông tin vòng quay
export const getSpinWheelInfo = async (
  token: string,
  signal?: AbortSignal
): Promise<SpinWheelInfoResponse> => {
  return apiCall<SpinWheelInfoResponse>(
    "/api/spin-wheel/info",
    "GET",
    undefined,
    token,
    signal
  );
};

// Thực hiện quay
export const spin = async (
  token: string,
  signal?: AbortSignal
): Promise<SpinResultResponse> => {
  return apiCall<SpinResultResponse>(
    "/api/spin-wheel/spin",
    "POST",
    undefined,
    token,
    signal
  );
};

// Lấy lịch sử quay
export const getSpinHistory = async (
  token: string,
  page: number = 1,
  limit: number = 20,
  signal?: AbortSignal
): Promise<SpinHistoryResponse> => {
  return apiCall<SpinHistoryResponse>(
    `/api/spin-wheel/history?page=${page}&limit=${limit}`,
    "GET",
    undefined,
    token,
    signal
  );
};

// Admin: Tặng lượt quay
export const adminAwardSpins = async (
  token: string,
  userId: string,
  spins: number,
  reason?: string,
  signal?: AbortSignal
): Promise<{ success: boolean; message: string }> => {
  return apiCall<{ success: boolean; message: string }>(
    "/api/spin-wheel/admin/award",
    "POST",
    { userId, spins, reason },
    token,
    signal
  );
};
