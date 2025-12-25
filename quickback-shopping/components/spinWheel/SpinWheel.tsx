"use client";

import { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import {
  getSpinWheelInfo,
  spin,
  SpinWheelInfo,
  SpinPrize,
  SpinHistoryItem,
} from "@/ultils/api/spinWheel";
import {
  GiftIcon,
  SparklesIcon,
  TrophyIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

interface SpinWheelProps {
  onClose?: () => void;
}

export default function SpinWheel({ onClose }: SpinWheelProps) {
  const token = Cookies.get("authToken");
  const [info, setInfo] = useState<SpinWheelInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<(SpinPrize & { voucherCode?: string }) | null>(null);
  const [showResult, setShowResult] = useState(false);
  const wheelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchInfo();
  }, []);

  const fetchInfo = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await getSpinWheelInfo(token);
      if (response.success) {
        setInfo(response.data);
      }
    } catch (error) {
      console.error("Error fetching spin wheel info:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSpin = async () => {
    if (!token || !info || info.availableSpins <= 0 || spinning) return;

    setSpinning(true);
    setShowResult(false);

    try {
      const response = await spin(token);
      if (response.success) {
        const prizeIndex = info.prizes.findIndex(
          (p) => p.id === response.data.prize.id
        );

        // Tính góc quay để dừng ở giải thưởng
        const segmentAngle = 360 / info.prizes.length;
        // Vị trí trung tâm của giải thưởng (tính từ 12h theo chiều kim đồng hồ)
        const prizeCenter = prizeIndex * segmentAngle + segmentAngle / 2;
        // Góc cần quay để giải thưởng nằm ở vị trí 12h (pointer)
        const targetAbsoluteRotation = 360 - prizeCenter;

        // Tính góc hiện tại của bánh xe và góc cần quay thêm
        const currentEffectiveRotation = rotation % 360;
        let additionalRotation = targetAbsoluteRotation - currentEffectiveRotation;
        // Đảm bảo luôn quay theo chiều kim đồng hồ (góc dương)
        if (additionalRotation <= 0) additionalRotation += 360;

        const spins = 5; // Số vòng quay
        const finalRotation = rotation + spins * 360 + additionalRotation;

        setRotation(finalRotation);

        // Sau khi quay xong, hiển thị kết quả
        setTimeout(() => {
          setResult(response.data.prize);
          setShowResult(true);
          setSpinning(false);
          // Cập nhật lại thông tin
          setInfo((prev) =>
            prev
              ? {
                  ...prev,
                  availableSpins: response.data.remainingSpins,
                  totalSpinsUsed: prev.totalSpinsUsed + 1,
                }
              : null
          );
        }, 5000);
      }
    } catch (error) {
      console.error("Error spinning:", error);
      setSpinning(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN").format(value) + "đ";
  };

  const getPrizeIcon = (type: string) => {
    switch (type) {
      case "cash":
        return <SparklesIcon className="size-6 text-yellow-500" />;
      case "voucher":
        return <GiftIcon className="size-6 text-purple-500" />;
      default:
        return <ClockIcon className="size-6 text-gray-500" />;
    }
  };

  const getPrizeMessage = (prize: SpinPrize & { voucherCode?: string }) => {
    switch (prize.type) {
      case "cash":
        return `Chúc mừng! Bạn nhận được ${formatCurrency(prize.value)}`;
      case "voucher":
        return `Chúc mừng! Bạn nhận được Voucher ${prize.value}%\nMã: ${prize.voucherCode}`;
      default:
        return "Chúc bạn may mắn lần sau!";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="size-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!info) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Không thể tải thông tin vòng quay</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 rounded-2xl p-6 text-white">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
          <TrophyIcon className="size-8 text-yellow-400" />
          Vòng Quay May Mắn
        </h2>
        <p className="text-purple-200 mt-1">
          Bạn có <span className="text-yellow-400 font-bold text-xl">{info.availableSpins}</span> lượt quay
        </p>
      </div>

      {/* Wheel Container */}
      <div className="relative flex justify-center mb-6">
        {/* Pointer - ở phía trên, chỉ xuống bánh xe */}
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-20">
          <div className="w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[25px] border-t-yellow-400 drop-shadow-lg" />
        </div>

        {/* Wheel */}
        <div
          ref={wheelRef}
          className="relative w-72 h-72 rounded-full border-8 border-yellow-400 shadow-2xl"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: spinning ? "transform 5s cubic-bezier(0.17, 0.67, 0.12, 0.99)" : "none",
            background: `conic-gradient(${info.prizes
              .map((prize, i) => {
                const segmentAngle = 360 / info.prizes.length;
                const start = i * segmentAngle;
                const end = (i + 1) * segmentAngle;
                return `${prize.color} ${start}deg ${end}deg`;
              })
              .join(", ")})`,
          }}
        >
          {/* Prize labels */}
          {info.prizes.map((prize, index) => {
            const segmentAngle = 360 / info.prizes.length;
            const midAngle = index * segmentAngle + segmentAngle / 2;
            // Tính vị trí text
            const radius = 100; // px từ tâm
            const angleRad = ((midAngle - 90) * Math.PI) / 180;
            const x = 144 + radius * Math.cos(angleRad); // 144 = center (288/2)
            const y = 144 + radius * Math.sin(angleRad);

            return (
              <div
                key={prize.id}
                className="absolute text-xs font-bold text-white drop-shadow-md whitespace-nowrap"
                style={{
                  left: `${x}px`,
                  top: `${y}px`,
                  transform: `translate(-50%, -50%) rotate(${midAngle}deg)`,
                }}
              >
                {prize.label}
              </div>
            );
          })}
          {/* Center circle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full shadow-lg flex items-center justify-center z-10">
            <SparklesIcon className="size-8 text-white" />
          </div>
        </div>
      </div>

      {/* Spin Button */}
      <div className="flex justify-center mb-6">
        <button
          onClick={handleSpin}
          disabled={spinning || info.availableSpins <= 0}
          className={`px-8 py-4 rounded-full text-lg font-bold transition-all transform ${
            spinning || info.availableSpins <= 0
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 hover:scale-105 shadow-lg"
          }`}
        >
          {spinning ? (
            <span className="flex items-center gap-2">
              <div className="size-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Đang quay...
            </span>
          ) : info.availableSpins <= 0 ? (
            "Hết lượt quay"
          ) : (
            "QUAY NGAY!"
          )}
        </button>
      </div>

      {/* Result Modal */}
      {showResult && result && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={() => setShowResult(false)}>
          <div
            className="bg-white rounded-2xl p-8 max-w-sm mx-4 text-center transform animate-bounce-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4">{getPrizeIcon(result.type)}</div>
            <div
              className={`text-6xl mb-4 ${
                result.type === "luck" ? "grayscale" : ""
              }`}
            >
              {result.type === "cash" ? "💰" : result.type === "voucher" ? "🎫" : "🍀"}
            </div>
            <h3
              className={`text-xl font-bold mb-2 ${
                result.type === "luck" ? "text-gray-600" : "text-green-600"
              }`}
            >
              {result.type === "luck" ? "Tiếc quá!" : "Chúc mừng!"}
            </h3>
            <p className="text-gray-700 whitespace-pre-line">{getPrizeMessage(result)}</p>
            {result.voucherCode && (
              <div className="mt-4 p-3 bg-purple-100 rounded-lg">
                <p className="text-sm text-purple-600">Mã voucher của bạn:</p>
                <p className="text-lg font-bold text-purple-800">{result.voucherCode}</p>
              </div>
            )}
            <button
              onClick={() => setShowResult(false)}
              className="mt-6 px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      {/* Milestones */}
      <div className="bg-white/10 rounded-xl p-4 mb-4">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <TrophyIcon className="size-5 text-yellow-400" />
          Mốc thưởng lượt quay
        </h3>
        <div className="grid grid-cols-4 gap-2 text-center text-sm">
          {info.milestones.slice(0, 8).map((milestone) => (
            <div
              key={milestone.orders}
              className={`p-2 rounded-lg ${
                info.approvedOrders >= milestone.orders
                  ? "bg-green-500/30 border border-green-400"
                  : info.lastMilestoneReached >= milestone.orders
                  ? "bg-yellow-500/30 border border-yellow-400"
                  : "bg-white/5"
              }`}
            >
              <p className="font-bold">{milestone.orders} đơn</p>
              <p className="text-yellow-300">+{milestone.spins} lượt</p>
            </div>
          ))}
        </div>
        {info.nextMilestone && (
          <p className="text-center mt-3 text-purple-200">
            Còn <span className="text-yellow-400 font-bold">{info.nextMilestone.ordersNeeded}</span> đơn nữa để nhận{" "}
            <span className="text-yellow-400 font-bold">{info.nextMilestone.spins}</span> lượt quay!
          </p>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="bg-white/10 rounded-xl p-3">
          <p className="text-2xl font-bold text-yellow-400">{info.totalSpinsUsed}</p>
          <p className="text-xs text-purple-200">Đã quay</p>
        </div>
        <div className="bg-white/10 rounded-xl p-3">
          <p className="text-2xl font-bold text-green-400">{formatCurrency(info.totalCashWon)}</p>
          <p className="text-xs text-purple-200">Tiền thắng</p>
        </div>
        <div className="bg-white/10 rounded-xl p-3">
          <p className="text-2xl font-bold text-purple-400">{info.totalVouchersWon}</p>
          <p className="text-xs text-purple-200">Voucher</p>
        </div>
      </div>

      {/* Recent History */}
      {info.recentHistory.length > 0 && (
        <div className="mt-4 bg-white/10 rounded-xl p-4">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <ClockIcon className="size-5" />
            Lịch sử gần đây
          </h3>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {info.recentHistory.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between text-sm bg-white/5 rounded-lg px-3 py-2"
              >
                <span className="flex items-center gap-2">
                  {item.prizeType === "cash" ? "💰" : item.prizeType === "voucher" ? "🎫" : "🍀"}
                  {item.prizeType === "cash"
                    ? formatCurrency(item.prizeValue)
                    : item.prizeType === "voucher"
                    ? `Voucher ${item.prizeValue}%`
                    : "Chúc may mắn"}
                </span>
                <span className="text-purple-300 text-xs">
                  {new Date(item.spunAt).toLocaleDateString("vi-VN")}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
