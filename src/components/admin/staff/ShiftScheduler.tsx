"use client";

import { useState } from "react";
import { MdAdd, MdClose, MdChevronLeft, MdChevronRight } from "react-icons/md";
import { IoSunny, IoMoon } from "react-icons/io5";
import { BsSun } from "react-icons/bs";
import {
  SHIFT_ASSIGNMENTS,
  SHIFT_CFG,
  STAFF_MEMBERS,
  type ShiftType,
  type ShiftAssignment,
} from "@/data/staff";

// ── Week helpers ──────────────────────────────────────────────────────────────
function buildWeek(startDate: Date) {
  const today = new Date(2026, 2, 9);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return {
      date: `${dd}/${mm}/${yyyy}`,
      day: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"][d.getDay()],
      isToday: d.toDateString() === today.toDateString(),
    };
  });
}

const SHIFTS: ShiftType[] = ["morning", "afternoon", "evening"];

const SHIFT_ICON: Record<ShiftType, React.ReactNode> = {
  morning: <IoSunny style={{ color: "#FFD93D", fontSize: 18 }} />,
  afternoon: <BsSun style={{ color: "#FF8C42", fontSize: 16 }} />,
  evening: <IoMoon style={{ color: "#7C5CFC", fontSize: 16 }} />,
};

interface ModalSlot {
  date: string;
  shift: ShiftType;
}

