"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import gsap from "gsap";
import { MdShoppingBag } from "react-icons/md";
import StaffOrdersHero from "./StaffOrdersHero";
import StaffOrdersTable from "./StaffOrdersTable";
import { useAdminOrdersApi } from "@/hooks";
import { orderService } from "@/services/order.service";
import { useToast } from "@/contexts/ToastContext";
import type { OrderListItem } from "@/types";

export default function StaffOrdersClient() {
  const ref = useRef<HTMLDivElement>(null);
  const { loading, data, usersMap, fetchOrders } = useAdminOrdersApi();
  const { error, success } = useToast();
  const [pageIndex, setPageIndex] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    fetchOrders({ pageIndex, pageSize });
  }, [fetchOrders, pageIndex]);

  const advanceOrderStatus = useCallback(
    async (order: OrderListItem) => {
      const status = order.status?.toUpperCase();
      const nextStatus =
        status === "PENDING" || status === "PAID"
          ? "PROCESSING"
          : status === "PROCESSING"
            ? "DELIVERED"
            : null;
      if (!nextStatus) return;

      const res = await orderService.updateOrderStatus(order.orderId, {
        status: nextStatus,
        notes: `Staff portal cập nhật trạng thái sang ${nextStatus}`,
      });

      if (!res.isSuccess) {
        error("Không thể cập nhật trạng thái đơn hàng");
        return;
      }

      success("Cập nhật trạng thái đơn hàng thành công");

      fetchOrders({ pageIndex, pageSize });
    },
    [error, fetchOrders, pageIndex, success],
  );

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

      <div className="ac">
        <StaffOrdersHero orders={data?.items || []} loading={loading} />
      </div>

      <div className="ac">
        <StaffOrdersTable
          orders={data?.items || []}
          usersMap={usersMap}
          loading={loading}
          onAdvanceStatus={advanceOrderStatus}
          pageIndex={data?.pageIndex || pageIndex}
          totalPages={data?.totalPages || 1}
          totalCount={data?.totalCount || 0}
          hasPreviousPage={data?.hasPreviousPage || false}
          hasNextPage={data?.hasNextPage || false}
          onChangePage={setPageIndex}
        />
      </div>
    </div>
  );
}
