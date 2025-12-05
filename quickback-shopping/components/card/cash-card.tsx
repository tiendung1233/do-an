import Link from "next/link";
import React from "react";
import {
  BanknotesIcon,
  ArrowTrendingUpIcon,
  WalletIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

interface CashbackCardProps {
  totalCashback: string;
  availableBalance: string;
  onWithdraw: () => void;
  userId: string;
}

const CashbackCard: React.FC<CashbackCardProps> = ({
  totalCashback,
  availableBalance,
  onWithdraw,
  userId,
}) => {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-br from-primary-500 via-primary-600 to-accent-500 p-6 shadow-card-lg">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl transform translate-x-10 -translate-y-10" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full blur-3xl transform -translate-x-10 translate-y-10" />
      </div>

      {/* Glass Effect Overlay */}
      <div className="absolute inset-0 bg-white/5 backdrop-blur-[1px]" />

      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <BanknotesIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Hoàn Tiền</h2>
              <p className="text-sm text-white/70">Tổng tiền hoàn đã nhận</p>
            </div>
          </div>
          <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm">
            <ArrowTrendingUpIcon className="w-4 h-4 text-success-300" />
            <span className="text-xs font-medium text-white">Active</span>
          </div>
        </div>

        {/* Total Cashback Amount */}
        <div className="mb-6">
          <p className="text-4xl font-bold text-white tracking-tight">
            {totalCashback}
          </p>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/20 mb-6" />

        {/* Available Balance & Withdraw Button */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <WalletIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-white/70">Số dư khả dụng</p>
              <p className="text-lg font-semibold text-white">
                {availableBalance}
              </p>
            </div>
          </div>

          <Link
            href={`/profile/${userId}`}
            className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-primary-600 font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
          >
            <span>Rút Tiền</span>
            <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CashbackCard;
