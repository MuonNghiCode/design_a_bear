"use client";

import InputField from "./InputField";
import SocialButtons from "./SocialButtons";
import { IoMailOutline } from "react-icons/io5";

interface ForgotFormProps {
  onSwitchLogin: () => void;
}

export default function ForgotForm({ onSwitchLogin }: ForgotFormProps) {
  return (
    <>
      <div className="field-item text-center mb-8">
        <h1 className="font-black text-[#1A1A2E] text-3xl leading-tight mb-2">
          Quên Mật Khẩu Rồi À?
        </h1>
        <p className="text-[#6B7280] text-sm leading-relaxed">
          Đừng lo, chúng tôi sẽ giúp bạn lấy lại quyền truy cập
        </p>
      </div>

      <div className="field-item space-y-4">
        <InputField
          type="email"
          placeholder="Email"
          rightIcon={<IoMailOutline />}
          name="email"
        />
      </div>

      <div className="field-item mt-5">
        <button
          type="submit"
          className="w-full bg-[#17409A] text-white font-bold py-4 rounded-2xl hover:bg-[#0E2A66] transition-colors duration-200 shadow-lg shadow-[#17409A]/20 text-base"
        >
          Cài lại mật khẩu
        </button>
      </div>

      <div className="field-item mt-5">
        <SocialButtons label="đăng nhập" />
      </div>

      <div className="field-item text-center text-sm text-[#6B7280] mt-4">
        Đã có tài khoản?{" "}
        <button
          type="button"
          onClick={onSwitchLogin}
          className="text-[#17409A] font-bold hover:underline underline-offset-2"
        >
          Đăng nhập ngay
        </button>
      </div>
    </>
  );
}
