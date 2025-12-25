/* eslint-disable react/no-unescaped-entities */
"use client";

import Spinner from "@/components/spinner/spinner";
import DataTable from "@/components/table/table";
import Tabs from "@/components/tabs/tabs";
import useAuth from "@/hook/useAuth";
import { useFetchDataForTab } from "@/hook/useFetchDataForTab";
import Footer from "@/layout/app/footer";
import NavBar from "@/layout/app/navbar";
import { getCart } from "@/ultils/api/cart";
import { getPurchase, PurchaseHistoryItem } from "@/ultils/api/purchase";
import { getWithdraw } from "@/ultils/api/withdraw";
import Cookies from "js-cookie";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

// Helper format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
};

export default function HistoryPage() {
  const { isAuthenticated } = useAuth(true);
  const token = Cookies.get("authToken");
  const searchParam = useSearchParams();
  const activeId = searchParam.get("activeId");
  const [activeTab, setActiveTab] = useState(activeId || "buy");

  const {
    data: cartData,
    loading: cartLoading,
    error: cartError,
  } = useFetchDataForTab(
    activeTab === "cart" ? activeTab : "",
    isAuthenticated,
    async (signal) => getCart(token!, 1, signal)
  );

  const {
    data: buyData,
    loading: buyLoading,
    error: buyError,
  } = useFetchDataForTab(
    activeTab === "buy" ? activeTab : "",
    isAuthenticated,
    async (signal) => getPurchase(token!, 1, signal)
  );

  const {
    data: withdrawData,
    loading: withdrawLoading,
    error: withdrawError,
  } = useFetchDataForTab(
    activeTab === "withdraw" ? activeTab : "",
    isAuthenticated,
    async (signal) => getWithdraw(token!, signal)
  );

  const renderLayoutTab = (
    loading: boolean,
    error: string | null,
    data: any,
    columns: any[],
    navigate?: string[]
  ) => (
    <div>
      {loading ? (
        <Spinner />
      ) : error ? (
        <p className="text-sm">{error}</p>
      ) : data && data.length > 0 ? (
        <DataTable columns={columns} data={data} navigate={navigate} />
      ) : (
        <p className="text-sm">Không có dữ liệu hiển thị</p>
      )}
    </div>
  );

  const columnsCart = [
    { header: "Id", key: "productId" },
    { header: "Tên", key: "productName" },
    { header: "Giá", key: "price" },
    { header: "Ảnh", key: "productImg", type: "image" },
    { header: "Số lượng", key: "quantity" },
    { header: "Đường dẫn mua hàng", key: "productLink" },
    { header: "% Tiền hoàn", key: "cashbackPercentage" },
  ];

  const columnsBuy = [
    { header: "Tên", key: "productName" },
    {
      header: "Giá",
      key: "price",
      render: (value: number) => (
        <span className="font-medium">{formatCurrency(value)}</span>
      ),
    },
    { header: "Ảnh", key: "img", type: "image" },
    { header: "Số lượng", key: "quantity" },
    {
      header: "Cashback",
      key: "cashback",
      render: (value: number, row: PurchaseHistoryItem) => (
        <div className="text-left">
          <p className="font-medium text-green-600">{formatCurrency(value)}</p>
          {/* Chi tiết bonus */}
          {(row.membershipBonusPercent || row.voucherBonusPercent) ? (
            <div className="mt-1 space-y-0.5 text-xs">
              {row.membershipBonusPercent ? (
                <p className="text-amber-600">
                  ★ Hạng +{row.membershipBonusPercent}%: {formatCurrency(row.membershipBonusAmount || 0)}
                </p>
              ) : null}
              {row.voucherUsed && row.voucherBonusPercent ? (
                <p className="text-purple-600">
                  🎫 Voucher +{row.voucherBonusPercent}%: {formatCurrency(row.bonusCashback || 0)}
                </p>
              ) : null}
            </div>
          ) : null}
        </div>
      ),
    },
    {
      header: "Trạng thái",
      key: "status",
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === "Đã duyệt"
            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
            : value === "Hủy"
            ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
        }`}>
          {value}
        </span>
      ),
    },
    { header: "Ngày mua", key: "purchaseDate" },
  ];

  const columnsWithdraw = [
    { header: "ID", key: "userId" },
    { header: "Ngân hàng", key: "bank" },
    { header: "Mã giao dịch", key: "transId" },
    { header: "Tài khoản ngân hàng", key: "accountBank" },
    { header: "Ngày rút", key: "withdrawDate" },
    { header: "Số tiền", key: "money" },
  ];

  const tabs = [
    {
      id: "buy",
      label: "Mua hàng",
      content: renderLayoutTab(
        buyLoading,
        buyError,
        buyData?.purchaseHistory,
        columnsBuy
      ),
    },
    {
      id: "cart",
      label: "Giỏ hàng",
      content: renderLayoutTab(
        cartLoading,
        cartError,
        cartData?.cartItems,
        columnsCart,
        cartData?.cartItems?.map((item: { productId: any }) => item.productId)
      ),
    },
    {
      id: "withdraw",
      label: "Rút tiền",
      content: renderLayoutTab(
        withdrawLoading,
        withdrawError,
        withdrawData,
        columnsWithdraw
      ),
    },
  ];

  const handleTabClick = (id: string) => {
    setActiveTab(id);
  };

  useEffect(() => {
    setActiveTab(activeId || "buy");
  }, [activeId]);

  return (
    <div className="bg-secondary-50 dark:bg-secondary-900 text-secondary-900 dark:text-white min-h-screen flex flex-col">
      <NavBar isAuthenticated={isAuthenticated} />
      <main className="flex-1 py-8 mt-[60px] px-4 sm:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">Lịch sử</h2>
          <Tabs
            tabs={tabs}
            onTabClick={handleTabClick}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
