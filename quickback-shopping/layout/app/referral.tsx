"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import {
  getMyReferralCode,
  getMyReferrals,
  ReferralReward,
} from "@/ultils/api/referral";
import Spinner from "@/components/spinner/spinner";

const REWARD_TABLE = [
  { person: 1, amount: 20000, label: "Nguoi thu 1" },
  { person: 2, amount: 50000, label: "Nguoi thu 2" },
  { person: 3, amount: 70000, label: "Nguoi thu 3" },
  { person: 4, amount: 30000, label: "Nguoi thu 4 tro di", isDefault: true },
];

export default function ReferralLayout() {
  const [referralCode, setReferralCode] = useState<string>("");
  const [referrals, setReferrals] = useState<ReferralReward[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const token = Cookies.get("authToken");
      if (!token) return;

      try {
        const [codeRes, referralsRes] = await Promise.all([
          getMyReferralCode(token),
          getMyReferrals(token),
        ]);
        setReferralCode(codeRes.referralCode);
        setReferrals(referralsRes.referrals);
      } catch (error) {
        console.error("Error fetching referral data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + "d";
  };

  if (loading) {
    return <Spinner />;
  }

  const totalEarned = referrals
    .filter((r) => r.status === "completed")
    .reduce((sum, r) => sum + r.rewardAmount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Gioi thieu ban be</h1>
        <p className="text-blue-100">
          Moi ban be dang ky va nhan thuong khong gioi han!
        </p>
      </div>

      {/* Referral Code Card */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Ma gioi thieu cua ban
        </h2>
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-gray-100 rounded-lg px-4 py-3 font-mono text-xl font-bold text-center text-blue-600">
            {referralCode || "Dang tao..."}
          </div>
          <button
            onClick={handleCopy}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg transition-colors"
          >
            {copied ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            )}
          </button>
        </div>
        {copied && (
          <p className="text-green-500 text-sm mt-2">Da sao chep ma!</p>
        )}
      </div>

      {/* Reward Table */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Bang thuong
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 text-gray-600">Cap bac</th>
                <th className="text-right py-3 px-4 text-gray-600">
                  Tien thuong
                </th>
              </tr>
            </thead>
            <tbody>
              {REWARD_TABLE.map((reward) => (
                <tr key={reward.person} className="border-b last:border-0">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center font-bold">
                        {reward.person === 4 ? "4+" : reward.person}
                      </span>
                      <span className="text-gray-700">{reward.label}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right font-semibold text-green-600">
                    +{formatCurrency(reward.amount)}
                    {reward.person === 4 && (
                      <span className="text-xs text-gray-500 block">moi nguoi</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-gray-500 text-sm mt-3">
          * Chi nhan thuong khi nguoi duoc gioi thieu phat sinh don hang dau
          tien
        </p>
      </div>

      {/* Stats Card */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-3xl font-bold text-blue-600">{referrals.length}</p>
            <p className="text-gray-600 text-sm">Nguoi da gioi thieu</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-3xl font-bold text-green-600">
              {formatCurrency(totalEarned)}
            </p>
            <p className="text-gray-600 text-sm">Da nhan thuong</p>
          </div>
        </div>
      </div>

      {/* Referrals List */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Danh sach nguoi da gioi thieu
        </h2>
        {referrals.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto mb-3 text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <p>Chua co nguoi nao duoc gioi thieu</p>
            <p className="text-sm mt-1">
              Chia se ma gioi thieu cua ban de bat dau nhan thuong!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {referrals.map((referral, index) => (
              <div
                key={referral._id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-medium text-gray-800">
                      {referral.referredUserId?.name || "Nguoi dung"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {referral.referredUserId?.email || ""}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  {referral.status === "completed" ? (
                    <>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Da mua hang
                      </span>
                      <p className="text-green-600 font-semibold mt-1">
                        +{formatCurrency(referral.rewardAmount)}
                      </p>
                    </>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Chua mua hang
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
