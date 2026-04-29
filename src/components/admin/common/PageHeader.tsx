"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

interface Breadcrumb {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  breadcrumbs?: Breadcrumb[];
  actions?: React.ReactNode;
  sticky?: boolean;
}

export default function PageHeader({ title, actions, sticky }: PageHeaderProps) {
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current,
        { y: -10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" }
      );
    }
  }, []);

  return (
    <div 
      ref={headerRef} 
      className={`mb-8 opacity-0 transition-all duration-300 ${
        sticky ? "sticky top-0 z-[100] -mx-4 px-4 md:-mx-10 md:px-10 py-6 bg-[#F8FAFC]/80 backdrop-blur-xl border-b border-white/20 shadow-[0_1px_2px_rgba(0,0,0,0.02)]" : ""
      }`}
    >
      {/* Title & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 max-w-[1450px] mx-auto">
        <h1 className="text-3xl font-black text-[#1A1A2E] tracking-tight font-fredoka uppercase">
          {title}
        </h1>
        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </div>
    </div>
  );
}
