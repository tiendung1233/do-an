"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { getMyMembership, MembershipData, MembershipTier } from "@/ultils/api/membership";

// Icon components for each tier
const TierIcon = ({ tier }: { tier: MembershipTier }) => {
  const iconClass = "w-12 h-12";

  switch (tier) {
    case "bronze":
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="#CD7F32">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
        </svg>
      );
    case "silver":
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="#C0C0C0">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
        </svg>
      );
    case "gold":
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="#FFD700">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
        </svg>
      );
    default:
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="#9CA3AF">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
        </svg>
      );
  }
};

const TIER_GRADIENTS: { [key in MembershipTier]: string } = {
  none: "from-gray-400 to-gray-600",
  bronze: "from-amber-600 to-amber-800",
  silver: "from-gray-300 to-gray-500",
  gold: "from-yellow-400 to-amber-500",
};

const TIER_THRESHOLDS = {
  bronze: 10000000,
  silver: 20000000,
  gold: 30000000,
};

export default function MembershipBanner() {
  const [membership, setMembership] = useState<MembershipData | null>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    fetchMembership();
  }, []);

  const fetchMembership = async () => {
    const token = Cookies.get("authToken");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await getMyMembership(token);
      setMembership(response.membership);
    } catch (error) {
      console.error("Error fetching membership:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + "d";
  };

  if (loading) {
    return (
      <div className="bg-gray-100 rounded-lg p-4 animate-pulse">
        <div className="h-20 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (!membership) return null;

  const tier = membership.tier;
  const gradient = TIER_GRADIENTS[tier];

  return (
    <div className="mb-6">
      {/* Main Banner */}
      <div
        className={`bg-gradient-to-r ${gradient} rounded-lg p-4 text-white cursor-pointer transition-all`}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <TierIcon tier={tier} />
            <div>
              <p className="text-sm opacity-80">Hang thanh vien</p>
              <h3 className="text-xl font-bold">
                {membership.tierInfo.nameVi}
              </h3>
              {membership.cashbackBonus > 0 && (
                <p className="text-sm">
                  +{membership.cashbackBonus}% cashback moi don
                </p>
              )}
            </div>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-6 w-6 transition-transform ${expanded ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {/* Progress to next tier */}
        {membership.nextTier && (
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Tien do len {membership.nextTierInfo?.nameVi}</span>
              <span>{membership.progressPercent}%</span>
            </div>
            <div className="w-full bg-white/30 rounded-full h-2">
              <div
                className="bg-white rounded-full h-2 transition-all"
                style={{ width: `${membership.progressPercent}%` }}
              ></div>
            </div>
            <p className="text-xs mt-1 opacity-80">
              Con {formatCurrency(membership.amountToNextTier)} nua
            </p>
          </div>
        )}
      </div>

      {/* Expanded Info */}
      {expanded && (
        <div className="bg-white rounded-lg shadow mt-2 p-4">
          <h4 className="font-semibold text-gray-800 mb-3">Bang quyen loi thanh vien</h4>

          {/* Tier Cards */}
          <div className="space-y-3">
            {(["bronze", "silver", "gold"] as MembershipTier[]).map((t) => {
              const isCurrentTier = t === tier;
              const isAchieved =
                (t === "bronze" && ["bronze", "silver", "gold"].includes(tier)) ||
                (t === "silver" && ["silver", "gold"].includes(tier)) ||
                (t === "gold" && tier === "gold");

              return (
                <div
                  key={t}
                  className={`p-3 rounded-lg border-2 ${
                    isCurrentTier
                      ? "border-blue-500 bg-blue-50"
                      : isAchieved
                      ? "border-green-300 bg-green-50"
                      : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <TierIcon tier={t} />
                      <div>
                        <h5 className="font-semibold text-gray-800">
                          Hang {t === "bronze" ? "Dong" : t === "silver" ? "Bac" : "Vang"}
                          {isCurrentTier && (
                            <span className="ml-2 text-xs bg-blue-500 text-white px-2 py-0.5 rounded">
                              Hien tai
                            </span>
                          )}
                        </h5>
                        <p className="text-sm text-gray-500">
                          Tong don hang: {formatCurrency(TIER_THRESHOLDS[t])}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-green-600 font-semibold">
                        +{t === "bronze" ? 1 : t === "silver" ? 2 : 3}% moi don
                      </p>
                      <p className="text-purple-600 text-sm">
                        Voucher {t === "bronze" ? 2 : t === "silver" ? 3 : 5}%
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Stats */}
          <div className="mt-4 pt-4 border-t">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-800">
                  {formatCurrency(membership.totalSpent)}
                </p>
                <p className="text-sm text-gray-500">Tong chi tieu</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">
                  +{membership.cashbackBonus}%
                </p>
                <p className="text-sm text-gray-500">Bonus hien tai</p>
              </div>
            </div>
          </div>

          {/* Benefits Info */}
          <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
            <h5 className="font-semibold text-yellow-800 mb-2">Quyen loi thanh vien</h5>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Cashback bonus tu dong cong vao moi don hang</li>
              <li>• Voucher dac biet khi thang hang</li>
              <li>• Hang duoc duy tri vinh vien</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
