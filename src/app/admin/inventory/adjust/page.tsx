"use client";

import React, { useState, useEffect, Suspense, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  MdOutlineInventory, 
  MdTrendingUp, 
  MdTrendingDown, 
  MdArrowBack,
  MdCheck,
  MdSettingsBackupRestore,
  MdInfoOutline,
  MdAttachMoney,
  MdLayers,
  MdLockOutline,
  MdCheckCircleOutline
} from "react-icons/md";
import { useToast } from "@/contexts/ToastContext";
import { inventoryService, locationService, productService, accessoryService } from "@/services";
import type { Location, Product, AccessoryResponse, Inventory } from "@/types";
import { formatPrice } from "@/utils/currency";
import gsap from "gsap";

function AdjustStockContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { success, error: toastError } = useToast();
  const containerRef = useRef<HTMLDivElement>(null);

  const productId = searchParams.get("id");
  const identityId = searchParams.get("identityId");
  const isAccessory = searchParams.get("isAccessory") === "true";

  const [itemDetails, setItemDetails] = useState<any>(null);
  const [inventories, setInventories] = useState<Inventory[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocationId, setSelectedLocationId] = useState("");
  const [delta, setDelta] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Animation
  useEffect(() => {
    if (!containerRef.current || isLoading) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".ac", 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" }
      );
    }, containerRef);
    return () => ctx.revert();
  }, [isLoading]);

  useEffect(() => {
    if (!productId) {
      router.replace("/admin/inventory");
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [locRes, detailRes, invRes] = await Promise.all([
          locationService.getLocations(),
          isAccessory 
            ? accessoryService.getById(productId)
            : productService.getProductById(productId),
          isAccessory
            ? inventoryService.getByAccessoryId(productId)
            : inventoryService.getByProductId(productId)
        ]);

        if (locRes.isSuccess && locRes.value) {
          setLocations(locRes.value);
          if (locRes.value.length > 0) {
            setSelectedLocationId(locRes.value[0].locationId);
          }
        }

        if (detailRes.isSuccess && detailRes.value) {
          setItemDetails(detailRes.value);
        }

        if (invRes.isSuccess && invRes.value) {
          setInventories(invRes.value);
        }
      } catch (err) {
        toastError("Đã có lỗi xảy ra khi tải dữ liệu");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [productId, isAccessory, router, toastError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLocationId) {
      toastError("Vui lòng chọn kho hàng");
      return;
    }
    if (delta === 0) {
      toastError("Vui lòng nhập số lượng thay đổi khác 0");
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
        success(`Đã điều chỉnh kho cho ${itemDetails?.name || "sản phẩm"}`);
        router.push("/admin/inventory");
      } else {
        toastError(res.error?.description || "Điều chỉnh kho thất bại");
      }
    } catch (err) {
      toastError("Đã có lỗi xảy ra");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#17409A]"></div>
      </div>
    );
  }

  const currentPrice = isAccessory ? (itemDetails as AccessoryResponse)?.targetPrice : (itemDetails as Product)?.price;
  const currentSku = isAccessory ? (itemDetails as AccessoryResponse)?.sku : (itemDetails as Product)?.sku;
  const currentImage = isAccessory ? (itemDetails as AccessoryResponse)?.imageUrl : (itemDetails as Product)?.imageUrl;

  const totalOnHand = inventories.reduce((acc, curr) => acc + (curr.onHand || 0), 0);
  const totalReserved = inventories.reduce((acc, curr) => acc + (curr.reserved || 0), 0);
  const totalAvailable = inventories.reduce((acc, curr) => acc + (curr.totalAvailable || 0), 0);

  return (
    <div ref={containerRef} className="pb-20">
      {/* Sticky Header Action Bar */}
      <div className="sticky top-0 z-30 mb-8 -mx-4 px-4 py-4 bg-[#F8FAFC]/80 backdrop-blur-md border-b border-[#F1F5F9]">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="ac flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="w-10 h-10 rounded-xl bg-white border border-[#E2E8F0] flex items-center justify-center text-gray-500 hover:text-[#17409A] hover:border-[#17409A] transition-all"
            >
              <MdArrowBack className="text-xl" />
            </button>
            <div>
              <h1 className="text-xl font-black text-[#1A1A2E] leading-tight">Điều chỉnh kho</h1>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{itemDetails?.name}</p>
            </div>
          </div>
          <div className="ac flex items-center gap-3">
            <button
              onClick={() => setDelta(0)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white border border-[#E2E8F0] text-gray-500 font-black text-xs hover:bg-gray-50 transition-all"
            >
              <MdSettingsBackupRestore className="text-lg" /> Làm lại
            </button>
            <button
              onClick={(e) => handleSubmit(e as any)}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-8 py-2.5 rounded-xl bg-[#17409A] text-white font-black text-xs hover:bg-[#0E2A66] transition-all shadow-lg shadow-[#17409A]/20 disabled:opacity-50"
            >
              {isSubmitting ? "Đang xử lý..." : <><MdCheck className="text-lg" /> Xác nhận</>}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left column: Product Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="ac bg-white rounded-[32px] p-8 shadow-sm border border-[#F1F5F9] sticky top-24">
            <div className="relative w-full aspect-square rounded-[24px] bg-[#F8FAFC] border border-[#F1F5F9] p-4 mb-6 overflow-hidden group">
              <img 
                src={currentImage || "/teddy_bear.png"} 
                alt={itemDetails?.name}
                className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm border border-white flex items-center gap-1.5">
                <MdLayers className="text-[#17409A] text-sm" />
                <span className="text-[10px] font-black uppercase tracking-wider text-[#1A1A2E]">
                  {isAccessory ? "Phụ kiện" : "Sản phẩm"}
                </span>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">Định danh SKU</p>
                <h2 className="text-2xl font-black text-[#1A1A2E] leading-tight">{itemDetails?.name}</h2>
                <p className="text-sm font-bold text-[#17409A] mt-1">{currentSku || "N/A"}</p>
              </div>

              <div className="h-px bg-[#F8FAFC]" />

              {/* Stock Levels Preview */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-[#F4F7FF] rounded-2xl border border-white text-center">
                  <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Tồn thực</p>
                  <p className="text-base font-black text-[#1A1A2E]">{totalOnHand}</p>
                </div>
                <div className="p-3 bg-green-50/50 rounded-2xl border border-white text-center">
                  <p className="text-[9px] font-black text-green-600/50 uppercase mb-1">Khả dụng</p>
                  <p className="text-base font-black text-green-600">{totalAvailable}</p>
                </div>
                <div className="p-3 bg-orange-50/50 rounded-2xl border border-white text-center">
                  <p className="text-[9px] font-black text-orange-600/50 uppercase mb-1">Đang khóa</p>
                  <p className="text-base font-black text-orange-600">{totalReserved}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-[#F8FAFC] rounded-2xl border border-white">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                    <MdAttachMoney className="text-xs" /> Giá bán lẻ
                  </p>
                  <p className="text-sm font-black text-[#1A1A2E]">{formatPrice(currentPrice || 0)}</p>
                </div>
                <div className="p-4 bg-[#F8FAFC] rounded-2xl border border-white">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                    <MdInfoOutline className="text-xs" /> Tình trạng
                  </p>
                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-tighter ${
                    itemDetails?.isActive ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"
                  }`}>
                    {itemDetails?.isActive ? "Đang bán" : "Bản nháp"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Adjustment Form */}
        <div className="lg:col-span-3 space-y-8">
          <div className="ac bg-white rounded-[32px] shadow-sm border border-[#F1F5F9] overflow-hidden">
            <div className="p-8 border-b border-[#F8FAFC] bg-[#F8FAFC]/50">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white border border-[#E2E8F0] flex items-center justify-center text-[#17409A] text-2xl shadow-sm">
                  <MdOutlineInventory />
                </div>
                <div>
                  <h2 className="text-lg font-black text-[#1A1A2E]">Thông tin điều chỉnh</h2>
                  <p className="text-xs font-bold text-gray-400">Chọn kho hàng và nhập số lượng cần thay đổi</p>
                </div>
              </div>
            </div>

            <div className="p-8 space-y-8">
              {/* Location Selector */}
              <div className="space-y-3">
                <label className="text-[11px] font-black text-[#64748B] tracking-wider uppercase ml-1">
                  Kho hàng xử lý
                </label>
                <div className="relative group">
                  <select
                    value={selectedLocationId}
                    onChange={(e) => setSelectedLocationId(e.target.value)}
                    className="w-full bg-[#F8FAFC] text-sm font-black text-[#1A1A2E] rounded-2xl px-6 py-4 outline-none border-2 border-transparent focus:border-[#17409A]/20 transition-all appearance-none cursor-pointer"
                  >
                    {locations.map((loc) => (
                      <option key={loc.locationId} value={loc.locationId}>
                        {loc.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-focus-within:text-[#17409A]">
                    <MdTrendingDown className="text-xl rotate-[-90deg]" />
                  </div>
                </div>
              </div>

              {/* Delta Input */}
              <div className="space-y-3">
                <label className="text-[11px] font-black text-[#64748B] tracking-wider uppercase ml-1">
                  Số lượng thay đổi (Delta)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={delta || ""}
                    onChange={(e) => setDelta(Number(e.target.value))}
                    placeholder="Vd: 50 để nhập, -10 để xuất"
                    className="w-full bg-[#F8FAFC] text-2xl font-black text-[#1A1A2E] rounded-2xl pl-16 pr-8 py-5 outline-none border-2 border-transparent focus:border-[#17409A]/20 transition-all placeholder:text-gray-300"
                  />
                  <div className="absolute left-6 top-1/2 -translate-y-1/2">
                    {delta >= 0 ? (
                      <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-500">
                        <MdTrendingUp className="text-xl" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-500">
                        <MdTrendingDown className="text-xl" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 p-4 bg-blue-50/50 rounded-2xl border border-blue-100/30">
                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                  <p className="text-[11px] font-bold text-blue-600/80 leading-relaxed italic">
                    Gợi ý: Nhập số <span className="text-green-600 font-black">DƯƠNG</span> để nhập thêm hàng, số <span className="text-red-600 font-black">ÂM</span> để xuất kho thực tế.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Info Card */}
          <div className="ac bg-[#1A1A2E] rounded-[32px] p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full translate-x-10 -translate-y-10 blur-3xl" />
            <div className="relative z-10">
              <h3 className="text-base font-black mb-4 uppercase tracking-wider flex items-center gap-2">
                <div className="w-1.5 h-6 bg-[#4ECDC4] rounded-full" />
                Lưu ý quan trọng
              </h3>
              <ul className="space-y-4 text-xs font-medium text-white/70 leading-relaxed">
                <li className="flex gap-3">
                  <span className="text-[#4ECDC4] font-black">01.</span>
                  Dữ liệu tồn kho sẽ được cập nhật ngay lập tức sau khi xác nhận.
                </li>
                <li className="flex gap-3">
                  <span className="text-[#4ECDC4] font-black">02.</span>
                  Vui lòng kiểm tra kỹ mã kho hàng trước khi thực hiện giao dịch.
                </li>
                <li className="flex gap-3">
                  <span className="text-[#4ECDC4] font-black">03.</span>
                  Lịch sử điều chỉnh sẽ được lưu lại để phục vụ công tác đối soát.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdjustStockPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#17409A]"></div>
      </div>
    }>
      <AdjustStockContent />
    </Suspense>
  );
}
