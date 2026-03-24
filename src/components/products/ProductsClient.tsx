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

/* ── Map API item → ProductCardProps ── */
function mapToCard(item: ProductListItem): ProductCardProps {
  const image =
    item.imageUrl ||
    item.media?.[0]?.url ||
    "/teddy_bear.png";

  return {
    id: item.productId,
    name: item.name,
    description: item.shortDescription,
    price: item.minPrice || item.price,
    image,
    badge: item.discountRate > 0 ? `-${item.discountRate}%` : undefined,
    badgeColor: item.discountRate > 0 ? "#FF6B9D" : "#17409A",
    href: `/products/${item.slug}`,
  };
}

export default function ProductsClient({ initialCategory }: ProductsClientProps) {
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory ?? "all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  /* ── API state ── */
  const { getProducts, loading } = useProductApi();
  const [allItems, setAllItems] = useState<ProductCardProps[]>([]);
  const [pageIndex, setPageIndex] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  // Sync category từ URL
  useEffect(() => {
    if (initialCategory) setActiveCategory(initialCategory);
  }, [initialCategory]);

  // Fetch trang đầu hoặc khi category thay đổi
  const fetchPage = useCallback(
    async (page: number, reset = false) => {
      try {
        const data = await getProducts({
          pageIndex: page,
          pageSize: 12,
        });
        const mapped = data.items.map(mapToCard);
        setAllItems((prev) => (reset ? mapped : [...prev, ...mapped]));
        setPageIndex(page);
        setHasNextPage(data.hasNextPage);
      } catch {
        // Lỗi đã handle trong hook
      }
    },
    [getProducts],
  );

  useEffect(() => {
    fetchPage(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLoadMore = async () => {
    setLoadingMore(true);
    await fetchPage(pageIndex + 1, false);
    setLoadingMore(false);
  };

  /* ── Client-side filter / sort ── */
  const filteredProducts = useMemo(() => {
    let list = allItems;

    if (activeCategory !== "all") {
      list = list.filter((p) =>
        p.name.toLowerCase().includes(activeCategory) ||
        (p.badge?.toLowerCase().includes(activeCategory) ?? false),
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q),
      );
    }

    switch (sortBy) {
      case "price-asc":
        return [...list].sort((a, b) => a.price - b.price);
      case "price-desc":
        return [...list].sort((a, b) => b.price - a.price);
      default:
        return list;
    }
  }, [allItems, activeCategory, searchQuery, sortBy]);

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
        <ProductsGrid products={filteredProducts} />
      )}

      {/* Load More */}
      {hasNextPage && !loading && (
        <div className="flex justify-center pb-12">
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="bg-[#17409A] text-white font-bold px-10 py-4 rounded-2xl hover:bg-[#0f2d6e] transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ fontFamily: "'Nunito', sans-serif" }}
          >
            {loadingMore ? "Đang tải..." : "Xem thêm sản phẩm"}
          </button>
        </div>
      )}

      <ProductsFeatureBanner />
      <Footer />
    </div>
  );
}
