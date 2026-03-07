"use client";

import { useState } from "react";
import { MdStorefront, MdCheck } from "react-icons/md";

const FIELDS = [
  {
    key: "name",
    label: "Tên cửa hàng",
    placeholder: "Design a Bear",
    type: "text",
  },
  {
    key: "tagline",
    label: "Slogan",
    placeholder: "Câu slogan ngắn gọn...",
    type: "text",
  },
  {
    key: "email",
    label: "Email liên hệ",
    placeholder: "hello@designabear.vn",
    type: "email",
  },
  {
    key: "phone",
    label: "Số điện thoại",
    placeholder: "09xx xxx xxx",
    type: "tel",
  },
  {
    key: "address",
    label: "Địa chỉ",
    placeholder: "123 Nguyễn Huệ, Q.1, TP.HCM",
    type: "text",
  },
] as const;

type FieldKey = (typeof FIELDS)[number]["key"];

type FormState = Record<FieldKey, string>;

export default function SettingsStore() {
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState<FormState>({
    name: "Design a Bear",
    tagline: "Gấu bông thông minh cho trẻ em Việt Nam",
    email: "hello@designabear.vn",
    phone: "0909 123 456",
    address: "123 Nguyễn Huệ, Q.1, TP.HCM",
  });

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  }

  return (
    <div className="bg-white rounded-3xl p-6 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-2xl bg-[#17409A]/10 flex items-center justify-center shrink-0">
          <MdStorefront className="text-[#17409A] text-xl" />
        </div>
        <div>
          <p className="text-[#9CA3AF] text-[10px] font-black tracking-[0.22em] uppercase">
            Cấu hình
          </p>
          <p className="text-[#1A1A2E] font-black text-lg">
            Thông tin cửa hàng
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="flex flex-col gap-4 flex-1">
        {FIELDS.map((f) => (
          <div key={f.key}>
            <label className="text-[10px] font-black text-[#9CA3AF] tracking-[0.18em] uppercase block mb-1.5">
              {f.label}
            </label>
            <input
              type={f.type}
              value={form[f.key]}
              onChange={(e) =>
                setForm((v) => ({ ...v, [f.key]: e.target.value }))
              }
              placeholder={f.placeholder}
              className="w-full bg-[#F4F7FF] text-[#1A1A2E] font-semibold text-sm rounded-xl px-4 py-3 outline-none border-2 border-transparent focus:border-[#17409A]/30 transition-colors"
            />
          </div>
        ))}
      </div>

      {/* Save */}
      <button
        onClick={handleSave}
        className={`mt-5 flex items-center justify-center gap-2 w-full py-3 rounded-2xl font-black text-sm tracking-wider transition-all duration-300 ${
          saved
            ? "bg-[#4ECDC4]/20 text-[#4ECDC4]"
            : "bg-[#17409A] text-white hover:bg-[#0E2A66]"
        }`}
      >
        {saved ? (
          <>
            <MdCheck className="text-base" /> ĐÃ LƯU
          </>
        ) : (
          "LƯU THAY ĐỔI →"
        )}
      </button>
    </div>
  );
}
