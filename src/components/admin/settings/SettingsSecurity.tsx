"use client";

import { useState } from "react";
import {
  MdLock,
  MdShield,
  MdComputer,
  MdPhoneAndroid,
  MdClose,
  MdCheck,
} from "react-icons/md";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { GiPawPrint } from "react-icons/gi";

const SESSIONS = [
  {
    device: "Chrome · Windows",
    location: "TP.HCM, VN",
    time: "5 phút trước",
    Icon: MdComputer,
    current: true,
  },
  {
    device: "Safari · iPhone 15",
    location: "TP.HCM, VN",
    time: "2 giờ trước",
    Icon: MdPhoneAndroid,
    current: false,
  },
  {
    device: "Chrome · MacBook",
    location: "Hà Nội, VN",
    time: "1 ngày trước",
    Icon: MdComputer,
    current: false,
  },
];

function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;
  const score =
    password.length < 6
      ? 1
      : password.length < 10
        ? 2
        : /[A-Z]/.test(password) && /[0-9!@#$%]/.test(password)
          ? 4
          : 3;
  const LABELS = ["", "Yếu", "Trung bình", "Tốt", "Mạnh"];
  const COLORS = ["", "#FF6B9D", "#FF8C42", "#4ECDC4", "#17409A"];
  return (
    <div className="mt-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="flex-1 h-1 rounded-full transition-all duration-300"
            style={{ backgroundColor: i <= score ? COLORS[score] : "#E5E7EB" }}
          />
        ))}
      </div>
      <p
        className="text-[10px] font-bold mt-1"
        style={{ color: COLORS[score] }}
      >
        {LABELS[score]}
      </p>
    </div>
  );
}

