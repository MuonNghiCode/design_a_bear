"use client";

import { useState, useMemo, useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductsHero from "./ProductsHero";
import ProductsFilter from "./ProductsFilter";
import ProductsGrid from "./ProductsGrid";
import ProductsFeatureBanner from "./ProductsFeatureBanner";
import { type SortOption, type ProductsClientProps } from "@/types/products";
import { ALL_PRODUCTS } from "@/data/products";

export default function ProductsClient({
  initialCategory,
}: ProductsClientProps) {
  const [activeCategory, setActiveCategory] = useState<string>(
    initialCategory ?? "all",
  );

  // Sync when navigating between category links (e.g. back/forward)
  useEffect(() => {
    if (initialCategory) setActiveCategory(initialCategory);
  }, [initialCategory]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  const filteredProducts = useMemo(() => {
    let list = ALL_PRODUCTS;

    if (activeCategory !== "all") {
      list = list.filter((p) => p.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.badge?.toLowerCase().includes(q) ?? false),
      );
    }

    switch (sortBy) {
      case "price-asc":
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case "popular":
        list = [...list].sort(
          (a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0),
        );
        break;
      case "newest":
      default:
        list = [...list].sort(
          (a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0),
        );
    }

    return list;
  }, [activeCategory, searchQuery, sortBy]);

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
      <ProductsGrid products={filteredProducts} />
      <ProductsFeatureBanner />
      <Footer />
    </div>
  );
}
