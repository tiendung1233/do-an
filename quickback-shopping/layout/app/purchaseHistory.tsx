"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { getPurchase } from "@/ultils/api/purchase";
import { validateVoucher, applyVoucher } from "@/ultils/api/voucher";
import Spinner from "@/components/spinner/spinner";

interface PurchaseItem {
  _id: string;
  productName: string;
  price: number;
  productLink: string;
  cashbackPercentage: number;
  cashback: number;
  quantity: number;
  purchaseDate: string;
  status: "Đang xử lý" | "Đã duyệt" | "Hủy";
  transaction_id: string;
  voucherUsed?: boolean;
  voucherCode?: string;
  bonusCashback?: number;
  img?: string;
}

export default function PurchaseHistoryLayout() {
  const [purchases, setPurchases] = useState<PurchaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPurchase, setSelectedPurchase] = useState<PurchaseItem | null>(null);
  const [voucherCode, setVoucherCode] = useState("");
  const [validating, setValidating] = useState(false);
  const [applying, setApplying] = useState(false);
  const [voucherMessage, setVoucherMessage] = useState<{
    type: "success" | "error" | "info";
    text: string;
    estimatedBonus?: number;
  } | null>(null);

  useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    const token = Cookies.get("authToken");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await getPurchase(token, 1);
      setPurchases(response.purchaseHistory || []);
    } catch (error) {
      console.error("Error fetching purchases:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleValidateVoucher = async () => {
    if (!voucherCode.trim() || !selectedPurchase) return;

    const token = Cookies.get("authToken");
    if (!token) return;

    setValidating(true);
    setVoucherMessage(null);

    try {
      const response = await validateVoucher(token, voucherCode, selectedPurchase._id);
      if (response.valid) {
        setVoucherMessage({
          type: "info",
          text: response.message,
          estimatedBonus: response.estimatedBonus,
        });
      } else {
        setVoucherMessage({
          type: "error",
          text: response.message,
        });
      }
    } catch (error: any) {
      setVoucherMessage({
        type: "error",
        text: error.message || "Loi khi kiem tra voucher",
      });
    } finally {
      setValidating(false);
    }
  };

  const handleApplyVoucher = async () => {
    if (!voucherCode.trim() || !selectedPurchase) return;

    const token = Cookies.get("authToken");
    if (!token) return;

    setApplying(true);

    try {
      const response = await applyVoucher(token, voucherCode, selectedPurchase._id);
      if (response.success) {
        setVoucherMessage({
          type: "success",
          text: response.message,
        });
        // Update the purchase in the list
        setPurchases((prev) =>
          prev.map((p) =>
            p._id === selectedPurchase._id
              ? {
                  ...p,
                  voucherUsed: true,
                  voucherCode: response.purchase.voucherCode,
                  bonusCashback: response.bonusCashback,
                }
              : p
          )
        );
        // Close modal after 2 seconds
        setTimeout(() => {
          setSelectedPurchase(null);
          setVoucherCode("");
          setVoucherMessage(null);
        }, 2000);
      }
    } catch (error: any) {
      setVoucherMessage({
        type: "error",
        text: error.message || "Loi khi ap dung voucher",
      });
    } finally {
      setApplying(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + "d";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Đã duyệt":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Da duyet
          </span>
        );
      case "Đang xử lý":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Dang xu ly
          </span>
        );
      case "Hủy":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Da huy
          </span>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-teal-500 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Lich su mua hang</h1>
        <p className="text-green-100">
          Ap dung voucher cho don hang da duyet de nhan them cashback!
        </p>
      </div>

      {/* Purchase List */}
      {purchases.length === 0 ? (
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
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
          <p className="text-gray-500">Chua co don hang nao</p>
        </div>
      ) : (
        <div className="space-y-3">
          {purchases.map((purchase) => (
            <div
              key={purchase._id}
              className="bg-white rounded-lg shadow overflow-hidden"
            >
              <div className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800 line-clamp-2">
                      {purchase.productName}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {formatDate(purchase.purchaseDate)} | SL: {purchase.quantity}
                    </p>
                  </div>
                  {getStatusBadge(purchase.status)}
                </div>

                <div className="flex justify-between items-center text-sm">
                  <div>
                    <span className="text-gray-600">Gia: </span>
                    <span className="font-medium">{formatCurrency(purchase.price)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Cashback: </span>
                    <span className="font-medium text-green-600">
                      {formatCurrency(purchase.cashback)}
                    </span>
                  </div>
                </div>

                {/* Voucher Status */}
                {purchase.voucherUsed && (
                  <div className="mt-3 p-2 bg-purple-50 rounded-lg">
                    <div className="flex justify-between items-center text-sm">
                      <div>
                        <span className="text-purple-600">Voucher: </span>
                        <span className="font-mono font-medium">{purchase.voucherCode}</span>
                      </div>
                      <span className="text-purple-600 font-medium">
                        +{formatCurrency(purchase.bonusCashback || 0)}
                      </span>
                    </div>
                  </div>
                )}

                {/* Apply Voucher Button */}
                {purchase.status === "Đã duyệt" && !purchase.voucherUsed && (
                  <button
                    onClick={() => {
                      setSelectedPurchase(purchase);
                      setVoucherCode("");
                      setVoucherMessage(null);
                    }}
                    className="mt-3 w-full py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Ap dung Voucher
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Voucher Modal */}
      {selectedPurchase && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-4 border-b">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg">Ap dung Voucher</h3>
                <button
                  onClick={() => {
                    setSelectedPurchase(null);
                    setVoucherCode("");
                    setVoucherMessage(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-4 space-y-4">
              {/* Purchase Info */}
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="font-medium text-gray-800 line-clamp-2">
                  {selectedPurchase.productName}
                </p>
                <div className="flex justify-between mt-2 text-sm">
                  <span className="text-gray-500">Cashback hien tai:</span>
                  <span className="font-medium text-green-600">
                    {formatCurrency(selectedPurchase.cashback)}
                  </span>
                </div>
              </div>

              {/* Voucher Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nhap ma voucher
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                    placeholder="VD: VCH-ABC123"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button
                    onClick={handleValidateVoucher}
                    disabled={validating || !voucherCode.trim()}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm font-medium disabled:opacity-50"
                  >
                    {validating ? "..." : "Kiem tra"}
                  </button>
                </div>
              </div>

              {/* Message */}
              {voucherMessage && (
                <div
                  className={`p-3 rounded-lg text-sm ${
                    voucherMessage.type === "success"
                      ? "bg-green-50 text-green-800"
                      : voucherMessage.type === "error"
                      ? "bg-red-50 text-red-800"
                      : "bg-blue-50 text-blue-800"
                  }`}
                >
                  <p>{voucherMessage.text}</p>
                  {voucherMessage.estimatedBonus && (
                    <p className="font-medium mt-1">
                      Du kien nhan them: {formatCurrency(voucherMessage.estimatedBonus)}
                    </p>
                  )}
                </div>
              )}

              {/* Apply Button */}
              <button
                onClick={handleApplyVoucher}
                disabled={applying || !voucherCode.trim() || voucherMessage?.type === "error"}
                className="w-full py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {applying ? "Dang ap dung..." : "Xac nhan ap dung"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
