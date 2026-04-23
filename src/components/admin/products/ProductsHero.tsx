"use client";

import { useEffect, useState, useMemo } from "react";
import { formatPrice } from "@/utils/currency";
import {
  MdShoppingBag,
  MdAttachMoney,
  MdLayers,
  MdMoving,
  MdAutoGraph,
} from "react-icons/md";
import { reportService } from "@/services/report.service";
import { productService } from "@/services/product.service";
import { accessoryService } from "@/services/accessory.service";
import type { RevenueReportData, ProductListItem, AccessoryResponse } from "@/types";

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
    <div className="bg-white rounded-3xl p-5 border border-[#F4F7FF] relative overflow-hidden group">
      <div
        className="absolute top-0 right-0 w-24 h-24 translate-x-8 -translate-y-8 rounded-full opacity-[0.03] group-hover:scale-125 transition-transform duration-500"
        style={{ backgroundColor: color }}
      />
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-10 h-10 rounded-2xl flex items-center justify-center"
          style={{ backgroundColor: color + "15", color }}
        >
          <Icon className="text-xl" />
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-[10px] font-black text-[#4ECDC4] bg-[#4ECDC415] px-2 py-1 rounded-full">
            <MdMoving className="text-sm" /> {trend}
          </div>
        )}
      </div>
      <div>
        <p className="text-[#9CA3AF] text-[10px] font-black tracking-[0.1em] uppercase mb-1">
          {label}
        </p>
        <p className="text-[#1A1A2E] text-2xl font-black leading-none font-fredoka">
          {value}
        </p>
      </div>
    </div>
  );
}

function CategoryProgress({
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
      <div className="flex justify-between items-end mb-2">
        <p className="text-[#1A1A2E] text-[10px] font-black">{label}</p>
        <p className="text-[#9CA3AF] text-[9px] font-bold">
          <span className="text-[#1A1A2E] font-black">{value}</span> / {total}
        </p>
      </div>
      <div className="h-1.5 bg-[#F4F7FF] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{ width: `${percent}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

export default function ProductsHero() {
  const [revenueData, setRevenueData] = useState<RevenueReportData | null>(null);
  const [bears, setBears] = useState<ProductListItem[]>([]);
  const [accessories, setAccessories] = useState<AccessoryResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        
        const [revRes, bearRes, accRes] = await Promise.all([
          reportService.getRevenueReport({
            startDate: startOfMonth.toISOString(),
            endDate: now.toISOString()
          }),
          productService.getProducts({ pageSize: 100, productType: "Standard" }),
          accessoryService.getAll()
        ]);

        if (revRes.isSuccess) setRevenueData(revRes.value);
        if (bearRes.isSuccess) setBears(bearRes.value.items);
        if (accRes.isSuccess) setAccessories(accRes.value);
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = useMemo(() => {
    const totalCount = bears.length + accessories.length;
    const activeBears = bears.filter(b => b.isActive).length;
    const activeAccs = accessories.filter(a => a.isActive).length;
    
    return {
      totalProducts: totalCount,
      activeCount: activeBears + activeAccs,
      lowStock: bears.filter(b => b.available <= 10).length + accessories.filter(a => a.available <= 10).length,
      revenue: revenueData?.totalRevenue || 0,
      bearCount: bears.length,
      accCount: accessories.length
    };
  }, [bears, accessories, revenueData]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 animate-pulse">
        <div className="lg:col-span-2 grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 bg-gray-100 rounded-3xl" />
          ))}
        </div>
        <div className="h-full bg-gray-100 rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      {/* Metrics */}
      <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard
          icon={MdShoppingBag}
          label="Tổng Sản phẩm"
          value={stats.totalProducts.toString()}
          trend="+12%"
          color="#17409A"
        />
        <StatCard
          icon={MdAttachMoney}
          label="Doanh thu tháng"
          value={formatPrice(stats.revenue)}
          trend="+8.5%"
          color="#4ECDC4"
        />
        <StatCard
          icon={MdLayers}
          label="Sản phẩm đang bán"
          value={stats.activeCount.toString()}
          color="#7C5CFC"
        />
        <StatCard
          icon={MdAutoGraph}
          label="Tỷ lệ chuyển đổi"
          value="3.2%"
          trend="+0.4%"
          color="#FF8C42"
        />
      </div>

      {/* Distribution */}
      <div className="bg-white rounded-3xl p-6 border border-[#F4F7FF]">
        <div className="flex items-center justify-between mb-8">
          <p className="text-[#1A1A2E] font-black text-sm font-fredoka">Phân mục</p>
          <div className="w-8 h-8 rounded-xl bg-[#F4F7FF] flex items-center justify-center text-[#9CA3AF]">
            <MdLayers className="text-base" />
          </div>
        </div>

        <div className="space-y-6">
          <CategoryProgress
            label="Gấu hoàn chỉnh"
            value={stats.bearCount}
            total={stats.totalProducts}
            color="#17409A"
          />
          <CategoryProgress
            label="Phụ kiện"
            value={stats.accCount}
            total={stats.totalProducts}
            color="#FF6B9D"
          />
          
          <div className="pt-6 border-t border-[#F4F7FF]">
            <div className="flex items-center gap-2 text-[#FF6B9D] bg-[#FF6B9D]/10 px-3 py-2 rounded-xl">
              <MdShoppingBag className="text-lg" />
              <p className="text-[10px] font-black uppercase tracking-wider">
                {stats.lowStock} sản phẩm sắp hết hàng
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
