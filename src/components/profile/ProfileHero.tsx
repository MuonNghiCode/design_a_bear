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
  avatarUrl?: string;
  initials: string;
  roleCfg: { label: string; color: string };
  editMode: boolean;
  onEditToggle: () => void;
  onLogout: () => void;
}

export default function ProfileHero({
  user,
  avatarUrl,
  initials,
  roleCfg,
  editMode,
  onEditToggle,
  onLogout,
}: Props) {
  const displayAvatar = avatarUrl || user.avatar;

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#17409A] via-[#12317A] to-[#0E2A66] rounded-b-[48px] shadow-xl">
      {/* Premium blobs */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(78,205,196,0.15),transparent_50%)] pointer-events-none" />
      
      <GiPawPrint
        className="absolute -top-12 -right-12 text-white/5 pointer-events-none rotate-12"
        style={{ fontSize: 320 }}
      />
      <GiPawPrint
        className="absolute -bottom-10 left-40 text-white/4 pointer-events-none -rotate-12"
        style={{ fontSize: 200 }}
      />

      <div className="relative max-w-screen-2xl mx-auto px-8 md:px-16 pt-36 pb-24">
        <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-8">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 text-center md:text-left">
            {/* Avatar with luxury border */}
            <div className="ac relative shrink-0 group">
              <div className="w-28 h-28 md:w-32 md:h-32 rounded-[32px] bg-gradient-to-br from-[#4ECDC4] to-[#17409A] border-4 border-white/20 flex items-center justify-center text-white font-black text-4xl shadow-2xl shadow-[#0E2A66]/40 hover:scale-105 transition-all duration-300 relative overflow-hidden">
                {displayAvatar ? (
                  <img
                    src={displayAvatar}
                    alt={user.name}
                    className="w-full h-full object-cover rounded-[28px]"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  initials
                )}
              </div>
              <span className="absolute bottom-2 right-2 w-4 h-4 bg-[#4ECDC4] rounded-full border-2 border-white shadow-md group-hover:scale-110 transition-transform duration-300" />
            </div>

            {/* Name + email */}
            <div className="ac flex-1">
              <div className="flex flex-col md:flex-row md:items-center items-center gap-3 mb-2">
                <h1 className="text-white font-black text-3xl md:text-4xl leading-tight tracking-tight">
                  {user.name}
                </h1>
                <span
                  className="text-[10px] font-black px-3.5 py-1 rounded-full tracking-widest uppercase shadow-sm"
                  style={{
                    color: roleCfg.color,
                    backgroundColor: "rgba(255,255,255,0.15)",
                  }}
                >
                  {roleCfg.label}
                </span>
              </div>
              <p className="text-white/70 text-sm font-semibold flex items-center gap-2 justify-center md:justify-start">
                <IoMailOutline className="text-lg" />
                {user.email}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="ac flex items-center gap-3 w-full md:w-auto justify-center md:justify-end">
            <button
              onClick={onEditToggle}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white text-xs font-black px-6 py-3.5 rounded-2xl transition-all duration-300 backdrop-blur-md shadow-sm border border-white/10"
            >
              <IoPencilOutline className="text-sm" />
              {editMode ? "Lưu" : "Chỉnh sửa"}
            </button>
            <button
              onClick={onLogout}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#FF6B9D]/15 hover:bg-[#FF6B9D]/25 text-[#FF6B9D] text-xs font-black px-6 py-3.5 rounded-2xl transition-all duration-300 backdrop-blur-md shadow-sm border border-[#FF6B9D]/10"
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
