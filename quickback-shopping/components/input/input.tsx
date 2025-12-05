import {
  ChangeEventHandler,
  HTMLAttributes,
  HTMLInputTypeAttribute,
} from "react";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";

interface IInputProps {
  onChange?: ChangeEventHandler<HTMLInputElement> | undefined;
  value?: string;
  required?: boolean;
  placeholder?: string;
  type?: HTMLInputTypeAttribute;
  name?: string;
  id?: string;
  label?: string;
  isHiddenLabel?: boolean;
  styleLabel?: HTMLAttributes<HTMLLabelElement>;
  styleInput?: HTMLAttributes<HTMLInputElement>;
  showError?: boolean;
  contentError?: string;
  disabled?: boolean;
  checked?: boolean;
  icon?: React.ReactNode;
  helperText?: string;
}

const InputSection = (props: IInputProps) => {
  const hasError = props.showError && props.contentError;

  return (
    <div className="w-full">
      {/* Label */}
      {!props.isHiddenLabel && props.label && (
        <label
          style={props.styleLabel}
          htmlFor={props.id}
          className="block mb-2 text-sm font-medium text-secondary-700 dark:text-secondary-300"
        >
          {props.label}
          {props.required && (
            <span className="text-accent-500 ml-1">*</span>
          )}
        </label>
      )}

      {/* Input Container */}
      <div className="relative">
        {/* Left Icon */}
        {props.icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <span className="text-secondary-400">{props.icon}</span>
          </div>
        )}

        {/* Input Field */}
        <input
          disabled={props.disabled}
          type={props.type}
          name={props.name}
          id={props.id}
          className={`
            w-full px-4 py-3
            ${props.icon ? "pl-11" : ""}
            ${hasError ? "pr-11" : ""}
            bg-white dark:bg-secondary-800
            border-2
            ${
              hasError
                ? "border-error-300 dark:border-error-500 focus:border-error-500 focus:ring-error-500/20"
                : "border-secondary-200 dark:border-secondary-700 focus:border-primary-500 focus:ring-primary-500/20"
            }
            text-secondary-900 dark:text-white
            text-sm
            rounded-xl
            focus:ring-4
            focus:outline-none
            placeholder:text-secondary-400 dark:placeholder:text-secondary-500
            disabled:bg-secondary-100 dark:disabled:bg-secondary-900
            disabled:text-secondary-400 dark:disabled:text-secondary-600
            disabled:cursor-not-allowed
            transition-all duration-200
          `}
          placeholder={props.placeholder}
          required={props.required}
          style={props.styleInput}
          value={props?.value}
          onChange={props.onChange}
          checked={!!props.checked}
        />

        {/* Error Icon */}
        {hasError && (
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
            <ExclamationCircleIcon className="w-5 h-5 text-error-500" />
          </div>
        )}
      </div>

      {/* Error Message */}
      {hasError && (
        <p className="mt-2 text-sm text-error-600 dark:text-error-400 flex items-center gap-1">
          <span>{props.contentError}</span>
        </p>
      )}

      {/* Helper Text */}
      {props.helperText && !hasError && (
        <p className="mt-2 text-sm text-secondary-500 dark:text-secondary-400">
          {props.helperText}
        </p>
      )}
    </div>
  );
};

export default InputSection;
