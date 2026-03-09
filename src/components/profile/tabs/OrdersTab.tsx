"use client";

import Image from "next/image";
import Link from "next/link";
import { PROFILE_ORDERS, ORDER_STATUS_CFG } from "@/data/profile";

export default function OrdersTab() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between mb-1">
        <p className="text-[#1A1A2E] font-black text-base">Lịch sử đơn hàng</p>
        <Link
          href="/products"
          className="text-[#17409A] text-xs font-black hover:underline underline-offset-2"
        >
          Mua thêm →
        </Link>
      </div>

      {PROFILE_ORDERS.map((order) => {
        const st = ORDER_STATUS_CFG[order.status];
        return (
          <div
            key={order.id}
            className="flex items-center gap-4 bg-[#F8F9FF] rounded-2xl p-4 hover:shadow-md hover:shadow-[#17409A]/5 transition-shadow cursor-pointer group"
          >
            <div className="w-14 h-14 rounded-xl bg-[#17409A]/5 flex items-center justify-center shrink-0 overflow-hidden group-hover:scale-105 transition-transform duration-200">
              <Image
                src={order.image}
                alt={order.product}
                width={50}
                height={50}
                className="object-contain"
              />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-[#1A1A2E] font-bold text-sm truncate">
                {order.product}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <span
                  className="text-[9px] font-black px-1.5 py-0.5 rounded-full"
                  style={{
                    color: order.badgeColor,
                    backgroundColor: order.badgeColor + "18",
                  }}
                >
                  {order.badge}
                </span>
                <span className="text-[#9CA3AF] text-[10px] font-semibold">
                  {order.date}
                </span>
              </div>
            </div>

            <div className="text-right shrink-0">
              <p className="text-[#17409A] font-black text-sm">
                {(order.amount / 1000).toFixed(0)}K
                <span className="text-[#9CA3AF] font-semibold text-[10px] ml-0.5">
                  đ
                </span>
              </p>
              <span
                className="text-[9px] font-black px-2 py-0.5 rounded-full"
                style={{ color: st.color, backgroundColor: st.bg }}
              >
                {st.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
