"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { IoStarSharp } from "react-icons/io5";

gsap.registerPlugin(ScrollTrigger);

/* ────────────────────────────────────────────
   Reviews data
   ──────────────────────────────────────────── */
const REVIEWS = [
  {
    name: "Chị Nguyễn Thanh Hà",
    role: "Mẹ bé Minh Anh (4 tuổi)",
    rating: 5,
    content:
      "Con gái tôi rất thích chú gấu này! Bé có thể nói chuyện với gấu hàng giờ liền. Tôi rất yên tâm vì nội dung học tập rất phù hợp với độ tuổi của bé. Chất liệu mềm mại và an toàn tuyệt đối.",
    avatar: "TH",
    avatarColor: "#FF6B9D",
  },
  {
    name: "Anh Trần Đức Minh",
    role: "Bố bé Gia Bảo (6 tuổi)",
    rating: 5,
    content:
      "Thằng bé nhà tôi vốn không thích đọc sách, nhưng khi có gấu kể chuyện, bé bắt đầu yêu thích việc học. Tính năng AI rất thông minh, phản hồi tự nhiên như người thật. Rất đáng đồng tiền!",
    avatar: "ĐM",
    avatarColor: "#4ECDC4",
  },
  {
    name: "Chị Phạm Thu Trang",
    role: "Mẹ bé Bảo Ngọc (3 tuổi)",
    rating: 5,
    content:
      "Tôi đã mua 2 chú gấu cho 2 bé nhà mình. Mỗi bé có nội dung học tập khác nhau phù hợp với độ tuổi. App điều khiển rất dễ sử dụng. Bảo hành tốt, team hỗ trợ nhiệt tình.",
    avatar: "TT",
    avatarColor: "#7C5CFC",
  },
  {
    name: "Anh Lê Văn Hùng",
    role: "Bố bé Phương Anh (5 tuổi)",
    rating: 5,
    content:
      "Sản phẩm vượt xa mong đợi của tôi. Con gái tôi giờ đây có người bạn đồng hành thực sự. Gấu có thể trả lời mọi câu hỏi của bé một cách thông minh và dễ hiểu. Quá tuyệt vời!",
    avatar: "VH",
    avatarColor: "#FF8C42",
  },
  {
    name: "Chị Võ Thị Mai",
    role: "Mẹ bé Quốc Bảo (7 tuổi)",
    rating: 5,
    content:
      "Thiết kế rất đẹp và chất lượng cao cấp. Bé nhà tôi học được rất nhiều điều bổ ích qua những câu chuyện mà gấu kể. Dịch vụ chăm sóc khách hàng xuất sắc, hỗ trợ tận tình.",
    avatar: "TM",
    avatarColor: "#8B5CF6",
  },
];

/* ────────────────────────────────────────────
   Paw Print SVG Component
   ──────────────────────────────────────────── */
const PawPrint = ({
  className = "",
  size = 40,
  color = "#17409A",
}: {
  className?: string;
  size?: number;
  color?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
    className={className}
  >
    <ellipse cx="8.5" cy="8" rx="2.5" ry="3" />
    <ellipse cx="15.5" cy="8" rx="2.5" ry="3" />
    <ellipse cx="6" cy="13" rx="2" ry="2.5" />
    <ellipse cx="18" cy="13" rx="2" ry="2.5" />
    <ellipse cx="12" cy="16" rx="4" ry="5" />
  </svg>
);

/* ────────────────────────────────────────────
   Star Rating
   ──────────────────────────────────────────── */
function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: count }).map((_, i) => (
        <IoStarSharp key={i} className="text-[#FFD93D] text-lg" />
      ))}
    </div>
  );
}

/* ────────────────────────────────────────────
   Component
   ──────────────────────────────────────────── */
