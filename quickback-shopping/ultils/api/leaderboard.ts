import { apiCall } from "../func/api";

export interface LeaderboardUser {
  rank: number;
  userId: string;
  userName: string;
  userEmail: string;
  userImage?: string;
  totalCashback?: number;
  referralCount?: number;
  reward?: number;
}

export interface CashbackLeaderboardResponse {
  success: boolean;
  month: number;
  year: number;
  leaderboard: LeaderboardUser[];
}

export interface ReferralLeaderboardResponse {
  success: boolean;
  month: number;
  year: number;
  leaderboard: LeaderboardUser[];
}

export interface AllTimeLeaderboardResponse {
  success: boolean;
  topCashback: LeaderboardUser[];
  topReferrers: LeaderboardUser[];
}

export interface MyRankingResponse {
  success: boolean;
  month: number;
  year: number;
  cashback: {
    amount: number;
    rank: number;
  };
  referral: {
    count: number;
    rank: number | null;
  };
}

export interface LeaderboardReward {
  _id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userImage?: string;
  month: number;
  year: number;
  rank: number;
  type: "cashback" | "referral";
  amount: number;
  rewardAmount: number;
  rewardStatus: "pending" | "claimed" | "expired";
  claimedAt?: string;
  createdAt: string;
}

export interface MyRewardsResponse {
  success: boolean;
  rewards: LeaderboardReward[];
}

// Lấy top cashback theo tháng
export const getTopCashback = async (
  token: string,
  month?: number,
  year?: number
): Promise<CashbackLeaderboardResponse> => {
  const params = new URLSearchParams();
  if (month) params.append("month", month.toString());
  if (year) params.append("year", year.toString());
  const query = params.toString() ? `?${params.toString()}` : "";
  return apiCall<CashbackLeaderboardResponse>(
    `/api/leaderboard/cashback${query}`,
    "GET",
    undefined,
    token
  );
};

// Lấy top người giới thiệu theo tháng
export const getTopReferrers = async (
  token: string,
  month?: number,
  year?: number
): Promise<ReferralLeaderboardResponse> => {
  const params = new URLSearchParams();
  if (month) params.append("month", month.toString());
  if (year) params.append("year", year.toString());
  const query = params.toString() ? `?${params.toString()}` : "";
  return apiCall<ReferralLeaderboardResponse>(
    `/api/leaderboard/referral${query}`,
    "GET",
    undefined,
    token
  );
};

// Lấy bảng xếp hạng toàn thời gian
export const getAllTimeLeaderboard = async (
  token: string
): Promise<AllTimeLeaderboardResponse> => {
  return apiCall<AllTimeLeaderboardResponse>(
    "/api/leaderboard/all-time",
    "GET",
    undefined,
    token
  );
};

// Lấy thứ hạng của bản thân
export const getMyRanking = async (
  token: string,
  month?: number,
  year?: number
): Promise<MyRankingResponse> => {
  const params = new URLSearchParams();
  if (month) params.append("month", month.toString());
  if (year) params.append("year", year.toString());
  const query = params.toString() ? `?${params.toString()}` : "";
  return apiCall<MyRankingResponse>(
    `/api/leaderboard/my-ranking${query}`,
    "GET",
    undefined,
    token
  );
};

// Lấy phần thưởng của bản thân
export const getMyRewards = async (token: string): Promise<MyRewardsResponse> => {
  return apiCall<MyRewardsResponse>(
    "/api/leaderboard/my-rewards",
    "GET",
    undefined,
    token
  );
};

// Admin: Phát thưởng hàng tháng
export const distributeRewards = async (
  token: string,
  month: number,
  year: number
): Promise<{ success: boolean; message: string }> => {
  return apiCall<{ success: boolean; message: string }>(
    "/api/leaderboard/distribute-rewards",
    "POST",
    { month, year },
    token
  );
};
