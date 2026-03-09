"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { MdInventory2 } from "react-icons/md";
import StaffProductsHero from "./StaffProductsHero";
import StaffProductsGrid from "./StaffProductsGrid";

export default function StaffProductsClient() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".ac", {
        opacity: 0,
        y: 22,
        duration: 0.5,
        stagger: 0.07,
        ease: "power2.out",
        clearProps: "all",
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="space-y-5">
      {/* Title row */}
      <div className="ac flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <MdInventory2 style={{ color: "#17409A", fontSize: 22 }} />
            <h1
              className="font-black text-xl text-[#1A1A2E] tracking-tight"
              style={{ fontFamily: "'Nunito', sans-serif" }}
            >
              Sản phẩm
            </h1>
          </div>
          <p className="text-[#9CA3AF] text-sm">
            Cập nhật tồn kho và trạng thái sản phẩm theo ca làm việc.
          </p>
        </div>
      </div>

      {/* Hero (2/5) + note panel (3/5) */}
      <div className="ac grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-2">
          <StaffProductsHero />
        </div>
        <div className="lg:col-span-3">
          <div className="bg-white rounded-3xl h-full p-6 shadow-sm border border-[#F4F7FF] flex flex-col gap-4">
            <p
              className="font-black text-[#1A1A2E] text-base"
              style={{ fontFamily: "'Nunito', sans-serif" }}
            >
              Hướng dẫn quản lý kho
            </p>
            <div className="flex flex-col gap-3 text-sm text-[#6B7280]">
              {[
                {
                  color: "#17409A",
                  title: "Cập nhật tồn kho",
                  desc: 'Nhấn "Cập nhật kho" để nhập số lượng thực tế sau khi kiểm kê. Hệ thống sẽ ghi nhận thay đổi ngay lập tức.',
                },
                {
                  color: "#4ECDC4",
                  title: "Kích hoạt / Ẩn sản phẩm",
                  desc: "Ẩn sản phẩm nếu tạm hết hàng hoặc đang chờ kiểm tra chất lượng. Kích hoạt lại khi kho đã được bổ sung.",
                },
                {
                  color: "#FF8C42",
                  title: "Sản phẩm tồn kho thấp",
                  desc: "Sản phẩm còn ≤ 10 cái được đánh dấu cam. Hết hàng hiển thị đỏ — ưu tiên báo cáo và bàn giao cho ca sau.",
                },
              ].map(({ color, title, desc }) => (
                <div
                  key={title}
                  className="flex gap-3 p-3 bg-[#F4F7FF] rounded-2xl"
                >
                  <div
                    className="w-1 rounded-full shrink-0 mt-0.5"
                    style={{ backgroundColor: color }}
                  />
                  <div>
                    <p className="font-bold text-[#1A1A2E] text-xs mb-0.5">
                      {title}
                    </p>
                    <p className="text-[11px] leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[#9CA3AF] text-[10px] mt-auto pt-2 border-t border-[#F4F7FF]">
              Không thể thêm sản phẩm mới hoặc chỉnh sửa giá — liên hệ Admin nếu
              cần thiết.
            </p>
          </div>
        </div>
      </div>

      {/* Products grid / table */}
      <div className="ac">
        <StaffProductsGrid />
      </div>
    </div>
  );
}
