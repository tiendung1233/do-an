"use client";
import React, { useEffect, useState } from "react";
import NavBar from "@/layout/app/navbar";
import Footer from "@/layout/app/footer";
import useAuth from "@/hook/useAuth";
import Cookies from "js-cookie";
import Spinner from "@/components/spinner/spinner";
import {
  getTopCashback,
  getTopReferrers,
  getAllTimeLeaderboard,
  getMyRanking,
  LeaderboardUser,
  MyRankingResponse,
} from "@/ultils/api/leaderboard";
import {
  TrophyIcon,
  FireIcon,
  UserGroupIcon,
  ChartBarIcon,
  CalendarIcon,
  SparklesIcon,
} from "@heroicons/react/24/solid";

type TabType = "cashback" | "referral" | "alltime";

const LeaderboardPage = () => {
  const isAuthenticated = useAuth(true);
  const [activeTab, setActiveTab] = useState<TabType>("cashback");
  const [loading, setLoading] = useState(true);
  const [cashbackLeaderboard, setCashbackLeaderboard] = useState<LeaderboardUser[]>([]);
  const [referralLeaderboard, setReferralLeaderboard] = useState<LeaderboardUser[]>([]);
  const [allTimeCashback, setAllTimeCashback] = useState<LeaderboardUser[]>([]);
  const [allTimeReferral, setAllTimeReferral] = useState<LeaderboardUser[]>([]);
  const [myRanking, setMyRanking] = useState<MyRankingResponse | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const fetchData = async () => {
    const token = Cookies.get("authToken");
    if (!token) {
      console.log("No token found");
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      console.log("Fetching leaderboard data...", { selectedMonth, selectedYear });

      const [cashbackRes, referralRes, allTimeRes, rankingRes] = await Promise.all([
        getTopCashback(token, selectedMonth, selectedYear),
        getTopReferrers(token, selectedMonth, selectedYear),
        getAllTimeLeaderboard(token),
        getMyRanking(token, selectedMonth, selectedYear),
      ]);

      console.log("Responses:", { cashbackRes, referralRes, allTimeRes, rankingRes });

      if (cashbackRes?.success) {
        setCashbackLeaderboard(cashbackRes.leaderboard || []);
      }
      if (referralRes?.success) {
        setReferralLeaderboard(referralRes.leaderboard || []);
      }
      if (allTimeRes?.success) {
        setAllTimeCashback(allTimeRes.topCashback || []);
        setAllTimeReferral(allTimeRes.topReferrers || []);
      }
      if (rankingRes?.success) {
        setMyRanking(rankingRes);
      }
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated?.isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated?.isAuthenticated, selectedMonth, selectedYear]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg">
            <TrophyIcon className="w-6 h-6 text-white" />
          </div>
        );
      case 2:
        return (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center shadow-lg">
            <TrophyIcon className="w-6 h-6 text-white" />
          </div>
        );
      case 3:
        return (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center shadow-lg">
            <TrophyIcon className="w-6 h-6 text-white" />
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 rounded-full bg-secondary-200 dark:bg-secondary-700 flex items-center justify-center">
            <span className="text-lg font-bold text-secondary-600 dark:text-secondary-300">
              {rank}
            </span>
          </div>
        );
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
  };

  const renderLeaderboardItem = (
    user: LeaderboardUser,
    type: "cashback" | "referral"
  ) => {
    const isTop3 = user.rank <= 3;
    return (
      <div
        key={user.userId}
        className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 ${
          isTop3
            ? "bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/30 dark:to-primary-800/30 border border-primary-200 dark:border-primary-700"
            : "bg-white dark:bg-secondary-800 hover:bg-secondary-50 dark:hover:bg-secondary-700"
        } shadow-sm`}
      >
        {getRankIcon(user.rank)}

        <div className="flex-shrink-0">
          {user.userImage ? (
            <img
              src={user.userImage}
              alt={user.userName}
              className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-secondary-700 shadow"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-lg">
              {user.userName?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-secondary-900 dark:text-white truncate">
            {user.userName}
          </p>
          <p className="text-sm text-secondary-500 dark:text-secondary-400 truncate">
            {user.userEmail}
          </p>
        </div>

        <div className="text-right">
          <p className="font-bold text-lg text-primary-600 dark:text-primary-400">
            {type === "cashback"
              ? formatCurrency(user.totalCashback || 0)
              : `${user.referralCount} người`}
          </p>
          {user.reward && user.reward > 0 && (
            <p className="text-sm text-green-600 dark:text-green-400 flex items-center justify-end gap-1">
              <SparklesIcon className="w-4 h-4" />
              +{formatCurrency(user.reward)}
            </p>
          )}
        </div>
      </div>
    );
  };

  const months = [
    "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4",
    "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8",
    "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12",
  ];

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="bg-secondary-50 dark:bg-secondary-900 text-secondary-900 dark:text-white min-h-screen flex flex-col">
      <NavBar isAuthenticated={isAuthenticated.isAuthenticated} />

      <main className="flex-1 mt-[80px] px-4 sm:px-8 lg:px-16 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 mb-4 shadow-lg">
              <TrophyIcon className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
              Bảng Xếp Hạng
            </h1>
            <p className="text-secondary-500 dark:text-secondary-400 mt-2">
              Top người dùng kiếm cashback và giới thiệu bạn bè
            </p>
          </div>

          {/* My Ranking Card */}
          {myRanking && (
            <div className="mb-6 p-6 rounded-3xl bg-gradient-to-r from-primary-500 to-primary-700 text-white shadow-xl">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <ChartBarIcon className="w-5 h-5" />
                Thứ hạng của bạn ({months[selectedMonth - 1]} {selectedYear})
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/20 backdrop-blur rounded-2xl p-4">
                  <p className="text-sm opacity-80">Cashback</p>
                  <p className="text-2xl font-bold">#{myRanking.cashback.rank}</p>
                  <p className="text-sm opacity-80">
                    {formatCurrency(myRanking.cashback.amount)}
                  </p>
                </div>
                <div className="bg-white/20 backdrop-blur rounded-2xl p-4">
                  <p className="text-sm opacity-80">Giới thiệu</p>
                  <p className="text-2xl font-bold">
                    {myRanking.referral.rank ? `#${myRanking.referral.rank}` : "-"}
                  </p>
                  <p className="text-sm opacity-80">
                    {myRanking.referral.count} người
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Month/Year Selector */}
          {activeTab !== "alltime" && (
            <div className="flex gap-4 mb-6 justify-center">
              <div className="flex items-center gap-2 bg-white dark:bg-secondary-800 rounded-xl px-4 py-2 shadow">
                <CalendarIcon className="w-5 h-5 text-primary-500" />
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                  className="bg-transparent border-none focus:ring-0 text-secondary-900 dark:text-white cursor-pointer"
                >
                  {months.map((month, index) => (
                    <option key={index} value={index + 1}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2 bg-white dark:bg-secondary-800 rounded-xl px-4 py-2 shadow">
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className="bg-transparent border-none focus:ring-0 text-secondary-900 dark:text-white cursor-pointer"
                >
                  {[2024, 2025, 2026].map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-2 mb-6 bg-white dark:bg-secondary-800 p-1.5 rounded-2xl shadow">
            <button
              onClick={() => setActiveTab("cashback")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                activeTab === "cashback"
                  ? "bg-primary-500 text-white shadow-lg"
                  : "text-secondary-600 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-700"
              }`}
            >
              <FireIcon className="w-5 h-5" />
              <span className="hidden sm:inline">Cashback</span>
            </button>
            <button
              onClick={() => setActiveTab("referral")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                activeTab === "referral"
                  ? "bg-primary-500 text-white shadow-lg"
                  : "text-secondary-600 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-700"
              }`}
            >
              <UserGroupIcon className="w-5 h-5" />
              <span className="hidden sm:inline">Giới thiệu</span>
            </button>
            <button
              onClick={() => setActiveTab("alltime")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                activeTab === "alltime"
                  ? "bg-primary-500 text-white shadow-lg"
                  : "text-secondary-600 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-700"
              }`}
            >
              <TrophyIcon className="w-5 h-5" />
              <span className="hidden sm:inline">Mọi thời đại</span>
            </button>
          </div>

          {/* Reward Info */}
          <div className="mb-6 p-4 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-2xl border border-yellow-200 dark:border-yellow-800">
            <h4 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-2 flex items-center gap-2">
              <SparklesIcon className="w-5 h-5" />
              Phần thưởng Top 3 hàng tháng
            </h4>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl mb-1">🥇</div>
                <p className="text-sm text-yellow-700 dark:text-yellow-400">
                  {activeTab === "referral" ? "150.000đ" : "100.000đ"}
                </p>
              </div>
              <div>
                <div className="text-2xl mb-1">🥈</div>
                <p className="text-sm text-yellow-700 dark:text-yellow-400">
                  {activeTab === "referral" ? "80.000đ" : "50.000đ"}
                </p>
              </div>
              <div>
                <div className="text-2xl mb-1">🥉</div>
                <p className="text-sm text-yellow-700 dark:text-yellow-400">
                  {activeTab === "referral" ? "50.000đ" : "30.000đ"}
                </p>
              </div>
            </div>
          </div>

          {/* Leaderboard Content */}
          {loading ? (
            <div className="flex justify-center py-12">
              <Spinner />
            </div>
          ) : (
            <div className="space-y-3">
              {activeTab === "cashback" && (
                <>
                  {cashbackLeaderboard.length > 0 ? (
                    cashbackLeaderboard.map((user) =>
                      renderLeaderboardItem(user, "cashback")
                    )
                  ) : (
                    <div className="text-center py-12 text-secondary-500">
                      <ChartBarIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Chưa có dữ liệu cho tháng này</p>
                    </div>
                  )}
                </>
              )}

              {activeTab === "referral" && (
                <>
                  {referralLeaderboard.length > 0 ? (
                    referralLeaderboard.map((user) =>
                      renderLeaderboardItem(user, "referral")
                    )
                  ) : (
                    <div className="text-center py-12 text-secondary-500">
                      <UserGroupIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Chưa có dữ liệu cho tháng này</p>
                    </div>
                  )}
                </>
              )}

              {activeTab === "alltime" && (
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-4 flex items-center gap-2 text-lg">
                      <FireIcon className="w-5 h-5 text-orange-500" />
                      Top Cashback
                    </h3>
                    <div className="space-y-3">
                      {allTimeCashback.map((user) =>
                        renderLeaderboardItem(user, "cashback")
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-4 flex items-center gap-2 text-lg">
                      <UserGroupIcon className="w-5 h-5 text-blue-500" />
                      Top Giới thiệu
                    </h3>
                    <div className="space-y-3">
                      {allTimeReferral.map((user) =>
                        renderLeaderboardItem(user, "referral")
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LeaderboardPage;
