import { HTMLAttributes, MouseEventHandler, ReactNode } from "react";

interface IBasicButtonProps {
  onClick?: MouseEventHandler<HTMLButtonElement> | undefined;
  text?: string;
  variant?: "primary" | "secondary" | "success" | "warning" | "error" | "ghost" | "outline" | "disabled";
  size?: "sm" | "md" | "lg" | "xl";
  type?: "button" | "reset" | "submit" | undefined;
  name?: string;
  id?: string;
  styles?: HTMLAttributes<HTMLButtonElement>;
  disabled?: boolean;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
  loading?: boolean;
}

const BasicButton = (props: IBasicButtonProps) => {
  const {
    variant = "primary",
    size = "md",
    iconPosition = "left",
    fullWidth = true,
    loading = false,
  } = props;

  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return `
          bg-gradient-to-r from-primary-500 to-primary-600
          text-white
          shadow-primary-sm
          hover:from-primary-600 hover:to-primary-700
          hover:shadow-primary
          hover:-translate-y-0.5
          active:translate-y-0 active:shadow-primary-sm
          dark:from-primary-600 dark:to-primary-700
        `;
      case "secondary":
        return `
          bg-secondary-100
          text-secondary-800
          shadow-card-sm
          hover:bg-secondary-200
          hover:shadow-card
          hover:-translate-y-0.5
          active:translate-y-0
          dark:bg-secondary-800 dark:text-secondary-100
          dark:hover:bg-secondary-700
        `;
      case "success":
        return `
          bg-gradient-to-r from-success-500 to-success-600
          text-white
          shadow-[0_4px_14px_rgba(16,185,129,0.3)]
          hover:from-success-600 hover:to-success-700
          hover:shadow-[0_8px_24px_rgba(16,185,129,0.4)]
          hover:-translate-y-0.5
          active:translate-y-0
          dark:from-success-600 dark:to-success-700
        `;
      case "warning":
        return `
          bg-gradient-to-r from-warning-500 to-warning-600
          text-white
          shadow-[0_4px_14px_rgba(245,158,11,0.3)]
          hover:from-warning-600 hover:to-warning-700
          hover:shadow-[0_8px_24px_rgba(245,158,11,0.4)]
          hover:-translate-y-0.5
          active:translate-y-0
          dark:from-warning-600 dark:to-warning-700
        `;
      case "error":
        return `
          bg-gradient-to-r from-error-500 to-error-600
          text-white
          shadow-[0_4px_14px_rgba(239,68,68,0.3)]
          hover:from-error-600 hover:to-error-700
          hover:shadow-[0_8px_24px_rgba(239,68,68,0.4)]
          hover:-translate-y-0.5
          active:translate-y-0
          dark:from-error-600 dark:to-error-700
        `;
      case "ghost":
        return `
          bg-transparent
          text-secondary-700
          hover:bg-secondary-100
          hover:text-secondary-900
          active:bg-secondary-200
          dark:text-secondary-300
          dark:hover:bg-secondary-800
          dark:hover:text-secondary-100
        `;
      case "outline":
        return `
          bg-transparent
          text-primary-600
          border-2 border-primary-500/50
          hover:bg-primary-50
          hover:border-primary-500
          hover:-translate-y-0.5
          active:translate-y-0
          dark:text-primary-400
          dark:border-primary-500/50
          dark:hover:bg-primary-950/50
          dark:hover:border-primary-400
        `;
      case "disabled":
        return `
          bg-secondary-200
          text-secondary-400
          cursor-not-allowed
          dark:bg-secondary-800
          dark:text-secondary-600
        `;
      default:
        return `
          bg-gradient-to-r from-primary-500 to-primary-600
          text-white
          shadow-primary-sm
          hover:from-primary-600 hover:to-primary-700
          hover:shadow-primary
          hover:-translate-y-0.5
          active:translate-y-0 active:shadow-primary-sm
        `;
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case "sm":
        return "px-3 py-1.5 text-xs gap-1.5 rounded-lg";
      case "md":
        return "px-4 py-2.5 text-sm gap-2 rounded-xl";
      case "lg":
        return "px-6 py-3 text-base gap-2.5 rounded-xl";
      case "xl":
        return "px-8 py-4 text-lg gap-3 rounded-2xl";
      default:
        return "px-4 py-2.5 text-sm gap-2 rounded-xl";
    }
  };

  const LoadingSpinner = () => (
    <svg
      className="animate-spin h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  return (
    <button
      disabled={props.disabled || loading || variant === "disabled"}
      style={props.styles}
      id={props.id}
      onClick={props.onClick}
      type={props.type}
      className={`
        ${fullWidth ? "w-full" : "w-auto"}
        inline-flex items-center justify-center
        font-semibold
        transition-all duration-200 ease-out
        focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:ring-offset-2
        disabled:cursor-not-allowed disabled:opacity-60 disabled:transform-none disabled:shadow-none
        ${getSizeStyles()}
        ${getVariantStyles()}
      `}
    >
      {loading && <LoadingSpinner />}
      {!loading && props.icon && iconPosition === "left" && props.icon}
      {props.text}
      {!loading && props.icon && iconPosition === "right" && props.icon}
    </button>
  );
};

export default BasicButton;