export default function Testimonials() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    if (headingRef.current) {
      gsap.fromTo(
        headingRef.current,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: headingRef.current,
            start: "top 85%",
            once: true,
          },
        },
      );
    }

    if (carouselRef.current) {
      gsap.fromTo(
        carouselRef.current,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: carouselRef.current,
            start: "top 80%",
            once: true,
          },
        },
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  // Continuous infinite scroll animation
  useEffect(() => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const cardWidth = 600; // Approximate width of a card with padding
    const totalWidth = cardWidth * REVIEWS.length;

    // Infinite loop animation
    const tl = gsap.timeline({ repeat: -1 });
    tl.to(container, {
      x: -totalWidth,
      duration: 30, // 30 seconds for smooth slow scroll
      ease: "none",
      onComplete: () => {
        gsap.set(container, { x: 0 });
      },
    });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-32 md:py-40 overflow-hidden bg-white"
      style={{
        fontFamily: "'Nunito', sans-serif",
      }}
    >
      {/* ── Background decorative orbs ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-20 left-10 w-96 h-96 rounded-full"
          style={{
            background: "radial-gradient(circle, #FF6B9D 0%, transparent 70%)",
            opacity: 0.02,
          }}
        />
        <div
          className="absolute bottom-32 right-16 w-lg h-128 rounded-full"
          style={{
            background: "radial-gradient(circle, #4ECDC4 0%, transparent 70%)",
            opacity: 0.02,
          }}
        />
      </div>

      {/* ── Decorative paw prints ── */}
      <PawPrint
        size={45}
        color="#FF6B9D"
        className="absolute top-20 right-24 opacity-[0.04] rotate-20"
      />
      <PawPrint
        size={40}
        color="#4ECDC4"
        className="absolute top-1/2 left-16 opacity-[0.05] -rotate-15"
      />
      <PawPrint
        size={42}
        color="#7C5CFC"
        className="absolute bottom-32 right-1/4 opacity-[0.04] rotate-25"
      />

      {/* ── Large decorative quote mark ── */}
      <div className="absolute top-16 left-8 text-[#17409A]/3 text-[14rem] font-black leading-none select-none pointer-events-none">
        &ldquo;
      </div>

      <div className="max-w-screen-2xl mx-auto px-8 md:px-16 relative z-10">
        {/* ── Premium Heading with decorative lines ── */}
        <div ref={headingRef} className="text-center mb-20 md:mb-24">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-16 h-px bg-[#17409A]/20" />
            <p className="text-[#17409A] font-bold text-sm tracking-widest uppercase">
              Phụ huynh nói gì
            </p>
            <div className="w-16 h-px bg-[#17409A]/20" />
          </div>
          <h2 className="text-[#1A1A2E] font-black text-5xl sm:text-6xl md:text-7xl leading-tight mb-6">
            Niềm tin từ{" "}
            <span className="text-[#17409A]">hàng nghìn gia đình</span>
          </h2>
          <p className="text-[#6B7280] text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Hơn 10.000 gia đình đã chọn Design a Bear làm người bạn đồng hành
            cho con yêu
          </p>
        </div>

        {/* ── Carousel Container ── */}
        <div ref={carouselRef} className="relative">
          {/* Continuous scroll wrapper */}
          <div className="overflow-hidden relative">
            <div
              ref={scrollContainerRef}
              className="flex gap-8 will-change-transform"
            >
              {/* Duplicate reviews twice for seamless infinite loop */}
              {[...REVIEWS, ...REVIEWS].map((review, i) => (
                <div key={i} className="w-137.5 shrink-0">
                  <div className="bg-white rounded-3xl p-8 md:p-10 flex flex-col shadow-xl h-full">
                    {/* Stars and quote icon */}
                    <div className="flex items-start justify-between mb-6">
                      <Stars count={review.rating} />
                      <div className="text-[#17409A]/10 text-5xl font-black leading-none">
                        &ldquo;
                      </div>
                    </div>

                    {/* Content */}
                    <p className="text-[#1A1A2E] text-base md:text-lg leading-relaxed mb-8 flex-1">
                      {review.content}
                    </p>

                    {/* Author */}
                    <div className="flex items-center gap-4 pt-6">
                      {/* Avatar */}
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-base shrink-0 shadow-lg"
                        style={{ backgroundColor: review.avatarColor }}
                      >
                        {review.avatar}
                      </div>
                      <div>
                        <p className="text-[#1A1A2E] font-black text-base mb-1">
                          {review.name}
                        </p>
                        <p className="text-[#9CA3AF] text-sm">{review.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Left fade gradient */}
            <div
              className="absolute left-0 top-0 bottom-0 w-32 pointer-events-none z-10"
              style={{
                background:
                  "linear-gradient(to right, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)",
              }}
            />

            {/* Right fade gradient */}
            <div
              className="absolute right-0 top-0 bottom-0 w-32 pointer-events-none z-10"
              style={{
                background:
                  "linear-gradient(to left, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)",
              }}
            />
          </div>
        </div>

        {/* ── Bottom stats ── */}
        <div className="mt-20 md:mt-24 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
          <div className="text-center">
            <div className="text-[#17409A] font-black text-4xl md:text-5xl mb-2">
              10,000+
            </div>
            <div className="text-[#6B7280] font-semibold text-sm md:text-base">
              Gia đình tin tưởng
            </div>
          </div>
          <div className="hidden md:block w-px h-16 bg-[#17409A]/20" />
          <div className="text-center">
            <div className="text-[#17409A] font-black text-4xl md:text-5xl mb-2">
              4.9/5
            </div>
            <div className="text-[#6B7280] font-semibold text-sm md:text-base">
              Đánh giá trung bình
            </div>
          </div>
          <div className="hidden md:block w-px h-16 bg-[#17409A]/20" />
          <div className="text-center">
            <div className="text-[#17409A] font-black text-4xl md:text-5xl mb-2">
              98%
            </div>
            <div className="text-[#6B7280] font-semibold text-sm md:text-base">
              Hài lòng & giới thiệu
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
