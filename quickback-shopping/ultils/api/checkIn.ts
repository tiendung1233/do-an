import { apiCall } from "../func/api";

// Interfaces
export interface CheckInDay {
  day: number;
  percentage: number;
  isCheckedIn: boolean;
  isToday: boolean;
  canCheckIn: boolean;
}

export interface CheckInStatus {
  success: boolean;
  weekStartDate: string;
  currentStreak: number;
  checkInDays: number[];
  hasCheckedInToday: boolean;
  currentDayOfWeek: number;
  days: CheckInDay[];
}

export interface CheckInVoucher {
  code: string;
  percentage: number;
  expiresAt: string;
}

export interface DoCheckInResponse {
  success: boolean;
  message: string;
  checkIn: {
    currentStreak: number;
    checkInDays: number[];
  };
  voucher: CheckInVoucher;
}

export interface CheckInHistoryItem {
  _id: string;
  userId: string;
  weekStartDate: string;
  checkInDays: number[];
  currentStreak: number;
  lastCheckInDate: string;
  createdAt: string;
}

export interface CheckInReward {
  day: number;
  percentage: number;
  label: string;
}

// API Functions

// Lấy trạng thái điểm danh hiện tại
export const getCheckInStatus = async (
  token: string,
  signal?: AbortSignal
): Promise<CheckInStatus> => {
  return apiCall<CheckInStatus>(
    "/api/checkin/status",
    "GET",
    undefined,
    token,
    signal
  );
};

// Thực hiện điểm danh
export const doCheckIn = async (
  token: string,
  signal?: AbortSignal
): Promise<DoCheckInResponse> => {
  return apiCall<DoCheckInResponse>(
    "/api/checkin/do",
    "POST",
    undefined,
    token,
    signal
  );
};

// Lấy lịch sử điểm danh
export const getCheckInHistory = async (
  token: string,
  signal?: AbortSignal
): Promise<{ success: boolean; history: CheckInHistoryItem[] }> => {
  return apiCall<{ success: boolean; history: CheckInHistoryItem[] }>(
    "/api/checkin/history",
    "GET",
    undefined,
    token,
    signal
  );
};

// Lấy bảng phần thưởng điểm danh
export const getCheckInRewards = async (
  signal?: AbortSignal
): Promise<{ success: boolean; rewards: CheckInReward[] }> => {
  return apiCall<{ success: boolean; rewards: CheckInReward[] }>(
    "/api/checkin/rewards",
    "GET",
    undefined,
    undefined,
    signal
  );
};
