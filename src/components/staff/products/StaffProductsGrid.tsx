"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/contexts/ToastContext";
import {
  MdSearch,
  MdStar,
  MdClose,
  MdAdd,
  MdRemove,
  MdRemoveRedEye
} from "react-icons/md";
import { type ProductAdminStatus } from "@/data/admin";
import DataTable from "@/components/admin/common/DataTable";
import Pagination from "@/components/admin/common/Pagination";
import { useDebounce } from "@/hooks";

export interface StaffProductView {
  id: string;
  name: string;
  imageUrl: string;
  badge?: string;
  badgeColor: string;
  category: "complete" | "bear" | "accessory";
  price: number;
  stock: number;
  sold: number;
  rating: number;
  status: ProductAdminStatus;
  popular: boolean;
}

type StatusFilter = "all" | "active" | "draft";

const STATUS_TABS: { id: StatusFilter; label: string }[] = [
  { id: "all", label: "Tất cả" },
  { id: "active", label: "Đang bán" },
  { id: "draft", label: "Bản nháp" },
];



interface StaffProductsGridProps {
  products: StaffProductView[];
  loading?: boolean;
  pageIndex: number;
  totalPages: number;
  totalCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  onChangePage: (page: number) => void;
}

export default function StaffProductsGrid({
  products: sourceProducts,
  loading = false,
  pageIndex,
  totalPages,
  totalCount,
  hasPreviousPage,
  hasNextPage,
  onChangePage,
}: StaffProductsGridProps) {
  const router = useRouter();
  const toast = useToast();
  const [products, setProducts] = useState<StaffProductView[]>(sourceProducts);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 350);

  useEffect(() => {
    setProducts(sourceProducts);
  }, [sourceProducts]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchStatus = statusFilter === "all" || p.status === statusFilter;
      const matchSearch = !debouncedSearch || p.name.toLowerCase().includes(debouncedSearch.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [products, statusFilter, debouncedSearch]);



  return (
    <div className="space-y-6">
      {/* Controls matching Admin ProductsGrid */}
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
        <div className="flex items-center gap-2 p-1.5 bg-white rounded-2xl shadow-sm border border-white/50 overflow-x-auto max-w-full no-scrollbar">
          {STATUS_TABS.map(({ id, label }) => {
            const active = statusFilter === id;
            return (
              <button
                key={id}
                onClick={() => setStatusFilter(id)}
                className={`px-5 py-2.5 rounded-xl text-[13px] font-black transition-all uppercase tracking-wider whitespace-nowrap ${
                  active
                    ? "bg-[#17409A] text-white shadow-md"
                    : "text-gray-400 hover:text-[#17409A] hover:bg-gray-50"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-80 group">
            <MdSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-2xl group-focus-within:text-[#17409A] transition-colors pointer-events-none" />
            <input
              type="text"
              placeholder="Tìm sản phẩm..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-14 pr-6 py-3.5 bg-white border border-white/50 rounded-2xl shadow-sm text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#17409A]/20 transition-all placeholder:text-gray-300 uppercase tracking-wide"
            />
          </div>
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
                  {p.badge && (
                    <span
                      className="text-[9px] font-black uppercase tracking-widest"
                      style={{ color: p.badgeColor }}
                    >
                      {p.badge}
                    </span>
                  )}
                </div>
              </div>
            ),
          },
          {
            header: "Giá bán",
            accessor: (p) => <span className="font-black text-[#17409A] text-base">{(p.price ?? 0).toLocaleString("vi-VN")}₫</span>,
          },
          {
            header: "Tồn kho",
            align: "center",
            accessor: (p) => (
              <span className={`text-sm font-black ${(p.stock || 0) <= 10 ? "text-orange-500" : "text-gray-500"}`}>
                {p.stock || 0}
              </span>
            ),
          },
          {
            header: "Trạng thái",
            align: "center",
            accessor: (p) => (
              <span className={`text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-wider whitespace-nowrap ${
                p.status === "active" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"
              }`}>
                {p.status === "active" ? "Đang bán" : "Bản nháp"}
              </span>
            ),
          },
          {
            header: "Đánh giá",
            align: "center",
            accessor: (p) => (
              <div className="flex items-center justify-center gap-1.5 text-[#FFB800] font-black text-sm">
                <MdStar className="text-lg" /> {p.rating?.toFixed(1) || "0"}
              </div>
            ),
          },
          {
            header: "Hành động",
            align: "right",
            accessor: (p) => (
              <div className="flex items-center justify-end gap-2.5">
                <button
                  onClick={() => router.push(`/staff/products/${p.id}`)}
                  className="p-2.5 rounded-2xl text-gray-400 hover:text-[#17409A] hover:bg-blue-50 transition-all border border-transparent hover:border-blue-100"
                  title="Xem chi tiết"
                >
                  <MdRemoveRedEye className="text-xl" />
                </button>
              </div>
            ),
          },
        ]}
      />

      <Pagination 
        currentPage={pageIndex}
        totalPages={totalPages}
        onPageChange={onChangePage}
        isLoading={loading}
      />


    </div>
  );
}