export default function SettingsSecurity() {
  const [twoFA, setTwoFA] = useState(false);
  const [show, setShow] = useState({ old: false, new: false, confirm: false });
  const [pw, setPw] = useState({ old: "", new: "", confirm: "" });
  const [saved, setSaved] = useState(false);
  const [sessions, setSessions] = useState(SESSIONS);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  }

  function revokeSession(index: number) {
    setSessions((prev) => prev.filter((_, i) => i !== index));
  }

  const PW_FIELDS = [
    { key: "old", label: "Mật khẩu hiện tại" },
    { key: "new", label: "Mật khẩu mới" },
    { key: "confirm", label: "Xác nhận mật khẩu" },
  ] as const;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {/* ── Change password ── */}
      <div className="bg-white rounded-3xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-[#FF8C42]/10 flex items-center justify-center shrink-0">
            <MdLock className="text-[#FF8C42] text-xl" />
          </div>
          <div>
            <p className="text-[#9CA3AF] text-[10px] font-black tracking-[0.22em] uppercase">
              Bảo mật
            </p>
            <p className="text-[#1A1A2E] font-black text-lg">Đổi mật khẩu</p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {PW_FIELDS.map((f) => (
            <div key={f.key}>
              <label className="text-[10px] font-black text-[#9CA3AF] tracking-[0.18em] uppercase block mb-1.5">
                {f.label}
              </label>
              <div className="relative">
                <input
                  type={show[f.key] ? "text" : "password"}
                  value={pw[f.key]}
                  onChange={(e) =>
                    setPw((v) => ({ ...v, [f.key]: e.target.value }))
                  }
                  placeholder="••••••••"
                  className="w-full bg-[#F4F7FF] text-[#1A1A2E] font-semibold text-sm rounded-xl px-4 py-3 pr-11 outline-none border-2 border-transparent focus:border-[#FF8C42]/40 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShow((v) => ({ ...v, [f.key]: !v[f.key] }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#374151] transition-colors"
                  tabIndex={-1}
                >
                  {show[f.key] ? (
                    <IoEyeOff className="text-lg" />
                  ) : (
                    <IoEye className="text-lg" />
                  )}
                </button>
              </div>
              {f.key === "new" && <PasswordStrength password={pw.new} />}
            </div>
          ))}
        </div>

        <button
          onClick={handleSave}
          className={`mt-5 w-full py-3 rounded-2xl font-black text-sm tracking-wider transition-all duration-300 flex items-center justify-center gap-2 ${
            saved
              ? "bg-[#4ECDC4]/20 text-[#4ECDC4]"
              : "bg-[#FF8C42] text-white hover:bg-[#e07a30]"
          }`}
        >
          {saved ? (
            <>
              <MdCheck className="text-base" /> ĐÃ CẬP NHẬT
            </>
          ) : (
            "CẬP NHẬT MẬT KHẨU →"
          )}
        </button>
      </div>

      {/* ── 2FA + Sessions ── */}
      <div className="flex flex-col gap-5">
        {/* 2FA — navy card */}
        <div className="bg-[#17409A] rounded-3xl p-6 relative overflow-hidden">
          <GiPawPrint
            className="absolute -bottom-4 -right-4 text-white/5 pointer-events-none"
            style={{ fontSize: 130 }}
          />
          <div className="flex items-center justify-between relative">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center shrink-0">
                <MdShield className="text-white text-xl" />
              </div>
              <div>
                <p className="text-white font-black text-base">
                  Xác thực 2 bước
                </p>
                <p className="text-white/50 text-[11px] font-semibold">
                  Bảo mật tài khoản nâng cao
                </p>
              </div>
            </div>
            {/* Toggle */}
            <button
              role="switch"
              aria-checked={twoFA}
              onClick={() => setTwoFA((v) => !v)}
              className="relative rounded-full transition-colors duration-300 shrink-0 focus:outline-none"
              style={{
                width: 48,
                height: 26,
                backgroundColor: twoFA ? "#4ECDC4" : "rgba(255,255,255,0.2)",
              }}
            >
              <span
                className="absolute top-1 w-4.5 h-4.5 bg-white rounded-full shadow-md transition-all duration-300"
                style={{ width: 18, height: 18, left: twoFA ? 25 : 5 }}
              />
            </button>
          </div>
          {twoFA && (
            <div className="mt-4 bg-white/10 rounded-2xl px-4 py-3">
              <p className="text-white/70 text-[11px] font-semibold leading-relaxed">
                Mã QR đã được gửi về email. Quét bằng ứng dụng{" "}
                <span className="text-white font-black">
                  Google Authenticator
                </span>
                .
              </p>
            </div>
          )}
        </div>

        {/* Active sessions */}
        <div className="bg-white rounded-3xl p-6 flex-1">
          <p className="text-[#9CA3AF] text-[10px] font-black tracking-[0.22em] uppercase mb-0.5">
            Phiên đăng nhập
          </p>
          <p className="text-[#1A1A2E] font-black text-lg mb-4">
            Thiết bị đang hoạt động
          </p>
          <div className="flex flex-col gap-2">
            {sessions.map((s, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 px-3 py-3 rounded-2xl transition-colors ${
                  s.current
                    ? "bg-[#17409A]/6 border border-[#17409A]/10"
                    : "hover:bg-[#F4F7FF]"
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    s.current
                      ? "bg-[#17409A] text-white"
                      : "bg-[#F4F7FF] text-[#9CA3AF]"
                  }`}
                >
                  <s.Icon className="text-lg" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-[#1A1A2E] font-bold text-sm truncate">
                      {s.device}
                    </p>
                    {s.current && (
                      <span className="text-[9px] font-black text-[#17409A] bg-[#17409A]/10 px-2 py-0.5 rounded-full whitespace-nowrap">
                        HIỆN TẠI
                      </span>
                    )}
                  </div>
                  <p className="text-[#9CA3AF] text-[11px] font-semibold">
                    {s.location} · {s.time}
                  </p>
                </div>
                {!s.current && (
                  <button
                    onClick={() => revokeSession(i)}
                    className="w-7 h-7 rounded-lg hover:bg-[#FF6B9D]/10 flex items-center justify-center text-[#9CA3AF] hover:text-[#FF6B9D] transition-all"
                    title="Thu hồi phiên"
                  >
                    <MdClose className="text-base" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
