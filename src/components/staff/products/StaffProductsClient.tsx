"use client";

import { useRef, useEffect, useMemo, useState } from "react";
import gsap from "gsap";
import { MdInventory2, MdRefresh } from "react-icons/md";
import StaffProductsHero from "./StaffProductsHero";
import StaffProductsGrid, { type StaffProductView } from "./StaffProductsGrid";
import { useAdminProductsApi } from "@/hooks";
import type { ProductListItem } from "@/types";

function mapProductToStaffView(
  item: ProductListItem,
  index: number,
): StaffProductView {
  const badgeColors = [
    "#17409A",
    "#7C5CFC",
    "#4ECDC4",
    "#FF8C42",
    "#FF6B9D",
    "#FFD93D",
  ];
  const color = badgeColors[index % badgeColors.length];

  let category: StaffProductView["category"] = "bear";
  if (item.productType === "ACCESSORY") category = "accessory";
  else if (item.productType === "COMPLETE_BEAR") category = "complete";

  return {
    id: item.productId,
    name: item.name,
    imageUrl: item.imageUrl || "/teddy_bear.png",
    badge: item.productType === "ACCESSORY" ? "Phụ kiện" : "Gấu bông",
    badgeColor: color,
    category,
    price: item.price,
    stock: item.onHand || 0,
    sold: item.totalSales,
    rating: item.averageRating,
    status: item.isActive ? "active" : "draft",
    popular: item.viewCountIn10Min > 5,
  };
}

export default function StaffProductsClient() {
  const ref = useRef<HTMLDivElement>(null);
  const { data, loading, fetchProducts } = useAdminProductsApi();
  const [pageIndex, setPageIndex] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    fetchProducts({ pageIndex, pageSize });
  }, [fetchProducts, pageIndex]);

  const products = useMemo(
    () => (data?.items || []).map(mapProductToStaffView),
    [data?.items],
  );

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
      <div className="ac flex items-end justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-[#1A1A2E] font-black text-2xl leading-tight">
            Sản phẩm
          </h1>
          <p className="text-[#9CA3AF] text-sm font-semibold">
            Quản lý danh mục và kho hàng trong ca
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 bg-white text-[#17409A] text-[11px] font-black px-6 py-3.5 rounded-2xl hover:bg-[#F4F7FF] transition-all border border-[#F4F7FF] shadow-sm active:scale-95 uppercase tracking-widest"
          >
            <MdRefresh className="text-lg" />
            Làm mới dữ liệu
          </button>
        </div>
      </div>

      {/* Hero (2/5) + note panel (3/5) */}
      <div className="ac grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-2">
          <StaffProductsHero products={products} loading={loading} />
        </div>
        <div className="lg:col-span-3">
          <div className="bg-white rounded-[48px] h-full p-10 shadow-sm border border-white flex flex-col gap-4">
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
        <StaffProductsGrid
          products={products}
          loading={loading}
          pageIndex={data?.pageIndex || pageIndex}
          totalPages={data?.totalPages || 1}
          totalCount={data?.totalCount || 0}
          hasPreviousPage={data?.hasPreviousPage || false}
          hasNextPage={data?.hasNextPage || false}
          onChangePage={setPageIndex}
        />
      </div>
    </div>
  );
}
