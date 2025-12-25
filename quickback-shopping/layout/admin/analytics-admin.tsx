"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import {
  getAllAnalytics,
  AllAnalyticsResponse,
  PeriodType,
} from "@/ultils/api/analytics";
import {
  ChartBarIcon,
  UsersIcon,
  CurrencyDollarIcon,
  ShoppingCartIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from "@heroicons/react/24/outline";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

const PERIOD_OPTIONS: { value: PeriodType; label: string }[] = [
  { value: "7d", label: "7 ngày" },
  { value: "30d", label: "30 ngày" },
  { value: "90d", label: "90 ngày" },
  { value: "1y", label: "1 năm" },
];

export default function AnalyticsAdmin() {
  const token = Cookies.get("authToken");
  const [period, setPeriod] = useState<PeriodType>("30d");
  const [data, setData] = useState<AllAnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);

    try {
      const response = await getAllAnalytics(token, period);
      if (response.success) {
        setData(response);
      } else {
        setError("Không thể tải dữ liệu");
      }
    } catch (err) {
      setError("Lỗi khi tải dữ liệu analytics");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    if (value >= 1000000000) {
      return (value / 1000000000).toFixed(1) + " tỷ";
    }
    if (value >= 1000000) {
      return (value / 1000000).toFixed(1) + " tr";
    }
    if (value >= 1000) {
      return (value / 1000).toFixed(0) + "k";
    }
    return value.toLocaleString("vi-VN");
  };

  const formatFullCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN").format(value) + "đ";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="size-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error}</p>
        <button
          onClick={fetchAnalytics}
          className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-lg"
        >
          Thử lại
        </button>
      </div>
    );
  }

  if (!data) return null;

  const { overview, ordersChart, revenueChart, usersChart } = data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary-500 shadow-primary-sm">
            <ChartBarIcon className="size-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-secondary-900 dark:text-white">
              Thống kê & Phân tích
            </h2>
            <p className="text-sm text-secondary-500">
              Theo dõi hiệu suất hệ thống
            </p>
          </div>
        </div>

        {/* Period Selector */}
        <div className="flex gap-2">
          {PERIOD_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => setPeriod(option.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                period === option.value
                  ? "bg-primary-500 text-white"
                  : "bg-secondary-100 dark:bg-secondary-700 text-secondary-700 dark:text-secondary-300 hover:bg-secondary-200 dark:hover:bg-secondary-600"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Tổng đơn hàng */}
        <div className="p-5 rounded-2xl bg-white/60 dark:bg-secondary-800/60 backdrop-blur-xl border border-secondary-200/50 dark:border-secondary-700/50">
          <div className="flex items-center justify-between">
            <div className="flex size-12 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30">
              <ShoppingCartIcon className="size-6 text-blue-600" />
            </div>
            <span className="text-xs text-secondary-500 bg-secondary-100 dark:bg-secondary-700 px-2 py-1 rounded-full">
              {overview.approvedOrders}/{overview.totalOrders} đã duyệt
            </span>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-bold text-secondary-900 dark:text-white">
              {overview.totalOrders.toLocaleString()}
            </p>
            <p className="text-sm text-secondary-500">Tổng đơn hàng</p>
          </div>
        </div>

        {/* Tổng doanh thu */}
        <div className="p-5 rounded-2xl bg-white/60 dark:bg-secondary-800/60 backdrop-blur-xl border border-secondary-200/50 dark:border-secondary-700/50">
          <div className="flex items-center justify-between">
            <div className="flex size-12 items-center justify-center rounded-xl bg-green-100 dark:bg-green-900/30">
              <CurrencyDollarIcon className="size-6 text-green-600" />
            </div>
            <span className="flex items-center gap-1 text-xs text-green-600">
              <ArrowTrendingUpIcon className="size-4" />
            </span>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-bold text-secondary-900 dark:text-white">
              {formatCurrency(overview.totalRevenue)}
            </p>
            <p className="text-sm text-secondary-500">Tổng doanh thu</p>
          </div>
        </div>

        {/* Tổng cashback */}
        <div className="p-5 rounded-2xl bg-white/60 dark:bg-secondary-800/60 backdrop-blur-xl border border-secondary-200/50 dark:border-secondary-700/50">
          <div className="flex items-center justify-between">
            <div className="flex size-12 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-900/30">
              <ArrowTrendingDownIcon className="size-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-bold text-secondary-900 dark:text-white">
              {formatCurrency(overview.totalCashback)}
            </p>
            <p className="text-sm text-secondary-500">Tổng cashback</p>
          </div>
        </div>

        {/* Người dùng */}
        <div className="p-5 rounded-2xl bg-white/60 dark:bg-secondary-800/60 backdrop-blur-xl border border-secondary-200/50 dark:border-secondary-700/50">
          <div className="flex items-center justify-between">
            <div className="flex size-12 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/30">
              <UsersIcon className="size-6 text-amber-600" />
            </div>
            <span className="text-xs text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
              +{overview.newUsers} mới
            </span>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-bold text-secondary-900 dark:text-white">
              {overview.totalUsers.toLocaleString()}
            </p>
            <p className="text-sm text-secondary-500">Tổng người dùng</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders Chart */}
        <div className="p-6 rounded-2xl bg-white/60 dark:bg-secondary-800/60 backdrop-blur-xl border border-secondary-200/50 dark:border-secondary-700/50">
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
            Biểu đồ đơn hàng
          </h3>
          {ordersChart.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ordersChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => {
                    if (period === "1y") return value.split("-")[1];
                    return value.split("-").slice(1).join("/");
                  }}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Legend />
                <Bar dataKey="approved" name="Đã duyệt" fill="#10b981" stackId="a" />
                <Bar dataKey="pending" name="Đang xử lý" fill="#f59e0b" stackId="a" />
                <Bar dataKey="cancelled" name="Đã hủy" fill="#ef4444" stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-secondary-500">
              Không có dữ liệu
            </div>
          )}
        </div>

        {/* Revenue Chart */}
        <div className="p-6 rounded-2xl bg-white/60 dark:bg-secondary-800/60 backdrop-blur-xl border border-secondary-200/50 dark:border-secondary-700/50">
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
            Biểu đồ doanh thu
          </h3>
          {revenueChart.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => {
                    if (period === "1y") return value.split("-")[1];
                    return value.split("-").slice(1).join("/");
                  }}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => formatCurrency(value)}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                  formatter={(value: number) => formatFullCurrency(value)}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  name="Doanh thu"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.3}
                />
                <Area
                  type="monotone"
                  dataKey="cashback"
                  name="Cashback"
                  stroke="#8b5cf6"
                  fill="#8b5cf6"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-secondary-500">
              Không có dữ liệu
            </div>
          )}
        </div>

        {/* Users Chart */}
        <div className="p-6 rounded-2xl bg-white/60 dark:bg-secondary-800/60 backdrop-blur-xl border border-secondary-200/50 dark:border-secondary-700/50 lg:col-span-2">
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
            Biểu đồ người dùng đăng ký
          </h3>
          {usersChart.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={usersChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => {
                    if (period === "1y") return value.split("-")[1];
                    return value.split("-").slice(1).join("/");
                  }}
                />
                <YAxis tick={{ fontSize: 12 }} yAxisId="left" />
                <YAxis tick={{ fontSize: 12 }} yAxisId="right" orientation="right" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="newUsers"
                  name="Đăng ký mới"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={{ fill: "#f59e0b", strokeWidth: 2 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="totalUsers"
                  name="Tổng số"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ fill: "#10b981", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-secondary-500">
              Không có dữ liệu
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
