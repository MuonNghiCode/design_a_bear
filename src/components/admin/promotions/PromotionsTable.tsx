"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  MdSearch,
  MdAdd,
  MdEdit,
  MdDelete,
  MdCheckCircle,
  MdError,
  MdSchedule,
  MdLocalOffer,
  MdCalendarToday,
} from "react-icons/md";
import { promotionService } from "@/services/promotion.service";
import { formatPrice } from "@/utils/currency";
import { useToast } from "@/contexts/ToastContext";
import { useDebounce } from "@/hooks";
import type { Promotion } from "@/types";
import DataTable from "@/components/admin/common/DataTable";
import Pagination from "@/components/admin/common/Pagination";
import ConfirmDialog from "@/components/admin/common/ConfirmDialog";

interface PromotionsTableProps {
  promotions: Promotion[];
  loading: boolean;
  onRefresh: () => void;
}

const TABS = [
  { id: "all", label: "Tất cả" },
  { id: "active", label: "Đang chạy" },
  { id: "scheduled", label: "Sắp diễn ra" },
  { id: "expired", label: "Hết hạn" },
];

export default function PromotionsTable({ promotions, loading, onRefresh }: PromotionsTableProps) {
  const router = useRouter();
  const [statusFilter, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 350);
  const [deleteTarget, setDeleteTarget] = useState<Promotion | null>(null);
  const { success, error: toastError } = useToast();

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const filtered = useMemo(() => {
    return promotions
      .map(p => ({ ...p, id: p.promotionId }))
      .filter((p) => {
        // Status filter logic
        const now = new Date();
        const start = p.startsAt ? new Date(p.startsAt) : null;
        const end = p.endsAt ? new Date(p.endsAt) : null;
        const isActive = p.isActive && (!end || now <= end) && (!start || now >= start);
        const isScheduled = p.isActive && start && now < start;
        const isExpired = end && now > end;

        if (statusFilter === "active" && !isActive) return false;
        if (statusFilter === "scheduled" && !isScheduled) return false;
        if (statusFilter === "expired" && !isExpired) return false;

        // Search logic
        if (debouncedSearch) {
          const q = debouncedSearch.toLowerCase();
          return p.code.toLowerCase().includes(q) || (p.description || "").toLowerCase().includes(q);
        }
        return true;
      });
  }, [promotions, statusFilter, debouncedSearch]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage]);

  useMemo(() => {
    setCurrentPage(1);
  }, [statusFilter, debouncedSearch]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await promotionService.deletePromotion(deleteTarget.promotionId);
      if (res.isSuccess) {
        success("Đã xóa mã giảm giá thành công");
        onRefresh();
      } else {
        toastError(res.error?.description || "Không thể xóa mã giảm giá");
      }
    } catch (e) {
      toastError("Lỗi hệ thống khi xóa");
    } finally {
      setDeleteTarget(null);
    }
  };

  const getStatusBadge = (p: Promotion) => {
    const now = new Date();
    const start = p.startsAt ? new Date(p.startsAt) : null;
    const end = p.endsAt ? new Date(p.endsAt) : null;

    if (!p.isActive) {
      return (
        <span className="text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider text-gray-400 bg-gray-100">
          Tạm dừng
        </span>
      );
    }
    if (end && now > end) {
      return (
        <span className="text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider text-[#FF6B9D] bg-[#FF6B9D15]">
          Hết hạn
        </span>
      );
    }
    if (start && now < start) {
      return (
        <span className="text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider text-[#FFB84D] bg-[#FFB84D15]">
          Sắp tới
        </span>
      );
    }
    return (
      <span className="text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider text-[#4ECDC4] bg-[#4ECDC415]">
        Đang chạy
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
        <div className="flex items-center gap-2 p-1.5 bg-white rounded-2xl shadow-sm border border-white/50 overflow-x-auto max-w-full no-scrollbar">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatus(tab.id)}
              className={`px-5 py-2.5 rounded-xl text-[13px] font-black transition-all uppercase tracking-wider whitespace-nowrap ${
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
              placeholder="Tìm mã giảm giá..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-14 pr-6 py-3.5 bg-white border border-white/50 rounded-2xl shadow-sm text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#17409A]/20 transition-all placeholder:text-gray-300 uppercase tracking-wide"
            />
          </div>
          <button
            onClick={() => router.push("/admin/promotions/add")}
            className="flex items-center gap-2 bg-[#17409A] text-white text-sm font-black px-8 py-3.5 rounded-2xl hover:bg-[#0E2A66] transition-all shadow-lg shadow-[#17409A]/20 uppercase tracking-widest"
          >
            <MdAdd className="text-xl" /> Tạo mã
          </button>
        </div>
      </div>

      <DataTable
        data={paginatedData}
        isLoading={loading}
        columns={[
          {
            header: "Mã giảm giá",
            accessor: (p) => (
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#F4F7FF] flex items-center justify-center text-[#17409A] shrink-0 border border-white shadow-sm">
                  <MdLocalOffer className="text-2xl" />
                </div>
                <div className="min-w-0">
                  <p className="text-[15px] font-black text-[#1A1A2E] truncate mb-0.5 tracking-tight group-hover:text-[#17409A] transition-colors uppercase">
                    {p.code}
                  </p>
                  <p className="text-[10px] font-bold text-gray-400 line-clamp-1 opacity-70">
                    {p.description || "Không có mô tả cho mã này"}
                  </p>
                </div>
              </div>
            ),
          },
          {
            header: "Loại ưu đãi",
            accessor: (p) => (
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-black text-[#17409A] uppercase tracking-wider">
                  {p.discountType === "PERCENTAGE" ? "Phần trăm" : p.discountType === "FIXED" ? "Cố định" : "Đồng giá"}
                </span>
                <span className="text-sm font-black text-[#1A1A2E]">
                  {p.discountType === "PERCENTAGE" ? `${p.value}%` : formatPrice(p.value)}
                </span>
              </div>
            ),
          },
          {
            header: "Hiệu lực",
            accessor: (p) => (
              <div className="flex flex-col gap-1 text-gray-500">
                <div className="flex items-center gap-1.5">
                  <MdCalendarToday className="text-[10px] opacity-30" />
                  <span className="text-[11px] font-black uppercase tracking-wider">
                    {p.startsAt ? new Date(p.startsAt).toLocaleDateString("vi-VN") : "—"} › {p.endsAt ? new Date(p.endsAt).toLocaleDateString("vi-VN") : "∞"}
                  </span>
                </div>
                <div className="w-full bg-gray-100 h-1 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#17409A] opacity-20"
                    style={{ width: p.maxUsageCount ? `${(p.usageCount / p.maxUsageCount) * 100}%` : "10%" }}
                  />
                </div>
              </div>
            ),
          },
          {
            header: "Lượt dùng",
            align: "center",
            accessor: (p) => (
              <div className="flex flex-col items-center">
                <span className="text-sm font-black text-[#1A1A2E]">{p.usageCount}</span>
                <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                  / {p.maxUsageCount || "∞"}
                </span>
              </div>
            ),
          },
          {
            header: "Trạng thái",
            align: "center",
            accessor: (p) => getStatusBadge(p),
          },
          {
            header: "Hành động",
            align: "right",
            accessor: (p) => (
              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => router.push(`/admin/promotions/${p.promotionId}`)}
                  className="p-2.5 rounded-2xl text-gray-400 hover:text-[#17409A] hover:bg-blue-50 transition-all border border-transparent hover:border-blue-100"
                  title="Sửa mã"
                >
                  <MdEdit className="text-xl" />
                </button>
                <button
                  onClick={() => setDeleteTarget(p)}
                  className="p-2.5 rounded-2xl text-red-300 hover:text-[#FF6B9D] hover:bg-red-50 transition-all border border-transparent hover:border-red-100"
                  title="Xóa mã"
                >
                  <MdDelete className="text-xl" />
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
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Xóa mã giảm giá?"
        message={`Bạn có chắc chắn muốn xóa mã "${deleteTarget?.code}"? Hành động này không thể hoàn tác.`}
        variant="danger"
      />
    </div>
  );
}
