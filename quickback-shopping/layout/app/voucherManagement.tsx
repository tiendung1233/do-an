"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { getMyVouchers, Voucher, VoucherStats } from "@/ultils/api/voucher";
import Spinner from "@/components/spinner/spinner";

type FilterStatus = "all" | "active" | "used" | "expired";

export default function VoucherManagementLayout() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [stats, setStats] = useState<VoucherStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    fetchVouchers();
  }, []);

  const fetchVouchers = async () => {
    const token = Cookies.get("authToken");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await getMyVouchers(token);
      setVouchers(response.vouchers);
      setStats(response.stats);
    } catch (error) {
      console.error("Error fetching vouchers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + "d";
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Con hieu luc
          </span>
        );
      case "used":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Da su dung
          </span>
        );
      case "expired":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Het han
          </span>
        );
      default:
        return null;
    }
  };

  const filteredVouchers = vouchers.filter((v) => {
    if (filter === "all") return true;
    return v.status === filter;
  });

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Kho Voucher</h1>
        <p className="text-purple-100">
          Quan ly va su dung voucher cua ban
        </p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
            <p className="text-gray-500 text-xs">Tong cong</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{stats.active}</p>
            <p className="text-gray-500 text-xs">Con hieu luc</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{stats.used}</p>
            <p className="text-gray-500 text-xs">Da su dung</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-2xl font-bold text-gray-400">{stats.expired}</p>
            <p className="text-gray-500 text-xs">Het han</p>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg shadow p-2">
        <div className="flex gap-2">
          {[
            { key: "all", label: "Tat ca" },
            { key: "active", label: "Con hieu luc" },
            { key: "used", label: "Da su dung" },
            { key: "expired", label: "Het han" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as FilterStatus)}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                filter === tab.key
                  ? "bg-purple-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Vouchers List */}
      <div className="space-y-3">
        {filteredVouchers.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
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
                d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
              />
            </svg>
            <p className="text-gray-500">Khong co voucher nao</p>
            <p className="text-gray-400 text-sm mt-1">
              Diem danh hang ngay de nhan voucher moi!
            </p>
          </div>
        ) : (
          filteredVouchers.map((voucher) => (
            <div
              key={voucher._id}
              className={`bg-white rounded-lg shadow overflow-hidden ${
                voucher.status !== "active" ? "opacity-60" : ""
              }`}
            >
              <div className="flex">
                {/* Left side - percentage */}
                <div className={`w-24 flex flex-col items-center justify-center p-4 ${
                  voucher.status === "active"
                    ? "bg-gradient-to-b from-orange-500 to-red-500"
                    : "bg-gray-400"
                } text-white`}>
                  <span className="text-3xl font-bold">+{voucher.percentage}%</span>
                  <span className="text-xs">cashback</span>
                </div>

                {/* Right side - details */}
                <div className="flex-1 p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono font-bold text-lg text-gray-800">
                          {voucher.code}
                        </span>
                        {voucher.status === "active" && (
                          <button
                            onClick={() => handleCopy(voucher.code)}
                            className="text-purple-500 hover:text-purple-700"
                          >
                            {copiedCode === voucher.code ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
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
                                className="h-5 w-5"
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
                        )}
                      </div>
                      <p className="text-gray-500 text-sm">
                        Voucher diem danh ngay {voucher.dayNumber}
                      </p>
                    </div>
                    {getStatusBadge(voucher.status)}
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">
                      {voucher.status === "used" && voucher.usedAt
                        ? `Da dung: ${formatDate(voucher.usedAt)}`
                        : `HSD: ${formatDate(voucher.expiresAt)}`}
                    </span>
                    {voucher.status === "used" && voucher.usedOnPurchaseId && (
                      <span className="text-green-600 font-medium">
                        +{formatCurrency(
                          Math.round(
                            (voucher.usedOnPurchaseId.cashback * voucher.percentage) / 100
                          )
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-3 text-blue-800">
          Cach su dung voucher
        </h2>
        <ol className="list-decimal list-inside space-y-2 text-blue-700">
          <li>Sao chep ma voucher con hieu luc</li>
          <li>Vao muc Lich su mua hang</li>
          <li>Chon don hang da duoc duyet</li>
          <li>Nhap ma voucher de nhan them cashback</li>
        </ol>
        <p className="text-blue-600 text-sm mt-3">
          * Moi don hang chi duoc su dung 1 voucher
        </p>
      </div>
    </div>
  );
}
