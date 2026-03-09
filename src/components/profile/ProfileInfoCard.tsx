"use client";

import {
  IoPersonOutline,
  IoMailOutline,
  IoCallOutline,
  IoLocationOutline,
  IoCheckmarkCircle,
} from "react-icons/io5";
import type { User } from "@/contexts/AuthContext";

interface Props {
  user: User;
  editMode: boolean;
  name: string;
  phone: string;
  address: string;
  setName: (v: string) => void;
  setPhone: (v: string) => void;
  setAddress: (v: string) => void;
  onSave: () => void;
}

export default function ProfileInfoCard({
  user,
  editMode,
  name,
  phone,
  address,
  setName,
  setPhone,
  setAddress,
  onSave,
}: Props) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <p className="text-[9px] font-black tracking-[0.22em] uppercase text-[#9CA3AF]">
          Thông tin cá nhân
        </p>
        {editMode && (
          <span className="text-[9px] font-black text-[#17409A] bg-[#17409A]/8 px-2 py-0.5 rounded-full">
            Đang chỉnh sửa
          </span>
        )}
      </div>

      <div className="flex flex-col gap-4">
        {/* Name */}
        <div>
          <label className="text-[9px] font-black tracking-widest text-[#9CA3AF] uppercase mb-1.5 block">
            Họ và tên
          </label>
          {editMode ? (
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#F4F7FF] rounded-xl px-4 py-2.5 text-sm font-bold text-[#1A1A2E] outline-none border-2 border-transparent focus:border-[#17409A]/30 transition-colors"
            />
          ) : (
            <div className="flex items-center gap-2.5">
              <IoPersonOutline className="text-[#9CA3AF] text-base shrink-0" />
              <span className="text-[#1A1A2E] font-bold text-sm">{name}</span>
            </div>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="text-[9px] font-black tracking-widest text-[#9CA3AF] uppercase mb-1.5 block">
            Email
          </label>
          <div className="flex items-center gap-2.5">
            <IoMailOutline className="text-[#9CA3AF] text-base shrink-0" />
            <span className="text-[#1A1A2E] font-bold text-sm break-all">
              {user.email}
            </span>
            <IoCheckmarkCircle
              className="text-[#4ECDC4] text-base shrink-0 ml-auto"
              title="Đã xác thực"
            />
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className="text-[9px] font-black tracking-widest text-[#9CA3AF] uppercase mb-1.5 block">
            Số điện thoại
          </label>
          {editMode ? (
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-[#F4F7FF] rounded-xl px-4 py-2.5 text-sm font-bold text-[#1A1A2E] outline-none border-2 border-transparent focus:border-[#17409A]/30 transition-colors"
            />
          ) : (
            <div className="flex items-center gap-2.5">
              <IoCallOutline className="text-[#9CA3AF] text-base shrink-0" />
              <span className="text-[#1A1A2E] font-bold text-sm">{phone}</span>
            </div>
          )}
        </div>

        {/* Address */}
        <div>
          <label className="text-[9px] font-black tracking-widest text-[#9CA3AF] uppercase mb-1.5 block">
            Địa chỉ
          </label>
          {editMode ? (
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={2}
              className="w-full bg-[#F4F7FF] rounded-xl px-4 py-2.5 text-sm font-bold text-[#1A1A2E] outline-none border-2 border-transparent focus:border-[#17409A]/30 transition-colors resize-none"
            />
          ) : (
            <div className="flex items-start gap-2.5">
              <IoLocationOutline className="text-[#9CA3AF] text-base shrink-0 mt-0.5" />
              <span className="text-[#1A1A2E] font-bold text-sm leading-snug">
                {address}
              </span>
            </div>
          )}
        </div>

        {editMode && (
          <button
            onClick={onSave}
            className="w-full bg-[#17409A] text-white font-black text-sm py-3 rounded-2xl hover:bg-[#0E2A66] transition-colors mt-1"
          >
            Lưu thay đổi
          </button>
        )}
      </div>
    </div>
  );
}
