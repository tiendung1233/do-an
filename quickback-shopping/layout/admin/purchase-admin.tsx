"use client";

import InputSection from "@/components/input/input";
import { useToast } from "@/context/toastContext";
import { getAllUser } from "@/ultils/api/profile";
import {
  adminCreatePurchase,
  adminGetAllPurchase,
  AdminPurchaseHistoryItem,
  AdminCreatePurchaseData,
} from "@/ultils/api/purchase";
import Cookies from "js-cookie";
import { useEffect, useState, useMemo } from "react";
import {
  ShoppingCartIcon,
  PlusIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

const defaultFormData: AdminCreatePurchaseData = {
  userId: "",
  productName: "",
  price: 0,
  productLink: "",
  cashbackPercentage: 0,
  quantity: 1,
  status: "Đang xử lý",
};

const fieldLabels: { [key: string]: string } = {
  userId: "Người dùng",
  productName: "Tên sản phẩm",
  price: "Giá (VNĐ)",
  productLink: "Link sản phẩm",
  cashbackPercentage: "% Hoàn tiền",
  quantity: "Số lượng",
  status: "Trạng thái",
};

export default function PurchaseAdmin() {
  const token = Cookies.get("authToken");
  const { addToast } = useToast();

  const [purchases, setPurchases] = useState<AdminPurchaseHistoryItem[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [formData, setFormData] = useState<AdminCreatePurchaseData>(defaultFormData);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch users for dropdown
  const fetchUsers = async () => {
    try {
      const data = await getAllUser(token!);
      if (data) {
        setUsers(data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Fetch purchase history
  const fetchPurchases = async () => {
    setLoading(true);
    try {
      const data = await adminGetAllPurchase(token!, page, 20, searchQuery);
      if (data) {
        setPurchases(data.purchaseHistory || []);
        setTotalPages(data.pages || 1);
      }
    } catch (error) {
      console.error("Error fetching purchases:", error);
      addToast("Không thể tải dữ liệu đơn hàng", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    fetchPurchases();
  }, [page, searchQuery]);

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.userId) {
      addToast("Vui lòng chọn người dùng", "error");
      return;
    }
    if (!formData.productName) {
      addToast("Vui lòng nhập tên sản phẩm", "error");
      return;
    }
    if (formData.price <= 0) {
      addToast("Giá phải lớn hơn 0", "error");
      return;
    }
    if (!formData.productLink) {
      addToast("Vui lòng nhập link sản phẩm", "error");
      return;
    }
    if (formData.quantity <= 0) {
      addToast("Số lượng phải lớn hơn 0", "error");
      return;
    }

    setSubmitting(true);
    try {
      const res = await adminCreatePurchase(token!, formData);
      if (res?.purchaseHistory) {
        addToast("Tạo đơn hàng thành công", "success");
        setFormData(defaultFormData);
        setIsFormOpen(false);
        fetchPurchases();
      } else {
        addToast(res?.message || "Có lỗi xảy ra", "error");
      }
    } catch (error) {
      addToast("Có lỗi xảy ra khi tạo đơn hàng", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // Format money
  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Đã duyệt":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-success-50 dark:bg-success-900/20 text-success-700 dark:text-success-400 text-xs font-medium">
            <CheckCircleIcon className="size-4" />
            Đã duyệt
          </span>
        );
      case "Hủy":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-error-50 dark:bg-error-900/20 text-error-700 dark:text-error-400 text-xs font-medium">
            <XCircleIcon className="size-4" />
            Hủy
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-warning-50 dark:bg-warning-900/20 text-warning-700 dark:text-warning-400 text-xs font-medium">
            <ClockIcon className="size-4" />
            Đang xử lý
          </span>
        );
    }
  };

  // Get user info from purchase
  const getUserInfo = (userId: AdminPurchaseHistoryItem["userId"]) => {
    if (typeof userId === "object" && userId !== null) {
      return { name: userId.name, email: userId.email };
    }
    const user = users.find((u) => u._id === userId);
    return { name: user?.name || "N/A", email: user?.email || "" };
  };

  return (
    <div className="space-y-6">
      {/* Header with Create Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary-500 shadow-primary-sm">
            <ShoppingCartIcon className="size-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-secondary-900 dark:text-white">
              Quản lý đơn hàng
            </h2>
            <p className="text-sm text-secondary-500">
              Tạo và quản lý đơn hàng cho người dùng
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsFormOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium shadow-primary-sm hover:shadow-primary transition-all"
        >
          <PlusIcon className="size-5" />
          Tạo đơn hàng
        </button>
      </div>

      {/* Create Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-[9999] overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-secondary-900/60 backdrop-blur-sm"
              onClick={() => setIsFormOpen(false)}
            />
            <div className="relative bg-white dark:bg-secondary-800 rounded-2xl shadow-xl p-6 max-w-2xl w-full border border-secondary-200/50 dark:border-secondary-700/50">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-primary-500">
                    <PlusIcon className="size-5 text-white" />
                  </div>
                  <h2 className="text-lg font-semibold text-secondary-900 dark:text-white">
                    Tạo đơn hàng mới
                  </h2>
                </div>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors"
                >
                  <XMarkIcon className="size-5 text-secondary-500" />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* User Dropdown */}
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1.5">
                      {fieldLabels.userId} *
                    </label>
                    <select
                      value={formData.userId}
                      onChange={(e) =>
                        setFormData({ ...formData, userId: e.target.value })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-secondary-100 dark:bg-secondary-700 border-0 text-sm text-secondary-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                    >
                      <option value="">-- Chọn người dùng --</option>
                      {users.map((user) => (
                        <option key={user._id} value={user._id}>
                          {user.name} - {user.email}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Product Name */}
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1.5">
                      {fieldLabels.productName} *
                    </label>
                    <InputSection
                      type="text"
                      value={formData.productName}
                      onChange={(e) =>
                        setFormData({ ...formData, productName: e.target.value })
                      }
                      styleInput={{ width: "100%" }}
                    />
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1.5">
                      {fieldLabels.price} *
                    </label>
                    <InputSection
                      type="number"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: Number(e.target.value) })
                      }
                      styleInput={{ width: "100%" }}
                    />
                  </div>

                  {/* Quantity */}
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1.5">
                      {fieldLabels.quantity} *
                    </label>
                    <InputSection
                      type="number"
                      value={formData.quantity}
                      onChange={(e) =>
                        setFormData({ ...formData, quantity: Number(e.target.value) })
                      }
                      styleInput={{ width: "100%" }}
                    />
                  </div>

                  {/* Product Link */}
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1.5">
                      {fieldLabels.productLink} *
                    </label>
                    <InputSection
                      type="text"
                      value={formData.productLink}
                      onChange={(e) =>
                        setFormData({ ...formData, productLink: e.target.value })
                      }
                      styleInput={{ width: "100%" }}
                    />
                  </div>

                  {/* Cashback Percentage */}
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1.5">
                      {fieldLabels.cashbackPercentage} (0-100)
                    </label>
                    <InputSection
                      type="number"
                      value={formData.cashbackPercentage}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          cashbackPercentage: Number(e.target.value),
                        })
                      }
                      styleInput={{ width: "100%" }}
                    />
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1.5">
                      {fieldLabels.status}
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          status: e.target.value as AdminCreatePurchaseData["status"],
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-secondary-100 dark:bg-secondary-700 border-0 text-sm text-secondary-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                    >
                      <option value="Đang xử lý">Đang xử lý</option>
                      <option value="Đã duyệt">Đã duyệt</option>
                      <option value="Hủy">Hủy</option>
                    </select>
                  </div>

                  {/* Cashback Preview */}
                  <div className="sm:col-span-2 p-4 rounded-xl bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800">
                    <p className="text-sm text-primary-700 dark:text-primary-300">
                      <span className="font-medium">Tiền hoàn dự kiến:</span>{" "}
                      {formatMoney(
                        (formData.price * formData.quantity * formData.cashbackPercentage) / 100
                      )}
                    </p>
                    {formData.status === "Đã duyệt" && (
                      <p className="text-xs text-primary-600 dark:text-primary-400 mt-1">
                        * Số tiền này sẽ được cộng vào tài khoản người dùng
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-secondary-100 dark:bg-secondary-700 text-secondary-700 dark:text-secondary-300 font-medium hover:bg-secondary-200 dark:hover:bg-secondary-600 transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2.5 rounded-xl font-medium text-white bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors inline-flex items-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Đang tạo...
                      </>
                    ) : (
                      <>
                        <PlusIcon className="size-4" />
                        Tạo đơn hàng
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Table Section */}
      <div className="rounded-2xl bg-white/60 dark:bg-secondary-800/60 backdrop-blur-xl border border-secondary-200/50 dark:border-secondary-700/50 overflow-hidden">
        {/* Table Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 border-b border-secondary-200/50 dark:border-secondary-700/50">
          <div>
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
              Danh sách đơn hàng
            </h3>
            <p className="text-sm text-secondary-500">
              Tổng cộng {purchases.length} đơn hàng
            </p>
          </div>

          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-secondary-400" />
            <input
              type="text"
              placeholder="Tìm theo tên sản phẩm..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="pl-10 pr-4 py-2.5 w-full sm:w-64 rounded-xl bg-secondary-100 dark:bg-secondary-700 border-0 text-sm text-secondary-900 dark:text-white placeholder:text-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-secondary-50/50 dark:bg-secondary-900/50">
                <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-500 uppercase tracking-wider">
                  Sản phẩm
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-500 uppercase tracking-wider">
                  Người dùng
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-500 uppercase tracking-wider">
                  Giá
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-500 uppercase tracking-wider">
                  SL
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-500 uppercase tracking-wider">
                  Hoàn tiền
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-500 uppercase tracking-wider">
                  Ngày tạo
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-100 dark:divide-secondary-700/50">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex justify-center">
                      <div className="size-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  </td>
                </tr>
              ) : purchases.length > 0 ? (
                purchases.map((purchase) => {
                  const userInfo = getUserInfo(purchase.userId);
                  return (
                    <tr
                      key={purchase._id}
                      className="hover:bg-secondary-50/50 dark:hover:bg-secondary-700/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="max-w-xs">
                          <p className="font-medium text-secondary-900 dark:text-white truncate">
                            {purchase.productName}
                          </p>
                          <a
                            href={purchase.productLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary-500 hover:underline truncate block"
                          >
                            {purchase.productLink}
                          </a>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-secondary-900 dark:text-white">
                            {userInfo.name}
                          </p>
                          <p className="text-xs text-secondary-500">{userInfo.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-secondary-900 dark:text-white">
                        {formatMoney(purchase.price)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-600 dark:text-secondary-400">
                        {purchase.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-success-600 dark:text-success-400">
                        {formatMoney(purchase.cashback)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(purchase.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-600 dark:text-secondary-400">
                        {formatDate(purchase.createdAt)}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <ShoppingCartIcon className="mx-auto size-12 text-secondary-300" />
                    <p className="mt-4 text-secondary-500">
                      {searchQuery
                        ? `Không tìm thấy đơn hàng với từ khóa "${searchQuery}"`
                        : "Chưa có đơn hàng nào"}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-secondary-200/50 dark:border-secondary-700/50">
            <p className="text-sm text-secondary-500">
              Trang {page} / {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 rounded-lg bg-secondary-100 dark:bg-secondary-700 text-sm font-medium text-secondary-700 dark:text-secondary-300 hover:bg-secondary-200 dark:hover:bg-secondary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Trước
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 rounded-lg bg-secondary-100 dark:bg-secondary-700 text-sm font-medium text-secondary-700 dark:text-secondary-300 hover:bg-secondary-200 dark:hover:bg-secondary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
