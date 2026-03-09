"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { MdStar, MdDownload } from "react-icons/md";
import ReviewsHero from "./ReviewsHero";
import ReviewsRatingChart from "./ReviewsRatingChart";
import ReviewsTable from "./ReviewsTable";

export default function ReviewsClient() {
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
        }
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="space-y-5">
      {/* Title row */}
      <div className="ac flex items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <MdStar className="text-[#FFD93D]" style={{ fontSize: 22 }} />
            <h1 className="font-black text-[#1A1A2E] text-2xl tracking-tight">
              Đánh giá
            </h1>
          </div>
          <p className="text-[#9CA3AF] text-sm">
            Quản lý và phản hồi đánh giá từ khách hàng
          </p>
        </div>

        <button className="flex items-center gap-2 bg-[#F4F7FF] hover:bg-[#EEF1FF] text-[#17409A] text-sm font-bold px-4 py-2.5 rounded-2xl transition-colors cursor-pointer whitespace-nowrap">
          <MdDownload className="text-base" />
          <span className="hidden sm:inline">Xuất CSV</span>
        </button>
      </div>

      {/* Hero (lg: 3/5) + Rating chart (lg: 2/5) */}
      <div className="ac grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3">
          <ReviewsHero />
        </div>
        <div className="lg:col-span-2">
          <ReviewsRatingChart />
        </div>
      </div>

      {/* Full-width table */}
      <div className="ac">
        <ReviewsTable />
      </div>
    </div>
  );
}