// ── Assign modal ──────────────────────────────────────────────────────────────
function AssignModal({
  slot,
  existingIds,
  onClose,
  onAssign,
}: {
  slot: ModalSlot;
  existingIds: string[];
  onClose: () => void;
  onAssign: (staffId: string, note: string) => void;
}) {
  const [selectedId, setSelectedId] = useState("");
  const [note, setNote] = useState("");
  const cfg = SHIFT_CFG[slot.shift];
  const available = STAFF_MEMBERS.filter(
    (m) => m.active && !existingIds.includes(m.id),
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        <div
          className="px-6 py-5 flex items-start justify-between border-b-2"
          style={{
            backgroundColor: cfg.color + "20",
            borderColor: cfg.color + "40",
          }}
        >
          <div>
            <p className="text-[#9CA3AF] text-xs font-semibold uppercase tracking-widest mb-0.5">
              Phân ca làm việc
            </p>
            <div className="flex items-center gap-2">
              {SHIFT_ICON[slot.shift]}
              <p className="text-[#1A1A2E] font-black text-lg">{cfg.label}</p>
            </div>
            <p className="text-[#9CA3AF] text-xs mt-0.5">
              {slot.date.slice(0, 5)} · {cfg.time}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-black/8 hover:bg-black/12 flex items-center justify-center text-[#9CA3AF] cursor-pointer transition-colors shrink-0"
          >
            <MdClose className="text-lg" />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-5">
          {available.length === 0 ? (
            <p className="text-center text-[#9CA3AF] text-sm py-6">
              Toàn bộ nhân viên đã được phân vào ca này.
            </p>
          ) : (
            <>
              <div>
                <label className="text-[#1A1A2E] text-sm font-bold block mb-3">
                  Chọn nhân viên
                </label>
                <div className="flex flex-col gap-2.5">
                  {available.map((staff) => (
                    <button
                      key={staff.id}
                      onClick={() => setSelectedId(staff.id)}
                      className={`flex items-center gap-3 p-3.5 rounded-2xl border-2 transition-all cursor-pointer text-left ${
                        selectedId === staff.id
                          ? "border-[#17409A] bg-[#17409A]/5"
                          : "border-[#F4F7FF] bg-[#F4F7FF] hover:border-[#9CA3AF]/40"
                      }`}
                    >
                      <div
                        className="w-11 h-11 rounded-2xl flex items-center justify-center text-white font-black text-base shrink-0 shadow-sm"
                        style={{ backgroundColor: staff.color }}
                      >
                        {staff.initial}
                      </div>
                      <div className="flex-1">
                        <p className="font-black text-[#1A1A2E] text-sm leading-tight">
                          {staff.name}
                        </p>
                        <p className="text-[#9CA3AF] text-[10px] mt-0.5">
                          {staff.role === "full_time"
                            ? "Toàn thời gian"
                            : "Bán thời gian"}{" "}
                          · Ưa thích:{" "}
                          {staff.preferredShifts
                            .map((s) => SHIFT_CFG[s].label)
                            .join(", ")}
                        </p>
                      </div>
                      {selectedId === staff.id && (
                        <div className="w-5 h-5 rounded-full bg-[#17409A] flex items-center justify-center shrink-0">
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[#1A1A2E] text-sm font-bold block mb-1.5">
                  Ghi chú (tuỳ chọn)
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="VD: Ưu tiên đóng gói đơn khẩn…"
                  className="w-full bg-[#F4F7FF] rounded-2xl px-4 py-3 text-sm text-[#1A1A2E] placeholder-[#9CA3AF] outline-none focus:ring-2 focus:ring-[#17409A]/30 transition"
                />
              </div>

              <button
                disabled={!selectedId}
                onClick={() => {
                  onAssign(selectedId, note);
                  onClose();
                }}
                className="w-full py-3 rounded-2xl bg-[#17409A] hover:bg-[#1a3a8a] text-white font-bold text-sm transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-[#17409A]/20"
              >
                Xác nhận phân ca
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function ShiftScheduler() {
  const [assignments, setAssignments] =
    useState<ShiftAssignment[]>(SHIFT_ASSIGNMENTS);
  const [modalSlot, setModalSlot] = useState<ModalSlot | null>(null);
  const [weekOffset, setWeekOffset] = useState(0);

  const weekStart = new Date(2026, 2, 9);
  weekStart.setDate(weekStart.getDate() + weekOffset * 7);
  const WEEK = buildWeek(weekStart);
  const weekLabel = `${WEEK[0].date.slice(0, 5)} – ${WEEK[6].date.slice(0, 5)}/${WEEK[6].date.slice(6, 10)}`;

  function getSlot(date: string, shift: ShiftType) {
    return assignments.filter((a) => a.date === date && a.shift === shift);
  }

  function handleAssign(
    date: string,
    shift: ShiftType,
    staffId: string,
    note: string,
  ) {
    const staff = STAFF_MEMBERS.find((m) => m.id === staffId)!;
    setAssignments((prev) => [
      ...prev,
      {
        id: `SA-${Date.now()}`,
        staffId: staff.id,
        staffName: staff.name,
        staffInitial: staff.initial,
        staffColor: staff.color,
        date,
        shift,
        note: note || undefined,
      },
    ]);
  }

  function handleRemove(id: string) {
    setAssignments((prev) => prev.filter((a) => a.id !== id));
  }

  const weekTotal = WEEK.reduce(
    (s, d) => s + SHIFTS.reduce((ss, sh) => ss + getSlot(d.date, sh).length, 0),
    0,
  );
  const todayInfo = WEEK.find((d) => d.isToday);
  const todayTotal = todayInfo
    ? SHIFTS.reduce((s, sh) => s + getSlot(todayInfo.date, sh).length, 0)
    : 0;

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-[#F4F7FF] overflow-hidden">
      {/* ── Header ── */}
      <div className="px-6 py-5 border-b border-[#F4F7FF]">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="font-black text-[#1A1A2E] text-xl">Lịch phân ca</p>
            <p className="text-[#9CA3AF] text-sm mt-0.5">
              {weekLabel} · {weekTotal} lượt phân công
              {todayTotal > 0 ? ` · hôm nay ${todayTotal} ca` : ""}
            </p>
          </div>

          {/* Week navigator */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setWeekOffset((o) => o - 1)}
              className="w-9 h-9 rounded-2xl bg-[#F4F7FF] hover:bg-[#EEF1FF] text-[#9CA3AF] hover:text-[#17409A] flex items-center justify-center transition-colors cursor-pointer"
            >
              <MdChevronLeft className="text-xl" />
            </button>
            <span className="text-sm font-bold text-[#1A1A2E] min-w-37 text-center">
              {weekLabel}
            </span>
            <button
              onClick={() => setWeekOffset((o) => o + 1)}
              className="w-9 h-9 rounded-2xl bg-[#F4F7FF] hover:bg-[#EEF1FF] text-[#9CA3AF] hover:text-[#17409A] flex items-center justify-center transition-colors cursor-pointer"
            >
              <MdChevronRight className="text-xl" />
            </button>
          </div>

          {/* Staff legend */}
          <div className="flex items-center gap-3 flex-wrap">
            {STAFF_MEMBERS.filter((m) => m.active).map((m) => (
              <div key={m.id} className="flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-xl flex items-center justify-center text-white font-black text-xs"
                  style={{ backgroundColor: m.color }}
                >
                  {m.initial}
                </div>
                <span className="text-xs font-semibold text-[#6B7280]">
                  {m.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Calendar ── */}
      <div className="overflow-x-auto">
        <div style={{ minWidth: 900 }}>
          {/* Day header row */}
          <div
            className="grid border-b border-[#F4F7FF]"
            style={{ gridTemplateColumns: "168px repeat(7, 1fr)" }}
          >
            <div className="px-5 py-4 flex items-end">
              <span className="text-[9px] font-black text-[#C4CAD4] uppercase tracking-widest">
                Ca / Ngày
              </span>
            </div>
            {WEEK.map((d) => (
              <div
                key={d.date}
                className="py-4 flex flex-col items-center justify-center border-l border-[#F4F7FF] gap-0.5"
                style={{ backgroundColor: d.isToday ? "#17409A08" : undefined }}
              >
                <span
                  className="text-[10px] font-black uppercase tracking-widest"
                  style={{ color: d.isToday ? "#17409A" : "#9CA3AF" }}
                >
                  {d.day}
                </span>
                <span
                  className="text-xl font-black leading-none"
                  style={{ color: d.isToday ? "#17409A" : "#1A1A2E" }}
                >
                  {d.date.slice(0, 2)}
                </span>
                <span
                  className="text-[9px] font-semibold"
                  style={{ color: d.isToday ? "#17409A80" : "#D1D5DB" }}
                >
                  tháng {d.date.slice(3, 5)}
                </span>
                {d.isToday && (
                  <div className="w-6 h-1 bg-[#17409A] rounded-full mt-1" />
                )}
              </div>
            ))}
          </div>

          {/* Shift rows */}
          {SHIFTS.map((shift, idx) => {
            const cfg = SHIFT_CFG[shift];
            return (
              <div
                key={shift}
                className="grid"
                style={{
                  gridTemplateColumns: "168px repeat(7, 1fr)",
                  borderTop: idx > 0 ? "1px solid #F4F7FF" : undefined,
                }}
              >
                {/* Shift label */}
                <div
                  className="px-5 py-6 flex flex-col justify-start gap-1 border-r-2 bg-[#FAFAFA]"
                  style={{ borderRightColor: cfg.color }}
                >
                  <div className="flex items-center gap-2">
                    {SHIFT_ICON[shift]}
                    <span className="text-sm font-black text-[#1A1A2E]">
                      {cfg.label}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#9CA3AF] font-semibold leading-snug">
                    {cfg.time}
                  </span>
                  <span className="text-[9px] text-[#C4CAD4] mt-1.5">
                    {WEEK.reduce(
                      (s, d) => s + getSlot(d.date, shift).length,
                      0,
                    )}{" "}
                    lượt tuần này
                  </span>
                </div>

                {/* Day cells */}
                {WEEK.map((d) => {
                  const slotItems = getSlot(d.date, shift);
                  return (
                    <div
                      key={d.date}
                      className="px-3 py-3 border-l border-[#F4F7FF] flex flex-col gap-2"
                      style={{
                        minHeight: 160,
                        backgroundColor: d.isToday ? "#17409A04" : undefined,
                      }}
                    >
                      {/* Staff chips */}
                      {slotItems.map((a) => (
                        <div
                          key={a.id}
                          className="group flex items-center gap-2.5 rounded-2xl px-3 py-2.5 bg-white border border-[#E5E7EB] shadow-sm"
                        >
                          <div
                            className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-black text-sm shrink-0"
                            style={{ backgroundColor: a.staffColor }}
                          >
                            {a.staffInitial}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-black leading-tight truncate text-[#1A1A2E]">
                              {a.staffName.split(" ").slice(-2).join(" ")}
                            </p>
                            {a.note && (
                              <p className="text-[9px] text-[#9CA3AF] truncate leading-tight mt-0.5">
                                {a.note}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => handleRemove(a.id)}
                            className="opacity-0 group-hover:opacity-100 w-5 h-5 rounded-full bg-[#FF6B9D]/20 hover:bg-[#FF6B9D]/40 flex items-center justify-center transition-all cursor-pointer shrink-0"
                            title="Gỡ phân công"
                          >
                            <MdClose
                              style={{ fontSize: 10, color: "#FF6B9D" }}
                            />
                          </button>
                        </div>
                      ))}

                      {/* Add button */}
                      <button
                        onClick={() => setModalSlot({ date: d.date, shift })}
                        className="flex items-center justify-center gap-1.5 rounded-2xl border border-dashed border-[#D1D5DB] hover:border-[#17409A] text-[#C4CAD4] hover:text-[#17409A] hover:bg-[#F4F7FF] py-2.5 transition-all cursor-pointer mt-auto"
                      >
                        <MdAdd style={{ fontSize: 14 }} />
                        <span className="text-[10px] font-bold">Thêm</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Summary bar ── */}
      <div className="px-6 py-4 border-t border-[#F4F7FF] flex items-center gap-6 flex-wrap bg-[#FAFAFA]">
        {SHIFTS.map((shift) => {
          const cfg = SHIFT_CFG[shift];
          const total = WEEK.reduce(
            (s, d) => s + getSlot(d.date, shift).length,
            0,
          );
          const max = 7 * STAFF_MEMBERS.filter((m) => m.active).length;
          return (
            <div
              key={shift}
              className="flex items-center gap-3 flex-1 min-w-36"
            >
              {SHIFT_ICON[shift]}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-[#4B5563]">
                    {cfg.label}
                  </span>
                  <span className="text-[10px] text-[#9CA3AF]">
                    {total}/{max}
                  </span>
                </div>
                <div className="h-1.5 bg-[#E5E7EB] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#17409A] transition-all duration-500"
                    style={{
                      width: `${Math.min((total / max) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Assign modal */}
      {modalSlot && (
        <AssignModal
          slot={modalSlot}
          existingIds={getSlot(modalSlot.date, modalSlot.shift).map(
            (a) => a.staffId,
          )}
          onClose={() => setModalSlot(null)}
          onAssign={(staffId, note) =>
            handleAssign(modalSlot.date, modalSlot.shift, staffId, note)
          }
        />
      )}
    </div>
  );
}
