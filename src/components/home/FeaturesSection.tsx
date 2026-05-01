"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { 
  IoChatbubblesOutline, 
  IoBookOutline, 
  IoBulbOutline, 
  IoPhonePortraitOutline,
} from "react-icons/io5";

// Register ScrollTrigger
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const LEFT_FEATURES = [
  {
    title: "Trò chuyện AI thông minh",
    description: "Nhận diện giọng nói và trò chuyện tự nhiên như một người bạn thực thụ, giúp bé tự tin giao tiếp.",
    icon: IoChatbubblesOutline,
    color: "#FF8C42" // Warm Orange
  },
  {
    title: "Học tập tương tác",
    description: "Cùng bé học tiếng Anh, làm toán cơ bản và kiên nhẫn trả lời hàng vạn câu hỏi 'Vì sao?'.",
    icon: IoBulbOutline,
    color: "#4ECDC4" // Mint Green
  }
];

const RIGHT_FEATURES = [
  {
    title: "Kể chuyện & Hát ru",
    description: "Kho tàng hàng ngàn câu chuyện cổ tích và bài hát ru êm dịu, mang đến cho bé giấc mơ đẹp.",
    icon: IoBookOutline,
    color: "#7C5CFC" // Purple
  },
  {
    title: "Kết nối gia đình từ xa",
    description: "Ba mẹ gửi lời nhắn yêu thương từ ứng dụng và phát trực tiếp qua gấu bông cho bé nghe.",
    icon: IoPhonePortraitOutline,
    color: "#FF6B9D" // Pink
  }
];

