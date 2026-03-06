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
];

/* ────────────────────────────────────────────
   Star Rating
   ──────────────────────────────────────────── */
function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <IoStarSharp key={i} className="text-[#FFD93D] text-base" />
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
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    if (headingRef.current) {
      gsap.fromTo(
        headingRef.current,
        { y: 25, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: { trigger: headingRef.current, start: "top 85%", once: true },
        }
      );
    }

    if (cardsRef.current) {
      gsap.fromTo(
        cardsRef.current.children,
        { y: 25, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: { trigger: cardsRef.current, start: "top 80%", once: true },
        }
      );
    }

    return () => { ScrollTrigger.getAll().forEach((t) => t.kill()); };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-32 bg-white overflow-hidden"
      style={{ fontFamily: "'Nunito', sans-serif" }}
    >
      {/* ── Decorative quote marks ── */}
      <div className="absolute top-16 left-8 text-[#17409A]/5 text-[12rem] font-black leading-none select-none pointer-events-none">
        &ldquo;
      </div>

      <div className="max-w-screen-2xl mx-auto px-8 md:px-16">
        {/* ── Heading ── */}
        <div ref={headingRef} className="text-center mb-16 md:mb-20">
          <p className="text-[#FF8C42] font-bold text-sm tracking-widest uppercase mb-4">
            Phụ huynh nói gì
          </p>
          <h2 className="text-[#1A1A2E] font-black text-3xl sm:text-4xl md:text-5xl leading-tight mb-5">
            Niềm tin từ hàng nghìn gia đình
          </h2>
          <p className="text-[#6B7280] text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Hơn 10.000 gia đình đã chọn Design a Bear làm người bạn đồng hành
            cho con yêu. Đây là cảm nhận của họ.
          </p>
        </div>

        {/* ── Review Cards ── */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
        >
          {REVIEWS.map((review, i) => (
            <div
              key={i}
              className="bg-[#F4F7FF] rounded-3xl p-7 md:p-8 flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              {/* Stars */}
              <Stars count={review.rating} />

              {/* Content */}
              <p className="text-[#1A1A2E] text-sm md:text-base leading-relaxed mt-5 mb-6 flex-1">
                &ldquo;{review.content}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-5 border-t border-[#E5E7EB]">
                {/* Avatar */}
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                  style={{ backgroundColor: review.avatarColor }}
                >
                  {review.avatar}
                </div>
                <div>
                  <p className="text-[#1A1A2E] font-bold text-sm">
                    {review.name}
                  </p>
                  <p className="text-[#9CA3AF] text-xs">
                    {review.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
