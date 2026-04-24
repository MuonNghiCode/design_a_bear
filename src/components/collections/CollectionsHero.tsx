"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

const CollectionsHero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
      );
      gsap.fromTo(
        descRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.2 }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative pt-32 pb-20 overflow-hidden bg-[#F4F7FF]"
    >
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-24 h-24 bg-[#17409A]/5 rounded-full blur-2xl" />
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-[#FF8C42]/5 rounded-full blur-3xl" />
      
      <div className="max-w-screen-2xl mx-auto px-8 md:px-16 text-center">
        <h1
          ref={titleRef}
          className="text-4xl md:text-6xl font-black text-[#17409A] mb-6 leading-tight"
          style={{ fontFamily: "'Fredoka', sans-serif" }}
        >
          Bộ Sưu Tập <br />
          <span className="text-[#FF8C42]">Gấu Bông Độc Bản</span>
        </h1>
        <p
          ref={descRef}
          className="text-lg text-[#6B7280] max-w-2xl mx-auto leading-relaxed"
        >
          Khám phá những bộ sưu tập gấu bông thông minh được thiết kế theo các chủ đề 
          đặc biệt, kết hợp giữa công nghệ AI hiện đại và tình yêu thương vô bờ bến.
        </p>
      </div>
    </section>
  );
};

export default CollectionsHero;
