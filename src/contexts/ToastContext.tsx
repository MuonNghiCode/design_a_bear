"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import {
  IoCheckmarkCircle,
  IoClose,
  IoInformationCircle,
  IoSparkles,
  IoWarning,
} from "react-icons/io5";
import { useEffect } from "react";

type ToastType = "success" | "error" | "info" | "warning";

type ToastItem = {
  id: number;
  type: ToastType;
  message: string;
  duration: number;
};

type ToastOptions = {
  type?: ToastType;
  duration?: number;
};

type ToastContextValue = {
  showToast: (message: string, options?: ToastOptions) => void;
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
};

const DEFAULT_DURATION = 3200;

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

function toastAccent(type: ToastType): string {
  if (type === "success") {
    return "bg-[#4ECDC4]";
  }
  if (type === "error") {
    return "bg-[#FF6B9D]";
  }
  if (type === "warning") {
    return "bg-[#FF8C42]";
  }
  return "bg-[#17409A]";
}

function toastTypeLabel(type: ToastType): string {
  if (type === "success") return "Thành công";
  if (type === "error") return "Lỗi";
  if (type === "warning") return "Cảnh báo";
  return "Thông báo";
}

function ToastIcon({ type }: { type: ToastType }) {
  if (type === "success")
    return <IoCheckmarkCircle className="text-lg text-[#4ECDC4]" />;
  if (type === "error") return <IoWarning className="text-lg text-[#FF6B9D]" />;
  if (type === "warning")
    return <IoWarning className="text-lg text-[#FF8C42]" />;
  return <IoInformationCircle className="text-lg text-[#17409A]" />;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, options?: ToastOptions) => {
      const id = Date.now() + Math.floor(Math.random() * 1000);
      const nextToast: ToastItem = {
        id,
        type: options?.type ?? "info",
        message,
        duration: options?.duration ?? DEFAULT_DURATION,
      };

      setToasts((prev) => [nextToast, ...prev].slice(0, 4));

      window.setTimeout(() => {
        removeToast(id);
      }, nextToast.duration);
    },
    [removeToast],
  );


  const value = useMemo<ToastContextValue>(
    () => ({
      showToast,
      success: (message: string, duration?: number) =>
        showToast(message, { type: "success", duration }),
      error: (message: string, duration?: number) =>
        showToast(message, { type: "error", duration }),
      info: (message: string, duration?: number) =>
        showToast(message, { type: "info", duration }),
      warning: (message: string, duration?: number) =>
        showToast(message, { type: "warning", duration }),
    }),
    [showToast],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div className="fixed left-1/2 top-4 z-1000 w-[min(92vw,420px)] -translate-x-1/2 space-y-3 pointer-events-none md:left-auto md:right-6 md:translate-x-0">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto relative overflow-hidden rounded-3xl border border-white/80 bg-white/85 px-4 py-3 shadow-2xl shadow-[#17409A]/15 backdrop-blur-xl transition-all duration-300"
            role="status"
            aria-live="polite"
          >
            <div
              className={`absolute left-0 top-0 h-full w-1.5 ${toastAccent(toast.type)}`}
            />

            <div className="flex items-start gap-3 pl-1">
              <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-2xl bg-[#17409A]/10">
                <ToastIcon type={toast.type} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="mb-1 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full border border-[#17409A]/15 bg-[#17409A]/5 px-2 py-0.5 text-[11px] font-bold text-[#17409A]">
                    {toastTypeLabel(toast.type)}
                  </span>
                </div>
                <p className="text-sm font-semibold leading-5 text-[#1A1A2E]">
                  {toast.message}
                </p>
              </div>

              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="rounded-xl p-1 text-[#9CA3AF] transition-colors hover:bg-[#17409A]/10 hover:text-[#17409A]"
                aria-label="Close toast"
              >
                <IoClose className="text-base" />
              </button>
            </div>

            <div className="mt-3 h-1 w-full rounded-full bg-[#17409A]/10">
              <div
                className={`h-full rounded-full ${toastAccent(toast.type)}`}
              />
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
