"use client";

import { useState } from "react";
import {
  MdAdd,
  MdClose,
  MdEdit,
  MdDelete,
  MdCheck,
  MdPhone,
  MdEmail,
  MdBadge,
  MdKey,
  MdVisibility,
  MdVisibilityOff,
} from "react-icons/md";
import {
  STAFF_MEMBERS,
  SHIFT_CFG,
  type StaffMember,
  type ShiftType,
  type StaffRole,
} from "@/data/staff";

// ── Constants ─────────────────────────────────────────────────────────────────
const AVATAR_COLORS = [
  "#7C5CFC",
  "#4ECDC4",
  "#FF6B9D",
  "#FF8C42",
  "#FFD93D",
  "#17409A",
];
const ALL_SHIFTS: ShiftType[] = ["morning", "afternoon", "evening"];

// ── Empty form ────────────────────────────────────────────────────────────────
function emptyForm() {
  return {
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "full_time" as StaffRole,
    preferredShifts: [] as ShiftType[],
    color: "#7C5CFC",
    joinedDate: new Date().toLocaleDateString("vi-VN"),
  };
}

// ── Toggle switch ─────────────────────────────────────────────────────────────
function Toggle({
  on,
  onChange,
}: {
  on: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!on)}
      className="relative w-11 h-6 rounded-full transition-colors duration-300 cursor-pointer shrink-0 focus:outline-none"
      style={{ backgroundColor: on ? "#22C55E" : "#D1D5DB" }}
    >
      <span
        className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300"
        style={{ transform: on ? "translateX(20px)" : "translateX(0)" }}
      />
    </button>
  );
}

