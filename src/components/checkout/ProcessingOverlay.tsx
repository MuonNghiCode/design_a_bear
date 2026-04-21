"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";

const MESSAGES = [
  "Đang chuẩn bị gấu thợ...",
  "Kiểm tra lại linh kiện...",
  "Đang khâu trái tim hồng...",
  "Liên kết với cổng thanh toán PayOS...",
  "Đang bảo mật giao dịch...",
  "Gấu của bạn sắp lên đường rồi!",
];

export function ProcessingOverlay() {
  const [messageIndex, setMessageIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Background fade in
    gsap.to(containerRef.current, {
      opacity: 1,
      duration: 0.5,
      ease: "power2.out",
    });

    // Progress bar animation
    gsap.to(progressRef.current, {
      width: "90%",
      duration: 25, // Slow progress to keep it moving
      ease: "power1.inOut",
    });

    // Message rotation
    const interval = setInterval(() => {
      gsap.to(textRef.current, {
        y: -10,
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
          setMessageIndex((prev) => (prev + 1) % MESSAGES.length);
          gsap.fromTo(
            textRef.current,
            { y: 10, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.4, ease: "back.out(1.7)" }
          );
        },
      });
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center p-6 opacity-0"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(12px)",
        fontFamily: "'Nunito', sans-serif",
      }}
    >
      <div className="relative w-72 h-72 mb-8 group">
        {/* Decorative background glow */}
        <div 
          className="absolute inset-0 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-1000"
          style={{ backgroundColor: "#17409A" }}
        />
        
        <div className="relative w-full h-full transform hover:scale-105 transition-transform duration-500">
          <Image
            src="/images/bear-craftsman.png"
            alt="Đang chuẩn bị gấu"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      <div className="max-w-xs w-full text-center">
        <h2 
          className="text-2xl font-black mb-2 tracking-tight"
          style={{ color: "#1A1A2E" }}
        >
          Đang xử lý đơn hàng
        </h2>
        
        <div className="relative h-7 mb-6">
          <p
            ref={textRef}
            className="text-sm font-bold absolute inset-0 text-center"
            style={{ color: "#17409A" }}
          >
            {MESSAGES[messageIndex]}
          </p>
        </div>

        {/* Progress bar container */}
        <div 
          className="h-1.5 w-full bg-blue-50 rounded-full overflow-hidden relative"
          style={{ backgroundColor: "#E8EDF7" }}
        >
          <div
            ref={progressRef}
            className="absolute top-0 left-0 h-full rounded-full transition-all duration-300"
            style={{ 
              width: "5%", 
              background: "linear-gradient(90deg, #17409A, #4ECDC4)",
              boxShadow: "0 0 10px rgba(23, 64, 154, 0.3)"
            }}
          />
        </div>
        
        <p className="mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-[#9CA3AF]">
          Vui lòng không tắt trình duyệt
        </p>
      </div>

      {/* Floating Paw Prints */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
         {[...Array(6)].map((_, i) => (
           <div 
             key={i}
             className="absolute opacity-5 animate-pulse"
             style={{
               top: `${Math.random() * 100}%`,
               left: `${Math.random() * 100}%`,
               transform: `rotate(${Math.random() * 360}deg) scale(${0.5 + Math.random()})`,
             }}
           >
             <PawsIcon size={48} />
           </div>
         ))}
      </div>
    </div>
  );
}

function PawsIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="14" r="5" />
      <circle cx="6" cy="7" r="3" />
      <circle cx="18" cy="7" r="3" />
      <circle cx="12" cy="4" r="3" />
    </svg>
  );
}
