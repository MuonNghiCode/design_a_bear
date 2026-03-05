"use client";

import InputField from "./InputField";
import SocialButtons from "./SocialButtons";
import {
  IoMailOutline,
  IoLockClosedOutline,
  IoPersonOutline,
} from "react-icons/io5";

interface RegisterFormProps {
  onSwitchLogin: () => void;
}

export default function RegisterForm({ onSwitchLogin }: RegisterFormProps) {
  return (
    <>
      <div className="field-item text-center mb-8">
        <h1 className="font-black text-[#1A1A2E] text-3xl leading-tight mb-2">
          Tham gia cùng chúng tôi
        </h1>
        <p className="text-[#6B7280] text-sm">
          Chỉ vài bước để bắt đầu thiết kế và học tập
        </p>
      </div>

      <div className="field-item space-y-4">
        <InputField
          type="text"
          placeholder="Username"
          rightIcon={<IoPersonOutline />}
          name="username"
        />
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

      <div className="field-item mt-5">
        <button
          type="submit"
          className="w-full bg-[#17409A] text-white font-bold py-4 rounded-2xl hover:bg-[#0E2A66] transition-colors duration-200 shadow-lg shadow-[#17409A]/20 text-base"
        >
          Đăng ký ngay
        </button>
      </div>

      <div className="field-item mt-5">
        <SocialButtons label="đăng ký" />
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
