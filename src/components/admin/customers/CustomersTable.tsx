"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  MdSearch,
  MdRemoveRedEye,
  MdFileDownload,
  MdEmail,
  MdClose,
  MdCalendarToday,
  MdAutorenew,
  MdPerson,
  MdShield,
} from "react-icons/md";
import { GiPawPrint } from "react-icons/gi";
import { MdBlock, MdCheckCircle } from "react-icons/md";
import { userService } from "@/services/user.service";
import { useToast } from "@/contexts/ToastContext";
import { useDebounce } from "@/hooks";
import type { UserDetail } from "@/types";

// ── Status config ──────────────────────────────────────
type ApiUserStatus = "Active" | "Pending" | "Inactive" | "Banned";

const STATUS_CFG: Record<string, { label: string; color: string; bg: string }> =
  {
    Active: { label: "Hoạt động", color: "#4ECDC4", bg: "#4ECDC418" },
    Pending: { label: "Chờ xác nhận", color: "#FF8C42", bg: "#FF8C4218" },
    Inactive: { label: "Không HĐ", color: "#9CA3AF", bg: "#9CA3AF18" },
    Banned: { label: "Đã khóa", color: "#FF6B9D", bg: "#FF6B9D18" },
  };

const PROVIDER_CFG: Record<string, { label: string; color: string }> = {
  Google: { label: "Google", color: "#EA4335" },
  Local: { label: "Email", color: "#17409A" },
};

const AVATAR_COLORS = [
  "#17409A",
  "#7C5CFC",
  "#4ECDC4",
  "#FF8C42",
  "#FF6B9D",
  "#FFD93D",
];

const TABS: { key: ApiUserStatus | "all"; label: string }[] = [
  { key: "all", label: "Tất cả" },
  { key: "Active", label: "Hoạt động" },
  { key: "Pending", label: "Chờ xác nhận" },
  { key: "Inactive", label: "Không HĐ" },
  { key: "Banned", label: "Đã khóa" },
];

const COL_HEADS = [
  "Người dùng",
  "Email",
  "Nhà cung cấp",
  "Trạng thái",
  "Ngày tạo",
  "",
];

