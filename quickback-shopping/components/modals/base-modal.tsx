import { useEffect, useRef } from "react";
import { ReactNode } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: "primary" | "danger";
}

const BaseModal = ({
  isOpen,
  onClose,
  title,
  children,
  onConfirm,
  confirmText = "Xác nhận",
  cancelText = "Đóng",
  confirmVariant = "primary",
}: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const confirmButtonClass =
    confirmVariant === "danger"
      ? "bg-gradient-to-r from-error-500 to-error-600 hover:from-error-600 hover:to-error-700 shadow-error-sm hover:shadow-error"
      : "bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 shadow-primary-sm hover:shadow-primary";

  return (
    <div
      id="default-modal"
      tabIndex={-1}
      className="fixed inset-0 z-[999999] flex justify-center items-center p-4 overflow-hidden"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-secondary-900/60 backdrop-blur-sm animate-fade-in" />

      {/* Modal Container */}
      <div
        ref={modalRef}
        className="relative w-full max-w-lg max-h-[90vh] overflow-hidden animate-scale-in"
      >
        {/* Modal Content */}
        <div className="relative bg-white dark:bg-secondary-800 rounded-2xl shadow-2xl border border-secondary-200/50 dark:border-secondary-700/50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-secondary-200 dark:border-secondary-700">
            <h3 className="text-xl font-bold text-secondary-900 dark:text-white">
              {title}
            </h3>
            <button
              type="button"
              className="p-2 rounded-xl text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-all"
              onClick={onClose}
            >
              <XMarkIcon className="w-5 h-5" />
              <span className="sr-only">Close modal</span>
            </button>
          </div>

          {/* Body */}
          <div className="p-5 overflow-y-auto max-h-[60vh]">
            <div className="text-secondary-600 dark:text-secondary-400">
              {children}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-5 border-t border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-900/50">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-secondary-100 dark:bg-secondary-700 text-secondary-700 dark:text-secondary-300 font-semibold hover:bg-secondary-200 dark:hover:bg-secondary-600 transition-all"
            >
              {cancelText}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className={`px-5 py-2.5 rounded-xl text-white font-semibold transition-all ${confirmButtonClass}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BaseModal;
