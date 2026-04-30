"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MdLockOutline, MdHistory, MdArrowBack, MdArrowForward } from "react-icons/md";
import { useToast } from "@/contexts/ToastContext";
import { inventoryService, locationService } from "@/services";
import type { Location } from "@/types";
import PageHeader from "@/components/admin/common/PageHeader";

function ReserveReleaseContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();

  const productId = searchParams.get("id");
  const identityId = searchParams.get("identityId");
  const productName = searchParams.get("name") || "Sản phẩm";
  const actionType = (searchParams.get("type") as "RESERVE" | "RELEASE") || "RESERVE";
  const isAccessory = searchParams.get("isAccessory") === "true";

  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocationId, setSelectedLocationId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const isReserve = actionType === "RESERVE";

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
    if (quantity <= 0) {
      toast.error("Vui lòng nhập số lượng hợp lệ");
      return;
    }

    setIsSubmitting(true);
    try {
      const targetId = identityId || productId!;
      const res = isReserve
        ? await inventoryService.reserveStock(targetId, isAccessory, quantity, selectedLocationId)
        : await inventoryService.releaseReservation(targetId, isAccessory, quantity, selectedLocationId);

      if (res.isSuccess) {
        toast.success(
          isReserve
            ? `Đã giữ hàng cho ${productName}`
            : `Đã giải phóng hàng cho ${productName}`,
        );
        router.push("/admin/inventory");
      } else {
        toast.error(res.error?.description || "Thao tác thất bại");
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
        title={isReserve ? "Tạm khóa kho hàng" : "Giải phóng kho hàng"}
        breadcrumbs={[
          { label: "Quản trị", href: "/admin" },
          { label: "Kho hàng", href: "/admin/inventory" },
          { label: isReserve ? "Tạm khóa" : "Giải phóng" },
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
        <div className={`mb-8 p-6 rounded-2xl border border-white flex items-center gap-4 ${isReserve ? "bg-orange-50/50" : "bg-blue-50/50"}`}>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white text-2xl shadow-lg ${isReserve ? "bg-orange-500 shadow-orange-200" : "bg-blue-500 shadow-blue-200"}`}>
            {isReserve ? <MdLockOutline /> : <MdHistory />}
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Đang thao tác cho</p>
            <h3 className="text-lg font-black text-[#1A1A2E]">{productName}</h3>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[11px] font-black text-[#6B7280] tracking-wider uppercase ml-1">
              Chọn kho xử lý
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
              Số lượng thao tác
            </label>
            <div className="relative">
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                className="w-full bg-[#F4F7FF] text-lg font-black text-[#1A1A2E] rounded-2xl pl-14 pr-6 py-4 outline-none border-2 border-transparent focus:border-[#17409A]/20 transition-all font-mono"
              />
              <div className="absolute left-5 top-1/2 -translate-y-1/2">
                <MdArrowForward className={`text-2xl ${isReserve ? "text-orange-500" : "text-blue-500"}`} />
              </div>
            </div>
            <p className="text-[11px] font-medium text-gray-400 italic ml-1">
              * {isReserve ? "Chuyển từ 'Khả dụng' sang 'Tạm khóa'." : "Chuyển từ 'Tạm khóa' về lại 'Khả dụng'."}
            </p>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting || isLoading || !selectedLocationId}
              className={`w-full py-5 rounded-2xl font-black transition-all flex items-center justify-center gap-3 shadow-xl ${
                isReserve
                  ? "bg-orange-600 text-white shadow-orange-200 hover:bg-orange-700"
                  : "bg-blue-600 text-white shadow-blue-200 hover:bg-blue-700"
              } disabled:opacity-50 disabled:shadow-none`}
            >
              {isSubmitting ? (
                "Đang xử lý..."
              ) : (
                <>
                  {isReserve ? <MdLockOutline className="text-xl" /> : <MdHistory className="text-xl" />}
                  Xác nhận {isReserve ? "tạm khóa kho" : "giải phóng kho"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ReserveReleasePage() {
  return (
    <Suspense fallback={<div className="p-8">Đang tải...</div>}>
      <ReserveReleaseContent />
    </Suspense>
  );
}
