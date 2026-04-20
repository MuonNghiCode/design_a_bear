"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductsHero from "./ProductsHero";
import ProductsFilter from "./ProductsFilter";
import ProductsGrid from "./ProductsGrid";
import ProductsFeatureBanner from "./ProductsFeatureBanner";
import ProductCardSkeleton from "@/components/shared/ProductCardSkeleton";
import { type SortOption, type ProductsClientProps } from "@/types/products";
import { useProductApi } from "@/hooks/useProductApi";
import type { ProductListItem } from "@/types";
import type { ProductCardProps } from "@/components/shared/ProductCard";
import { inventoryService } from "@/services/inventory.service";

const PAGE_SIZE = 12;

type UserVisibleProduct = ProductListItem & {
  normalizedType: string;
};

/* ── Map API item → ProductCardProps ── */
function mapToCard(item: ProductListItem, stock?: number): ProductCardProps {
  const image = item.imageUrl || item.media?.[0]?.url || "/teddy_bear.png";

  return {
    id: item.productId,
    name: item.name,
    description: item.shortDescription,
    price: item.minPrice || item.price,
    image,
    badge: item.discountRate > 0 ? `-${item.discountRate}%` : undefined,
    badgeColor: item.discountRate > 0 ? "#FF6B9D" : "#17409A",
    href: `/products/${item.slug}`,
    availableStock: stock,
  };
}

