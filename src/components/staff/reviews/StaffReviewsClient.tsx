"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { MdStar } from "react-icons/md";
import { GiPawPrint } from "react-icons/gi";
import { ADMIN_REVIEWS } from "@/data/admin";
import StaffReviewsTable from "./StaffReviewsTable";

const total = ADMIN_REVIEWS.length;
const answered = ADMIN_REVIEWS.filter((r) => r.reply).length;
const pending = ADMIN_REVIEWS.filter((r) => r.status === "pending").length;
const avg = (ADMIN_REVIEWS.reduce((s, r) => s + r.rating, 0) / total).toFixed(
  1,
);

export default function StaffReviewsClient() {
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
      {/* Title */}
      <div className="ac flex items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <MdStar className="text-[#FFD93D]" style={{ fontSize: 22 }} />
            <h1 className="font-black text-[#1A1A2E] text-2xl tracking-tight">
              Đánh giá
            </h1>
          </div>
          <p className="text-[#9CA3AF] text-sm">
            Trả lời đánh giá từ khách hàng
          </p>
        </div>
      </div>

      {/* Summary strip */}
      <div className="ac grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Tổng đánh giá", value: total, color: "#17409A" },
          { label: "Chờ trả lời", value: total - answered, color: "#FF8C42" },
          { label: "Đã phản hồi", value: answered, color: "#4ECDC4" },
          { label: "Điểm trung bình", value: avg, color: "#FFD93D" },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            className="bg-white rounded-2xl px-5 py-4 flex items-center gap-3"
          >
            <div
              className="w-2.5 h-10 rounded-full shrink-0"
              style={{ backgroundColor: color }}
            />
            <div>
              <p className="text-[#9CA3AF] text-[10px] font-black tracking-wider uppercase">
                {label}
              </p>
              <p className="text-[#1A1A2E] font-black text-xl">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="ac">
        <StaffReviewsTable />
      </div>
    </div>
  );
}
