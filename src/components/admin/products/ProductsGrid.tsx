"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/utils/currency";
import { useDebounce } from "@/hooks";
import {
  MdSearch,
  MdAdd,
  MdEdit,
  MdRemoveRedEye,
  MdDelete,
  MdStar,
  MdRefresh,
} from "react-icons/md";
import { type ProductAdminStatus } from "@/data/admin";
import { useAdminProductsApi } from "@/hooks/useAdminProductsApi";
import { useToast } from "@/contexts/ToastContext";
import DataTable from "@/components/admin/common/DataTable";
import ConfirmDialog from "@/components/admin/common/ConfirmDialog";

export default function ProductsGrid() {
  const router = useRouter();
  const [statusFilter, setStatus] = useState<ProductAdminStatus | "all">("all");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 350);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data, loading, fetchProducts, deleteProduct } = useAdminProductsApi();
  const { success, error: toastError } = useToast();

  const handleRefresh = useCallback(() => {
    fetchProducts({ pageIndex: 1, pageSize: 100 });
  }, [fetchProducts]);

  useEffect(() => {
    handleRefresh();
  }, [handleRefresh]);

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    const ok = await deleteProduct(deletingId);
    if (ok) {
      success("Đã xóa sản phẩm thành công!");
      handleRefresh();
    } else {
      toastError("Không thể xóa sản phẩm này.");
    }
    setDeletingId(null);
  };

  const filtered = useMemo(() => {
    if (!data?.items) return [];
    return data.items
      .map(p => ({ ...p, id: p.productId }))
      .filter((p) => {
        const statusMatch = statusFilter === "all" || (statusFilter === "active" ? p.isActive : !p.isActive);
        const searchMatch = !debouncedSearch || p.name.toLowerCase().includes(debouncedSearch.toLowerCase()) || p.sku?.toLowerCase().includes(debouncedSearch.toLowerCase());
        return statusMatch && searchMatch;
      });
  }, [data, statusFilter, debouncedSearch]);

  return (
    <div className="space-y-6">
      {/* Search & Actions */}
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
        <div className="flex items-center gap-2 p-1.5 bg-white rounded-2xl shadow-sm border border-white/50">
          {[
            { id: "all", label: "Tất cả" },
            { id: "active", label: "Đang bán" },
            { id: "draft", label: "Bản nháp" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatus(tab.id as any)}
              className={`px-5 py-2.5 rounded-xl text-[13px] font-black transition-all ${
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
            <MdSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-2xl group-focus-within:text-[#17409A] transition-colors" />
            <input
              type="text"
              placeholder="Tìm sản phẩm..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-14 pr-6 py-3.5 bg-white border border-white/50 rounded-2xl shadow-sm text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#17409A]/20 transition-all placeholder:text-gray-300"
            />
          </div>
          <button
            onClick={() => router.push("/admin/products/add")}
            className="flex items-center gap-2 bg-[#17409A] text-white text-sm font-black px-8 py-3.5 rounded-2xl hover:bg-[#0E2A66] transition-all shadow-lg shadow-[#17409A]/20"
          >
            <MdAdd className="text-xl" /> Thêm mới
          </button>
        </div>
      </div>

      <DataTable
        data={filtered}
        isLoading={loading}
        columns={[
          {
            header: "Sản phẩm",
            accessor: (p) => (
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-[#F4F7FF] border border-white p-1.5 overflow-hidden shadow-sm shrink-0">
                  <img
                    src={p.imageUrl || "/teddy_bear.png"}
                    className="w-full h-full object-contain rounded-xl"
                    alt=""
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-base font-black text-[#1A1A2E] truncate mb-0.5">{p.name}</p>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{p.sku || "N/A"}</p>
                </div>
              </div>
            ),
          },
          {
            header: "Giá bán",
            accessor: (p) => <span className="font-black text-[#17409A] text-base">{formatPrice(p.price)}</span>,
          },
          {
            header: "Tồn kho",
            align: "center",
            accessor: (p) => (
              <span className={`text-sm font-black ${(p.onHand || 0) <= 10 ? "text-orange-500" : "text-gray-500"}`}>
                {p.onHand || 0}
              </span>
            ),
          },
          {
            header: "Trạng thái",
            align: "center",
            accessor: (p) => (
              <span className={`text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-wider ${
                p.isActive ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"
              }`}>
                {p.isActive ? "Đang bán" : "Bản nháp"}
              </span>
            ),
          },
          {
            header: "Đánh giá",
            align: "center",
            accessor: (p) => (
              <div className="flex items-center justify-center gap-1.5 text-[#FFB800] font-black text-sm">
                <MdStar className="text-lg" /> {p.averageRating?.toFixed(1) || "0"}
              </div>
            ),
          },
          {
            header: "Hành động",
            align: "right",
            accessor: (p) => (
              <div className="flex items-center justify-end gap-2.5">
                <button
                  onClick={() => router.push(`/admin/products/${p.id}`)}
                  className="p-2.5 rounded-2xl text-gray-400 hover:text-[#17409A] hover:bg-blue-50 transition-all border border-transparent hover:border-blue-100"
                  title="Xem chi tiết"
                >
                  <MdRemoveRedEye className="text-xl" />
                </button>
                <button
                  onClick={() => router.push(`/admin/products/${p.id}/edit`)}
                  className="p-2.5 rounded-2xl text-gray-400 hover:text-[#17409A] hover:bg-blue-50 transition-all border border-transparent hover:border-blue-100"
                  title="Sửa"
                >
                  <MdEdit className="text-xl" />
                </button>
                <button
                  onClick={() => setDeletingId(p.id as string)}
                  className="p-2.5 rounded-2xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all border border-transparent hover:border-red-100"
                  title="Xóa"
                >
                  <MdDelete className="text-xl" />
                </button>
              </div>
            ),
          },
        ]}
      />

      <ConfirmDialog
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDeleteConfirm}
        title="Xác nhận xóa?"
        message="Bạn có chắc chắn muốn xóa sản phẩm này? Mọi dữ liệu liên quan sẽ bị gỡ bỏ."
        variant="danger"
      />
    </div>
  );
}
