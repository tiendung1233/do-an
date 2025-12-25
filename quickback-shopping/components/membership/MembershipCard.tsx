"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import Link from "next/link";
import { getMyMembership, MembershipData, MembershipTier } from "@/ultils/api/membership";
import { getMyReferralCode } from "@/ultils/api/referral";

const TIER_COLORS: { [key in MembershipTier]: string } = {
  none: "from-gray-400 to-gray-500",
  bronze: "from-amber-600 to-amber-700",
  silver: "from-gray-300 to-gray-400",
  gold: "from-yellow-400 to-amber-500",
};

const TIER_ICONS: { [key in MembershipTier]: string } = {
  none: "☆",
  bronze: "🥉",
  silver: "🥈",
  gold: "🥇",
};

interface MembershipCardProps {
  userId?: string;
  telegramLink?: string;
}

export default function MembershipCard({ userId, telegramLink = "https://t.me/quickback_vn" }: MembershipCardProps) {
  const [membership, setMembership] = useState<MembershipData | null>(null);
  const [referralCode, setReferralCode] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = Cookies.get("authToken");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const [membershipRes, referralRes] = await Promise.all([
        getMyMembership(token),
        getMyReferralCode(token),
      ]);
      setMembership(membershipRes.membership);
      setReferralCode(referralRes.referralCode);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + "d";
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-4 animate-pulse">
        <div className="h-32 bg-gray-200 rounded-lg"></div>
      </div>
    );
  }

  if (!membership) return null;

  const tier = membership.tier;
  const gradient = TIER_COLORS[tier];

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Membership Section */}
      <div className={`bg-gradient-to-r ${gradient} p-4 text-white`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{TIER_ICONS[tier]}</span>
            <div>
              <p className="text-xs opacity-80">Hang thanh vien</p>
              <h3 className="text-lg font-bold">{membership.tierInfo.nameVi}</h3>
            </div>
          </div>
          {membership.cashbackBonus > 0 && (
            <div className="text-right">
              <p className="text-2xl font-bold">+{membership.cashbackBonus}%</p>
              <p className="text-xs opacity-80">moi don</p>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        {membership.nextTier && (
          <div className="mt-3">
            <div className="flex justify-between text-xs mb-1">
              <span>Len {membership.nextTierInfo?.nameVi}</span>
              <span>{membership.progressPercent}%</span>
            </div>
            <div className="w-full bg-white/30 rounded-full h-1.5">
              <div
                className="bg-white rounded-full h-1.5 transition-all"
                style={{ width: `${membership.progressPercent}%` }}
              ></div>
            </div>
            <p className="text-xs mt-1 opacity-70">
              Con {formatCurrency(membership.amountToNextTier)}
            </p>
          </div>
        )}

        <Link
          href={userId ? `/profile/${userId}` : "#"}
          className="block mt-3 text-center text-xs bg-white/20 hover:bg-white/30 rounded-lg py-1.5 transition-colors"
        >
          Xem chi tiet
        </Link>
      </div>

      {/* Referral Code Section */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Ma gioi thieu</span>
          <Link
            href={userId ? `/event/${userId}/referral` : "#"}
            className="text-xs text-blue-500 hover:underline"
          >
            Chi tiet
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-gray-100 rounded-lg px-3 py-2 font-mono font-bold text-center text-blue-600">
            {referralCode || "---"}
          </div>
          <button
            onClick={handleCopyReferral}
            className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            title="Sao chep"
          >
            {copied ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            )}
          </button>
        </div>
        {copied && (
          <p className="text-green-500 text-xs mt-1 text-center">Da sao chep!</p>
        )}
      </div>

      {/* Telegram Section */}
      <div className="p-4">
        <a
          href={telegramLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#0088cc] hover:bg-[#006699] text-white rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
          </svg>
          <span className="font-medium">Tham gia Telegram</span>
        </a>
        <p className="text-xs text-gray-500 text-center mt-2">
          Nhan thong bao uu dai moi nhat
        </p>
      </div>
    </div>
  );
}
