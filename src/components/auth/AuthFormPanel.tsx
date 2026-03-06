"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import AuthCard from "./AuthCard";

export default function AuthFormPanel() {
  const router = useRouter();

  return (
    <div className="relative z-10 flex flex-col items-center justify-center w-full lg:w-[50%] xl:w-[46%] h-full px-4 sm:px-8 gap-4">

      {/* Mobile only: logo + back button */}
      <div className="flex lg:hidden items-center justify-between w-full mb-2">
        <div className="flex items-center gap-2">
          <div className="relative w-9 h-9 shrink-0">
            <Image src="/logo.webp" alt="Design a Bear" fill className="object-contain" />
          </div>
          <span className="text-white font-black text-lg">Design a Bear</span>
        </div>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-white/70 hover:text-white text-sm font-semibold transition-colors cursor-pointer"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Quay lại
        </button>
      </div>

      {/* Form card */}
      <div className="w-full max-w-md">
        <AuthCard />
      </div>
    </div>
  );
}
