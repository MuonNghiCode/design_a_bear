"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import PawDecoration from "./PawDecoration";

import { useEffect, useState } from "react";
import { productService } from "@/services/product.service";
import { reviewService } from "@/services/review.service";

export default function AuthBrandPanel() {
  const router = useRouter();
  const [stats, setStats] = useState([
    { value: "500+", label: "Sản phẩm" },
    { value: "4.9/5", label: "Đánh giá" },
    { value: "98%", label: "Hài lòng" },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [prodRes, revRes] = await Promise.allSettled([
          productService.getProducts({ pageIndex: 1, pageSize: 1 }),
          reviewService.getAllReviews({ pageIndex: 1, pageSize: 1 }),
        ]);

        const newStats = [...stats];

        if (prodRes.status === "fulfilled" && prodRes.value.isSuccess) {
          const total = prodRes.value.value?.totalCount || 0;
          newStats[0] = { value: `${total}+`, label: "Sản phẩm" };
        }

        if (revRes.status === "fulfilled" && revRes.value.isSuccess) {
          const total = revRes.value.value?.totalCount || 0;
          newStats[1] = { value: `${total}+`, label: "Đánh giá" };
        }

        setStats(newStats);
      } catch (e) {
        console.error("Failed to fetch brand stats", e);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="hidden lg:flex relative z-10 flex-1 flex-col justify-between px-12 py-10">
      <PawDecoration />

      {/* Logo + brand name */}
      <div className="flex items-center gap-3">
        <div className="relative w-10 h-10 shrink-0">
          <Image
            src="/logo.webp"
            alt="Design a Bear"
            fill
            className="object-contain"
          />
        </div>
        <span className="text-white font-black text-xl tracking-wide">
          Design a Bear
        </span>
      </div>

      {/* Bear mascot + decorative text + tagline */}
      <div className="flex flex-col items-center text-center">
        <p
          className="text-white/6 font-black select-none leading-none"
          style={{
            fontSize: "clamp(3.5rem, 8vw, 6.5rem)",
            letterSpacing: "0.06em",
            marginBottom: "-1.5rem",
          }}
        >
          DESIGN
        </p>

        <div
          className="relative w-44 h-44 xl:w-56 xl:h-56 drop-shadow-2xl"
          style={{ animation: "floatBear 3s ease-in-out infinite" }}
        >
          <Image
            src="/teddy_bear.png"
            alt="Mascot"
            fill
            className="object-contain"
            priority
          />
        </div>

        <p
          className="text-white/6 font-black select-none leading-none"
          style={{
            fontSize: "clamp(3.5rem, 8vw, 6.5rem)",
            letterSpacing: "0.06em",
            marginTop: "-1.5rem",
            marginBottom: "1rem",
          }}
        >
          A BEAR
        </p>

        <h2 className="text-white font-black text-2xl xl:text-3xl leading-tight mb-2">
          Gấu bông của tương lai
        </h2>
        <p className="text-white/60 text-sm max-w-xs leading-relaxed">
          Thông minh, sáng tạo và đồng hành cùng trẻ trên hành trình học tập.
        </p>
      </div>

      <div className="flex items-center bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden border border-white/15">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={`flex-1 text-center py-3 ${i < stats.length - 1 ? "border-r border-white/15" : ""}`}
          >
            <p className="text-white font-black text-xl">{s.value}</p>
            <p className="text-white/55 text-xs mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes floatBear {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-12px); }
        }
      `}</style>
    </div>
  );
}
