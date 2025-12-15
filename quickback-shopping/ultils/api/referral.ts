import { apiCall } from "../func/api";

// Interfaces
export interface ReferralReward {
  _id: string;
  referrerId: string;
  referredUserId: {
    _id: string;
    name: string;
    email: string;
    image?: string;
    createdAt: string;
  };
  referralNumber: number;
  rewardAmount: number;
  status: "pending" | "completed";
  completedAt?: string;
  createdAt: string;
}

export interface ReferralStats {
  total: number;
  pending: number;
  completed: number;
  totalEarned: number;
}

export interface GetMyReferralsResponse {
  referrals: ReferralReward[];
  stats: ReferralStats;
}

export interface RewardTableItem {
  referralNumber: number;
  rewardAmount: number;
  label: string;
}

export interface CheckRewardsResponse {
  rewarded: boolean;
  amount: number;
  referrals?: string[];
  message: string;
}

// API Functions

// Lấy mã giới thiệu của user hiện tại
export const getMyReferralCode = async (
  token: string,
  signal?: AbortSignal
): Promise<{ referralCode: string }> => {
  return apiCall<{ referralCode: string }>(
    "/api/referral/my-code",
    "GET",
    undefined,
    token,
    signal
  );
};

// Lấy danh sách người đã giới thiệu
export const getMyReferrals = async (
  token: string,
  signal?: AbortSignal
): Promise<GetMyReferralsResponse> => {
  return apiCall<GetMyReferralsResponse>(
    "/api/referral/my-referrals",
    "GET",
    undefined,
    token,
    signal
  );
};

// Check và nhận thưởng (gọi khi login)
export const checkAndRewardReferrals = async (
  token: string,
  signal?: AbortSignal
): Promise<CheckRewardsResponse> => {
  return apiCall<CheckRewardsResponse>(
    "/api/referral/check-rewards",
    "POST",
    undefined,
    token,
    signal
  );
};

// Validate mã giới thiệu
export const validateReferralCode = async (
  referralCode: string,
  signal?: AbortSignal
): Promise<{ valid: boolean; referrerName?: string; message: string }> => {
  return apiCall<{ valid: boolean; referrerName?: string; message: string }>(
    "/api/referral/validate",
    "POST",
    { referralCode },
    undefined,
    signal
  );
};

// Lấy bảng thưởng
export const getRewardTable = async (
  signal?: AbortSignal
): Promise<{ rewards: RewardTableItem[] }> => {
  return apiCall<{ rewards: RewardTableItem[] }>(
    "/api/referral/reward-table",
    "GET",
    undefined,
    undefined,
    signal
  );
};