export default function FeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const bearRef = useRef<HTMLDivElement>(null);
  const leftCardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const rightCardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const triggersRef = useRef<ReturnType<typeof ScrollTrigger.create>[]>([]);

  useEffect(() => {
    if (!sectionRef.current) return;

    // Initial state
    if (headingRef.current) gsap.set(headingRef.current, { y: 20, opacity: 0 });
    if (bearRef.current) gsap.set(bearRef.current, { scale: 0.9, opacity: 0 });
    
    leftCardsRef.current.forEach(card => {
      if (card) gsap.set(card, { x: -30, opacity: 0 });
    });
    rightCardsRef.current.forEach(card => {
      if (card) gsap.set(card, { x: 30, opacity: 0 });
    });

    const ctx = gsap.context(() => {
      // Heading Animation
      if (headingRef.current) {
        triggersRef.current.push(
          ScrollTrigger.create({
            trigger: headingRef.current,
            start: "top 85%",
            once: true,
            onEnter: () => {
              gsap.to(headingRef.current, { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" });
            }
          })
        );
      }

      // Bear Animation
      if (bearRef.current) {
        triggersRef.current.push(
          ScrollTrigger.create({
            trigger: bearRef.current,
            start: "top 75%",
            once: true,
            onEnter: () => {
              gsap.to(bearRef.current, { 
                scale: 1, 
                opacity: 1, 
                duration: 1, 
                ease: "back.out(1.2)" 
              });
              
              // Continuous floating
              gsap.to(bearRef.current, {
                y: -15,
                duration: 2.5,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                delay: 1
              });
            }
          })
        );
      }

      // Left Cards
      leftCardsRef.current.forEach((card, i) => {
        if (card) {
          triggersRef.current.push(
            ScrollTrigger.create({
              trigger: card,
              start: "top 80%",
              once: true,
              onEnter: () => {
                gsap.to(card, {
                  x: 0, opacity: 1, duration: 0.6, delay: i * 0.1, ease: "power2.out"
                });
              }
            })
          );
        }
      });

      // Right Cards
      rightCardsRef.current.forEach((card, i) => {
        if (card) {
          triggersRef.current.push(
            ScrollTrigger.create({
              trigger: card,
              start: "top 80%",
              once: true,
              onEnter: () => {
                gsap.to(card, {
                  x: 0, opacity: 1, duration: 0.6, delay: i * 0.1, ease: "power2.out"
                });
              }
            })
          );
        }
      });
    }, sectionRef);

    return () => {
      ctx.revert();
      triggersRef.current.forEach(t => t.kill());
      triggersRef.current = [];
    };
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="relative py-32 md:py-40 bg-[#F4F7FF] overflow-hidden"
      style={{ fontFamily: "'Nunito', sans-serif" }}
    >
      {/* ── Decorative background elements ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.02]">
        <div className="absolute top-1/4 left-10 w-96 h-96 rounded-full" style={{ backgroundColor: "#17409A" }} />
        <div className="absolute bottom-1/4 right-10 w-125 h-125 rounded-full" style={{ backgroundColor: "#FF6B9D" }} />
      </div>

      {/* ── Paw prints decorative ── */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        {[
          { top: "15%", left: "12%", size: 48, rot: -20, op: 0.04, color: "#17409A" },
          { top: "40%", right: "8%", size: 42, rot: 25, op: 0.05, color: "#FF8C42" },
          { bottom: "20%", left: "5%", size: 55, rot: 15, op: 0.03, color: "#4ECDC4" },
        ].map((p, i) => (
          <svg
            key={i}
            width={p.size}
            height={p.size}
            viewBox="0 0 64 64"
            fill={p.color}
            style={{
              position: "absolute",
              top: p.top, left: p.left, right: p.right, bottom: p.bottom,
              opacity: p.op, transform: `rotate(${p.rot}deg)`
            }}
          >
            <ellipse cx="32" cy="44" rx="16" ry="13" />
            <circle cx="14" cy="28" r="7" />
            <circle cx="50" cy="28" r="7" />
            <circle cx="23" cy="20" r="5.5" />
            <circle cx="41" cy="20" r="5.5" />
          </svg>
        ))}
      </div>

      <div className="max-w-screen-2xl mx-auto px-8 md:px-16 relative z-10">
        
        {/* ── Heading matching HowItWorks style ── */}
        <div ref={headingRef} className="text-center mb-20 md:mb-28">
          <div className="flex items-center justify-center gap-4 mb-5">
            <div className="w-16 h-px bg-[#FF8C42]"></div>
            <p className="text-[#FF8C42] font-bold text-sm tracking-[0.2em] uppercase">
              Khám Phá Sức Mạnh
            </p>
            <div className="w-16 h-px bg-[#FF8C42]"></div>
          </div>

          <h2 className="text-[#1A1A2E] font-black text-4xl sm:text-5xl md:text-6xl leading-tight mb-6">
            Chú Gấu Của Bé <br className="hidden md:block" /> 
            <span className="text-[#17409A]">Sẽ Làm Được Những Gì?</span>
          </h2>

          <p className="text-[#6B7280] text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Hơn cả một món đồ chơi nhồi bông, Smart Bear được tích hợp công nghệ AI tiên tiến, 
            sẵn sàng đồng hành cùng bé trong mọi khoảnh khắc vui chơi và học tập.
          </p>
        </div>

        {/* ── Center Bear & Branching Features ── */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-8 xl:gap-16">
          
          {/* Left Features */}
          <div className="w-full lg:w-[32%] flex flex-col gap-8 md:gap-12 relative z-10 order-2 lg:order-1">
            {LEFT_FEATURES.map((feature, idx) => (
              <div 
                key={idx}
                ref={(el) => { leftCardsRef.current[idx] = el; }}
                className="group relative bg-white rounded-3xl p-8 md:p-10 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 flex flex-col items-center sm:items-start lg:items-end text-center sm:text-left lg:text-right z-10"
              >
                {/* Connecting Line (Desktop) */}
                <div className="hidden lg:block absolute top-1/2 -right-8 xl:-right-16 w-8 xl:w-16 border-t-2 border-dashed border-[#17409A]/20 z-0"></div>
                
                {/* Icon Circle */}
                <div 
                  className="flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full shadow-lg mb-6 transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: `${feature.color}15`, color: feature.color }}
                >
                  <feature.icon className="text-3xl md:text-4xl" />
                </div>
                
                <h3 className="text-[#1A1A2E] font-black text-2xl mb-4 leading-tight group-hover:text-[#17409A] transition-colors">
                  {feature.title}
                </h3>
                <p className="text-[#6B7280] text-base md:text-lg leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* Center Bear Image */}
          <div 
            ref={bearRef} 
            className="w-full lg:w-[36%] flex justify-center items-center relative order-1 lg:order-2 px-4"
          >
            {/* Ambient background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white rounded-full opacity-60 blur-3xl -z-10" />
            
            <div className="relative group">
              <div className="absolute inset-0 bg-[#17409A]/5 rounded-full blur-2xl group-hover:bg-[#17409A]/10 transition-colors duration-500"></div>
              <Image
                src="/teddy_bear.png"
                alt="Smart Teddy Bear"
                width={500}
                height={600}
                className="object-contain drop-shadow-2xl relative z-20 w-auto h-auto max-h-[400px] lg:max-h-[550px]"
                priority
              />
            </div>
          </div>

          {/* Right Features */}
          <div className="w-full lg:w-[32%] flex flex-col gap-8 md:gap-12 relative z-10 order-3">
            {RIGHT_FEATURES.map((feature, idx) => (
              <div 
                key={idx}
                ref={(el) => { rightCardsRef.current[idx] = el; }}
                className="group relative bg-white rounded-3xl p-8 md:p-10 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 flex flex-col items-center sm:items-start text-center sm:text-left z-10"
              >
                {/* Connecting Line (Desktop) */}
                <div className="hidden lg:block absolute top-1/2 -left-8 xl:-left-16 w-8 xl:w-16 border-t-2 border-dashed border-[#17409A]/20 z-0"></div>
                
                {/* Icon Circle */}
                <div 
                  className="flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full shadow-lg mb-6 transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: `${feature.color}15`, color: feature.color }}
                >
                  <feature.icon className="text-3xl md:text-4xl" />
                </div>
                
                <h3 className="text-[#1A1A2E] font-black text-2xl mb-4 leading-tight group-hover:text-[#17409A] transition-colors">
                  {feature.title}
                </h3>
                <p className="text-[#6B7280] text-base md:text-lg leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>

      <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&subset=vietnamese&display=swap');`}</style>
    </section>
  );
}
