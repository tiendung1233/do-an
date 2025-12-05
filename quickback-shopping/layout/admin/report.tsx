import InputSection from "@/components/input/input";
import { useToast } from "@/context/toastContext";
import { getReport } from "@/ultils/api/purchase";
import { formatDate } from "@/ultils/func/helper";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import {
  ChartBarIcon,
  ArrowPathIcon,
  FunnelIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";

export default function ReportAdmin() {
  const token = Cookies.get("authToken");
  const { addToast } = useToast();
  const [report, setReport] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState<{
    utm_source?: "";
    limit: 100;
    status?: 0 | 1 | 2;
    merchant?: string;
  }>({ utm_source: "", limit: 100, merchant: "" });

  const fetchReport = async () => {
    setLoading(true);
    const data = await getReport(token!, value);
    if (data) {
      setReport(data.userData);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const formatMoney = (amount: number | string) => {
    const num = typeof amount === "string" ? parseFloat(amount) : amount;
    return new Intl.NumberFormat("vi-VN").format(num) + "đ";
  };

  const getStatusBadge = (status: number) => {
    if (status === 1) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-success-50 dark:bg-success-900/20 text-success-700 dark:text-success-400 text-xs font-medium">
          <CheckCircleIcon className="size-4" />
          Đã duyệt
        </span>
      );
    } else if (status === 0) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-warning-50 dark:bg-warning-900/20 text-warning-700 dark:text-warning-400 text-xs font-medium">
          <ClockIcon className="size-4" />
          Đang xử lý
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-error-50 dark:bg-error-900/20 text-error-700 dark:text-error-400 text-xs font-medium">
          <XCircleIcon className="size-4" />
          Hủy
        </span>
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Filter Section */}
      <div className="rounded-2xl bg-white/60 dark:bg-secondary-800/60 backdrop-blur-xl border border-secondary-200/50 dark:border-secondary-700/50 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-primary-sm">
            <FunnelIcon className="size-5 text-white" />
          </div>
          <h2 className="text-lg font-semibold text-secondary-900 dark:text-white">
            Bộ lọc báo cáo
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1.5">
              ID người dùng
            </label>
            <InputSection
              type="text"
              value={value.utm_source}
              placeholder="Nhập ID người dùng"
              onChange={(e) =>
                setValue((prev: any) => ({
                  ...prev,
                  utm_source: e.target.value,
                }))
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1.5">
              Số lượng
            </label>
            <InputSection
              type="number"
              value={value.limit?.toString()}
              placeholder="100"
              onChange={(e) =>
                setValue((prev: any) => ({
                  ...prev,
                  limit: e.target.value,
                }))
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1.5">
              Nền tảng
            </label>
            <InputSection
              type="text"
              value={value.merchant}
              placeholder="Shopee, Lazada..."
              onChange={(e) =>
                setValue((prev: any) => ({
                  ...prev,
                  merchant: e.target.value,
                }))
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1.5">
              Trạng thái
            </label>
            <InputSection
              type="number"
              value={value.status?.toString()}
              placeholder="0: hold, 1: approved, 2: rejected"
              onChange={(e) =>
                setValue((prev: any) => ({
                  ...prev,
                  status: e.target.value,
                }))
              }
            />
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={async () => {
              await fetchReport();
            }}
            disabled={loading}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium shadow-primary-sm hover:shadow-primary transition-all disabled:opacity-50"
          >
            <ArrowPathIcon className={`size-5 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Đang tải..." : "Tải lại báo cáo"}
          </button>
        </div>
      </div>

      {/* Report Table */}
      <div className="rounded-2xl bg-white/60 dark:bg-secondary-800/60 backdrop-blur-xl border border-secondary-200/50 dark:border-secondary-700/50 overflow-hidden">
        <div className="flex items-center gap-3 p-6 border-b border-secondary-200/50 dark:border-secondary-700/50">
          <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-success-500 to-success-600 shadow-lg">
            <ChartBarIcon className="size-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-secondary-900 dark:text-white">
              Báo cáo giao dịch
            </h2>
            <p className="text-sm text-secondary-500">
              Tổng cộng {report?.length || 0} giao dịch
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-secondary-50/50 dark:bg-secondary-900/50">
                <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-500 uppercase tracking-wider">
                  Tên
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-500 uppercase tracking-wider">
                  Hoa hồng
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-500 uppercase tracking-wider">
                  Giá
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-500 uppercase tracking-wider">
                  Ngày mua
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-500 uppercase tracking-wider">
                  Mã GD
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-500 uppercase tracking-wider">
                  Lý do
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-500 uppercase tracking-wider">
                  Sản phẩm
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-500 uppercase tracking-wider">
                  Nền tảng
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-500 uppercase tracking-wider">
                  Link
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-500 uppercase tracking-wider">
                  Xác nhận
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-500 uppercase tracking-wider">
                  Chi tiết
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-100 dark:divide-secondary-700/50">
              {report &&
                report?.length > 0 &&
                report?.map((p: any, i: number) => (
                  <tr
                    key={i}
                    className="hover:bg-secondary-50/50 dark:hover:bg-secondary-700/30 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-medium text-secondary-900 dark:text-white">
                        {p?.userName}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-600 dark:text-secondary-400">
                      {p?.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-success-600 dark:text-success-400">
                      {formatMoney(p?.commission)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900 dark:text-white">
                      {formatMoney(p?.product_price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-600 dark:text-secondary-400">
                      {formatDate(p?.transaction_time)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500 font-mono">
                      {p?.transaction_id?.slice(-8)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-600 dark:text-secondary-400">
                      {p?.reason_rejected || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(p?.status)}
                    </td>
                    <td className="px-6 py-4 max-w-[200px] truncate text-sm text-secondary-600 dark:text-secondary-400">
                      {p?.product_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 text-xs font-medium">
                        {p?.merchant}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <a
                        className="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 transition-colors"
                        href={p?.click_url}
                        target="_blank"
                      >
                        Xem
                        <ArrowTopRightOnSquareIcon className="size-4" />
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-600 dark:text-secondary-400">
                      {formatDate(p?.confirmed_time)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <a
                        className="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 transition-colors"
                        href="https://pub2.accesstrade.vn/report/"
                        target="_blank"
                      >
                        Chi tiết
                        <ArrowTopRightOnSquareIcon className="size-4" />
                      </a>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
