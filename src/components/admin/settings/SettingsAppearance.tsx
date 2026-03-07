"use client";

import { MdPalette, MdCheck } from "react-icons/md";
import { IoLanguage } from "react-icons/io5";
import { useAdminPrefs } from "@/contexts/AdminPreferencesContext";
import type { AdminDensity } from "@/contexts/AdminPreferencesContext";

const LANGUAGES = [
  { code: "vi", label: "🆻🇳  Tiếng Việt" },
  { code: "en", label: "🇺🇸  English" },
  { code: "zh", label: "🇨🇳  中文" },
];

const ACCENTS = [
  { label: "Navy", color: "#17409A" },
  { label: "Purple", color: "#7C5CFC" },
  { label: "Teal", color: "#4ECDC4" },
  { label: "Orange", color: "#FF8C42" },
  { label: "Pink", color: "#FF6B9D" },
  { label: "Gold", color: "#FFD93D" },
];

const DENSITY = [
  {
    key: "comfortable" as AdminDensity,
    label: "Thoải mái",
    desc: "Khoảng cách rộng",
  },
  { key: "normal" as AdminDensity, label: "Vừa phải", desc: "Mặc định" },
  { key: "compact" as AdminDensity, label: "Gọn", desc: "Hiển thị nhiều hơn" },
];

export default function SettingsAppearance() {
  const { pending, setPending, apply, applied } = useAdminPrefs();

  const lang = pending.language;
  const accent = pending.accent;
  const density = pending.density;

  const currentAccent = ACCENTS.find((a) => a.color === accent);
  const currentLang = LANGUAGES.find((l) => l.code === lang);

  return (
    <div className="bg-white rounded-3xl p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-2xl bg-[#4ECDC4]/10 flex items-center justify-center shrink-0">
          <MdPalette className="text-[#4ECDC4] text-xl" />
        </div>
        <div>
          <p className="text-[#9CA3AF] text-[10px] font-black tracking-[0.22em] uppercase">
            Tuỳ chỉnh
          </p>
          <p className="text-[#1A1A2E] font-black text-lg">
            Giao diện &amp; Ngôn ngữ
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
        {/* Language */}
        <div>
          <label className="text-[10px] font-black text-[#9CA3AF] tracking-[0.18em] uppercase mb-3 flex items-center gap-1.5">
            <IoLanguage className="text-sm" /> Ngôn ngữ
          </label>
          <div className="flex flex-col gap-1.5 mt-3">
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                onClick={() => setPending({ language: l.code })}
                className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  lang === l.code
                    ? "bg-[#17409A] text-white shadow-sm"
                    : "bg-[#F4F7FF] text-[#4B5563] hover:bg-[#E8EEF9]"
                }`}
              >
                {l.label}
                {lang === l.code && <MdCheck className="text-sm shrink-0" />}
              </button>
            ))}
          </div>
        </div>

        {/* Accent colour */}
        <div>
          <label className="text-[10px] font-black text-[#9CA3AF] tracking-[0.18em] uppercase block mb-3">
            Màu chủ đạo
          </label>
          <div className="grid grid-cols-3 gap-2 mt-3">
            {ACCENTS.map((a) => (
              <button
                key={a.color}
                onClick={() => setPending({ accent: a.color })}
                title={a.label}
                className="relative h-10 rounded-xl transition-transform hover:scale-105 flex items-center justify-center focus:outline-none group"
                style={{ backgroundColor: a.color }}
              >
                {accent === a.color && (
                  <MdCheck className="text-white text-base drop-shadow" />
                )}
                <span className="pointer-events-none absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] font-black text-[#9CA3AF] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {a.label}
                </span>
              </button>
            ))}
          </div>
          <p className="text-[11px] text-[#9CA3AF] font-semibold mt-4">
            Áp dụng cho sidebar, topbar và các nút chính
          </p>
        </div>

        {/* Density */}
        <div>
          <label className="text-[10px] font-black text-[#9CA3AF] tracking-[0.18em] uppercase block mb-3">
            Mật độ hiển thị
          </label>
          <div className="flex flex-col gap-1.5 mt-3">
            {DENSITY.map((d) => (
              <button
                key={d.key}
                onClick={() => setPending({ density: d.key })}
                className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-bold transition-all text-left ${
                  density === d.key
                    ? "bg-[#4ECDC4]/15 text-[#4ECDC4] border border-[#4ECDC4]/30"
                    : "bg-[#F4F7FF] text-[#4B5563] hover:bg-[#E8EEF9]"
                }`}
              >
                <div>
                  <span>{d.label}</span>
                  <span
                    className={`block text-[10px] font-semibold ${
                      density === d.key ? "text-[#4ECDC4]/70" : "text-[#9CA3AF]"
                    }`}
                  >
                    {d.desc}
                  </span>
                </div>
                {density === d.key && (
                  <MdCheck className="text-[#4ECDC4] text-sm shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Apply bar */}
      <div className="mt-7 p-4 bg-[#F4F7FF] rounded-2xl flex items-center gap-3 flex-wrap">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-300"
          style={{ backgroundColor: accent }}
        >
          <MdPalette className="text-white text-sm" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[#1A1A2E] font-bold text-sm">Xem trước thay đổi</p>
          <p className="text-[#9CA3AF] text-[11px] font-semibold">
            {currentLang?.label.split("  ")[1]} ·{" "}
            {DENSITY.find((d) => d.key === density)?.label} ·{" "}
            <span style={{ color: accent }}>●</span> {currentAccent?.label}
          </p>
        </div>
        <button
          onClick={apply}
          className="shrink-0 text-white text-xs font-black px-5 py-2.5 rounded-xl transition-all duration-300 flex items-center gap-2"
          style={{ backgroundColor: applied ? "#4ECDC4" : accent }}
        >
          {applied ? (
            <>
              <MdCheck className="text-sm" /> ĐÃ ÁP DỤNG
            </>
          ) : (
            "ÁP DỤNG →"
          )}
        </button>
      </div>
    </div>
  );
}
