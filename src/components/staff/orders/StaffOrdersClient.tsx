"use client";

import { useRef, useEffect, useMemo, useState } from "react";
import gsap from "gsap";
import { MdShoppingBag, MdRefresh } from "react-icons/md";
import StaffOrdersTable from "@/components/staff/orders/StaffOrdersTable";
import StaffOrdersHero from "@/components/staff/orders/StaffOrdersHero";
import OrdersPipeline from "@/components/admin/orders/OrdersPipeline";
import { useAdminOrdersApi } from "@/hooks/useAdminOrdersApi";

export default function StaffOrdersClient() {
  const ref = useRef<HTMLDivElement>(null);

  const { data, loading, fetchOrders, usersMap } = useAdminOrdersApi();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchOrders({ pageIndex: 1, pageSize: 10, fetchAllPages: true });
  }, [fetchOrders]);

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await fetchOrders({ pageIndex: 1, pageSize: 10, fetchAllPages: true });
    } finally {
      setRefreshing(false);
    }
  };

  const orders = useMemo(() => data?.items || [], [data?.items]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".ac",
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
          stagger: 0.07,
          clearProps: "all",
        },
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="space-y-6">
      <div className="ac flex items-end justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-[#1A1A2E] font-black text-2xl leading-tight">
            Đơn hàng
          </h1>
          <p className="text-[#9CA3AF] text-sm font-semibold">
            Theo dõi, xử lý và cập nhật trạng thái đơn hàng
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleRefresh}
            className="flex items-center gap-2 bg-white text-[#17409A] text-[11px] font-black px-6 py-3.5 rounded-2xl hover:bg-[#F4F7FF] transition-all border border-[#F4F7FF] shadow-sm active:scale-95 uppercase tracking-widest"
          >
            <MdRefresh className="text-lg" />
            Làm mới dữ liệu
          </button>
        </div>
      </div>

      <div className="ac grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-8">
          <StaffOrdersHero orders={orders} loading={loading} />
        </div>
        <div className="xl:col-span-4">
          <OrdersPipeline orders={orders} loading={loading} />
        </div>
      </div>

      <div className="ac bg-white rounded-[48px] p-8 sm:p-10 shadow-sm border border-white">
        <StaffOrdersTable 
          orders={orders} 
          loading={loading} 
          usersMap={usersMap} 
          onRefresh={handleRefresh}
          refreshing={refreshing}
        />
      </div>
    </div>
  );
}
