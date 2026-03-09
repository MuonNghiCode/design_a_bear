"use client";

import Image from "next/image";
import {
  IoMailOutline,
  IoPencilOutline,
  IoLogOutOutline,
} from "react-icons/io5";
import { GiPawPrint } from "react-icons/gi";
import type { User } from "@/contexts/AuthContext";

interface Props {
  user: User;
  initials: string;
  roleCfg: { label: string; color: string };
  editMode: boolean;
  onEditToggle: () => void;
  onLogout: () => void;
}

export default function ProfileHero({
  user,
  initials,
  roleCfg,
  editMode,
  onEditToggle,
  onLogout,
}: Props) {
  return (
    <div className="relative overflow-hidden bg-[#17409A]">
      <GiPawPrint
        className="absolute -top-10 -right-10 text-white/5 pointer-events-none rotate-12"
        style={{ fontSize: 300 }}
      />
      <GiPawPrint
        className="absolute bottom-0 left-40 text-white/4 pointer-events-none"
        style={{ fontSize: 160 }}
      />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-8 pt-35 pb-24">
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6">
          {/* Avatar */}
          <div className="ac relative shrink-0">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-linear-to-br from-[#4ECDC4] to-[#17409A] border-4 border-white/20 flex items-center justify-center text-white font-black text-3xl shadow-2xl shadow-[#0E2A66]/40">
              {user.avatar ? (
                <Image
                  src={user.avatar}
                  alt={user.name}
                  fill
                  className="object-cover rounded-3xl"
                />
              ) : (
                initials
              )}
            </div>
            <span className="absolute bottom-1.5 right-1.5 w-3.5 h-3.5 bg-[#4ECDC4] rounded-full border-2 border-white" />
          </div>

          {/* Name + email */}
          <div className="ac flex-1">
            <div className="flex items-center gap-3 mb-1.5">
              <h1 className="text-white font-black text-2xl sm:text-3xl leading-tight">
                {user.name}
              </h1>
              <span
                className="text-[10px] font-black px-2.5 py-1 rounded-full"
                style={{
                  color: roleCfg.color,
                  backgroundColor: "rgba(255,255,255,0.15)",
                }}
              >
                {roleCfg.label}
              </span>
            </div>
            <p className="text-white/60 text-sm font-semibold flex items-center gap-1.5">
              <IoMailOutline className="text-base" />
              {user.email}
            </p>
          </div>

          {/* Action buttons */}
          <div className="ac flex items-center gap-2">
            <button
              onClick={onEditToggle}
              className="flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white text-xs font-black px-4 py-2.5 rounded-2xl transition-colors"
            >
              <IoPencilOutline className="text-sm" />
              {editMode ? "Lưu" : "Chỉnh sửa"}
            </button>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 bg-[#FF6B9D]/20 hover:bg-[#FF6B9D]/35 text-[#FF6B9D] text-xs font-black px-4 py-2.5 rounded-2xl transition-colors"
            >
              <IoLogOutOutline className="text-sm" />
              Đăng xuất
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
