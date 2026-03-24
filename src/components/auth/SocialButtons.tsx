"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";

// Module-level flag: google.accounts.id.initialize() chỉ được gọi đúng 1 lần
let isGoogleInitialized = false;

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential?: string }) => void;
          }) => void;
          prompt: (
            callback?: (notification: {
              isNotDisplayed?: () => boolean;
              isSkippedMoment?: () => boolean;
            }) => void,
          ) => void;
        };
      };
    };
  }
}

type SocialButtonsProps = {
  label?: string;
  onGoogleProfileRequired?: () => void;
};

export default function SocialButtons({
  label = "đăng nhập",
  onGoogleProfileRequired,
}: SocialButtonsProps) {
  const router = useRouter();
  const { loginWithGoogle } = useAuth();
  const { success, error: toastError, info } = useToast();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const loadGoogleScript = useCallback(async () => {
    if (window.google?.accounts?.id) return;

    await new Promise<void>((resolve, reject) => {
      const existing = document.getElementById("google-identity-script");
      if (existing) {
        existing.addEventListener("load", () => resolve(), { once: true });
        existing.addEventListener(
          "error",
          () => reject(new Error("Không thể tải Google Identity script")),
          { once: true },
        );
        return;
      }

      const script = document.createElement("script");
      script.id = "google-identity-script";
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () =>
        reject(new Error("Không thể tải Google Identity script"));
      document.head.appendChild(script);
    });
  }, []);

  const getGoogleCredential = useCallback(
    async (clientId: string) => {
      await loadGoogleScript();

      return new Promise<string>((resolve, reject) => {
        if (!window.google?.accounts?.id) {
          reject(new Error("Google Identity chưa sẵn sàng"));
          return;
        }

        let settled = false;
        const timeoutId = window.setTimeout(() => {
          if (!settled) {
            settled = true;
            reject(
              new Error(
                "Không nhận được xác thực từ Google. Vui lòng chọn lại tài khoản Google.",
              ),
            );
          }
        }, 15000);

        if (!isGoogleInitialized) {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: (response) => {
              if (settled) return;
              if (response.credential) {
                settled = true;
                window.clearTimeout(timeoutId);
                resolve(response.credential);
                return;
              }

              settled = true;
              window.clearTimeout(timeoutId);
              reject(new Error("Google không trả về credential"));
            },
          });
          isGoogleInitialized = true;
        }

        window.google.accounts.id.prompt((notification) => {
          if (settled) return;

          // Google can emit skipped/notDisplayed for non-error reasons (FedCM/UI policy).
          // Do not reject immediately to avoid false "Bạn đã hủy" errors.
          if (
            notification.isNotDisplayed?.() ||
            notification.isSkippedMoment?.()
          ) {
            return;
          }
        });
      });
    },
    [loadGoogleScript],
  );

  const handleGoogleLogin = useCallback(async () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) {
      toastError("Thiếu NEXT_PUBLIC_GOOGLE_CLIENT_ID trong môi trường");
      return;
    }
    setIsGoogleLoading(true);
    try {
      const credential = await getGoogleCredential(clientId);
      const result = await loginWithGoogle(credential);

      if (result.requiresProfileCompletion) {
        info("Vui lòng hoàn tất hồ sơ để tiếp tục với Google");
        onGoogleProfileRequired?.();
        return;
      }

      success("Đăng nhập Google thành công");

      const stored = localStorage.getItem("dab_user");
      const user = stored ? JSON.parse(stored) : null;
      if (user?.role === "admin") {
        router.push("/admin");
      } else if (user?.role === "staff") {
        router.push("/staff");
      } else {
        router.push("/");
      }
    } catch (error) {
      toastError(
        error instanceof Error ? error.message : "Đăng nhập Google thất bại",
      );
    } finally {
      setIsGoogleLoading(false);
    }
  }, [
    getGoogleCredential,
    info,
    loginWithGoogle,
    onGoogleProfileRequired,
    router,
    success,
    toastError,
  ]);

  return (
    <div className="space-y-4">
      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-[#E5E7EB]" />
        <span className="text-[#9CA3AF] text-xs whitespace-nowrap">
          hoặc {label} với
        </span>
        <div className="flex-1 h-px bg-[#E5E7EB]" />
      </div>

      {/* Buttons */}
      <div className="flex justify-center gap-5">
        {/* Google */}
        <button
          type="button"
          aria-label="Google"
          onClick={handleGoogleLogin}
          disabled={isGoogleLoading}
          className="w-14 h-14 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm flex items-center justify-center hover:shadow-md hover:border-[#17409A]/20 transition-all duration-200"
        >
          <svg width="22" height="22" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
        </button>

        {/* Facebook */}
        <button
          type="button"
          aria-label="Facebook"
          className="w-14 h-14 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm flex items-center justify-center hover:shadow-md hover:border-[#1877F2]/20 transition-all duration-200"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="#1877F2">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
