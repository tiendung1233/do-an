import { apiCall } from "../func/api";

// Types
export type MembershipTier = "none" | "bronze" | "silver" | "gold";

export interface TierInfo {
  name: string;
  nameVi: string;
  color: string;
}

export interface MembershipData {
  tier: MembershipTier;
  tierInfo: TierInfo;
  totalSpent: number;
  cashbackBonus: number;
  nextTier: MembershipTier | null;
  nextTierInfo: TierInfo | null;
  amountToNextTier: number;
  progressPercent: number;
}

export interface GetMyMembershipResponse {
  success: boolean;
  membership: MembershipData;
  thresholds: { [key in MembershipTier]: number };
  bonuses: { [key in MembershipTier]: number };
  voucherRewards: { [key in MembershipTier]: number };
  tierInfo: { [key in MembershipTier]: TierInfo };
}

export interface MembershipTierInfo {
  tier: MembershipTier;
  name: string;
  nameVi: string;
  color: string;
  threshold: number;
  cashbackBonus: number;
  voucherReward: number;
}

export interface CheckUpgradeResponse {
  success: boolean;
  upgraded: boolean;
  message: string;
  previousTier?: MembershipTier;
  newTier?: MembershipTier;
  tierInfo?: TierInfo;
  voucherCode?: string;
  voucherPercentage?: number;
  currentTier?: MembershipTier;
}

export interface MembershipHistoryItem {
  _id: string;
  previousTier: MembershipTier;
  previousTierInfo: TierInfo;
  newTier: MembershipTier;
  newTierInfo: TierInfo;
  totalSpentAtUpgrade: number;
  voucherAwarded?: {
    code: string;
    percentage: number;
    status: string;
  };
  createdAt: string;
}

// API Functions

// Lay thong tin membership cua user
export const getMyMembership = async (
  token: string,
  signal?: AbortSignal
): Promise<GetMyMembershipResponse> => {
  return apiCall<GetMyMembershipResponse>(
    "/api/membership/my-membership",
    "GET",
    undefined,
    token,
    signal
  );
};

// Check va update hang
export const checkMembershipUpgrade = async (
  token: string,
  signal?: AbortSignal
): Promise<CheckUpgradeResponse> => {
  return apiCall<CheckUpgradeResponse>(
    "/api/membership/check-upgrade",
    "POST",
    undefined,
    token,
    signal
  );
};

// Lay lich su thang hang
export const getMembershipHistory = async (
  token: string,
  signal?: AbortSignal
): Promise<{ success: boolean; history: MembershipHistoryItem[] }> => {
  return apiCall<{ success: boolean; history: MembershipHistoryItem[] }>(
    "/api/membership/history",
    "GET",
    undefined,
    token,
    signal
  );
};

// Lay bang thong tin hang (public)
export const getMembershipInfo = async (
  signal?: AbortSignal
): Promise<{ success: boolean; tiers: MembershipTierInfo[] }> => {
  return apiCall<{ success: boolean; tiers: MembershipTierInfo[] }>(
    "/api/membership/info",
    "GET",
    undefined,
    undefined,
    signal
  );
};
