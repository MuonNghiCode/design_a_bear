"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  MdSearch,
  MdRemoveRedEye,
  MdFileDownload,
  MdEmail,
  MdCalendarToday,
  MdShield,
  MdBlock,
  MdCheckCircle,
  MdAdd
} from "react-icons/md";
import { GiPawPrint } from "react-icons/gi";
import { userService } from "@/services/user.service";
import { useToast } from "@/contexts/ToastContext";
import { useDebounce } from "@/hooks";
import type { UserDetail } from "@/types";
import { formatDate } from "@/utils/date";
import DataTable from "@/components/admin/common/DataTable";
import Pagination from "@/components/admin/common/Pagination";
import ConfirmDialog from "@/components/admin/common/ConfirmDialog";

function UserAvatar({ user, size = "w-12 h-12" }: { user: UserDetail; size?: string }) {
  const [error, setError] = useState(false);
  const getInitial = (name: string) => name?.trim().charAt(0).toUpperCase() || "?";
  const AVATAR_COLORS = ["#17409A", "#7C5CFC", "#4ECDC4", "#FF8C42", "#FF6B9D", "#FFD93D"];
  const color = AVATAR_COLORS[user.userId.charCodeAt(0) % AVATAR_COLORS.length];

  if (user.avatarUrl && !error) {
    return (
      <div className={`${size} rounded-2xl overflow-hidden shrink-0 border border-white shadow-sm`}>
        <img 
          src={user.avatarUrl} 
          alt={user.fullName} 
          className="w-full h-full object-cover"
          onError={() => setError(true)}
        />
      </div>
    );
  }

  return (
    <div 
      className={`${size} rounded-2xl flex items-center justify-center text-white font-black text-lg shrink-0 border border-white shadow-sm`}
      style={{ backgroundColor: color }}
    >
      {getInitial(user.fullName)}
    </div>
  );
}

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

const TABS: { id: ApiUserStatus | "all"; label: string }[] = [
  { id: "all", label: "Tất cả" },
  { id: "Active", label: "Hoạt động" },
  { id: "Pending", label: "Chờ xác nhận" },
  { id: "Inactive", label: "Không HĐ" },
  { id: "Banned", label: "Đã khóa" },
];