// ── Create / Edit modal ───────────────────────────────────────────────────────
function StaffFormModal({
  mode,
  initial,
  onClose,
  onSave,
}: {
  mode: "create" | "edit";
  initial?: Partial<ReturnType<typeof emptyForm>>;
  onClose: () => void;
  onSave: (data: ReturnType<typeof emptyForm>) => void;
}) {
  const [form, setForm] = useState({ ...emptyForm(), ...initial });
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function setField<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => {
      const ne = { ...e };
      delete ne[k];
      return ne;
    });
  }

  function toggleShift(s: ShiftType) {
    setField(
      "preferredShifts",
      form.preferredShifts.includes(s)
        ? form.preferredShifts.filter((x) => x !== s)
        : [...form.preferredShifts, s],
    );
  }

  function autoInitial(name: string) {
    const parts = name.trim().split(/\s+/);
    return parts.length >= 2
      ? (parts[parts.length - 1][0]?.toUpperCase() ?? "")
      : (name[0]?.toUpperCase() ?? "");
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Vui lòng nhập họ tên";
    if (!form.email.trim()) e.email = "Vui lòng nhập email";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Email không hợp lệ";
    if (!form.phone.trim()) e.phone = "Vui lòng nhập số điện thoại";
    if (mode === "create") {
      if (!form.password) e.password = "Vui lòng nhập mật khẩu";
      else if (form.password.length < 6)
        e.password = "Mật khẩu tối thiểu 6 ký tự";
      if (form.password !== form.confirmPassword)
        e.confirmPassword = "Mật khẩu không khớp";
    }
    if (form.preferredShifts.length === 0)
      e.preferredShifts = "Chọn ít nhất 1 ca";
    return e;
  }

  function handleSubmit() {
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }
    onSave(form);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#F4F7FF] flex items-center justify-between shrink-0">
          <div>
            <p className="font-black text-[#1A1A2E] text-lg">
              {mode === "create" ? "Tạo tài khoản mới" : "Chỉnh sửa tài khoản"}
            </p>
            <p className="text-[#9CA3AF] text-xs mt-0.5">
              {mode === "create"
                ? "Điền thông tin để tạo tài khoản nhân viên"
                : "Cập nhật thông tin nhân viên"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-[#F4F7FF] hover:bg-[#EEF1FF] flex items-center justify-center text-[#9CA3AF] cursor-pointer transition-colors"
          >
            <MdClose className="text-lg" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-6 flex flex-col gap-5">
          {/* Avatar preview + color picker */}
          <div className="flex items-center gap-5">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg shrink-0"
              style={{ backgroundColor: form.color }}
            >
              {autoInitial(form.name) || "?"}
            </div>
            <div>
              <p className="text-[#1A1A2E] text-xs font-bold mb-2">
                Màu avatar
              </p>
              <div className="flex gap-2">
                {AVATAR_COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setField("color", c)}
                    className="w-7 h-7 rounded-xl transition-transform hover:scale-110 cursor-pointer border-2"
                    style={{
                      backgroundColor: c,
                      borderColor: form.color === c ? "#1A1A2E" : "transparent",
                      transform: form.color === c ? "scale(1.15)" : undefined,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="text-sm font-bold text-[#1A1A2E] block mb-1.5">
              Họ và tên *
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setField("name", e.target.value)}
              placeholder="VD: Nguyễn Thị Lan"
              className="w-full bg-[#F4F7FF] rounded-2xl px-4 py-3 text-sm text-[#1A1A2E] placeholder-[#9CA3AF] outline-none focus:ring-2 focus:ring-[#17409A]/30 transition"
            />
            {errors.name && (
              <p className="text-[#FF6B9D] text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email + Phone */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-bold text-[#1A1A2E] block mb-1.5">
                <MdEmail className="inline mr-1 text-[#9CA3AF]" />
                Email *
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setField("email", e.target.value)}
                placeholder="nhan.vien@email.com"
                className="w-full bg-[#F4F7FF] rounded-2xl px-4 py-3 text-sm text-[#1A1A2E] placeholder-[#9CA3AF] outline-none focus:ring-2 focus:ring-[#17409A]/30 transition"
              />
              {errors.email && (
                <p className="text-[#FF6B9D] text-xs mt-1">{errors.email}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-bold text-[#1A1A2E] block mb-1.5">
                <MdPhone className="inline mr-1 text-[#9CA3AF]" />
                Điện thoại *
              </label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setField("phone", e.target.value)}
                placeholder="0901 234 567"
                className="w-full bg-[#F4F7FF] rounded-2xl px-4 py-3 text-sm text-[#1A1A2E] placeholder-[#9CA3AF] outline-none focus:ring-2 focus:ring-[#17409A]/30 transition"
              />
              {errors.phone && (
                <p className="text-[#FF6B9D] text-xs mt-1">{errors.phone}</p>
              )}
            </div>
          </div>

          {/* Password (create mode only) */}
          {mode === "create" && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-bold text-[#1A1A2E] block mb-1.5">
                  <MdKey className="inline mr-1 text-[#9CA3AF]" />
                  Mật khẩu *
                </label>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => setField("password", e.target.value)}
                    placeholder="••••••"
                    className="w-full bg-[#F4F7FF] rounded-2xl px-4 py-3 pr-10 text-sm text-[#1A1A2E] placeholder-[#9CA3AF] outline-none focus:ring-2 focus:ring-[#17409A]/30 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#1A1A2E] cursor-pointer transition-colors"
                  >
                    {showPw ? <MdVisibilityOff /> : <MdVisibility />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-[#FF6B9D] text-xs mt-1">
                    {errors.password}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm font-bold text-[#1A1A2E] block mb-1.5">
                  Xác nhận mật khẩu *
                </label>
                <input
                  type={showPw ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={(e) => setField("confirmPassword", e.target.value)}
                  placeholder="••••••"
                  className="w-full bg-[#F4F7FF] rounded-2xl px-4 py-3 text-sm text-[#1A1A2E] placeholder-[#9CA3AF] outline-none focus:ring-2 focus:ring-[#17409A]/30 transition"
                />
                {errors.confirmPassword && (
                  <p className="text-[#FF6B9D] text-xs mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Role */}
          <div>
            <label className="text-sm font-bold text-[#1A1A2E] block mb-2">
              <MdBadge className="inline mr-1 text-[#9CA3AF]" />
              Loại hợp đồng *
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(["full_time", "part_time"] as StaffRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setField("role", r)}
                  className={`py-3 rounded-2xl text-sm font-bold transition-all cursor-pointer border-2 ${
                    form.role === r
                      ? "bg-[#17409A] border-[#17409A] text-white shadow-lg shadow-[#17409A]/20"
                      : "bg-[#F4F7FF] border-[#F4F7FF] text-[#6B7280] hover:border-[#17409A]/30"
                  }`}
                >
                  {r === "full_time" ? "Toàn thời gian" : "Bán thời gian"}
                </button>
              ))}
            </div>
          </div>

          {/* Preferred shifts */}
          <div>
            <label className="text-sm font-bold text-[#1A1A2E] block mb-2">
              Ca làm ưa thích *
            </label>
            <div className="flex gap-2">
              {ALL_SHIFTS.map((s) => {
                const cfg = SHIFT_CFG[s];
                const active = form.preferredShifts.includes(s);
                return (
                  <button
                    key={s}
                    onClick={() => toggleShift(s)}
                    className="flex-1 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer border-2"
                    style={{
                      borderColor: active ? cfg.color : "#F4F7FF",
                      backgroundColor: active ? cfg.color + "18" : "#F4F7FF",
                      color: active ? cfg.color : "#9CA3AF",
                    }}
                  >
                    {cfg.label}
                    <br />
                    <span className="font-normal text-[9px] opacity-70">
                      {cfg.time}
                    </span>
                  </button>
                );
              })}
            </div>
            {errors.preferredShifts && (
              <p className="text-[#FF6B9D] text-xs mt-1">
                {errors.preferredShifts}
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#F4F7FF] flex gap-3 shrink-0">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl bg-[#F4F7FF] hover:bg-[#EEF1FF] text-[#6B7280] font-bold text-sm transition-colors cursor-pointer"
          >
            Huỷ
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 py-3 rounded-2xl bg-[#17409A] hover:bg-[#1a3a8a] text-white font-bold text-sm transition-colors cursor-pointer shadow-lg shadow-[#17409A]/25"
          >
            {mode === "create" ? "Tạo tài khoản" : "Lưu thay đổi"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Staff card ────────────────────────────────────────────────────────────────
function StaffCard({
  member,
  onEdit,
  onToggleActive,
  onDeleteRequest,
}: {
  member: StaffMember;
  onEdit: (m: StaffMember) => void;
  onToggleActive: (id: string) => void;
  onDeleteRequest: (id: string) => void;
}) {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-[#F4F7FF] overflow-hidden flex flex-col transition-shadow hover:shadow-md">
      {/* Color top stripe */}
      <div className="h-2" style={{ backgroundColor: member.color }} />

      <div className="p-5 flex flex-col gap-4 flex-1">
        {/* Avatar + name + status row */}
        <div className="flex items-start gap-3">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-md shrink-0"
            style={{ backgroundColor: member.color }}
          >
            {member.initial}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-black text-[#1A1A2E] text-base leading-tight">
              {member.name}
            </p>
            <p className="text-[#9CA3AF] text-xs mt-0.5">{member.id}</p>
            <span
              className="inline-block mt-1.5 rounded-xl px-2.5 py-0.5 text-[10px] font-bold"
              style={{
                backgroundColor:
                  member.role === "full_time" ? "#17409A18" : "#7C5CFC18",
                color: member.role === "full_time" ? "#17409A" : "#7C5CFC",
              }}
            >
              {member.role === "full_time" ? "Toàn thời gian" : "Bán thời gian"}
            </span>
          </div>
          {/* Active toggle */}
          <div className="flex flex-col items-center gap-1 shrink-0">
            <Toggle
              on={member.active}
              onChange={() => onToggleActive(member.id)}
            />
            <span
              className="text-[9px] font-semibold"
              style={{ color: member.active ? "#22C55E" : "#9CA3AF" }}
            >
              {member.active ? "Hoạt động" : "Tạm nghỉ"}
            </span>
          </div>
        </div>

        {/* Contact info */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-xs text-[#6B7280]">
            <MdEmail className="text-[#9CA3AF] shrink-0" />
            <span className="truncate">{member.email}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#6B7280]">
            <MdPhone className="text-[#9CA3AF] shrink-0" />
            <span>{member.phone}</span>
          </div>
        </div>

        {/* Preferred shifts */}
        <div>
          <p className="text-[9px] font-black text-[#C4CAD4] uppercase tracking-widest mb-1.5">
            Ca ưa thích
          </p>
          <div className="flex gap-1.5 flex-wrap">
            {member.preferredShifts.map((s) => {
              const cfg = SHIFT_CFG[s];
              return (
                <span
                  key={s}
                  className="rounded-xl px-2.5 py-1 text-[10px] font-bold"
                  style={{
                    backgroundColor: cfg.color + "20",
                    color: cfg.color,
                  }}
                >
                  {cfg.label}
                </span>
              );
            })}
          </div>
        </div>

        {/* Joined date */}
        <p className="text-[10px] text-[#9CA3AF]">
          Tham gia:{" "}
          <span className="font-semibold text-[#6B7280]">
            {member.joinedDate}
          </span>
        </p>
      </div>

      {/* Action bar */}
      <div className="px-5 py-3 border-t border-[#F4F7FF] flex items-center gap-2">
        <button
          onClick={() => onEdit(member)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-2xl bg-[#F4F7FF] hover:bg-[#EEF1FF] text-[#6B7280] hover:text-[#17409A] transition-colors cursor-pointer text-xs font-bold"
        >
          <MdEdit className="text-sm" />
          Chỉnh sửa
        </button>
        <button
          onClick={() => onDeleteRequest(member.id)}
          className="w-9 h-9 rounded-2xl bg-[#FF6B9D]/10 hover:bg-[#FF6B9D]/20 text-[#FF6B9D] flex items-center justify-center cursor-pointer transition-colors shrink-0"
          title="Xoá tài khoản"
        >
          <MdDelete className="text-base" />
        </button>
      </div>
    </div>
  );
}

// ── Delete confirm inline ─────────────────────────────────────────────────────
function DeleteConfirmBanner({
  name,
  onConfirm,
  onCancel,
}: {
  name: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 flex flex-col items-center gap-5 text-center">
        <div className="w-14 h-14 rounded-2xl bg-[#FF6B9D]/12 flex items-center justify-center">
          <MdDelete className="text-3xl text-[#FF6B9D]" />
        </div>
        <div>
          <p className="font-black text-[#1A1A2E] text-lg">Xoá tài khoản?</p>
          <p className="text-[#9CA3AF] text-sm mt-1">
            Tài khoản của{" "}
            <span className="font-bold text-[#1A1A2E]">{name}</span> sẽ bị xoá
            vĩnh viễn. Hành động này không thể hoàn tác.
          </p>
        </div>
        <div className="flex gap-3 w-full">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-2xl bg-[#F4F7FF] hover:bg-[#EEF1FF] text-[#6B7280] font-bold text-sm cursor-pointer transition-colors"
          >
            Huỷ
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 rounded-2xl bg-[#FF6B9D] hover:bg-[#ff5090] text-white font-bold text-sm cursor-pointer transition-colors shadow-lg shadow-[#FF6B9D]/25"
          >
            Xoá
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function StaffAccountManager() {
  const [members, setMembers] = useState<StaffMember[]>(STAFF_MEMBERS);
  const [showCreate, setShowCreate] = useState(false);
  const [editingMember, setEditingMember] = useState<StaffMember | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filtered = members.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()),
  );

  const activeCount = members.filter((m) => m.active).length;
  const fullTimeCount = members.filter(
    (m) => m.role === "full_time" && m.active,
  ).length;
  const partTimeCount = members.filter(
    (m) => m.role === "part_time" && m.active,
  ).length;

  function handleCreate(form: ReturnType<typeof emptyForm>) {
    const nameParts = form.name.trim().split(/\s+/);
    const initial =
      nameParts.length >= 2
        ? nameParts[nameParts.length - 1][0].toUpperCase()
        : nameParts[0][0].toUpperCase();
    const newMember: StaffMember = {
      id: `S-${String(members.length + 1).padStart(3, "0")}`,
      name: form.name.trim(),
      initial,
      color: form.color,
      role: form.role,
      email: form.email.trim(),
      phone: form.phone.trim(),
      preferredShifts: form.preferredShifts,
      joinedDate: form.joinedDate,
      active: true,
    };
    setMembers((prev) => [...prev, newMember]);
  }

  function handleEdit(form: ReturnType<typeof emptyForm>) {
    if (!editingMember) return;
    const nameParts = form.name.trim().split(/\s+/);
    const initial =
      nameParts.length >= 2
        ? nameParts[nameParts.length - 1][0].toUpperCase()
        : nameParts[0][0].toUpperCase();
    setMembers((prev) =>
      prev.map((m) =>
        m.id === editingMember.id
          ? {
              ...m,
              name: form.name.trim(),
              initial,
              color: form.color,
              role: form.role,
              email: form.email.trim(),
              phone: form.phone.trim(),
              preferredShifts: form.preferredShifts,
            }
          : m,
      ),
    );
    setEditingMember(null);
  }

  function handleToggleActive(id: string) {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, active: !m.active } : m)),
    );
  }

  function handleDelete(id: string) {
    setMembers((prev) => prev.filter((m) => m.id !== id));
    setDeleteId(null);
  }

  return (
    <div className="flex flex-col gap-6">
      {/* ── Summary pills ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Tổng tài khoản", value: members.length, color: "#17409A" },
          { label: "Đang hoạt động", value: activeCount, color: "#22C55E" },
          { label: "Toàn thời gian", value: fullTimeCount, color: "#7C5CFC" },
          { label: "Bán thời gian", value: partTimeCount, color: "#FF8C42" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl px-5 py-4 border border-[#F4F7FF] shadow-sm flex items-center gap-3"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-sm shrink-0"
              style={{ backgroundColor: stat.color }}
            >
              {stat.value}
            </div>
            <p className="text-xs font-semibold text-[#6B7280]">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* ── Toolbar ── */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex-1 min-w-48 relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên hoặc email…"
            className="w-full bg-white border border-[#F4F7FF] rounded-2xl pl-4 pr-4 py-3 text-sm text-[#1A1A2E] placeholder-[#9CA3AF] outline-none focus:ring-2 focus:ring-[#17409A]/20 shadow-sm transition"
          />
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#17409A] hover:bg-[#1a3a8a] text-white font-bold text-sm transition-colors cursor-pointer shadow-lg shadow-[#17409A]/20 shrink-0"
        >
          <MdAdd className="text-lg" />
          Tạo tài khoản mới
        </button>
      </div>

      {/* ── Cards grid ── */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#F4F7FF] py-16 flex flex-col items-center gap-3 text-[#9CA3AF]">
          <MdBadge className="text-5xl opacity-30" />
          <p className="text-sm font-semibold">Không tìm thấy nhân viên nào</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((m) => (
            <StaffCard
              key={m.id}
              member={m}
              onEdit={(member) => setEditingMember(member)}
              onToggleActive={handleToggleActive}
              onDeleteRequest={(id) => setDeleteId(id)}
            />
          ))}
        </div>
      )}

      {/* Create modal */}
      {showCreate && (
        <StaffFormModal
          mode="create"
          onClose={() => setShowCreate(false)}
          onSave={handleCreate}
        />
      )}

      {/* Edit modal */}
      {editingMember && (
        <StaffFormModal
          mode="edit"
          initial={{
            name: editingMember.name,
            email: editingMember.email,
            phone: editingMember.phone,
            role: editingMember.role,
            preferredShifts: editingMember.preferredShifts,
            color: editingMember.color,
          }}
          onClose={() => setEditingMember(null)}
          onSave={handleEdit}
        />
      )}

      {/* Delete confirm */}
      {deleteId && (
        <DeleteConfirmBanner
          name={members.find((m) => m.id === deleteId)?.name ?? ""}
          onConfirm={() => handleDelete(deleteId)}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}
