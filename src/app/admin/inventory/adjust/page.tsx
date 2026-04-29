"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MdOutlineInventory, MdTrendingUp, MdTrendingDown, MdArrowBack } from "react-icons/md";
import { useToast } from "@/contexts/ToastContext";
import { inventoryService, locationService } from "@/services";
import type { Location } from "@/types";
import PageHeader from "@/components/admin/common/PageHeader";

function AdjustStockContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();

  const productId = searchParams.get("id");
  const identityId = searchParams.get("identityId");
  const productName = searchParams.get("name") || "Sản phẩm";
  const isAccessory = searchParams.get("isAccessory") === "true";

  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocationId, setSelectedLocationId] = useState("");
  const [delta, setDelta] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!productId) {
      router.replace("/admin/inventory");
      return;
    }

    const fetchLocations = async () => {
      try {
        const res = await locationService.getLocations();
        if (res.isSuccess && res.value) {
          setLocations(res.value);
          if (res.value.length > 0) {
            setSelectedLocationId(res.value[0].locationId);
          }
        }
      } catch (err) {
        toast.error("Không thể tải danh sách kho hàng");
      } finally {
        setIsLoading(false);
      }
    };
    fetchLocations();
  }, [productId, router, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLocationId) {
      toast.error("Vui lòng chọn kho hàng");
      return;
    }
    if (delta === 0) {
      toast.error("Vui lòng nhập số lượng thay đổi khác 0");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await inventoryService.adjustStock(
        identityId || productId!,
        isAccessory,
        delta,
        selectedLocationId,
      );
      if (res.isSuccess) {
        toast.success(`Đã điều chỉnh kho cho ${productName}`);
        router.push("/admin/inventory");
      } else {
        toast.error(res.error?.description || "Điều chỉnh kho thất bại");
      }
    } catch (err) {
      toast.error("Đã có lỗi xảy ra");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader
        title="Điều chỉnh kho hàng"
        breadcrumbs={[
          { label: "Quản trị", href: "/admin" },
          { label: "Kho hàng", href: "/admin/inventory" },
          { label: "Điều chỉnh" },
        ]}
        actions={
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 text-gray-600 font-black text-xs hover:bg-gray-200 transition-all"
          >
            <MdArrowBack /> Quay lại
          </button>
        }
      />

      <div className="bg-white rounded-[32px] shadow-sm border border-white/50 p-8">
        <div className="mb-8 p-6 bg-[#F4F7FF] rounded-2xl border border-white flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#17409A] flex items-center justify-center text-white text-2xl shadow-lg">
            <MdOutlineInventory />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Đang điều chỉnh cho</p>
            <h3 className="text-lg font-black text-[#1A1A2E]">{productName}</h3>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[11px] font-black text-[#6B7280] tracking-wider uppercase ml-1">
              Chọn kho hàng xử lý
            </label>
            {isLoading ? (
              <div className="h-14 w-full bg-gray-50 animate-pulse rounded-2xl" />
            ) : (
              <select
                value={selectedLocationId}
                onChange={(e) => setSelectedLocationId(e.target.value)}
                className="w-full bg-[#F4F7FF] text-sm font-bold text-[#1A1A2E] rounded-2xl px-6 py-4 outline-none border-2 border-transparent focus:border-[#17409A]/20 transition-all appearance-none cursor-pointer"
              >
                {locations.map((loc) => (
                  <option key={loc.locationId} value={loc.locationId}>
                    {loc.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-black text-[#6B7280] tracking-wider uppercase ml-1">
              Số lượng thay đổi (Delta)
            </label>
            <div className="relative">
              <input
                type="number"
                value={delta}
                onChange={(e) => setDelta(Number(e.target.value))}
                placeholder="Vd: 50 để nhập thêm, -10 để xuất kho"
                className="w-full bg-[#F4F7FF] text-lg font-black text-[#1A1A2E] rounded-2xl pl-14 pr-6 py-4 outline-none border-2 border-transparent focus:border-[#17409A]/20 transition-all"
              />
              <div className="absolute left-5 top-1/2 -translate-y-1/2">
                {delta >= 0 ? (
                  <MdTrendingUp className="text-2xl text-green-500" />
                ) : (
                  <MdTrendingDown className="text-2xl text-red-500" />
                )}
              </div>
            </div>
            <p className="text-[11px] font-medium text-gray-400 italic ml-1">
              * Nhập số dương để tăng tồn thực tế, số âm để giảm.
            </p>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting || isLoading || !selectedLocationId}
              className="w-full bg-[#17409A] text-white py-5 rounded-2xl font-black shadow-xl shadow-[#17409A]/20 hover:bg-[#0E2A66] transition-all disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-3"
            >
              {isSubmitting ? (
                "Đang xử lý..."
              ) : (
                <>
                  <MdOutlineInventory className="text-xl" />
                  Xác nhận điều chỉnh kho
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdjustStockPage() {
  return (
    <Suspense fallback={<div className="p-8">Đang tải...</div>}>
      <AdjustStockContent />
    </Suspense>
  );
}
