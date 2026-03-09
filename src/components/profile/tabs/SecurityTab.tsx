"use client";

import {
  IoShieldCheckmarkOutline,
  IoCheckmarkCircle,
  IoLogOutOutline,
} from "react-icons/io5";
import { SECURITY_ITEMS } from "@/data/profile";

const SECURITY_ICONS = {
  "Đổi mật khẩu": IoShieldCheckmarkOutline,
  "Xác thực 2 bước": IoCheckmarkCircle,
} as Record<
  string,
  React.ComponentType<{ className?: string; style?: React.CSSProperties }>
>;

interface Props {
  onLogout: () => void;
}

export default function SecurityTab({ onLogout }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-[#1A1A2E] font-black text-base mb-1">
        Bảo mật tài khoản
      </p>

      {SECURITY_ITEMS.map((item) => {
        const Icon = SECURITY_ICONS[item.label];
        return (
          <div
            key={item.label}
            className="flex items-center gap-4 bg-[#F8F9FF] rounded-2xl p-4"
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: item.color + "18" }}
            >
              {Icon && (
                <Icon className="text-xl" style={{ color: item.color }} />
              )}
            </div>
            <div className="flex-1">
              <p className="text-[#1A1A2E] font-bold text-sm">{item.label}</p>
              <p className="text-[#9CA3AF] text-[11px] font-semibold">
                {item.desc}
              </p>
            </div>
            <button
              className="text-xs font-black px-4 py-2 rounded-xl hover:opacity-80 transition-opacity shrink-0"
              style={{ color: item.color, backgroundColor: item.color + "18" }}
            >
              {item.action}
            </button>
          </div>
        );
      })}

      {/* Danger zone */}
      <div className="mt-2 bg-[#FF6B9D]/5 border border-[#FF6B9D]/20 rounded-2xl p-4 flex items-center justify-between">
        <div>
          <p className="text-[#FF6B9D] font-bold text-sm">
            Đăng xuất khỏi tất cả thiết bị
          </p>
          <p className="text-[#9CA3AF] text-[11px] font-semibold">
            Kết thúc tất cả phiên đăng nhập
          </p>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center gap-1.5 text-[#FF6B9D] text-xs font-black bg-[#FF6B9D]/10 hover:bg-[#FF6B9D]/20 px-4 py-2 rounded-xl transition-colors shrink-0"
        >
          <IoLogOutOutline />
          Đăng xuất
        </button>
      </div>
    </div>
  );
}
