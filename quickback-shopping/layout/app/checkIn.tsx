"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import {
  getCheckInStatus,
  doCheckIn,
  CheckInDay,
} from "@/ultils/api/checkIn";
import Spinner from "@/components/spinner/spinner";

const DAY_NAMES = ["", "T2", "T3", "T4", "T5", "T6", "T7", "CN"];

export default function CheckInLayout() {
  const [days, setDays] = useState<CheckInDay[]>([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [hasCheckedInToday, setHasCheckedInToday] = useState(false);
  const [loading, setLoading] = useState(true);
  const [checkingIn, setCheckingIn] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [receivedVoucher, setReceivedVoucher] = useState<{
    code: string;
    percentage: number;
    expiresAt: string;
  } | null>(null);

  useEffect(() => {
    fetchCheckInStatus();
  }, []);

  const fetchCheckInStatus = async () => {
    const token = Cookies.get("authToken");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await getCheckInStatus(token);
      setDays(response.days);
      setCurrentStreak(response.currentStreak);
      setHasCheckedInToday(response.hasCheckedInToday);
    } catch (error) {
      console.error("Error fetching check-in status:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    const token = Cookies.get("authToken");
    if (!token) return;

    setCheckingIn(true);
    setMessage(null);

    try {
      const response = await doCheckIn(token);
      if (response.success) {
        setMessage({ type: "success", text: response.message });
        setReceivedVoucher(response.voucher);
        // Refresh status
        await fetchCheckInStatus();
      }
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.message || "Co loi xay ra khi diem danh",
      });
    } finally {
      setCheckingIn(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Diem danh hang ngay</h1>
        <p className="text-orange-100">
          Diem danh moi ngay de nhan voucher cashback!
        </p>
      </div>

      {/* Streak Info */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 rounded-full mb-3">
            <span className="text-3xl font-bold text-orange-600">{currentStreak}</span>
          </div>
          <p className="text-gray-600">Ngay da diem danh tuan nay</p>
        </div>
      </div>

      {/* Check-in Days Grid */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Lich diem danh tuan nay
        </h2>
        <div className="grid grid-cols-7 gap-2">
          {days.map((day) => (
            <div
              key={day.day}
              className={`relative p-3 rounded-lg text-center transition-all ${
                day.isCheckedIn
                  ? "bg-green-500 text-white"
                  : day.isToday
                  ? "bg-orange-100 border-2 border-orange-500"
                  : "bg-gray-100"
              }`}
            >
              <p className="text-xs font-medium mb-1">
                {DAY_NAMES[day.day]}
              </p>
              <p className={`text-lg font-bold ${
                day.isCheckedIn ? "text-white" : day.isToday ? "text-orange-600" : "text-gray-600"
              }`}>
                {day.percentage}%
              </p>
              {day.isCheckedIn && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 absolute top-1 right-1"
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
              )}
              {day.isToday && !day.isCheckedIn && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full animate-pulse"></span>
              )}
            </div>
          ))}
        </div>

        {/* Check-in Button */}
        <div className="mt-6">
          {hasCheckedInToday ? (
            <div className="text-center py-4 bg-green-50 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 mx-auto text-green-500 mb-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-green-600 font-medium">Ban da diem danh hom nay!</p>
              <p className="text-gray-500 text-sm mt-1">Quay lai ngay mai de tiep tuc nhan thuong</p>
            </div>
          ) : (
            <button
              onClick={handleCheckIn}
              disabled={checkingIn}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-lg font-bold text-lg hover:from-orange-600 hover:to-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {checkingIn ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Dang diem danh...
                </span>
              ) : (
                "DIEM DANH NGAY"
              )}
            </button>
          )}
        </div>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Received Voucher */}
      {receivedVoucher && (
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg p-6 text-white">
          <h3 className="font-bold text-lg mb-2">Chuc mung! Ban nhan duoc voucher!</h3>
          <div className="bg-white/20 rounded-lg p-4">
            <p className="font-mono text-2xl font-bold text-center mb-2">
              {receivedVoucher.code}
            </p>
            <div className="flex justify-between text-sm">
              <span>Gia tri: +{receivedVoucher.percentage}% cashback</span>
              <span>HSD: {formatDate(receivedVoucher.expiresAt)}</span>
            </div>
          </div>
          <p className="text-yellow-100 text-sm mt-3">
            Voucher da duoc luu vao kho. Su dung trong muc Lich su mua hang!
          </p>
        </div>
      )}

      {/* Reward Info */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Bang phan thuong
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 text-gray-600">Ngay</th>
                <th className="text-right py-3 px-4 text-gray-600">Voucher</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                <tr key={day} className="border-b last:border-0">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="bg-orange-100 text-orange-600 w-8 h-8 rounded-full flex items-center justify-center font-bold">
                        {day}
                      </span>
                      <span className="text-gray-700">{DAY_NAMES[day]}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right font-semibold text-green-600">
                    +{day}% cashback
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-gray-500 text-sm mt-3">
          * Voucher chi su dung duoc cho don hang da duoc duyet va chua ap dung voucher
        </p>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-3 text-blue-800">
          Huong dan su dung voucher
        </h2>
        <ol className="list-decimal list-inside space-y-2 text-blue-700">
          <li>Diem danh hang ngay de nhan voucher</li>
          <li>Vao muc Lich su mua hang</li>
          <li>Chon don hang da duoc duyet</li>
          <li>Nhap ma voucher de nhan them cashback</li>
        </ol>
      </div>
    </div>
  );
}
