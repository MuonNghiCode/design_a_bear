"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { MdClose, MdInfo, MdHistory, MdInventory2, MdAttachMoney } from "react-icons/md";
import { accessoryService } from "@/services/accessory.service";
import { formatPrice } from "@/utils/currency";
import { formatDate } from "@/utils/date";
import { useToast } from "@/contexts/ToastContext";
import type { AccessoryResponse } from "@/types";

interface Props {
  accessoryId: string;
  onClose: () => void;
}

export default function AccessoryDetailModal({ accessoryId, onClose }: Props) {
  const toast = useToast();
  const [accessory, setAccessory] = useState<AccessoryResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await accessoryService.getById(accessoryId);
        if (res.isSuccess) {
          setAccessory(res.value);
        } else {
          toast.error("Không thể tải thông tin phụ kiện");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [accessoryId, toast]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <div className="bg-white rounded-3xl p-12 animate-pulse">
          <div className="w-12 h-12 rounded-full border-4 border-t-[#17409A] border-gray-100 animate-spin mx-auto mb-4" />
          <p className="text-[#9CA3AF] font-bold text-sm">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!accessory) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-[#F4F7FF] rounded-[2rem] shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row animate-in fade-in zoom-in duration-300 max-h-[90vh]">
        
        {/* Left: Product Image */}
        <div className="md:w-2/5 bg-white p-8 flex flex-col items-center justify-center relative border-r border-[#F4F7FF]">
          <div className="relative w-full aspect-square bg-[#F4F7FF] rounded-3xl overflow-hidden flex items-center justify-center group">
            <Image
              src={accessory.imageUrl || "/accessory_placeholder.png"}
              alt={accessory.name}
              width={400}
              height={400}
              className="object-contain w-3/4 h-3/4 drop-shadow-2xl group-hover:scale-105 transition-transform duration-500"
            />
            {/* Status Badge */}
            <div className={`absolute top-4 right-4 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
              accessory.isActive ? "bg-[#4ECDC415] text-[#4ECDC4]" : "bg-[#9CA3AF15] text-[#9CA3AF]"
            }`}>
              {accessory.isActive ? "Đang hoạt động" : "Bản nháp"}
            </div>
          </div>
          <div className="mt-8 text-center">
            <p className="text-[#9CA3AF] text-[10px] font-black tracking-[0.2em] uppercase mb-1">SKU: {accessory.sku}</p>
            <h2 className="text-[#1A1A2E] text-2xl font-black leading-tight">{accessory.name}</h2>
          </div>
        </div>

        {/* Right: Details */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#17409A] text-white flex items-center justify-center">
                <MdInfo className="text-lg" />
              </div>
              <h3 className="text-[#1A1A2E] font-black text-lg">Thông tin chi tiết</h3>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white text-[#9CA3AF] hover:text-[#1A1A2E] shadow-sm transition-all border border-transparent hover:border-[#17409A]/10"
            >
              <MdClose className="text-2xl" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {/* Description */}
            <div className="bg-white p-5 rounded-3xl shadow-sm border border-white">
              <p className="text-[#9CA3AF] text-[10px] font-black uppercase tracking-wider mb-2">Mô tả sản phẩm</p>
              <p className="text-[#4B5563] text-sm font-medium leading-relaxed">
                {accessory.description || "Không có mô tả cho sản phẩm này."}
              </p>
            </div>

            {/* Price section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div className="bg-white p-5 rounded-3xl shadow-sm border border-white flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#4ECDC415] text-[#4ECDC4] flex items-center justify-center">
                    <MdAttachMoney className="text-2xl" />
                  </div>
                  <div>
                    <p className="text-[#9CA3AF] text-[10px] font-black uppercase leading-none mb-1">Giá bán niêm yết</p>
                    <p className="text-[#1A1A2E] text-xl font-black leading-none">{formatPrice(accessory.targetPrice)}</p>
                  </div>
               </div>
               <div className="bg-white p-5 rounded-3xl shadow-sm border border-white flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#7C5CFC15] text-[#7C5CFC] flex items-center justify-center">
                    <MdInventory2 className="text-2xl" />
                  </div>
                  <div>
                    <p className="text-[#9CA3AF] text-[10px] font-black uppercase leading-none mb-1">Tồn kho khả dụng</p>
                    <p className="text-[#1A1A2E] text-xl font-black leading-none">{accessory.available}</p>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 px-4 bg-[#F4F7FF] rounded-2xl border border-white/50">
                   <span className="text-[11px] font-bold text-[#6B7280]">Giá vốn</span>
                   <span className="text-sm font-black text-[#1A1A2E]">{formatPrice(accessory.baseCost)}</span>
                </div>
                <div className="flex items-center justify-between p-3 px-4 bg-[#F4F7FF] rounded-2xl border border-white/50">
                   <span className="text-[11px] font-bold text-[#6B7280]">Giá lắp ráp</span>
                   <span className="text-sm font-black text-[#1A1A2E]">{formatPrice(accessory.assemblyCost)}</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex flex-col p-4 bg-white rounded-3xl border border-[#F4F7FF]">
                   <div className="flex items-center gap-2 mb-3">
                      <MdHistory className="text-[#9CA3AF]" />
                      <span className="text-[10px] font-black uppercase text-[#9CA3AF]">Thời gian</span>
                   </div>
                   <div className="space-y-2">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="font-bold text-[#9CA3AF]">Khởi tạo</span>
                        <span className="font-black text-[#4B5563]">{accessory.createdAt ? formatDate(accessory.createdAt) : "N/A"}</span>
                      </div>
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="font-bold text-[#9CA3AF]">Cập nhật</span>
                        <span className="font-black text-[#4B5563]">{accessory.updatedAt ? formatDate(accessory.updatedAt) : "N/A"}</span>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
