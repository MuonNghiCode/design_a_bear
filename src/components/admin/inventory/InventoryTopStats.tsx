"use client";

import { useEffect, useState, useMemo } from "react";
import {
  MdBarChart,
  MdOutlineInventory,
  MdLayers,
} from "react-icons/md";
import { productService, accessoryService, inventoryService } from "@/services";
import type { Inventory } from "@/types";

function StockLevelProgress({
  label,
  value,
  total,
  color,
}: {
  label: string;
  value: number;
  total: number;
  color: string;
}) {
  const percent = total > 0 ? (value / total) * 100 : 0;
  return (
    <div>
      <div className="flex justify-between items-end mb-2.5">
        <p className="text-[#1A1A2E] text-[10px] font-black uppercase tracking-wider">{label}</p>
        <p className="text-[#9CA3AF] text-[10px] font-bold">
          <span className="text-[#1A1A2E] font-black text-xs">{value}</span> / {total}
        </p>
      </div>
      <div className="h-1.5 bg-[#F4F7FF] rounded-full overflow-hidden shadow-inner">
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{ width: `${percent}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

export default function InventoryTopStats() {
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
        console.error("Failed to fetch inventory top stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = useMemo(() => {
    const outOfStockCount = items.filter(item => {
      const itemInvs = inventories.filter(inv => 
        inv.identityId === item.id && inv.isAccessory === item.isAccessory
      );
      const available = itemInvs.reduce((acc, curr) => acc + (curr.totalAvailable || 0), 0);
      return available <= 0;
    }).length;

    const lowStockCount = items.filter(item => {
      const itemInvs = inventories.filter(inv => 
        inv.identityId === item.id && inv.isAccessory === item.isAccessory
      );
      const available = itemInvs.reduce((acc, curr) => acc + (curr.totalAvailable || 0), 0);
      return available > 0 && available <= 10;
    }).length;

    const bearCount = items.filter(i => !i.isAccessory).length;
    const accCount = items.filter(i => i.isAccessory).length;

    return {
      outOfStockCount,
      lowStockCount,
      totalItems: items.length,
      bearCount,
      accCount
    };
  }, [inventories, items]);

  if (loading) {
    return <div className="h-full bg-white rounded-[32px] border border-[#F4F7FF] animate-pulse shadow-sm" />;
  }

  return (
    <div className="bg-white rounded-[32px] p-7 border border-[#F4F7FF] shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-[#1A1A2E] font-black text-base font-fredoka uppercase tracking-wider leading-none">Sức khỏe Kho</p>
          <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-widest mt-1.5">Phân bổ tồn kho</p>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-[#F4F7FF] flex items-center justify-center text-[#17409A]">
          <MdBarChart className="text-xl" />
        </div>
      </div>

      <div className="space-y-6 flex-1">
        <StockLevelProgress
          label="Hết hàng"
          value={stats.outOfStockCount}
          total={stats.totalItems}
          color="#FF6B6B"
        />
        <StockLevelProgress
          label="Sắp hết hàng"
          value={stats.lowStockCount}
          total={stats.totalItems}
          color="#FFD166"
        />
        <StockLevelProgress
          label="An toàn"
          value={stats.totalItems - stats.outOfStockCount - stats.lowStockCount}
          total={stats.totalItems}
          color="#06D6A0"
        />
        
        <div className="pt-6 border-t border-[#F4F7FF] mt-auto grid grid-cols-2 gap-4">
          <div className="p-3.5 bg-[#F4F7FF]/50 rounded-2xl border border-white/50">
            <div className="flex items-center gap-2 text-[#17409A] mb-1">
              <MdLayers className="text-sm" />
              <p className="text-[9px] font-black uppercase tracking-wider">Gấu bông</p>
            </div>
            <p className="text-base font-black text-[#1A1A2E]">{stats.bearCount}</p>
          </div>
          <div className="p-3.5 bg-[#F4F7FF]/50 rounded-2xl border border-white/50">
            <div className="flex items-center gap-2 text-purple-600 mb-1">
              <MdOutlineInventory className="text-sm" />
              <p className="text-[9px] font-black uppercase tracking-wider">Phụ kiện</p>
            </div>
            <p className="text-base font-black text-[#1A1A2E]">{stats.accCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
