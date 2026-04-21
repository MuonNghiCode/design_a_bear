"use client";

import { useState, useEffect } from "react";
import {
  MdClose,
  MdOutlineInventory,
  MdTrendingUp,
  MdTrendingDown,
} from "react-icons/md";
import { useToast } from "@/contexts/ToastContext";
import {
  inventoryService,
  locationService,
  accessoryService,
} from "@/services";
import type { Location } from "@/types";

interface Props {
  productId: string; // The parent ID
  identityId?: string | null; // The specific identifier
  productName: string;
  isAccessory: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AdjustStockModal({
  productId,
  identityId,
  productName,
  isAccessory,
  onClose,
  onSuccess,
}: Props) {
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocationId, setSelectedLocationId] = useState("");
  const [delta, setDelta] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
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
  }, [toast]);

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
        identityId || productId,
        isAccessory,
        delta,
        selectedLocationId,
      );
      if (res.isSuccess) {
        toast.success(`Đã điều chỉnh kho cho ${productName}`);
        onSuccess();
        onClose();
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-[#1A1A2E]">
              Điều chỉnh kho hàng
            </h2>
            <p className="text-xs font-bold text-[#6B7280]">{productName}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <MdClose className="text-xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-1.5">
            <label className="text-[11px] font-black text-[#6B7280] tracking-wider uppercase">
              Chọn kho hàng
            </label>
            {isLoading ? (
              <div className="h-12 w-full bg-gray-50 animate-pulse rounded-xl" />
            ) : (
              <select
                value={selectedLocationId}
                onChange={(e) => setSelectedLocationId(e.target.value)}
                className="w-full bg-[#F4F7FF] text-sm font-bold text-[#1A1A2E] rounded-xl px-4 py-3 outline-none border-2 border-transparent focus:border-[#17409A]/20 transition-all"
              >
                {locations.map((loc) => (
                  <option key={loc.locationId} value={loc.locationId}>
                    {loc.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-black text-[#6B7280] tracking-wider uppercase">
              Số lượng thay đổi
            </label>
            <div className="relative">
              <input
                type="number"
                value={delta}
                onChange={(e) => setDelta(Number(e.target.value))}
                placeholder="Vd: 50 để nhập thêm, -10 để xuất kho"
                className="w-full bg-[#F4F7FF] text-sm font-bold text-[#1A1A2E] rounded-xl pl-12 pr-4 py-3 outline-none border-2 border-transparent focus:border-[#17409A]/20 transition-all"
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                {delta >= 0 ? (
                  <MdTrendingUp className="text-xl text-green-500" />
                ) : (
                  <MdTrendingDown className="text-xl text-red-500" />
                )}
              </div>
            </div>
            <p className="text-[10px] font-medium text-[#9CA3AF] italic">
              * Nhập số dương để tăng tồn thực tế (OnHand), số âm để giảm.
            </p>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || isLoading || !selectedLocationId}
              className="w-full bg-[#17409A] text-white py-3.5 rounded-2xl text-sm font-black shadow-lg shadow-[#17409A]/20 hover:bg-[#0E2A66] transition-all disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                "Đang xử lý..."
              ) : (
                <>
                  <MdOutlineInventory className="text-lg" />
                  Xác nhận điều chỉnh
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
