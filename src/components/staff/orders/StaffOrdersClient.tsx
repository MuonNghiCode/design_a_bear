"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { MdShoppingBag } from "react-icons/md";
import StaffOrdersTable from "@/components/staff/orders/StaffOrdersTable";
import OrdersHero from "@/components/admin/orders/OrdersHero";
import OrdersPipeline from "@/components/admin/orders/OrdersPipeline";
import { useAdminOrdersApi } from "@/hooks/useAdminOrdersApi";

export default function StaffOrdersClient() {
  const ref = useRef<HTMLDivElement>(null);
  const { data, loading, fetchOrders } = useAdminOrdersApi();

  useEffect(() => {
    fetchOrders({ pageIndex: 1, pageSize: 10, fetchAllPages: true });
  }, [fetchOrders]);

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

  const orders = data?.items || [];

  return (
    <div ref={ref} className="space-y-5">
      <div className="ac flex items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <MdShoppingBag
              className="text-[#17409A]"
              style={{ fontSize: 22 }}
            />
            <h1 className="font-black text-[#1A1A2E] text-2xl tracking-tight">
              Đơn hàng
            </h1>
          </div>
          <p className="text-[#9CA3AF] text-sm">
            Xử lý và cập nhật trạng thái đơn hàng
          </p>
        </div>
      </div>

      {/* Hero cards at top */}
      <div className="ac grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3">
          <OrdersHero orders={orders} loading={loading} />
        </div>
        <div className="lg:col-span-2">
          <OrdersPipeline orders={orders} loading={loading} />
        </div>
      </div>

      <div className="ac">
        <StaffOrdersTable />
      </div>
    </div>
  );
}
