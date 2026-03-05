"use client";

import AuthCard from "@/src/components/auth/AuthCard";
import Image from "next/image";


export default function AuthPage() {
  return (
    <div
      className="min-h-screen -mt-20 relative flex"
      style={{ fontFamily: "'Nunito', sans-serif" }}
    >
      {/* ── Full-page background ── */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/login-background.png"
          alt="Login background"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* ── Left panel: form card ── */}
      <div className="relative z-10 flex items-center justify-center w-full lg:w-[52%] min-h-screen px-8 py-12">
        <AuthCard />
      </div>

      {/* ── Right panel: decorative ── */}
      <div className="hidden lg:flex relative z-10 flex-1 items-center justify-center">
        <div className="text-center px-8 select-none">
          {/* Floating teddy bear */}
          <div
            className="relative w-72 h-72 mx-auto mb-8 drop-shadow-2xl"
            style={{ animation: "floatBear 3s ease-in-out infinite" }}
          >
            <Image
              src="/teddy_bear.png"
              alt="Design a Bear mascot"
              fill
              className="object-contain"
              priority
            />
          </div>

          <h2 className="text-5xl font-black text-[#17409A] mb-4 leading-tight">
            Design a Bear
          </h2>
          <p className="text-[#6B7280] text-lg max-w-sm mx-auto leading-relaxed font-semibold">
            Gấu bông thông minh tích hợp IoT &amp; AI,
            <br />
            dạy học cho trẻ em theo cách riêng của chúng.
          </p>
        </div>
      </div>

      {/* Nunito font + float keyframe */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&subset=vietnamese&display=swap');
        @keyframes floatBear {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-18px); }
        }
      `}</style>
    </div>
  );
}
