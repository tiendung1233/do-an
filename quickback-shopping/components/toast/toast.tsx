import { useEffect, useState } from "react";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

interface IToast {
  type: "success" | "warning" | "error";
  content: string;
  isHidden: boolean;
  onClose: () => void;
}

export default function Toast(props: IToast) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (!props.isHidden) {
      const timer = setTimeout(() => {
        setIsExiting(true);
        setTimeout(() => {
          props.onClose && props.onClose();
        }, 300);
      }, 3000);

      return () => clearTimeout(timer);
    }

    setIsExiting(true);
  }, [props.isHidden, props.onClose, props.content]);

  const getTypeConfig = () => {
    switch (props.type) {
      case "error":
        return {
          bgClass: "bg-error-50 dark:bg-error-900/20",
          borderClass: "border-error-200 dark:border-error-800",
          iconBgClass: "bg-error-100 dark:bg-error-900/40",
          iconClass: "text-error-500",
          textClass: "text-error-800 dark:text-error-200",
          icon: XCircleIcon,
        };
      case "warning":
        return {
          bgClass: "bg-warning-50 dark:bg-warning-900/20",
          borderClass: "border-warning-200 dark:border-warning-800",
          iconBgClass: "bg-warning-100 dark:bg-warning-900/40",
          iconClass: "text-warning-500",
          textClass: "text-warning-800 dark:text-warning-200",
          icon: ExclamationTriangleIcon,
        };
      case "success":
      default:
        return {
          bgClass: "bg-success-50 dark:bg-success-900/20",
          borderClass: "border-success-200 dark:border-success-800",
          iconBgClass: "bg-success-100 dark:bg-success-900/40",
          iconClass: "text-success-500",
          textClass: "text-success-800 dark:text-success-200",
          icon: CheckCircleIcon,
        };
    }
  };

  const config = getTypeConfig();
  const IconComponent = config.icon;

  return (
    <div
      className={`
        min-w-[300px] max-w-md
        flex items-center gap-3
        p-4
        rounded-xl
        border
        shadow-card-lg
        backdrop-blur-sm
        ${config.bgClass}
        ${config.borderClass}
        ${isExiting ? "toast-exit" : "toast-enter"}
      `}
      role="alert"
    >
      {/* Icon Container */}
      <div
        className={`
          flex-shrink-0
          w-10 h-10
          rounded-xl
          flex items-center justify-center
          ${config.iconBgClass}
        `}
      >
        <IconComponent className={`w-5 h-5 ${config.iconClass}`} />
      </div>

      {/* Content */}
      <div className={`flex-1 text-sm font-medium ${config.textClass}`}>
        {props.content}
      </div>

      {/* Close Button */}
      <button
        type="button"
        className={`
          flex-shrink-0
          p-1.5
          rounded-lg
          ${config.textClass}
          hover:bg-secondary-200/50 dark:hover:bg-secondary-700/50
          transition-colors
        `}
        aria-label="Close"
        onClick={() => setIsExiting(true)}
      >
        <XMarkIcon className="w-4 h-4" />
      </button>
    </div>
  );
}