// ── Component ────────────────────────────────────────
export default function CustomersTable() {
  const [tab, setTab] = useState<ApiUserStatus | "all">("all");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 350);
  const [selected, setSelected] = useState<UserDetail | null>(null);
  const [users, setUsers] = useState<UserDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [confirmTarget, setConfirmTarget] = useState<UserDetail | null>(null);
  const { success, error: toastError } = useToast();

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await userService.getUsers();
      if (res.isSuccess && res.value) {
        setUsers(res.value);
      } else {
        setError("Không thể tải danh sách người dùng.");
      }
    } catch (e) {
      console.error(e);
      setError("Lỗi mạng khi tải danh sách người dùng.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: users.length };
    users.forEach((u) => {
      c[u.status] = (c[u.status] ?? 0) + 1;
    });
    return c;
  }, [users]);

  const filtered = useMemo(
    () =>
      users.filter((u) => {
        if (tab !== "all" && u.status !== tab) return false;
        if (debouncedSearch) {
          const q = debouncedSearch.toLowerCase();
          return (
            u.fullName.toLowerCase().includes(q) ||
            u.email.toLowerCase().includes(q) ||
            u.userId.toLowerCase().includes(q)
          );
        }
        return true;
      }),
    [users, tab, debouncedSearch],
  );

  const getAvatarColor = (userId: string) =>
    AVATAR_COLORS[userId.charCodeAt(0) % AVATAR_COLORS.length];

  const getInitial = (fullName: string) =>
    fullName?.trim().charAt(0).toUpperCase() || "?";

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleBlockToggle = async (user: UserDetail) => {
    try {
      setProcessingId(user.userId);
      const isBlocked = user.status === "Banned";
      const res = isBlocked
        ? await userService.unblockUser(user.userId)
        : await userService.blockUser(user.userId);

      if (res.isSuccess) {
        const nextStatus = isBlocked ? "Active" : "Banned";
        success(
          isBlocked
            ? "Đã mở khóa người dùng thành công!"
            : "Đã khóa người dùng thành công!",
        );

        // Update local state immediately for instant feedback
        setUsers((prev) =>
          prev.map((u) =>
            u.userId === user.userId ? { ...u, status: nextStatus } : u,
          ),
        );

        if (selected?.userId === user.userId) {
          setSelected((prev) =>
            prev ? { ...prev, status: nextStatus } : null,
          );
        }
      } else {
        toastError(res.error?.description || "Thao tác thất bại");
      }
    } catch (e) {
      console.error(e);
      toastError("Lỗi khi thực hiện thao tác");
    } finally {
      setProcessingId(null);
      setConfirmTarget(null);
    }
  };

  const openDetail = (u: UserDetail) => {
    // Find the latest version of this user from our list to ensure correct status
    const latest = users.find((user) => user.userId === u.userId) || u;
    setSelected(latest);
  };

  return (
    <>
      <div className="bg-white rounded-3xl p-6">
        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div>
            <p className="text-[#9CA3AF] text-[10px] font-black tracking-[0.22em] uppercase mb-0.5">
              Danh sách
            </p>
            <p className="text-[#1A1A2E] font-black text-xl">
              Tất cả người dùng
              <span className="text-[#9CA3AF] font-semibold text-sm ml-2">
                ({loading ? "..." : filtered.length})
              </span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative">
              <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] text-base pointer-events-none" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm tên, email..."
                className="bg-[#F4F7FF] text-[#1A1A2E] text-sm font-semibold placeholder:text-[#9CA3AF] rounded-xl pl-9 pr-4 py-2.5 outline-none border-2 border-transparent focus:border-[#17409A]/20 transition-colors w-52"
              />
            </div>
            {/* Refresh */}
            <button
              onClick={fetchUsers}
              disabled={loading}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#F4F7FF] text-[#9CA3AF] hover:text-[#17409A] hover:bg-[#E8EEFF] transition-all disabled:opacity-50"
              title="Làm mới"
            >
              <MdAutorenew
                className={`text-base ${loading ? "animate-spin" : ""}`}
              />
            </button>
            {/* Export */}
            <button className="flex items-center gap-1.5 bg-[#17409A] text-white text-xs font-black px-4 py-2.5 rounded-xl hover:bg-[#0f2d70] transition-colors whitespace-nowrap">
              <MdFileDownload className="text-sm" />
              Xuất CSV
            </button>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="flex gap-1 mb-5 overflow-x-auto pb-1">
          {TABS.map(({ key, label }) => {
            const active = tab === key;
            return (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all duration-150 ${
                  active
                    ? "bg-[#17409A] text-white shadow-sm"
                    : "bg-[#F4F7FF] text-[#9CA3AF] hover:bg-[#E8EEFF] hover:text-[#17409A]"
                }`}
              >
                {label}
                <span
                  className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${
                    active
                      ? "bg-white/20 text-white"
                      : "bg-white text-[#9CA3AF]"
                  }`}
                >
                  {counts[key] ?? 0}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Body ── */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-[#9CA3AF]">
            <MdAutorenew
              className="animate-spin text-[#17409A]"
              style={{ fontSize: 40 }}
            />
            <p className="font-black text-sm">Đang tải dữ liệu...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-[#FF6B9D]">
            <GiPawPrint className="text-[#FFE8EF]" style={{ fontSize: 52 }} />
            <p className="font-black text-sm">{error}</p>
            <button
              onClick={fetchUsers}
              className="text-xs font-black text-[#17409A] bg-[#17409A]/8 px-4 py-2 rounded-xl hover:bg-[#17409A]/15 transition-colors"
            >
              Thử lại
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-[#9CA3AF]">
            <GiPawPrint className="text-[#E5E7EB]" style={{ fontSize: 52 }} />
            <p className="font-black text-sm">Không tìm thấy người dùng</p>
            <p className="text-xs font-semibold">
              Thử thay đổi bộ lọc hoặc từ khoá tìm kiếm
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-6">
            <table className="w-full min-w-175">
              <thead>
                <tr>
                  {COL_HEADS.map((h) => (
                    <th
                      key={h}
                      className="text-left text-[9px] font-black text-[#9CA3AF] tracking-[0.18em] uppercase px-6 pb-3 first:pl-6 last:pr-6"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((u, idx) => {
                  const sCfg = STATUS_CFG[u.status] ?? STATUS_CFG.Inactive;
                  const pCfg = PROVIDER_CFG[u.provider] ?? PROVIDER_CFG.Local;
                  const avatarColor = getAvatarColor(u.userId);
                  const isLast = idx === filtered.length - 1;

                  return (
                    <tr
                      key={u.userId}
                      className={`group hover:bg-[#F8FAFF] transition-colors duration-150 ${
                        !isLast ? "border-b border-[#F4F7FF]" : ""
                      }`}
                    >
                      {/* User */}
                      <td className="px-6 py-3.5 first:pl-6">
                        <div className="flex items-center gap-3">
                          {u.avatarUrl && !u.avatarUrl.startsWith("string") ? (
                            <div className="w-10 h-10 rounded-2xl overflow-hidden shrink-0 group-hover:scale-105 transition-transform duration-200">
                              <Image
                                src={u.avatarUrl}
                                alt={u.fullName}
                                width={40}
                                height={40}
                                className="object-cover w-full h-full"
                              />
                            </div>
                          ) : (
                            <div
                              className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-black text-sm shrink-0 group-hover:scale-105 transition-transform duration-200"
                              style={{ backgroundColor: avatarColor }}
                            >
                              {getInitial(u.fullName)}
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="text-[#1A1A2E] font-bold text-sm truncate">
                              {u.fullName || "Chưa cập nhật"}
                            </p>
                            <p className="text-[#9CA3AF] text-[10px] font-semibold truncate max-w-45">
                              {u.userId.slice(0, 8)}...
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-1.5 text-[#9CA3AF]">
                          <MdEmail className="text-xs shrink-0" />
                          <span className="text-[11px] font-semibold truncate max-w-40">
                            {u.email}
                          </span>
                        </div>
                      </td>

                      {/* Provider */}
                      <td className="px-6 py-3.5">
                        <span
                          className="text-[10px] font-black px-2.5 py-1 rounded-full"
                          style={{
                            color: pCfg.color,
                            backgroundColor: pCfg.color + "18",
                          }}
                        >
                          {pCfg.label}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-3.5">
                        <span
                          className="text-[10px] font-black px-2.5 py-1 rounded-full"
                          style={{
                            color: sCfg.color,
                            backgroundColor: sCfg.bg,
                          }}
                        >
                          {sCfg.label}
                        </span>
                      </td>

                      {/* Joined */}
                      <td className="px-6 py-3.5">
                        <p className="text-[#1A1A2E] font-bold text-xs">
                          {formatDate(u.createdAt)}
                        </p>
                      </td>

                      {/* Action */}
                      <td className="px-6 py-3.5 last:pr-6">
                        <div className="flex items-center gap-1 transition-opacity">
                          <button
                            className="w-8 h-8 rounded-xl flex items-center justify-center text-[#9CA3AF] hover:text-[#17409A] hover:bg-[#17409A]/8 transition-all duration-150"
                            title="Xem chi tiết"
                            onClick={() => openDetail(u)}
                          >
                            <MdRemoveRedEye className="text-base" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── User Detail Modal ── */}
      {selected &&
        (() => {
          const sCfg = STATUS_CFG[selected.status] ?? STATUS_CFG.Inactive;
          const pCfg = PROVIDER_CFG[selected.provider] ?? PROVIDER_CFG.Local;
          const avatarColor = getAvatarColor(selected.userId);

          return (
            <div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 flex items-center justify-center p-4"
              onClick={() => setSelected(null)}
            >
              <div
                className="bg-white rounded-3xl w-full max-w-md max-h-[88vh] flex flex-col overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200"
                onClick={(e) => e.stopPropagation()}
              >
                {/* ── HERO ── */}
                <div
                  className="relative p-6 shrink-0"
                  style={{ backgroundColor: avatarColor }}
                >
                  <button
                    onClick={() => setSelected(null)}
                    className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
                  >
                    <MdClose className="text-base" />
                  </button>

                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    {selected.avatarUrl &&
                    !selected.avatarUrl.startsWith("string") ? (
                      <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 ring-4 ring-white/30">
                        <Image
                          src={selected.avatarUrl}
                          alt={selected.fullName}
                          width={64}
                          height={64}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-2xl bg-white/25 flex items-center justify-center text-white font-black text-2xl shrink-0">
                        {getInitial(selected.fullName)}
                      </div>
                    )}

                    <div className="min-w-0">
                      <p className="text-white font-black text-xl leading-tight">
                        {selected.fullName || "Chưa cập nhật"}
                      </p>
                      <p className="text-white/60 text-xs font-semibold mt-0.5 truncate">
                        {selected.email}
                      </p>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-white/20 text-white">
                          {sCfg.label}
                        </span>
                        <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-white/20 text-white">
                          {pCfg.label}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── BODY ── */}
                <div className="flex-1 overflow-y-auto p-6 space-y-5">
                  {/* Contact */}
                  <div>
                    <p className="text-[#9CA3AF] text-[9px] font-black uppercase tracking-[0.2em] mb-3">
                      Thông tin liên hệ
                    </p>
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-[#17409A]/8 flex items-center justify-center shrink-0">
                          <MdEmail className="text-[#17409A] text-sm" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[#9CA3AF] text-[9px] font-semibold">
                            Địa chỉ email
                          </p>
                          <p className="text-[#1A1A2E] text-xs font-bold truncate">
                            {selected.email}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-[#4ECDC4]/10 flex items-center justify-center shrink-0">
                          <MdPerson className="text-[#4ECDC4] text-sm" />
                        </div>
                        <div>
                          <p className="text-[#9CA3AF] text-[9px] font-semibold">
                            Nhà cung cấp
                          </p>
                          <p
                            className="text-xs font-bold"
                            style={{ color: pCfg.color }}
                          >
                            {selected.provider}
                          </p>
                        </div>
                      </div>

                      {selected.roleName && (
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-[#7C5CFC]/10 flex items-center justify-center shrink-0">
                            <MdShield className="text-[#7C5CFC] text-sm" />
                          </div>
                          <div>
                            <p className="text-[#9CA3AF] text-[9px] font-semibold">
                              Vai trò
                            </p>
                            <p className="text-[#1A1A2E] text-xs font-bold">
                              {selected.roleName}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Timeline */}
                  <div>
                    <p className="text-[#9CA3AF] text-[9px] font-black uppercase tracking-[0.2em] mb-3">
                      Thời gian
                    </p>
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-[#FF8C42]/10 flex items-center justify-center shrink-0">
                          <MdCalendarToday className="text-[#FF8C42] text-sm" />
                        </div>
                        <div>
                          <p className="text-[#9CA3AF] text-[9px] font-semibold">
                            Ngày đăng ký
                          </p>
                          <p className="text-[#1A1A2E] text-xs font-bold">
                            {formatDate(selected.createdAt)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-[#17409A]/8 flex items-center justify-center shrink-0">
                          <MdAutorenew className="text-[#17409A] text-sm" />
                        </div>
                        <div>
                          <p className="text-[#9CA3AF] text-[9px] font-semibold">
                            Cập nhật lần cuối
                          </p>
                          <p className="text-[#1A1A2E] text-xs font-bold">
                            {formatDate(selected.updatedAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* UUID */}
                  <div className="bg-[#F8F9FF] rounded-2xl p-3">
                    <p className="text-[#9CA3AF] text-[9px] font-black uppercase tracking-wide mb-1">
                      User ID
                    </p>
                    <p className="text-[#1A1A2E] text-[10px] font-mono font-semibold break-all">
                      {selected.userId}
                    </p>
                  </div>

                  {/* Actions in Modal */}
                  <div className="pt-2 border-t border-[#F4F7FF] flex gap-3">
                    <button
                      disabled={processingId === selected.userId}
                      onClick={() => setConfirmTarget(selected)}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-xs font-black transition-all ${
                        selected.status === "Banned"
                          ? "bg-[#4ECDC4] text-white hover:bg-[#3dbbb2] shadow-lg shadow-[#4ECDC4]/20"
                          : "bg-[#FF6B9D] text-white hover:bg-[#ff528a] shadow-lg shadow-[#FF6B9D]/20"
                      } disabled:opacity-50`}
                    >
                      {processingId === selected.userId ? (
                        <MdAutorenew className="text-base animate-spin" />
                      ) : selected.status === "Banned" ? (
                        <>
                          <MdCheckCircle className="text-base" />
                          Mở khóa người dùng
                        </>
                      ) : (
                        <>
                          <MdBlock className="text-base" />
                          Khóa người dùng
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

      {/* ── Confirmation Dialog ── */}
      {confirmTarget && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden p-6 text-center animate-in zoom-in duration-300">
            <div
              className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4 ${
                confirmTarget.status === "Banned"
                  ? "bg-[#4ECDC4]/15 text-[#4ECDC4]"
                  : "bg-[#FF6B9D]/15 text-[#FF6B9D]"
              }`}
            >
              {confirmTarget.status === "Banned" ? (
                <MdCheckCircle size={32} />
              ) : (
                <MdBlock size={32} />
              )}
            </div>
            <h3 className="text-xl font-black text-[#1A1A2E] mb-2">
              {confirmTarget.status === "Banned"
                ? "Mở khóa người dùng?"
                : "Khóa người dùng?"}
            </h3>
            <p className="text-sm font-semibold text-[#6B7280] mb-6">
              {confirmTarget.status === "Banned"
                ? `Bạn có chắc chắn muốn mở khóa cho tài khoản ${confirmTarget.fullName}?`
                : `Người dùng ${confirmTarget.fullName} sẽ không thể truy cập hệ thống sau khi bị khóa.`}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmTarget(null)}
                className="flex-1 py-3 rounded-2xl text-sm font-bold text-[#6B7280] bg-[#F4F7FF] hover:bg-[#E5E7EB] transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={() => handleBlockToggle(confirmTarget)}
                disabled={processingId === confirmTarget.userId}
                className={`flex-1 py-3 rounded-2xl text-sm font-bold text-white transition-all ${
                  confirmTarget.status === "Banned"
                    ? "bg-[#4ECDC4] hover:bg-[#3dbbb2]"
                    : "bg-[#FF6B9D] hover:bg-[#ff528a]"
                } disabled:opacity-50`}
              >
                {confirmTarget.status === "Banned"
                  ? "Mở khóa ngay"
                  : "Khóa ngay"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
