"use client";

import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { useState } from "react";

interface InputFieldProps {
  type?: "text" | "email" | "password";
  placeholder: string;
  rightIcon: React.ReactNode;
  value?: string;
  onChange?: (v: string) => void;
  name?: string;
}

export default function InputField({
  type = "text",
  placeholder,
  rightIcon,
  value,
  onChange,
  name,
}: InputFieldProps) {
  const [showPass, setShowPass] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPass ? "text" : "password") : type;

  return (
    <div className="relative">
      <input
        type={inputType}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full pl-5 pr-12 py-4 rounded-2xl border border-[#E5E7EB] bg-white/50 text-[#1A1A2E] placeholder-[#9CA3AF] text-sm focus:outline-none focus:border-[#17409A] focus:bg-white/80 transition-all duration-200"
        style={{ fontFamily: "'Nunito', sans-serif", fontSize: "0.95rem" }}
      />
      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] text-xl">
        {isPassword ? (
          <button
            type="button"
            onClick={() => setShowPass((p) => !p)}
            className="text-[#9CA3AF] hover:text-[#17409A] transition-colors focus:outline-none"
            tabIndex={-1}
          >
            {showPass ? <IoEyeOutline /> : <IoEyeOffOutline />}
          </button>
        ) : (
          <span className="pointer-events-none">{rightIcon}</span>
        )}
      </span>
    </div>
  );
}
