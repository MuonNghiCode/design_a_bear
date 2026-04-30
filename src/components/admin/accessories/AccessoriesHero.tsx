"use client";

import { useEffect, useState, useMemo } from "react";
import {
  MdShoppingBag,
  MdLayers,
  MdMoving,
  MdAutoGraph,
  MdInventory,
} from "react-icons/md";
import { accessoryService } from "@/services/accessory.service";
import type { AccessoryResponse } from "@/types";

function StatCard({
  icon: Icon,
  label,
  value,
  trend,
  color,
}: {
  icon: any;
  label: string;
  value: string;
  trend?: string;
  color: string;
}) {
  return (
    <div className="bg-white rounded-[32px] p-7 border border-[#F4F7FF] relative overflow-hidden group shadow-sm hover:shadow-md transition-all duration-300">
      <div
        className="absolute top-0 right-0 w-32 h-32 translate-x-8 -translate-y-8 rounded-full opacity-[0.03] group-hover:scale-125 transition-transform duration-500"
        style={{ backgroundColor: color }}
      />
      <div className="flex items-start justify-between mb-5">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner"
          style={{ backgroundColor: color + "15", color }}
        >
          <Icon className="text-2xl" />
        </div>
        {trend && (
          <div className="flex items-center gap-1.5 text-[11px] font-black text-[#4ECDC4] bg-[#4ECDC415] px-3 py-1.5 rounded-full border border-[#4ECDC4]/10">
            <MdMoving className="text-base" /> {trend}
          </div>
        )}
      </div>
      <div>
        <p className="text-[#9CA3AF] text-[11px] font-black tracking-[0.1em] uppercase mb-2">
          {label}
        </p>
        <p className="text-[#1A1A2E] text-3xl font-black leading-none font-fredoka">
          {value}
        </p>
      </div>
    </div>
  );
}

export default function AccessoriesHero() {
  const [accessories, setAccessories] = useState<AccessoryResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accRes = await accessoryService.getAll();
        if (accRes.isSuccess) setAccessories(accRes.value);
      } catch (err) {
        console.error("Failed to fetch accessory stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = useMemo(() => {
    return {
      totalCount: accessories.length,
      activeCount: accessories.filter(a => a.isActive).length,
      lowStock: accessories.filter(a => a.available <= 10).length,
      outOfStock: accessories.filter(a => a.available === 0).length,
    };
  }, [accessories]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 animate-pulse">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-40 bg-gray-100 rounded-[32px]" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      <StatCard
        icon={MdLayers}
        label="Tổng Phụ kiện"
        value={stats.totalCount.toString()}
        trend="+5%"
        color="#17409A"
      />
      <StatCard
        icon={MdShoppingBag}
        label="Đang hoạt động"
        value={stats.activeCount.toString()}
        color="#4ECDC4"
      />
      <StatCard
        icon={MdInventory}
        label="Sắp hết hàng"
        value={stats.lowStock.toString()}
        trend="-2%"
        color="#FF8C42"
      />
      <StatCard
        icon={MdAutoGraph}
        label="Hết hàng"
        value={stats.outOfStock.toString()}
        color="#FF6B9D"
      />
    </div>
  );
}
