"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { MdTrendingUp, MdVisibility, MdInventory } from "react-icons/md";
import { formatPrice } from "@/utils/currency";
import { accessoryService } from "@/services/accessory.service";
import type { AccessoryResponse } from "@/types";

export default function AccessoriesTopStats() {
  const [topAccessories, setTopAccessories] = useState<AccessoryResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTop = async () => {
      try {
        const res = await accessoryService.getAll();
        if (res.isSuccess) {
          // Just take the first 3 for the stats section
          setTopAccessories(res.value.slice(0, 3));
        }
      } catch (err) {
        console.error("Accessories Stats fetch failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTop();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-[32px] p-6 border border-[#F4F7FF] animate-pulse h-full">
        <div className="h-6 w-32 bg-gray-100 rounded mb-8" />
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4">
              <div className="w-14 h-14 bg-gray-100 rounded-2xl" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-100 rounded w-3/4" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (topAccessories.length === 0) return null;

  return (
    <div className="bg-white rounded-[32px] p-6 border border-[#F4F7FF] h-full shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-[#9CA3AF] text-[10px] font-black tracking-[0.2em] uppercase mb-1">
            Tổng quan
          </p>
          <h2 className="text-[#1A1A2E] font-black text-lg font-fredoka">Phụ kiện nổi bật</h2>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-[#4ECDC415] text-[#4ECDC4] flex items-center justify-center">
          <MdInventory className="text-xl" />
        </div>
      </div>

      <div className="space-y-6">
        {topAccessories.map((a, i) => (
          <div
            key={a.accessoryId}
            className="flex items-center gap-4 group cursor-pointer"
          >
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-[#F4F7FF] flex items-center justify-center overflow-hidden border border-[#F4F7FF] group-hover:border-[#17409A]/50 transition-colors shadow-inner">
                <Image
                  src={a.imageUrl || "/accessory_placeholder.png"}
                  alt={a.name}
                  width={56}
                  height={56}
                  className="object-contain group-hover:scale-110 transition-transform duration-300 p-2"
                />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-[#1A1A2E] font-black text-sm truncate mb-1">
                {a.name}
              </p>
              <div className="flex items-center gap-3">
                <p className="text-[#17409A] font-black text-xs">
                  {formatPrice(a.targetPrice)}
                </p>
                <div className="w-1 h-1 rounded-full bg-[#E5E7EB]" />
                <p className="text-[#9CA3AF] text-[10px] font-bold">
                  {a.available} có sẵn
                </p>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1">
              <div className={`text-[10px] font-black px-2 py-0.5 rounded-full ${a.isActive ? "bg-emerald-50 text-emerald-600" : "bg-gray-50 text-gray-400"}`}>
                {a.isActive ? "ACTIVE" : "DRAFT"}
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-8 py-3.5 rounded-2xl text-[10px] font-black text-[#6B7280] bg-[#F4F7FF] hover:bg-[#17409A] hover:text-white transition-all uppercase tracking-widest shadow-sm">
        Xem báo cáo chi tiết
      </button>
    </div>
  );
}
