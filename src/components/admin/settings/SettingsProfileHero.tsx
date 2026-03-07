"use client";

import { useState } from "react";
import { MdEdit, MdCheck, MdClose, MdCameraAlt } from "react-icons/md";
import { GiPawPrint } from "react-icons/gi";

const STAT_PILLS = [
  { label: "Đơn đã duyệt", value: "1,284" },
  { label: "Lần đăng nhập", value: "47" },
  { label: "Tuổi tài khoản", value: "8 tháng" },
];

const ROLES = ["Super Admin", "Manager", "Editor"];

export default function SettingsProfileHero() {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("Admin Hùng");
  const [role, setRole] = useState("Super Admin");
  const [draft, setDraft] = useState({ name: "", role: "" });

  function startEdit() {
    setDraft({ name, role });
    setEditing(true);
  }

  function save() {
    if (draft.name.trim()) setName(draft.name.trim());
    setRole(draft.role);
    setEditing(false);
  }

  return (
    <div className="relative bg-[#17409A] rounded-3xl p-6 sm:p-8 overflow-hidden">
      {/* Paw watermarks */}
      <GiPawPrint
        className="absolute -top-10 -right-10 text-white/5 pointer-events-none"
        style={{ fontSize: 240 }}
      />
      <GiPawPrint
        className="absolute bottom-6 left-64 text-white/4 pointer-events-none -rotate-12"
        style={{ fontSize: 90 }}
      />

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 relative">
        {/* Avatar */}
        <div className="relative shrink-0 group cursor-pointer">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-white/20 border-2 border-white/30 flex items-center justify-center text-white font-black text-3xl sm:text-4xl select-none transition-colors group-hover:bg-white/30">
            {name.charAt(0).toUpperCase()}
          </div>
          {/* Camera overlay */}
          <div className="absolute inset-0 rounded-3xl bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <MdCameraAlt className="text-white text-xl" />
          </div>
          {/* Online dot */}
          <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#4ECDC4] rounded-full border-2 border-[#17409A] flex items-center justify-center">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
          </span>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          {editing ? (
            <div className="flex flex-col gap-2.5">
              <input
                autoFocus
                value={draft.name}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, name: e.target.value }))
                }
                className="bg-white/15 text-white font-black text-2xl placeholder:text-white/40 rounded-xl px-4 py-2 outline-none border border-white/20 focus:border-white/60 w-full max-w-xs transition-colors"
                placeholder="Tên hiển thị..."
              />
              <select
                value={draft.role}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, role: e.target.value }))
                }
                className="bg-white/15 text-white font-bold text-sm rounded-xl px-4 py-2 outline-none border border-white/20 focus:border-white/60 w-48 transition-colors"
              >
                {ROLES.map((r) => (
                  <option key={r} value={r} className="text-[#17409A] bg-white">
                    {r}
                  </option>
                ))}
              </select>
              <div className="flex gap-2 mt-0.5">
                <button
                  onClick={save}
                  className="flex items-center gap-1.5 bg-white text-[#17409A] font-black text-xs px-4 py-2 rounded-xl hover:opacity-90 transition-opacity"
                >
                  <MdCheck className="text-sm" /> Lưu
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="flex items-center gap-1.5 bg-white/15 text-white font-bold text-xs px-4 py-2 rounded-xl hover:bg-white/25 transition-colors"
                >
                  <MdClose className="text-sm" /> Hủy
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-white font-black text-2xl sm:text-3xl leading-tight">
                  {name}
                </h2>
                <button
                  onClick={startEdit}
                  className="w-8 h-8 rounded-xl bg-white/15 hover:bg-white/25 flex items-center justify-center text-white/60 hover:text-white transition-all"
                  title="Chỉnh sửa hồ sơ"
                >
                  <MdEdit className="text-sm" />
                </button>
              </div>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className="bg-white/20 text-white text-[11px] font-black px-3 py-1 rounded-full">
                  {role}
                </span>
                <span className="text-white/40 text-xs font-semibold">
                  · Đăng nhập 5 phút trước
                </span>
              </div>
            </>
          )}
        </div>

        {/* Right side meta — desktop only */}
        {!editing && (
          <div className="hidden lg:block text-right shrink-0 space-y-2">
            <div>
              <p className="text-white/40 text-[10px] font-black tracking-wider uppercase">
                IP cuối
              </p>
              <p className="text-white font-black text-sm">192.168.1.45</p>
            </div>
            <div>
              <p className="text-white/40 text-[10px] font-black tracking-wider uppercase">
                Thiết bị
              </p>
              <p className="text-white font-black text-sm">Chrome · Windows</p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom stat strip */}
      <div className="flex items-center gap-3 mt-6 pt-5 border-t border-white/10 flex-wrap">
        {STAT_PILLS.map((s) => (
          <div
            key={s.label}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/15 transition-colors rounded-2xl px-4 py-2.5 cursor-default"
          >
            <span className="text-white font-black text-base">{s.value}</span>
            <span className="text-white/40 text-[11px] font-semibold">
              {s.label}
            </span>
          </div>
        ))}
        <div className="ml-auto">
          <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-colors rounded-xl px-4 py-2 text-white text-[11px] font-black tracking-wider">
            <MdCameraAlt className="text-sm" />
            CẬP NHẬT ẢNH
          </button>
        </div>
      </div>
    </div>
  );
}
