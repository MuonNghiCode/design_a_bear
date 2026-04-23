"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductsGrid from "@/components/products/ProductsGrid";
import { collectionService } from "@/services";
import { CollectionResponse, ProductListItem } from "@/types";
import { type ProductCardProps } from "@/components/shared/ProductCard";
import { GiBearFace } from "react-icons/gi";
import gsap from "gsap";

export default function CollectionDetailPage() {
  const { slug } = useParams();
  const [collection, setCollection] = useState<CollectionResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!slug) return;
      try {
        const res = await collectionService.getCollectionBySlug(slug as string);
        if (res.isSuccess) {
          setCollection(res.value);
        }
      } catch (error) {
        console.error("Failed to fetch collection detail:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [slug]);

  // Animation for header
  useEffect(() => {
    if (!loading && collection) {
      gsap.fromTo(
        ".collection-header-content",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
      );
    }
  }, [loading, collection]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F7FF]">
        <Header />
        <div className="pt-40 pb-20 text-center">
          <div className="w-20 h-20 border-4 border-[#17409A] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#17409A] font-bold">Đang tải bộ sưu tập...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="min-h-screen bg-[#F4F7FF]">
        <Header />
        <div className="pt-40 pb-20 text-center">
          <GiBearFace size={80} className="mx-auto text-[#FF6B9D] mb-6" />
          <h1 className="text-3xl font-black text-[#1A1A2E] mb-4">
            Không tìm thấy bộ sưu tập
          </h1>
          <p className="text-[#6B7280] mb-8">
            Có vẻ như bộ sưu tập này không tồn tại hoặc đã bị gỡ bỏ.
          </p>
          <a
            href="/collections"
            className="inline-block bg-[#17409A] text-white px-8 py-3 rounded-2xl font-bold hover:bg-[#0E2A66] transition-colors"
          >
            Quay lại danh sách
          </a>
        </div>
        <Footer />
      </div>
    );
  }

  // Map products for ProductsGrid
  const mappedProducts: ProductCardProps[] = (collection.products || []).map((p) => ({
    id: p.productId,
    name: p.name,
    price: p.price,
    image: p.imageUrl || "/images/placeholder-bear.png",
    description: p.shortDescription || "",
    slug: p.slug,
    availableStock: p.available,
    badge: p.productType === "BASE_BEAR" ? "Gấu" : "Phụ kiện",
    badgeColor: p.productType === "BASE_BEAR" ? "#17409A" : "#FF6B9D",
  }));

  return (
    <main className="min-h-screen bg-white">
      <Header />
      
      {/* Detail Header */}
      <section className="relative pt-40 pb-20 bg-[#F4F7FF] overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[#17409A]/5 rounded-bl-[200px]" />
        
        <div className="max-w-screen-2xl mx-auto px-8 md:px-16 relative z-10">
          <div className="collection-header-content">
            <nav className="flex items-center gap-2 text-sm text-[#6B7280] mb-6">
              <a href="/collections" className="hover:text-[#17409A]">Bộ sưu tập</a>
              <span>/</span>
              <span className="text-[#17409A] font-bold">{collection.name}</span>
            </nav>
            
            <h1 
              className="text-5xl md:text-7xl font-black text-[#17409A] mb-6"
              style={{ fontFamily: "'Fredoka', sans-serif" }}
            >
              {collection.name}
            </h1>
            <p className="text-xl text-[#6B7280] max-w-3xl leading-relaxed">
              Khám phá tinh hoa của sự sáng tạo trong bộ sưu tập {collection.name}. 
              Nơi mỗi chú gấu bông không chỉ là đồ chơi, mà là một người bạn đồng hành 
              thông minh cho sự phát triển của trẻ.
            </p>
          </div>
        </div>
      </section>

      {/* Product List */}
      <div className="py-10">
        <div className="max-w-screen-2xl mx-auto px-8 md:px-16 flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black text-[#1A1A2E]">
            Sản phẩm ({mappedProducts.length})
          </h2>
          <div className="h-[2px] flex-1 bg-[#F4F7FF] mx-8 hidden md:block" />
        </div>
        
        <ProductsGrid products={mappedProducts} />
        
        {mappedProducts.length === 0 && (
          <div className="text-center py-20 px-8">
            <div className="bg-[#F4F7FF] w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <GiBearFace size={48} className="text-[#9CA3AF]" />
            </div>
            <h3 className="text-xl font-bold text-[#6B7280] mb-2">
              Chưa có sản phẩm nào trong bộ sưu tập này.
            </h3>
            <p className="text-[#9CA3AF] max-w-md mx-auto">
              Chúng tôi đang chuẩn bị những mẫu thiết kế tuyệt vời nhất. 
              Vui lòng quay lại sau nhé!
            </p>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
