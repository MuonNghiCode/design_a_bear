"use client";

import { useEffect, useState, useMemo } from "react";
import {
  MdOutlineInventory,
  MdLockOutline,
  MdCheckCircleOutline,
  MdWarningAmber,
  MdTrendingUp,
} from "react-icons/md";
import { productService, accessoryService, inventoryService } from "@/services";
import type { Inventory } from "@/types";

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
  trend?: { text: string; positive: boolean };
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
          <div className={`flex items-center gap-1.5 text-[11px] font-black px-3 py-1.5 rounded-full border ${
            trend.positive 
              ? "text-[#4ECDC4] bg-[#4ECDC415] border-[#4ECDC4]/10" 
              : "text-[#FF6B6B] bg-[#FF6B6B15] border-[#FF6B6B]/10"
          }`}>
            <MdTrendingUp className={`text-base ${!trend.positive && "rotate-180"}`} /> {trend.text}
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

export default function InventoryHero() {
  const [items, setItems] = useState<{ id: string; isAccessory: boolean }[]>([]);
  const [inventories, setInventories] = useState<Inventory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, accRes] = await Promise.all([
          productService.getProducts({ pageSize: 150 }),
          accessoryService.getAll()
        ]);

        let normalizedItems: { id: string; isAccessory: boolean }[] = [];
        if (prodRes.isSuccess && prodRes.value?.items) {
          normalizedItems = [...normalizedItems, ...prodRes.value.items.map(p => ({ id: p.productId, isAccessory: false }))];
        }
        if (accRes.isSuccess && accRes.value) {
          normalizedItems = [...normalizedItems, ...accRes.value.map(a => ({ id: a.accessoryId, isAccessory: true }))];
        }
        setItems(normalizedItems);

        const invPromises = normalizedItems.map(item => 
          item.isAccessory 
            ? inventoryService.getByAccessoryId(item.id)
            : inventoryService.getByProductId(item.id)
        );
        
        const invResponses = await Promise.all(invPromises);
        const allInvs = invResponses.flatMap(res => res.isSuccess && res.value ? res.value : []);
        setInventories(allInvs);
      } catch (err) {
        console.error("Failed to fetch inventory hero stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = useMemo(() => {
    const totalOnHand = inventories.reduce((acc, curr) => acc + (curr.onHand || 0), 0);
    const totalReserved = inventories.reduce((acc, curr) => acc + (curr.reserved || 0), 0);
    const totalAvailable = inventories.reduce((acc, curr) => acc + (curr.totalAvailable || 0), 0);
    const outOfStockCount = items.filter(item => {
      const itemInvs = inventories.filter(inv => 
        inv.identityId === item.id && inv.isAccessory === item.isAccessory
      );
      const available = itemInvs.reduce((acc, curr) => acc + (curr.totalAvailable || 0), 0);
      return available <= 0;
    }).length;

    return {
      totalOnHand,
      totalReserved,
      totalAvailable,
      outOfStockCount,
    };
  }, [inventories, items]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 animate-pulse h-full">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-full min-h-[140px] bg-white rounded-[32px] border border-[#F4F7FF]" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 h-full">
      <StatCard
        icon={MdOutlineInventory}
        label="Tổng Tồn Thực"
        value={stats.totalOnHand.toLocaleString()}
        color="#17409A"
        trend={{ text: "Ổn định", positive: true }}
      />
      <StatCard
        icon={MdCheckCircleOutline}
        label="Hàng Khả Dụng"
        value={stats.totalAvailable.toLocaleString()}
        color="#06D6A0"
        trend={{ text: "+5.2%", positive: true }}
      />
      <StatCard
        icon={MdLockOutline}
        label="Đang Tạm Khóa"
        value={stats.totalReserved.toLocaleString()}
        color="#FF8C42"
        trend={{ text: "-2.1%", positive: true }}
      />
      <StatCard
        icon={MdWarningAmber}
        label="Hết hàng"
        value={stats.outOfStockCount.toString()}
        color="#FF6B6B"
        trend={{ text: `${stats.outOfStockCount > 0 ? "Cần nhập" : "An toàn"}`, positive: stats.outOfStockCount === 0 }}
      />
    </div>
  );
}
