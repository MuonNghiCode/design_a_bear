"use client";

import { useState, useEffect } from "react";
import {
  MdClose,
  MdLockOutline,
  MdHistory,
  MdArrowForward,
} from "react-icons/md";
import { useToast } from "@/contexts/ToastContext";
import { inventoryService, locationService } from "@/services";
import type { Location } from "@/types";

interface Props {
  productId: string; // This will be AccessoryId if isAccessory is true
  variantId?: string | null;
  productName: string;
  actionType: "RESERVE" | "RELEASE";
  isAccessory?: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ReserveReleaseModal({
  productId,
  variantId,
  productName,
  actionType,
  isAccessory,
  onClose,
  onSuccess,
}: Props) {
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocationId, setSelectedLocationId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  const isReserve = actionType === "RESERVE";

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
    if (quantity <= 0) {
      toast.error("Vui lòng nhập số lượng hợp lệ");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = isReserve
        ? await inventoryService.reserveStock(
            isAccessory ? null : productId,
            variantId,
            isAccessory ? productId : null,
            quantity,
            selectedLocationId,
          )
        : await inventoryService.releaseReservation(
            isAccessory ? null : productId,
            variantId,
            isAccessory ? productId : null,
            quantity,
            selectedLocationId,
          );

      if (res.isSuccess) {
        toast.success(
          isReserve
            ? `Đã giữ hàng cho ${productName}`
            : `Đã giải phóng hàng cho ${productName}`,
        );
        onSuccess();
        onClose();
      } else {
        toast.error(
          res.error?.description ||
            (isReserve ? "Giữ hàng thất bại" : "Giải phóng hàng thất bại"),
        );
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
        <div
          className={`px-6 py-5 border-b border-gray-100 flex items-center justify-between ${isReserve ? "bg-orange-50/50" : "bg-blue-50/50"}`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${isReserve ? "bg-orange-100 text-orange-600" : "bg-blue-100 text-blue-600"}`}
            >
              {isReserve ? (
                <MdLockOutline className="text-xl" />
              ) : (
                <MdHistory className="text-xl" />
              )}
            </div>
            <div>
              <h2 className="text-lg font-black text-[#1A1A2E]">
                {isReserve ? "Giữ hàng" : "Hủy giữ hàng"}
              </h2>
              <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-tighter">
                {productName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl bg-white text-gray-400 hover:text-gray-600 transition-colors shadow-sm"
          >
            <MdClose className="text-xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-1.5">
            <label className="text-[11px] font-black text-[#6B7280] tracking-wider uppercase">
              Chọn kho xử lý
            </label>
            {isLoading ? (
              <div className="h-12 w-full bg-gray-50 animate-pulse rounded-xl" />
            ) : (
              <select
                value={selectedLocationId}
                onChange={(e) => setSelectedLocationId(e.target.value)}
                className="w-full bg-[#F4F7FF] text-sm font-bold text-[#1A1A2E] rounded-xl px-4 py-3 outline-none border-2 border-transparent focus:border-[#17409A]/20 transition-all appearance-none"
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
              Số lượng thao tác
            </label>
            <div className="relative">
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, Number(e.target.value)))
                }
                className="w-full bg-[#F4F7FF] text-sm font-bold text-[#1A1A2E] rounded-xl pl-12 pr-4 py-3 outline-none border-2 border-transparent focus:border-[#17409A]/20 transition-all font-mono"
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <MdArrowForward
                  className={`text-xl ${isReserve ? "text-orange-500" : "text-blue-500"}`}
                />
              </div>
            </div>
            <p className="text-[10px] font-semibold text-[#9CA3AF] italic">
              *{" "}
              {isReserve
                ? "Sẽ chuyển số lượng này từ 'Sẵn có' sang 'Đang giữ'."
                : "Sẽ chuyển số lượng này từ 'Đang giữ' về lại 'Sẵn có'."}
            </p>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || isLoading || !selectedLocationId}
              className={`w-full py-3.5 rounded-2xl text-sm font-black transition-all flex items-center justify-center gap-2 shadow-lg ${
                isReserve
                  ? "bg-orange-600 text-white shadow-orange-200 hover:bg-orange-700"
                  : "bg-blue-600 text-white shadow-blue-200 hover:bg-blue-700"
              } disabled:opacity-50 disabled:shadow-none`}
            >
              {isSubmitting ? (
                "Đang xử lý..."
              ) : (
                <>
                  {isReserve ? (
                    <MdLockOutline className="text-lg" />
                  ) : (
                    <MdHistory className="text-lg" />
                  )}
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
