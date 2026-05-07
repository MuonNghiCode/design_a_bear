"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";

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
  const buttonRef = React.useRef<HTMLDivElement>(null);

  // Dùng ref để luôn truy cập phiên bản mới nhất của các hàm
  const callbackRef = React.useRef<(response: any) => void>(undefined);
  callbackRef.current = async (response: any) => {
    if (!response.credential) return;
    try {
      const result = await loginWithGoogle(response.credential);
      if (result.requiresProfileCompletion) {
        info("Vui lòng hoàn tất hồ sơ để tiếp tục");
        onGoogleProfileRequired?.();
        return;
      }
      success("Đăng nhập Google thành công");
      const user = JSON.parse(localStorage.getItem("dab_user") || "{}");
      if (user.role === "admin") router.push("/admin");
      else if (user.role === "staff") router.push("/staff");
      else if (user.role === "craftsman") router.push("/craftsman");
      else if (user.role === "quality_control") router.push("/qc");
      else router.push("/");
    } catch (error) {
      toastError(
        error instanceof Error ? error.message : "Đăng nhập thất bại"
      );
    }
  };

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) {
      console.error("[SocialButtons] Missing NEXT_PUBLIC_GOOGLE_CLIENT_ID");
      return;
    }

    // Đăng ký callback lên window
    (window as any).__handleGoogleResponse = (response: any) => {
      callbackRef.current?.(response);
    };

    const renderBtn = () => {
      const g = (window as any).google;
      if (!g?.accounts?.id || !buttonRef.current) return;

      g.accounts.id.initialize({
        client_id: clientId,
        callback: (window as any).__handleGoogleResponse,
        use_fedcm_for_prompt: false,
      });

      // Thử hiện One Tap
      g.accounts.id.prompt();

      // Render nút bấm vào đúng ref
      g.accounts.id.renderButton(buttonRef.current, {
        type: "icon",
        shape: "circle",
        theme: "outline",
        size: "large",
      });
    };

    // Nếu script đã load rồi (ví dụ navigate lại trang), render luôn
    if ((window as any).google?.accounts?.id) {
      renderBtn();
      return;
    }

    // Nếu script đang load (từ lần render trước), đợi nó
    const existingScript = document.querySelector(
      'script[src="https://accounts.google.com/gsi/client"]'
    );
    if (existingScript) {
      existingScript.addEventListener("load", renderBtn);
      return;
    }

    // Tải script mới
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = renderBtn;
    document.head.appendChild(script);
    // Không xóa script trong cleanup — Google cần nó để duy trì iframe
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-[#E5E7EB]" />
        <span className="text-[#9CA3AF] text-xs whitespace-nowrap">
          hoặc {label} với
        </span>
        <div className="flex-1 h-px bg-[#E5E7EB]" />
      </div>

      <div className="flex justify-center">
        {/* Container cho nút Google — KHÔNG overflow-hidden, KHÔNG transform */}
        <div
          ref={buttonRef}
          style={{ minWidth: 44, minHeight: 44 }}
        />
      </div>
    </div>
  );
}
