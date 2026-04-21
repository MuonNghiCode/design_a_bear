"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ProductsHero from "@/components/admin/products/ProductsHero";
import ProductsTopSellers from "@/components/admin/products/ProductsTopSellers";
import ProductsGrid from "@/components/admin/products/ProductsGrid";
import AccessoriesGrid from "@/components/admin/products/AccessoriesGrid";
import { MdCategory, MdShoppingBag, MdInventory2 } from "react-icons/md";

type TabType = "products" | "accessories" | "inventory";

export default function ProductsClient() {
  const [activeTab, setActiveTab] = useState<TabType>("products");
  const ref = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
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

  useEffect(() => {
    if (!contentRef.current) return;
    gsap.fromTo(
      contentRef.current,
      { opacity: 0, x: 20 },
      { opacity: 1, x: 0, duration: 0.4, ease: "power2.out" }
    );
  }, [activeTab]);

  const TABS = [
    { id: "products", label: "Sản phẩm", icon: MdShoppingBag },
    { id: "accessories", label: "Phụ kiện", icon: MdCategory },
    { id: "inventory", label: "Tổng quan kho", icon: MdInventory2 },
  ] as const;

  return (
    <div ref={ref} className="space-y-6">
      {/* Page Header */}
      <div className="ac flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-[#1A1A2E] font-black text-3xl leading-tight">
            Quản lý Kho hàng
          </h1>
          <p className="text-[#9CA3AF] text-sm font-semibold mt-1">
            Hệ thống quản lý sản phẩm, phụ kiện và điều phối tồn kho toàn diện.
          </p>
        </div>
      </div>

      {/* Modern Tabs */}
      <div className="ac flex items-center bg-white/50 backdrop-blur-sm p-1.5 rounded-2xl w-fit border border-[#E5E7EB]">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all duration-300 ${
                isActive
                  ? "bg-[#17409A] text-white shadow-lg shadow-[#17409A]/20"
                  : "text-[#6B7280] hover:bg-[#F4F7FF] hover:text-[#17409A]"
              }`}
            >
              <tab.icon className={`text-lg transition-transform ${isActive ? "scale-110" : ""}`} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div ref={contentRef} className="space-y-6">
        {activeTab === "products" && (
          <>
            {/* Hero (left 2/5) + Top sellers (right 3/5) */}
            <div className="ac grid grid-cols-1 lg:grid-cols-5 gap-5">
              <div className="lg:col-span-2">
                <ProductsHero />
              </div>
              <div className="lg:col-span-3">
                <ProductsTopSellers />
              </div>
            </div>

            {/* Full-width products grid/table */}
            <div className="ac">
              <ProductsGrid />
            </div>
          </>
        )}

        {activeTab === "accessories" && (
          <div className="ac">
            <AccessoriesGrid />
          </div>
        )}

        {activeTab === "inventory" && (
          <div className="ac bg-white rounded-3xl p-12 text-center border-2 border-dashed border-[#E5E7EB]">
            <MdInventory2 className="text-6xl text-[#D1D5DB] mx-auto mb-4" />
            <h3 className="text-xl font-black text-[#1A1A2E]">Chức năng đang phát triển</h3>
            <p className="text-[#9CA3AF] text-sm font-medium mt-2">Báo cáo kho hàng chi tiết sẽ sớm ra mắt.</p>
          </div>
        )}
      </div>
    </div>
  );
}
