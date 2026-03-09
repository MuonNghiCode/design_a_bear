"use client";

import { useState } from "react";
import {
  MdClose,
  MdAdd,
  MdDelete,
  MdWarning,
  MdCheckCircle,
  MdSend,
  MdSave,
} from "react-icons/md";
import {
  SHIFT_CFG,
  REPORT_TYPE_CFG,
  type ShiftType,
  type ReportType,
  type IssueSeverity,
} from "@/data/staff";
import { useAuth } from "@/contexts/AuthContext";

interface Issue {
  id: string;
  severity: IssueSeverity;
  description: string;
  resolved: boolean;
}

interface FormState {
  type: ReportType;
  shift: ShiftType;
  date: string;
  ordersProcessed: string;
  packagingDone: string;
  reviewsAnswered: string;
  issues: Issue[];
  stockNotes: string;
  handoverNotes: string;
  generalNotes: string;
}

const EMPTY_FORM: FormState = {
  type: "shift",
  shift: "morning",
  date: new Date().toLocaleDateString("vi-VN"),
  ordersProcessed: "",
  packagingDone: "",
  reviewsAnswered: "",
  issues: [],
  stockNotes: "",
  handoverNotes: "",
  generalNotes: "",
};

const SEVERITY_OPTIONS: { value: IssueSeverity; label: string; color: string }[] = [
  { value: "low",    label: "Thấp",         color: "#4ECDC4" },
  { value: "medium", label: "Trung bình",   color: "#FF8C42" },
  { value: "high",   label: "Cao",          color: "#FF6B9D" },
];

interface StaffReportFormProps {
  onClose: () => void;
  onSubmit: () => void;
}

