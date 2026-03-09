"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { MdShoppingBag } from "react-icons/md";
import StaffOrdersHero from "./StaffOrdersHero";
import StaffOrdersTable from "./StaffOrdersTable";

export default function StaffOrdersClient() {
  const ref = useRef<HTMLDivElement>(null);

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
        <StaffOrdersHero />
      </div>

      <div className="ac">
        <StaffOrdersTable />
      </div>
    </div>
  );
}
