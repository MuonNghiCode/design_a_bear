"use client";

import InputField from "./InputField";
import SocialButtons from "./SocialButtons";
import { IoMailOutline, IoLockClosedOutline } from "react-icons/io5";

interface LoginFormProps {
  onSwitchRegister: () => void;
  onSwitchForgot: () => void;
}

export default function LoginForm({ onSwitchRegister, onSwitchForgot }: LoginFormProps) {
  return (
    <>
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
        />
        <InputField
          type="password"
          placeholder="Mật Khẩu"
          rightIcon={<IoLockClosedOutline />}
          name="password"
        />
      </div>

      <div className="field-item flex items-center justify-between mt-3 mb-5">
        <label className="flex items-center gap-2 text-sm text-[#6B7280] cursor-pointer select-none">
          <input
            type="checkbox"
            className="w-4 h-4 rounded accent-[#17409A]"
          />
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
          className="w-full bg-[#17409A] text-white font-bold py-4 rounded-2xl hover:bg-[#0E2A66] transition-colors duration-200 shadow-lg shadow-[#17409A]/20 text-base"
        >
          Đăng nhập ngay
        </button>
      </div>

      <div className="field-item mt-5">
        <SocialButtons label="đăng nhập" />
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
    </>
  );
}