export default function CustomersTable() {
  const router = useRouter();
  const [statusFilter, setStatus] = useState<ApiUserStatus | "all">("all");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 350);
  const [users, setUsers] = useState<UserDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [confirmTarget, setConfirmTarget] = useState<UserDetail | null>(null);
  const { success, error: toastError } = useToast();

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await userService.getUsers();
      if (res.isSuccess && res.value) {
        setUsers(res.value);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filtered = useMemo(
    () =>
      users
        .map(u => ({ ...u, id: u.userId }))
        .filter((u) => {
          if (statusFilter !== "all" && u.status !== statusFilter) return false;
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
    [users, statusFilter, debouncedSearch],
  );

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, debouncedSearch]);

  const handleBlockToggle = async () => {
    if (!confirmTarget) return;
    const user = confirmTarget;
    try {
      setProcessingId(user.userId);
      const isBlocked = user.status === "Banned";
      const res = isBlocked
        ? await userService.unblockUser(user.userId)
        : await userService.blockUser(user.userId);

      if (res.isSuccess) {
        const nextStatus = isBlocked ? "Active" : "Banned";
        success(isBlocked ? "Đã mở khóa thành công!" : "Đã khóa thành công!");
        setUsers((prev) =>
          prev.map((u) =>
            u.userId === user.userId ? { ...u, status: nextStatus } : u,
          ),
        );
      } else {
        toastError(res.error?.description || "Thao tác thất bại");
      }
    } catch (e) {
      console.error(e);
      toastError("Lỗi hệ thống");
    } finally {
      setProcessingId(null);
      setConfirmTarget(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search & Actions */}
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
        <div className="flex items-center gap-2 p-1.5 bg-white rounded-2xl shadow-sm border border-white/50">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatus(tab.id as any)}
              className={`px-5 py-2.5 rounded-xl text-[13px] font-black transition-all uppercase tracking-wider ${
                statusFilter === tab.id
                  ? "bg-[#17409A] text-white shadow-md"
                  : "text-gray-400 hover:text-[#17409A] hover:bg-gray-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-80 group">
            <MdSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-2xl group-focus-within:text-[#17409A] transition-colors pointer-events-none" />
            <input
              type="text"
              placeholder="Tìm khách hàng..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-14 pr-6 py-3.5 bg-white border border-white/50 rounded-2xl shadow-sm text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#17409A]/20 transition-all placeholder:text-gray-300 uppercase tracking-wide"
            />
          </div>
          <button
            onClick={() => router.push("/admin/customers/add")}
            className="flex items-center gap-2 bg-[#17409A] text-white text-sm font-black px-8 py-3.5 rounded-2xl hover:bg-[#0E2A66] transition-all shadow-lg shadow-[#17409A]/20 uppercase tracking-widest"
          >
            <MdAdd className="text-xl" /> Thêm mới
          </button>
        </div>
      </div>

      <DataTable
        data={paginatedData}
        isLoading={loading}
        columns={[
          {
            header: "Khách hàng",
            accessor: (u) => (
              <div className="flex items-center gap-4">
                <UserAvatar user={u} />
                <div className="min-w-0">
                  <p className="text-[15px] font-black text-[#1A1A2E] truncate mb-0.5 tracking-tight group-hover:text-[#17409A] transition-colors uppercase">
                    {u.fullName || "Chưa cập nhật"}
                  </p>
                  <p className="text-[10px] font-black text-[#17409A] opacity-40 uppercase tracking-widest font-mono">
                    ID: {u.userId.slice(0, 8)}
                  </p>
                </div>
              </div>
            ),
          },
          {
            header: "Email & Tài khoản",
            accessor: (u) => (
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-gray-500">
                  <MdEmail className="text-sm opacity-30" />
                  <span className="text-[12px] font-bold truncate max-w-[200px]">{u.email}</span>
                </div>
                <span className="text-[9px] font-black px-2 py-0.5 rounded-lg border border-gray-100 text-gray-400 uppercase tracking-widest">
                  {PROVIDER_CFG[u.provider]?.label || u.provider}
                </span>
              </div>
            ),
          },
          {
            header: "Trạng thái",
            align: "center",
            accessor: (u) => {
              const cfg = STATUS_CFG[u.status] || STATUS_CFG.Inactive;
              return (
                <span
                  className="text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-wider"
                  style={{ color: cfg.color, backgroundColor: cfg.bg }}
                >
                  {cfg.label}
                </span>
              );
            },
          },
          {
            header: "Ngày tham gia",
            align: "center",
            accessor: (u) => (
              <div className="flex flex-col items-center gap-1 text-gray-500">
                <div className="flex items-center gap-1.5">
                  <MdCalendarToday className="text-[10px] opacity-30" />
                  <span className="text-[11px] font-black uppercase tracking-wider">{formatDate(u.createdAt)}</span>
                </div>
              </div>
            ),
          },
          {
            header: "Hành động",
            align: "right",
            accessor: (u) => (
              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => router.push(`/admin/customers/${u.userId}`)}
                  className="p-2.5 rounded-2xl text-gray-400 hover:text-[#17409A] hover:bg-blue-50 transition-all border border-transparent hover:border-blue-100"
                  title="Xem hồ sơ"
                >
                  <MdRemoveRedEye className="text-xl" />
                </button>
                <button
                  disabled={processingId === u.userId}
                  onClick={() => setConfirmTarget(u)}
                  className={`p-2.5 rounded-2xl transition-all border border-transparent ${
                    u.status === "Banned"
                      ? "text-emerald-400 hover:text-emerald-600 hover:bg-emerald-50 hover:border-emerald-100"
                      : "text-red-300 hover:text-[#FF6B9D] hover:bg-red-50 hover:border-red-100"
                  }`}
                  title={u.status === "Banned" ? "Mở khóa" : "Khóa tài khoản"}
                >
                  {u.status === "Banned" ? <MdCheckCircle className="text-xl" /> : <MdBlock className="text-xl" />}
                </button>
              </div>
            ),
          },
        ]}
      />

      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        isLoading={loading}
      />

      <ConfirmDialog
        isOpen={!!confirmTarget}
        onClose={() => setConfirmTarget(null)}
        onConfirm={handleBlockToggle}
        title={confirmTarget?.status === "Banned" ? "Mở khóa thành viên?" : "Khóa thành viên?"}
        message={
          confirmTarget?.status === "Banned"
            ? `Bạn có chắc chắn muốn khôi phục quyền truy cập cho ${confirmTarget.fullName}?`
            : `Thành viên ${confirmTarget?.fullName} sẽ bị tạm đình chỉ hoạt động trên hệ thống.`
        }
        variant={confirmTarget?.status === "Banned" ? "info" : "danger"}
      />
    </div>
  );
}
