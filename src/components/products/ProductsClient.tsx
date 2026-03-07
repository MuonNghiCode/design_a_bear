"use client";

import { useState, useMemo } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductsHero from "./ProductsHero";
import ProductsFilter from "./ProductsFilter";
import ProductsGrid from "./ProductsGrid";
import ProductsFeatureBanner from "./ProductsFeatureBanner";
import { type ProductCardProps } from "@/components/shared/ProductCard";

type Category = "all" | "complete" | "bear" | "accessory";
type SortOption = "newest" | "popular" | "price-asc" | "price-desc";

interface ProductItem extends ProductCardProps {
  category: Category;
  popular?: boolean;
  createdAt?: number;
}

const ALL_PRODUCTS: ProductItem[] = [
  {
    id: "bear-brown-happy",
    name: "Gấu Nâu Brownie Hạnh Phúc",
    description:
      "Chú gấu với chip AI dạy Toán, chất liệu bông tơ tằm siêu nhẹ, an toàn cho bé.",
    price: 450000,
    image: "/teddy_bear.png",
    badge: "Toán",
    badgeColor: "#17409A",
    category: "complete",
    popular: true,
    createdAt: 9,
  },
  {
    id: "bear-pink-melody",
    name: "Gấu Hồng Melody Âm Nhạc",
    description:
      "Dạy bé yêu âm nhạc qua hàng trăm bài hát và giai điệu vui nhộn.",
    price: 520000,
    image: "/teddy_bear.png",
    badge: "Âm nhạc",
    badgeColor: "#FF6B9D",
    category: "complete",
    popular: true,
    createdAt: 8,
  },
  {
    id: "bear-blue-einstein",
    name: "Gấu Xanh Einstein Khám Phá",
    description:
      "Trả lời hàng nghìn câu hỏi khoa học, kích thích trí tò mò của bé.",
    price: 580000,
    image: "/teddy_bear.png",
    badge: "Khoa học",
    badgeColor: "#4ECDC4",
    category: "complete",
    popular: false,
    createdAt: 7,
  },
  {
    id: "bear-cream-story",
    name: "Gấu Kem Storyteller Kể Chuyện",
    description:
      "Kể chuyện cổ tích tương tác, giọng kể ấm áp theo cảm xúc của bé.",
    price: 490000,
    image: "/teddy_bear.png",
    badge: "Ngôn ngữ",
    badgeColor: "#7C5CFC",
    category: "complete",
    popular: true,
    createdAt: 6,
  },
  {
    id: "bear-white-picasso",
    name: "Gấu Trắng Picasso Nghệ Sĩ",
    description:
      "Khơi dậy năng khiếu hội hoạ và sáng tạo của bé qua trò chơi màu sắc.",
    price: 460000,
    image: "/teddy_bear.png",
    badge: "Nghệ thuật",
    badgeColor: "#FF8C42",
    category: "bear",
    popular: false,
    createdAt: 5,
  },
  {
    id: "bear-yellow-sunny",
    name: "Gấu Vàng Sunny Bạn Đồng Hành",
    description:
      "Người bạn nhỏ luôn lắng nghe, giúp bé hình thành kỹ năng cảm xúc.",
    price: 380000,
    image: "/teddy_bear.png",
    badge: "Cảm xúc",
    badgeColor: "#FFD93D",
    category: "bear",
    popular: false,
    createdAt: 4,
  },
  {
    id: "bear-purple-genius",
    name: "Gấu Tím Genius Lập Trình",
    description:
      "Dạy tư duy lập trình logic cho trẻ từ 5 tuổi qua game và câu đố.",
    price: 620000,
    image: "/teddy_bear.png",
    badge: "Lập trình",
    badgeColor: "#7C5CFC",
    category: "bear",
    popular: true,
    createdAt: 3,
  },
  {
    id: "outfit-princess",
    name: "Bộ Váy Công Chúa Hoàng Gia",
    description:
      "Trang phục thêu tay cao cấp, vải cotton hữu cơ, an toàn cho da bé.",
    price: 185000,
    image: "/teddy_bear.png",
    badge: "Mới",
    badgeColor: "#FF8C42",
    category: "accessory",
    popular: false,
    createdAt: 2,
  },
  {
    id: "outfit-space",
    name: "Đồ Phi Hành Gia Vũ Trụ",
    description:
      "Bộ trang phục phi hành gia mini, vải phản quang nhẹ, siêu cute.",
    price: 210000,
    image: "/teddy_bear.png",
    badge: "Hot",
    badgeColor: "#FF6B9D",
    category: "accessory",
    popular: true,
    createdAt: 1,
  },
];

export default function ProductsClient() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
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