export default function ProductsClient({
  initialCategory,
}: ProductsClientProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  /* ── API state ── */
  const { getProducts, loading } = useProductApi();
  const [allItems, setAllItems] = useState<UserVisibleProduct[]>([]);
  const [inventoryMap, setInventoryMap] = useState<Record<string, number>>({});
  const [pageIndex, setPageIndex] = useState(1);

  // Sync category từ URL
  useEffect(() => {
    if (!initialCategory || initialCategory === "accessory") {
      setActiveCategory("all");
      return;
    }
    setActiveCategory(initialCategory);
  }, [initialCategory]);

  // Fetch một lần và chỉ giữ BASE_BEAR + COMPLETE_BEAR (ẩn ACCESSORY)
  const fetchPage = useCallback(async () => {
    try {
      const data = await getProducts({
        pageIndex: 1,
        pageSize: 200,
      });
      const sanitized = data.items
        .map((item) => ({
          ...item,
          normalizedType: (item.productType || "").trim().toUpperCase(),
        }))
        .filter((item) => item.normalizedType !== "ACCESSORY");

      setAllItems(sanitized);
      setPageIndex(1);
    } catch {
      // Lỗi đã handle trong hook
    }
  }, [getProducts]);

  useEffect(() => {
    fetchPage();
  }, [fetchPage]);

  /* ── Client-side filter / sort ── */
  const filteredProducts = useMemo(() => {
    let list = allItems;

    if (activeCategory === "bear") {
      list = list.filter((p) => p.normalizedType === "BASE_BEAR");
    } else if (activeCategory === "complete") {
      list = list.filter((p) => p.normalizedType === "COMPLETE_BEAR");
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.shortDescription || "").toLowerCase().includes(q),
      );
    }

    switch (sortBy) {
      case "popular":
        return [...list].sort(
          (a, b) => b.viewCountIn10Min - a.viewCountIn10Min,
        );
      case "price-asc":
        return [...list].sort(
          (a, b) => (a.minPrice || a.price) - (b.minPrice || b.price),
        );
      case "price-desc":
        return [...list].sort(
          (a, b) => (b.minPrice || b.price) - (a.minPrice || a.price),
        );
      default:
        return list;
    }
  }, [allItems, activeCategory, searchQuery, sortBy]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / PAGE_SIZE),
  );

  useEffect(() => {
    setPageIndex((prev) => Math.min(prev, totalPages));
  }, [totalPages]);

  const pagedProducts = useMemo(() => {
    const start = (pageIndex - 1) * PAGE_SIZE;
    return filteredProducts
      .slice(start, start + PAGE_SIZE)
      .map((item) => mapToCard(item, inventoryMap[item.productId]));
  }, [filteredProducts, pageIndex, inventoryMap]);

  // Sync inventory for visible items
  useEffect(() => {
    const visibleIds = filteredProducts
      .slice((pageIndex - 1) * PAGE_SIZE, pageIndex * PAGE_SIZE)
      .map((p) => p.productId);

    if (visibleIds.length > 0) {
      (async () => {
        try {
          const results = await Promise.all(
            visibleIds.map(async (id) => {
              const res = await inventoryService.getTotalAvailable(id);
              return {
                id,
                total:
                  res.isSuccess && res.value ? res.value.totalAvailable : 0,
              };
            }),
          );

          const newMap = { ...inventoryMap };
          let changed = false;
          results.forEach((r) => {
            if (newMap[r.id] !== r.total) {
              newMap[r.id] = r.total;
              changed = true;
            }
          });
          if (changed) setInventoryMap(newMap);
        } catch (err) {
          console.error("Failed to sync list inventory:", err);
        }
      })();
    }
  }, [pageIndex, filteredProducts.length]); // Only re-fetch on page/list change

  const pageNumbers = useMemo(() => {
    const pages: number[] = [];
    const start = Math.max(1, pageIndex - 2);
    const end = Math.min(totalPages, pageIndex + 2);
    for (let i = start; i <= end; i += 1) pages.push(i);
    return pages;
  }, [pageIndex, totalPages]);

  return (
    <div className="min-h-screen bg-[#F4F7FF] flex flex-col">
      <Header />
      <ProductsHero />
      <ProductsFilter
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortBy={sortBy}
        onSortChange={(s) => setSortBy(s as SortOption)}
        productCount={filteredProducts.length}
      />

      {/* Loading skeleton */}
      {loading && allItems.length === 0 ? (
        <section className="bg-[#F4F7FF] flex-1 py-10 md:py-14">
          <div className="max-w-screen-2xl mx-auto px-4 md:px-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </section>
      ) : (
        <>
          <ProductsGrid products={pagedProducts} />

          {/* Pagination */}
          {!loading && filteredProducts.length > 0 && totalPages > 1 && (
            <div className="pb-12">
              <div className="mx-auto flex w-fit items-center gap-2 rounded-2xl border border-[#E5E7EB] bg-white px-3 py-2 shadow-sm">
                <button
                  type="button"
                  onClick={() => setPageIndex((prev) => Math.max(1, prev - 1))}
                  disabled={pageIndex === 1}
                  className="rounded-xl px-3 py-2 text-xs font-black text-[#17409A] transition-colors hover:bg-[#F4F7FF] disabled:cursor-not-allowed disabled:text-[#9CA3AF]"
                  style={{ fontFamily: "'Nunito', sans-serif" }}
                >
                  Trước
                </button>

                {pageNumbers[0] > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => setPageIndex(1)}
                      className="rounded-xl px-3 py-2 text-xs font-bold text-[#6B7280] transition-colors hover:bg-[#F4F7FF]"
                    >
                      1
                    </button>
                    {pageNumbers[0] > 2 && (
                      <span className="px-1 text-xs font-black text-[#9CA3AF]">
                        ...
                      </span>
                    )}
                  </>
                )}

                {pageNumbers.map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setPageIndex(page)}
                    className={`rounded-xl px-3 py-2 text-xs font-black transition-colors ${
                      page === pageIndex
                        ? "bg-[#17409A] text-white"
                        : "text-[#6B7280] hover:bg-[#F4F7FF]"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                {pageNumbers[pageNumbers.length - 1] < totalPages && (
                  <>
                    {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                      <span className="px-1 text-xs font-black text-[#9CA3AF]">
                        ...
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => setPageIndex(totalPages)}
                      className="rounded-xl px-3 py-2 text-xs font-bold text-[#6B7280] transition-colors hover:bg-[#F4F7FF]"
                    >
                      {totalPages}
                    </button>
                  </>
                )}

                <button
                  type="button"
                  onClick={() =>
                    setPageIndex((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={pageIndex === totalPages}
                  className="rounded-xl px-3 py-2 text-xs font-black text-[#17409A] transition-colors hover:bg-[#F4F7FF] disabled:cursor-not-allowed disabled:text-[#9CA3AF]"
                  style={{ fontFamily: "'Nunito', sans-serif" }}
                >
                  Sau
                </button>
              </div>

              <p
                className="mt-3 text-center text-xs font-semibold text-[#6B7280]"
                style={{ fontFamily: "'Nunito', sans-serif" }}
              >
                Trang {pageIndex}/{totalPages}
              </p>
            </div>
          )}
        </>
      )}

      <ProductsFeatureBanner />
      <Footer />
    </div>
  );
}
