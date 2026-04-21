"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import InputField from "./InputField";
import SocialButtons from "./SocialButtons";
import { IoMailOutline, IoLockClosedOutline } from "react-icons/io5";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";

interface LoginFormProps {
  onSwitchRegister: () => void;
  onSwitchForgot: () => void;
}

export default function LoginForm({
  onSwitchRegister,
  onSwitchForgot,
}: LoginFormProps) {
  const { login } = useAuth();
  const { success, error: toastError } = useToast();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      success("Đăng nhập thành công");
      
      // AuthContext now stores role — read from localStorage to redirect
      const stored = localStorage.getItem("dab_user");
      const user = stored ? JSON.parse(stored) : null;
      
      console.log("[Auth] User data from storage:", user);
      console.log("[Auth] Redirecting based on role:", user?.role);

      if (user?.role === "admin") {
        console.log("[Auth] Route: /admin");
        router.push("/admin");
      } else if (user?.role === "staff") {
        console.log("[Auth] Route: /staff");
        router.push("/staff");
      } else {
        console.log("[Auth] Route: /");
        router.push("/");
      }
    } catch (err: unknown) {
      toastError(err instanceof Error ? err.message : "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="field-item text-center mb-8">
        <h1 className="font-black text-[#1A1A2E] text-3xl leading-tight mb-2">
          Chào mừng bạn trở lại
        </h1>
        <p className="text-[#6B7280] text-sm">
          Đăng nhập để tiếp tục thiết kế và học tập cùng{" "}
          <span className="text-[#17409A] font-semibold">DesignABear</span>
        </p>
      </div>

      <div className="field-item space-y-4">
        <InputField
          type="email"
          placeholder="Email"
          rightIcon={<IoMailOutline />}
          name="email"
          value={email}
          onChange={(v) => setEmail(v)}
        />
        <InputField
          type="password"
          placeholder="Mật Khẩu"
          rightIcon={<IoLockClosedOutline />}
          name="password"
          value={password}
          onChange={(v) => setPassword(v)}
        />
      </div>

      <div className="field-item flex items-center justify-between mt-3 mb-5">
        <label className="flex items-center gap-2 text-sm text-[#6B7280] cursor-pointer select-none">
          <input type="checkbox" className="w-4 h-4 rounded accent-[#17409A]" />
          Ghi nhớ đăng nhập
        </label>
        <button
          type="button"
          onClick={onSwitchForgot}
          className="text-sm text-[#17409A] font-bold hover:underline underline-offset-2"
        >
          Quên mật khẩu?
        </button>
      </div>

      <div className="field-item">
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#17409A] text-white font-bold py-4 rounded-2xl hover:bg-[#0E2A66] transition-colors duration-200 shadow-lg shadow-[#17409A]/20 text-base disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Đang đăng nhập..." : "Đăng nhập ngay"}
        </button>
      </div>

      <div className="field-item mt-5">
        <SocialButtons
          label="đăng nhập"
          onGoogleProfileRequired={onSwitchRegister}
        />
      </div>

      <div className="field-item text-center text-sm text-[#6B7280] mt-4">
        Chưa có tài khoản?{" "}
        <button
          type="button"
          onClick={onSwitchRegister}
          className="text-[#17409A] font-bold hover:underline underline-offset-2"
        >
          Đăng ký ngay
        </button>
      </div>
    </form>
  );
}
