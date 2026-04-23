"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { GiBearFace } from "react-icons/gi";
import { HiArrowRight } from "react-icons/hi2";
import { collectionService } from "@/services";
import { CollectionResponse } from "@/types";

const COLLECTION_COLORS = [
  "#17409A", // Navy
  "#FF8C42", // Orange
  "#FF6B9D", // Pink
  "#7C5CFC", // Purple
  "#4ECDC4", // Green
  "#FFD93D", // Yellow
];

const CollectionsGrid = () => {
  const [collections, setCollections] = useState<CollectionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const res = await collectionService.getCollections();
        if (res.isSuccess) {
          setCollections(res.value);
        }
      } catch (error) {
        console.error("Failed to fetch collections:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  useEffect(() => {
    if (!loading && collections.length > 0) {
      const items = gridRef.current?.querySelectorAll(".collection-card");
      if (items) {
        gsap.fromTo(
          items,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: gridRef.current,
              start: "top 80%",
            },
          }
        );
      }
    }
  }, [loading, collections]);

  if (loading) {
    return (
      <div className="max-w-screen-2xl mx-auto px-8 md:px-16 py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-80 bg-white rounded-3xl animate-pulse shadow-sm"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <section className="bg-white py-24">
      <div className="max-w-screen-2xl mx-auto px-8 md:px-16">
        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10"
        >
          {collections.map((item, index) => {
            const color = COLLECTION_COLORS[index % COLLECTION_COLORS.length];
            return (
              <Link
                key={item.collectionId}
                href={`/collections/${item.slug}`}
                className="collection-card group relative h-96 rounded-3xl overflow-hidden bg-[#F4F7FF] shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                {/* Visual Background */}
                <div 
                  className="absolute inset-0 opacity-10 transition-opacity group-hover:opacity-20"
                  style={{ backgroundColor: color }}
                />
                
                {/* Bear Icon Background */}
                <div className="absolute -right-10 -bottom-10 opacity-5 group-hover:scale-110 transition-transform duration-700">
                  <GiBearFace size={300} color={color} />
                </div>

                <div className="relative h-full p-10 flex flex-col justify-between z-10">
                  <div>
                    <div 
                      className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg"
                      style={{ backgroundColor: color }}
                    >
                      <GiBearFace size={32} />
                    </div>
                    <h3 
                      className="text-3xl font-bold text-[#1A1A2E] mb-4 group-hover:text-[#17409A] transition-colors"
                      style={{ fontFamily: "'Fredoka', sans-serif" }}
                    >
                      {item.name}
                    </h3>
                    <p className="text-[#6B7280] text-lg line-clamp-3">
                      Khám phá những thiết kế đặc biệt trong bộ sưu tập {item.name}. 
                      Mỗi sản phẩm đều mang một câu chuyện riêng biệt.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-[#17409A] font-bold group-hover:gap-4 transition-all">
                    <span>Xem chi tiết</span>
                    <HiArrowRight />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {collections.length === 0 && (
          <div className="text-center py-20">
            <GiBearFace size={64} className="mx-auto text-[#9CA3AF] mb-4" />
            <h3 className="text-xl font-bold text-[#6B7280]">
              Hiện chưa có bộ sưu tập nào được ra mắt.
            </h3>
            <p className="text-[#9CA3AF]">
              Quay lại sau để khám phá những điều bất ngờ nhé!
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default CollectionsGrid;
