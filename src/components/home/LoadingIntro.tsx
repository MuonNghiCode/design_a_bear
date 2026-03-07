"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";

const BRAND_LETTERS = "DESIGN A BEAR".split("");

export default function LoadingIntro({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressLineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Lock scroll
    document.body.style.overflow = "hidden";

    const tl = gsap.timeline({
      onComplete: () => {
        // Unlock scroll & notify parent
        document.body.style.overflow = "";
        onComplete();
      },
    });

    // ── 1. Logo scale in ──
    tl.fromTo(
      logoRef.current,
      { scale: 0.6, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.6)" },
    )

      // ── 2. Letters stagger in ──
      .fromTo(
        letterRefs.current.filter(Boolean),
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.04,
          ease: "power3.out",
        },
        "-=0.2",
      )

      // ── 3. Tagline fade in ──
      .fromTo(
        taglineRef.current,
        { y: 10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" },
        "-=0.1",
      )

      // ── 4. Progress bar fill ──
      .fromTo(
        progressLineRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 1.1, ease: "power1.inOut" },
        "+=0.1",
      )

      // ── 5. Pause briefly ──
      .to({}, { duration: 0.2 })

      // ── 6. Everything fades/scale slightly before slide ──
      .to(
        [
          logoRef.current,
          letterRefs.current.filter(Boolean),
          taglineRef.current,
          progressBarRef.current,
        ],
        { opacity: 0, y: -20, duration: 0.4, ease: "power2.in", stagger: 0.02 },
      )

      // ── 7. Overlay slides UP to reveal hero ──
      .to(
        overlayRef.current,
        { y: "-100%", duration: 0.8, ease: "power3.inOut" },
        "-=0.1",
      );

    return () => {
      tl.kill();
      document.body.style.overflow = "";
    };
  }, [onComplete]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-200 flex flex-col items-center justify-center"
      style={{ backgroundColor: "#0E2A66", fontFamily: "'Nunito', sans-serif" }}
    >
      {/* Bear paw decorative — top left */}
      <div className="absolute top-10 left-8 opacity-[0.06] select-none pointer-events-none">
        <svg width="72" height="72" viewBox="0 0 100 100" fill="white">
          <ellipse cx="50" cy="65" rx="30" ry="25" />
          <ellipse cx="22" cy="38" rx="12" ry="10" />
          <ellipse cx="78" cy="38" rx="12" ry="10" />
          <ellipse cx="12" cy="58" rx="9" ry="8" />
          <ellipse cx="88" cy="58" rx="9" ry="8" />
        </svg>
      </div>

      {/* Bear paw decorative — bottom right */}
      <div className="absolute bottom-16 right-12 opacity-[0.04] rotate-12 select-none pointer-events-none">
        <svg width="56" height="56" viewBox="0 0 100 100" fill="white">
          <ellipse cx="50" cy="65" rx="30" ry="25" />
          <ellipse cx="22" cy="38" rx="12" ry="10" />
          <ellipse cx="78" cy="38" rx="12" ry="10" />
          <ellipse cx="12" cy="58" rx="9" ry="8" />
          <ellipse cx="88" cy="58" rx="9" ry="8" />
        </svg>
      </div>

      {/* Logo */}
      <div ref={logoRef} className="mb-8 opacity-0">
        <div className="relative w-20 h-20 md:w-24 md:h-24">
          <Image
            src="/logo.webp"
            alt="Design a Bear"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Brand name letters */}
      <div className="flex items-end justify-center flex-wrap gap-x-0 mb-4 px-6">
        {BRAND_LETTERS.map((char, i) => (
          <span
            key={i}
            ref={(el) => {
              letterRefs.current[i] = el;
            }}
            className="inline-block font-black text-white opacity-0"
            style={{
              fontSize: "clamp(1.8rem, 7vw, 5rem)",
              letterSpacing: "0.08em",
              minWidth: char === " " ? "0.4em" : undefined,
              lineHeight: 1,
            }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </div>

      {/* Tagline */}
      <p
        ref={taglineRef}
        className="text-white/50 text-sm md:text-base font-medium tracking-[0.2em] uppercase mb-12 opacity-0"
      >
        Smart · Sáng tạo · Yêu thương
      </p>

      {/* Progress bar */}
      <div ref={progressBarRef} className="relative w-40 md:w-56">
        <div className="h-px bg-white/15 rounded-full overflow-hidden">
          <div
            ref={progressLineRef}
            className="h-full bg-white/70 origin-left rounded-full"
            style={{ transform: "scaleX(0)" }}
          />
        </div>
      </div>
    </div>
  );
}