export default function StaffReportForm({ onClose, onSubmit }: StaffReportFormProps) {
  const { user }  = useAuth();
  const [form, setForm]       = useState<FormState>(EMPTY_FORM);
  const [step, setStep]       = useState<1 | 2 | 3 | 4>(1);
  const [submitted, setSubmitted] = useState(false);

  function set<K extends keyof FormState>(k: K, v: FormState[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function addIssue() {
    set("issues", [
      ...form.issues,
      { id: `I-${Date.now()}`, severity: "medium", description: "", resolved: false },
    ]);
  }

  function updateIssue(id: string, patch: Partial<Issue>) {
    set(
      "issues",
      form.issues.map((i) => (i.id === id ? { ...i, ...patch } : i)),
    );
  }

  function removeIssue(id: string) {
    set("issues", form.issues.filter((i) => i.id !== id));
  }

  function handleSubmit(asDraft = false) {
    setSubmitted(true);
    setTimeout(() => {
      onSubmit();
    }, 1500);
  }

  const STEPS = [
    { n: 1 as const, label: "Thông tin ca" },
    { n: 2 as const, label: "Công việc"    },
    { n: 3 as const, label: "Sự cố & kho"  },
    { n: 4 as const, label: "Bàn giao"     },
  ];

  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
        <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-10 flex flex-col items-center gap-5 text-center">
          <div className="w-20 h-20 rounded-full bg-[#4ECDC4]/10 flex items-center justify-center">
            <MdCheckCircle className="text-[#4ECDC4]" style={{ fontSize: 44 }} />
          </div>
          <div>
            <p className="font-black text-[#1A1A2E] text-xl">Báo cáo đã nộp!</p>
            <p className="text-[#9CA3AF] text-sm mt-1">Admin sẽ xem xét trong thời gian sớm nhất.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden max-h-[95vh]">

        {/* ── Header ── */}
        <div className="bg-[#17409A] px-6 py-5">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-0.5">Tạo báo cáo mới</p>
              <p className="text-white font-black text-lg">{user?.name ?? "Nhân viên"}</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-xl bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors cursor-pointer shrink-0">
              <MdClose className="text-lg" />
            </button>
          </div>

          {/* Step tracker */}
          <div className="flex items-center gap-1">
            {STEPS.map((s, idx) => (
              <div key={s.n} className="flex items-center gap-1 flex-1">
                <button
                  onClick={() => setStep(s.n)}
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-colors ${
                      step === s.n
                        ? "bg-white text-[#17409A]"
                        : step > s.n
                        ? "bg-[#4ECDC4] text-white"
                        : "bg-white/15 text-white/50"
                    }`}
                  >
                    {step > s.n ? <MdCheckCircle className="text-sm" /> : s.n}
                  </div>
                  <span
                    className={`text-xs font-bold hidden sm:inline transition-colors ${
                      step === s.n ? "text-white" : "text-white/50"
                    }`}
                  >
                    {s.label}
                  </span>
                </button>
                {idx < STEPS.length - 1 && (
                  <div className="flex-1 h-px bg-white/15 mx-1" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Body ── */}
        <div className="overflow-y-auto flex-1 p-6">

          {/* Step 1: Info */}
          {step === 1 && (
            <div className="flex flex-col gap-5">
              <p className="font-black text-[#1A1A2E] text-base">Thông tin ca làm việc</p>

              {/* Report type */}
              <div>
                <label className="text-[#1A1A2E] text-sm font-bold block mb-2">Loại báo cáo</label>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.entries(REPORT_TYPE_CFG) as [ReportType, (typeof REPORT_TYPE_CFG)[ReportType]][]).map(([key, cfg]) => (
                    <button
                      key={key}
                      onClick={() => set("type", key)}
                      className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                        form.type === key
                          ? "border-[#17409A] bg-[#17409A]/5"
                          : "border-[#F4F7FF] bg-[#F4F7FF] hover:border-[#17409A]/30"
                      }`}
                    >
                      <span
                        className="text-xs font-black block"
                        style={{ color: form.type === key ? cfg.color : "#9CA3AF" }}
                      >
                        {cfg.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Shift */}
              <div>
                <label className="text-[#1A1A2E] text-sm font-bold block mb-2">Ca làm việc</label>
                <div className="grid grid-cols-3 gap-2">
                  {(Object.entries(SHIFT_CFG) as [ShiftType, (typeof SHIFT_CFG)[ShiftType]][]).map(([key, cfg]) => (
                    <button
                      key={key}
                      onClick={() => set("shift", key)}
                      className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                        form.shift === key
                          ? "border-[#17409A] bg-[#17409A]/5"
                          : "border-[#F4F7FF] bg-[#F4F7FF] hover:border-[#17409A]/30"
                      }`}
                    >
                      <span className="text-xs font-black block text-[#1A1A2E]">{cfg.label}</span>
                      <span className="text-[10px] text-[#9CA3AF]">{cfg.time}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Date */}
              <div>
                <label className="text-[#1A1A2E] text-sm font-bold block mb-2">Ngày</label>
                <input
                  type="text"
                  value={form.date}
                  onChange={(e) => set("date", e.target.value)}
                  className="w-full bg-[#F4F7FF] rounded-2xl px-4 py-3 text-sm text-[#1A1A2E] outline-none focus:ring-2 focus:ring-[#17409A]/30 transition"
                  placeholder="DD/MM/YYYY"
                />
              </div>
            </div>
          )}

          {/* Step 2: Work summary */}
          {step === 2 && (
            <div className="flex flex-col gap-5">
              <p className="font-black text-[#1A1A2E] text-base">Tổng kết công việc trong ca</p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { key: "ordersProcessed" as const, label: "Số đơn đã xử lý",   placeholder: "VD: 12" },
                  { key: "packagingDone"   as const, label: "Số đơn đã đóng gói", placeholder: "VD: 12" },
                  { key: "reviewsAnswered" as const, label: "Phản hồi đánh giá",  placeholder: "VD: 3"  },
                ].map(({ key, label, placeholder }) => (
                  <div key={key}>
                    <label className="text-[#1A1A2E] text-sm font-bold block mb-2">{label}</label>
                    <input
                      type="number"
                      min="0"
                      value={form[key]}
                      onChange={(e) => set(key, e.target.value)}
                      placeholder={placeholder}
                      className="w-full bg-[#F4F7FF] rounded-2xl px-4 py-3 text-sm text-[#1A1A2E] outline-none focus:ring-2 focus:ring-[#17409A]/30 transition"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="text-[#1A1A2E] text-sm font-bold block mb-2">Ghi chú chung về công việc</label>
                <textarea
                  rows={4}
                  value={form.generalNotes}
                  onChange={(e) => set("generalNotes", e.target.value)}
                  placeholder="Mô tả tổng quan ca làm việc, những điểm nổi bật…"
                  className="w-full bg-[#F4F7FF] rounded-2xl px-4 py-3 text-sm text-[#1A1A2E] placeholder-[#9CA3AF] outline-none focus:ring-2 focus:ring-[#17409A]/30 resize-none transition"
                />
              </div>
            </div>
          )}

          {/* Step 3: Issues + stock */}
          {step === 3 && (
            <div className="flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <p className="font-black text-[#1A1A2E] text-base">Sự cố phát sinh</p>
                <button
                  onClick={addIssue}
                  className="flex items-center gap-1.5 bg-[#FF8C42]/10 text-[#FF8C42] text-xs font-bold px-3 py-1.5 rounded-xl cursor-pointer hover:bg-[#FF8C42]/20 transition-colors"
                >
                  <MdAdd /> Thêm sự cố
                </button>
              </div>

              {form.issues.length === 0 && (
                <div className="bg-[#F4F7FF] rounded-2xl p-6 text-center text-[#9CA3AF] text-sm">
                  <MdCheckCircle className="text-[#4ECDC4] text-3xl mx-auto mb-2" />
                  Không có sự cố — bấm &quot;Thêm sự cố&quot; nếu cần báo cáo
                </div>
              )}

              <div className="flex flex-col gap-3">
                {form.issues.map((issue) => (
                  <div key={issue.id} className="bg-[#F4F7FF] rounded-2xl p-4 flex flex-col gap-3">
                    <div className="flex items-center justify-between gap-3">
                      {/* Severity */}
                      <div className="flex gap-1.5">
                        {SEVERITY_OPTIONS.map((s) => (
                          <button
                            key={s.value}
                            onClick={() => updateIssue(issue.id, { severity: s.value })}
                            className="text-[10px] font-black px-2.5 py-1 rounded-xl transition-all cursor-pointer"
                            style={{
                              color: issue.severity === s.value ? "white" : s.color,
                              backgroundColor: issue.severity === s.value ? s.color : `${s.color}20`,
                            }}
                          >
                            {s.label}
                          </button>
                        ))}
                      </div>

                      {/* Resolved toggle */}
                      <div className="flex items-center gap-2">
                        <span className="text-[#9CA3AF] text-xs">Đã giải quyết</span>
                        <button
                          onClick={() => updateIssue(issue.id, { resolved: !issue.resolved })}
                          className={`w-9 h-5 rounded-full transition-colors cursor-pointer relative ${
                            issue.resolved ? "bg-[#4ECDC4]" : "bg-[#D1D5DB]"
                          }`}
                        >
                          <span
                            className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${
                              issue.resolved ? "left-4" : "left-0.5"
                            }`}
                          />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => removeIssue(issue.id)}
                          className="w-7 h-7 rounded-xl bg-[#FF6B9D]/10 hover:bg-[#FF6B9D]/20 text-[#FF6B9D] flex items-center justify-center cursor-pointer"
                        >
                          <MdDelete className="text-sm" />
                        </button>
                      </div>
                    </div>

                    <textarea
                      rows={2}
                      value={issue.description}
                      onChange={(e) => updateIssue(issue.id, { description: e.target.value })}
                      placeholder="Mô tả chi tiết sự cố, nguyên nhân, hướng xử lý…"
                      className="w-full bg-white rounded-xl px-3 py-2 text-sm text-[#1A1A2E] placeholder-[#9CA3AF] outline-none focus:ring-2 focus:ring-[#17409A]/20 resize-none transition"
                    />
                  </div>
                ))}
              </div>

              {/* Stock notes */}
              <div>
                <label className="text-[#1A1A2E] text-sm font-bold flex items-center gap-1.5 mb-2">
                  <MdWarning className="text-[#FFD93D]" /> Tình trạng kho / nguyên vật liệu
                </label>
                <textarea
                  rows={3}
                  value={form.stockNotes}
                  onChange={(e) => set("stockNotes", e.target.value)}
                  placeholder="Tình trạng bông nhồi, hộp quà, ruy băng, vải… Ghi rõ nếu sắp hết."
                  className="w-full bg-[#F4F7FF] rounded-2xl px-4 py-3 text-sm text-[#1A1A2E] placeholder-[#9CA3AF] outline-none focus:ring-2 focus:ring-[#17409A]/30 resize-none transition"
                />
              </div>
            </div>
          )}

          {/* Step 4: Handover */}
          {step === 4 && (
            <div className="flex flex-col gap-5">
              <p className="font-black text-[#1A1A2E] text-base">Ghi chú bàn giao ca</p>

              <div className="bg-[#FFD93D]/10 border border-[#FFD93D]/30 rounded-2xl p-4 text-sm text-[#374151]">
                <p className="font-bold text-[#e6a800] mb-1 text-xs uppercase tracking-wide">Quan trọng</p>
                Nội dung bàn giao sẽ hiển thị nổi bật cho ca tiếp theo. Hãy ghi rõ những đầu việc chưa hoàn thành và những thông tin nhân viên ca sau cần biết.
              </div>

              <textarea
                rows={6}
                value={form.handoverNotes}
                onChange={(e) => set("handoverNotes", e.target.value)}
                placeholder="VD: Ca chiều nhận thêm 5 đơn mới. ORD-042 khách yêu cầu giao trước 18:00. Kệ A3 có 2 gấu Brownie lỗi cần chờ xử lý…"
                className="w-full bg-[#F4F7FF] rounded-2xl px-4 py-3 text-sm text-[#1A1A2E] placeholder-[#9CA3AF] outline-none focus:ring-2 focus:ring-[#17409A]/30 resize-none transition"
              />

              {/* Summary preview */}
              <div className="bg-[#F4F7FF] rounded-2xl p-4 flex flex-col gap-3">
                <p className="font-black text-[#1A1A2E] text-sm">Xác nhận nộp báo cáo</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { label: "Loại",       value: REPORT_TYPE_CFG[form.type].label             },
                    { label: "Ca",         value: SHIFT_CFG[form.shift].label                  },
                    { label: "Đơn xử lý", value: form.ordersProcessed || "0"                  },
                    { label: "Sự cố",      value: form.issues.length.toString()                },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-white rounded-xl px-3 py-2 flex justify-between">
                      <span className="text-[#9CA3AF]">{label}</span>
                      <span className="font-bold text-[#1A1A2E]">{value}</span>
                    </div>
                  ))}
                </div>
                <p className="text-[#9CA3AF] text-xs">Nhân viên: {user?.name ?? "—"}</p>
              </div>
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="px-6 py-4 border-t border-[#F4F7FF] flex items-center justify-between gap-3">
          <button
            onClick={() => setStep((s) => Math.max(1, s - 1) as 1 | 2 | 3 | 4)}
            disabled={step === 1}
            className="text-[#9CA3AF] hover:text-[#1A1A2E] text-sm font-semibold px-4 py-2.5 rounded-2xl hover:bg-[#F4F7FF] transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ← Quay lại
          </button>

          <div className="flex gap-2">
            {step < 4 ? (
              <button
                onClick={() => setStep((s) => Math.min(4, s + 1) as 1 | 2 | 3 | 4)}
                className="flex items-center gap-2 bg-[#17409A] hover:bg-[#1a3a8a] text-white text-sm font-bold px-5 py-2.5 rounded-2xl transition-colors cursor-pointer"
              >
                Tiếp theo →
              </button>
            ) : (
              <>
                <button
                  onClick={() => handleSubmit(true)}
                  className="flex items-center gap-2 bg-[#F4F7FF] hover:bg-[#EEF1FF] text-[#17409A] text-sm font-bold px-4 py-2.5 rounded-2xl transition-colors cursor-pointer"
                >
                  <MdSave className="text-base" /> Lưu nháp
                </button>
                <button
                  onClick={() => handleSubmit(false)}
                  className="flex items-center gap-2 bg-[#17409A] hover:bg-[#1a3a8a] text-white text-sm font-bold px-5 py-2.5 rounded-2xl transition-colors cursor-pointer"
                >
                  <MdSend className="text-base" /> Nộp báo cáo
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
