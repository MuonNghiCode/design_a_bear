"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { MdRefresh } from "react-icons/md";
import PromotionsHero from "./PromotionsHero";
import PromotionsTable from "./PromotionsTable";
import { promotionService } from "@/services/promotion.service";
import type { Promotion } from "@/types";

export default function PromotionsClient() {
  const ref = useRef<HTMLDivElement>(null);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPromotions = useCallback(async () => {
    try {
      setLoading(true);
      const res = await promotionService.getAllPromotions();
      if (res.isSuccess) {
        setPromotions(res.value || []);
      }
    } catch (err) {
      console.error("Failed to fetch promotions", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchPromotions();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchPromotions();
  }, [fetchPromotions]);

  useEffect(() => {
    if (!ref.current || loading) return;
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
  }, [loading]);

  return (
    <div ref={ref} className="space-y-8 pb-12" style={{ fontFamily: "var(--font-nunito), Nunito, sans-serif" }}>
      {/* ── Page Header ── */}
      <div className="ac flex items-end justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-[#1A1A2E] font-black text-2xl leading-tight">
            Mã giảm giá
          </h1>
          <p className="text-[#9CA3AF] text-sm font-semibold tracking-wide opacity-70">
            Quản lý chiến dịch ưu đãi ·{" "}
            {new Date().toLocaleDateString("vi-VN", {
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 bg-white text-[#17409A] text-[11px] font-black px-6 py-3.5 rounded-2xl hover:bg-[#F4F7FF] transition-all border border-[#F4F7FF] shadow-sm active:scale-95 disabled:opacity-50 uppercase tracking-widest"
          disabled={loading || refreshing}
        >
          <MdRefresh className={`text-lg ${loading || refreshing ? "animate-spin" : ""}`} />
          Làm mới dữ liệu
        </button>
      </div>

      {/* Full-width Promotions Hero */}
      <div className="ac">
        <PromotionsHero promotions={promotions} loading={loading} />
      </div>

      {/* Full-width promotions table */}
      <div className="ac">
        <PromotionsTable promotions={promotions} loading={loading} onRefresh={fetchPromotions} />
      </div>
    </div>
  );
}
