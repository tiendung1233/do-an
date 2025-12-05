import { BanknotesIcon } from "@heroicons/react/24/outline";
import WithDrawTable from "./withdraw-table";

export default function RequirementAdmin() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white/60 dark:bg-secondary-800/60 backdrop-blur-xl border border-secondary-200/50 dark:border-secondary-700/50 overflow-hidden">
        <div className="flex items-center gap-3 p-6 border-b border-secondary-200/50 dark:border-secondary-700/50">
          <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-warning-500 to-warning-600 shadow-lg">
            <BanknotesIcon className="size-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-secondary-900 dark:text-white">
              Yêu cầu rút tiền
            </h2>
            <p className="text-sm text-secondary-500">
              Quản lý và xử lý các yêu cầu rút tiền từ người dùng
            </p>
          </div>
        </div>
        <div className="p-6">
          <WithDrawTable />
        </div>
      </div>
    </div>
  );
}
