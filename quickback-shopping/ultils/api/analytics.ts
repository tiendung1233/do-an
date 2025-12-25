import { apiCall } from "../func/api";

export interface AnalyticsOverview {
  totalOrders: number;
  approvedOrders: number;
  totalRevenue: number;
  totalCashback: number;
  newUsers: number;
  totalUsers: number;
  period: string;
}

export interface OrdersChartData {
  date: string;
  total: number;
  approved: number;
  pending: number;
  cancelled: number;
}

export interface RevenueChartData {
  date: string;
  revenue: number;
  cashback: number;
  orders: number;
}

export interface UsersChartData {
  date: string;
  newUsers: number;
  totalUsers: number;
}

export interface AllAnalyticsResponse {
  success: boolean;
  overview: AnalyticsOverview;
  ordersChart: OrdersChartData[];
  revenueChart: RevenueChartData[];
  usersChart: UsersChartData[];
}

export type PeriodType = "7d" | "30d" | "90d" | "1y";

// Lấy tất cả dữ liệu analytics
export const getAllAnalytics = async (
  token: string,
  period: PeriodType = "30d",
  signal?: AbortSignal
): Promise<AllAnalyticsResponse> => {
  return apiCall<AllAnalyticsResponse>(
    `/api/analytics/all?period=${period}`,
    "GET",
    undefined,
    token,
    signal
  );
};

// Lấy overview
export const getAnalyticsOverview = async (
  token: string,
  period: PeriodType = "30d",
  signal?: AbortSignal
): Promise<{ success: boolean; overview: AnalyticsOverview }> => {
  return apiCall<{ success: boolean; overview: AnalyticsOverview }>(
    `/api/analytics/overview?period=${period}`,
    "GET",
    undefined,
    token,
    signal
  );
};

// Lấy biểu đồ đơn hàng
export const getOrdersChart = async (
  token: string,
  period: PeriodType = "30d",
  signal?: AbortSignal
): Promise<{ success: boolean; chartData: OrdersChartData[] }> => {
  return apiCall<{ success: boolean; chartData: OrdersChartData[] }>(
    `/api/analytics/orders?period=${period}`,
    "GET",
    undefined,
    token,
    signal
  );
};

// Lấy biểu đồ doanh thu
export const getRevenueChart = async (
  token: string,
  period: PeriodType = "30d",
  signal?: AbortSignal
): Promise<{ success: boolean; chartData: RevenueChartData[] }> => {
  return apiCall<{ success: boolean; chartData: RevenueChartData[] }>(
    `/api/analytics/revenue?period=${period}`,
    "GET",
    undefined,
    token,
    signal
  );
};

// Lấy biểu đồ người dùng
export const getUsersChart = async (
  token: string,
  period: PeriodType = "30d",
  signal?: AbortSignal
): Promise<{ success: boolean; chartData: UsersChartData[] }> => {
  return apiCall<{ success: boolean; chartData: UsersChartData[] }>(
    `/api/analytics/users?period=${period}`,
    "GET",
    undefined,
    token,
    signal
  );
};
