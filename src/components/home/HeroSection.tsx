"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ────────────────────────────────────────────
   Text phases — mapped to video time (8 s)
   Mỗi phase có heading + sub được chia thành
   các từ riêng lẻ để tạo hiệu ứng text-reveal
   ──────────────────────────────────────────── */
interface TextPhase {
  start: number;
  end: number;
  heading: string;
  sub?: string;
  cta?: { label: string; href: string };
  annotationLayout?: boolean;
  heroTitle?: boolean;
  annotations?: {
    label: string;
    detail: string;
    x: number;
    y: number;
    anchorX: number;
    anchorY: number;
  }[];
}

const PHASES: TextPhase[] = [
  {
    start: 0,
    end: 1.4,
    heading: "DESIGN A BEAR",
    heroTitle: true,
  },
  {
    start: 1.4,
    end: 2.8,
    heading: "Nơi sáng tạo gặp gỡ công nghệ hiện đại, hơn cả một món đồ chơi thông thường",
  },
  {
    start: 3,
    end: 4.2,
    heading: "Tạo ra từ trái tim, tích hợp hàng trăm linh kiện công nghệ bên trong mỗi chú gấu",
  },
  {
    start: 4.4,
    end: 5.6,
    heading: "",
    annotationLayout: true,
    annotations: [
      {
        label: "Vi xử lý AI",
        detail: "Chip xử lý ngôn ngữ tự nhiên, nhận diện giọng nói và phản hồi thông minh",
        x: 8, y: 15, anchorX: 42, anchorY: 35,
      },
      {
        label: "Loa HD",
        detail: "Âm thanh trong trẻo, kể chuyện và phát nhạc ru êm dịu",
        x: 75, y: 12, anchorX: 58, anchorY: 32,
      },
      {
        label: "Cảm biến cảm ứng",
        detail: "Nhận biết cử chỉ ôm, vỗ, nắm tay để phản hồi tương tác",
        x: 5, y: 55, anchorX: 40, anchorY: 50,
      },
      {
        label: "Module WiFi",
        detail: "Kết nối không dây, cập nhật nội dung và điều khiển từ xa qua app",
        x: 72, y: 52, anchorX: 60, anchorY: 48,
      },
      {
        label: "Pin lithium",
        detail: "Dung lượng cao, 12 giờ hoạt động liên tục, sạc nhanh USB-C",
        x: 10, y: 82, anchorX: 44, anchorY: 68,
      },
      {
        label: "Bộ nhớ 8GB",
        detail: "Lưu trữ hàng nghìn câu chuyện, bài hát và bài học tương tác",
        x: 70, y: 80, anchorX: 56, anchorY: 70,
      },
    ],
  },
  {
    start: 5.8,
    end: 7.0,
    heading: "Trí tuệ nhân tạo biết học, biết hiểu, biết yêu thương và an toàn tuyệt đối",
    sub: "Nhận diện giọng nói tiếng Việt chính xác · Trả lời hàng nghìn câu hỏi của trẻ · Kể chuyện tương tác theo cảm xúc ",
  },
  {
    start: 7.4,
    end: 8,
    heading: "Thiết kế chú gấu bông thông minh của riêng bạn ngay hôm nay",
    sub: "Chọn màu sắc, giọng nói, tính cách và nội dung học tập phù hợp với con bạn",
    cta: { label: "Khám phá ngay", href: "/products" },
  },
];

const VIDEO_DURATION = 8;
const HERO_WORDS = ["DESIGN", "A", "BEAR"];

/* ────────────────────────────────────────────
   Utility: split text into words for reveal
   ──────────────────────────────────────────── */
function splitIntoWords(text: string): string[] {
  return text.split(/\s+/).filter(Boolean);
}

/* ────────────────────────────────────────────
   Smooth cubic ease-in-out
   ──────────────────────────────────────────── */
function easeInOutCubic(t: number): number {
  return t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/* ────────────────────────────────────────────
   Apply text-reveal glow to word elements
   ──────────────────────────────────────────── */
function applyWordReveal(
  wordEls: (HTMLSpanElement | null)[],
  phaseT: number,
  isHeroTitle: boolean,
) {
  const wordCount = wordEls.filter(Boolean).length;
  if (wordCount === 0) return;

  // Glow timing within the phase
  const glowStart = 0.10;
  const glowEnd = 0.78;
  const glowRange = glowEnd - glowStart;

  wordEls.forEach((wordEl, wi) => {
    if (!wordEl) return;

    const wordGlowStart = glowStart + (wi / wordCount) * glowRange;
    const wordGlowEnd = glowStart + ((wi + 1) / wordCount) * glowRange;
    const wordGlowDuration = wordGlowEnd - wordGlowStart;

    const wordProgress = Math.max(
      0,
      Math.min(1, (phaseT - wordGlowStart) / wordGlowDuration)
    );

    const eased = easeInOutCubic(wordProgress);

    // Alpha: dim → bright
    const alpha = 0.15 + eased * 0.85;
    wordEl.style.color = `rgba(244, 247, 255, ${alpha})`;

    // Glow effect
    const glowIntensity = eased * (isHeroTitle ? 50 : 30);
    const glowSpread = eased * (isHeroTitle ? 70 : 45);
    wordEl.style.textShadow = eased > 0.03
      ? `0 0 ${glowIntensity}px rgba(244, 247, 255, ${eased * 0.7}), 0 0 ${glowSpread}px rgba(74, 144, 226, ${eased * 0.35}), 0 2px 20px rgba(0,0,0,0.5)`
      : `0 2px 20px rgba(0,0,0,0.4)`;
  });
}

/* ────────────────────────────────────────────
   Component
   ──────────────────────────────────────────── */
export default function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const phaseRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Word refs for each phase: phaseWordRefs[phaseIndex] = [span, span, ...]
  // Heading words
  const headingWordRefs = useRef<(HTMLSpanElement | null)[][]>([]);
  // Sub words
  const subWordRefs = useRef<(HTMLSpanElement | null)[][]>([]);

  const annotationRefs = useRef<(HTMLDivElement | null)[][]>([]);
  const lineRefs = useRef<(SVGLineElement | null)[][]>([]);

  const CTA_PHASE_INDEX = PHASES.length - 1;

  useEffect(() => {
    const video = videoRef.current;
    const section = sectionRef.current;
    if (!video || !section) return;

    const st = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.8,
      onUpdate: (self) => {
        const progress = self.progress;
        const currentTime = progress * VIDEO_DURATION;

        if (video.readyState >= 2) {
          video.currentTime = currentTime;
        }

        PHASES.forEach((phase, pi) => {
          const el = phaseRefs.current[pi];
          if (!el) return;

          const isCTA = pi === CTA_PHASE_INDEX;
          const phaseCenter = (phase.start + phase.end) / 2;
          const phaseDuration = phase.end - phase.start;
          const slideDuration = phaseDuration * 1.8;

          const phaseT =
            (currentTime - phaseCenter) / slideDuration + 0.5;

          /* ── CTA phase: stay visible once reached, never exit ── */
          if (isCTA) {
            // enterT: 0 = just started entering, 1+ = fully entered
            const enterT = Math.max(0, (currentTime - phase.start) / (phaseDuration * 0.5));
            // Clamp opacity at 1 — never fade out
            const ctaOpacity = Math.min(1, enterT);
            // Y slides up and stops at 0 — never moves past
            const ctaY = Math.max(0, (1 - Math.min(1, enterT))) * 50;

            el.style.transform = `translateY(${ctaY}px)`;
            el.style.opacity = String(ctaOpacity);

            // Text reveal for CTA, clamped at fully lit
            const hWords = headingWordRefs.current[pi] || [];
            const sWords = subWordRefs.current[pi] || [];
            const ctaRevealT = Math.max(0, Math.min(1, enterT));
            applyWordReveal(hWords, ctaRevealT, false);
            applyWordReveal(sWords, ctaRevealT, false);
            return;
          }

          // Gentle Y movement
          const yPx = (phaseT - 0.5) * -1.0 * window.innerHeight;

          // Opacity
          const distFromCenter = Math.abs(phaseT - 0.5);
          let opacity: number;
          if (distFromCenter < 0.18) {
            opacity = 1;
          } else if (phaseT < 0.5) {
            opacity = Math.max(0, 1 - (distFromCenter - 0.18) / 0.28);
          } else {
            opacity = Math.max(0, 1 - (distFromCenter - 0.18) / 0.22);
          }

          el.style.transform = `translateY(${yPx}px)`;
          el.style.opacity = String(opacity);

          /* ── Text reveal for heading words ── */
          if (!phase.annotationLayout) {
            const hWords = headingWordRefs.current[pi] || [];
            const sWords = subWordRefs.current[pi] || [];

            applyWordReveal(hWords, phaseT, !!phase.heroTitle);

            // Sub words reveal starts slightly after heading
            const subPhaseT = Math.max(0, (phaseT - 0.08) / 0.92);
            applyWordReveal(sWords, subPhaseT, false);
          }

          /* ── Annotation lines ── */
          if (phase.annotationLayout && phase.annotations) {
            const annots = annotationRefs.current[pi] || [];
            const lines = lineRefs.current[pi] || [];

            phase.annotations.forEach((_, ai) => {
              const annotEl = annots[ai];
              const lineEl = lines[ai];
              if (!annotEl || !lineEl) return;

              const staggerDelay = ai * 0.06;
              const annotProgress = (phaseT - 0.10 - staggerDelay) / 0.55;
              const annotOpacity = Math.max(0, Math.min(1, annotProgress * 2));

              const lineLength = lineEl.getTotalLength?.() || 200;
              const drawProgress = Math.max(0, Math.min(1, annotProgress * 1.5));

              annotEl.style.opacity = String(annotOpacity);
              lineEl.style.strokeDasharray = `${lineLength}`;
              lineEl.style.strokeDashoffset = `${lineLength * (1 - drawProgress)}`;
              lineEl.style.opacity = String(annotOpacity);
            });
          }
        });
      },
    });

    return () => {
      st.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative -mt-20"
      style={{ height: "1000vh" }}
    >
      {/* Sticky viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Video */}
        <video
          ref={videoRef}
          src="/hero-section.mp4"
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ pointerEvents: "none" }}
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Text phases */}
        {PHASES.map((phase, pi) => {
          // Init ref arrays
          if (!headingWordRefs.current[pi]) headingWordRefs.current[pi] = [];
          if (!subWordRefs.current[pi]) subWordRefs.current[pi] = [];
          if (phase.annotationLayout && phase.annotations) {
            if (!annotationRefs.current[pi]) annotationRefs.current[pi] = [];
            if (!lineRefs.current[pi]) lineRefs.current[pi] = [];
          }

          const headingWords = phase.heroTitle
            ? HERO_WORDS
            : splitIntoWords(phase.heading);
          const subWords = phase.sub ? splitIntoWords(phase.sub) : [];

          return (
            <div
              key={pi}
              ref={(el) => { phaseRefs.current[pi] = el; }}
              className="absolute inset-0 flex items-center justify-center"
              style={{ opacity: 0, willChange: "transform, opacity" }}
            >
              {/* ── Hero title: large word-by-word ── */}
              {phase.heroTitle && (
                <div className="text-center w-full px-4">
                  <h1 className="flex items-center justify-center gap-4 sm:gap-6 md:gap-8 whitespace-nowrap">
                    {HERO_WORDS.map((word, wi) => (
                      <span
                        key={wi}
                        ref={(el) => { headingWordRefs.current[pi][wi] = el; }}
                        className="font-black tracking-tight leading-none"
                        style={{
                          fontFamily: "'Nunito', sans-serif",
                          fontSize: "clamp(3rem, 10vw, 9rem)",
                          color: "rgba(244, 247, 255, 0.15)",
                          textShadow: "0 2px 20px rgba(0,0,0,0.4)",
                          lineHeight: 1,
                        }}
                      >
                        {word}
                      </span>
                    ))}
                  </h1>
                </div>
              )}

              {/* ── Standard text layout with word-by-word reveal ── */}
              {!phase.annotationLayout && !phase.heroTitle && (
                <div className="text-center max-w-5xl mx-auto px-6 md:px-16">
                  {/* Heading — each word is a span */}
                  <h2 className="font-black tracking-tight leading-tight text-3xl sm:text-4xl md:text-5xl lg:text-6xl flex flex-wrap items-center justify-center gap-x-3 gap-y-1 sm:gap-x-4 md:gap-x-5">
                    {headingWords.map((word, wi) => (
                      <span
                        key={wi}
                        ref={(el) => { headingWordRefs.current[pi][wi] = el; }}
                        className="inline-block"
                        style={{
                          fontFamily: "'Nunito', sans-serif",
                          color: "rgba(244, 247, 255, 0.15)",
                          textShadow: "0 2px 20px rgba(0,0,0,0.4)",
                          lineHeight: 1.15,
                        }}
                      >
                        {word}
                      </span>
                    ))}
                  </h2>

                  {/* Sub — each word is a span */}
                  {subWords.length > 0 && (
                    <p className="mt-6 md:mt-8 flex flex-wrap items-center justify-center gap-x-[6px] gap-y-1 sm:gap-x-2 max-w-3xl mx-auto">
                      {subWords.map((word, wi) => (
                        <span
                          key={wi}
                          ref={(el) => { subWordRefs.current[pi][wi] = el; }}
                          className="inline-block text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed font-medium"
                          style={{
                            fontFamily: "'Nunito', sans-serif",
                            color: "rgba(244, 247, 255, 0.15)",
                            textShadow: "0 1px 12px rgba(0,0,0,0.3)",
                          }}
                        >
                          {word}
                        </span>
                      ))}
                    </p>
                  )}

                  {/* CTA Button */}
                  {phase.cta && (
                    <div className="mt-10 md:mt-12">
                      <Link
                        href={phase.cta.href}
                        className="inline-block bg-[#17409A] text-[#F4F7FF] font-bold px-10 py-5 rounded-2xl text-lg shadow-xl hover:bg-[#0E2A66] transition-colors duration-200"
                        style={{ fontFamily: "'Nunito', sans-serif" }}
                      >
                        {phase.cta.label}
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* ── Annotation layout ── */}
              {phase.annotationLayout && phase.annotations && (
                <div className="absolute inset-0">
                  <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: "none" }}>
                    {phase.annotations.map((ann, ai) => (
                      <line
                        key={ai}
                        ref={(el) => {
                          if (!lineRefs.current[pi]) lineRefs.current[pi] = [];
                          lineRefs.current[pi][ai] = el;
                        }}
                        x1={`${ann.x + (ann.x < 50 ? 18 : -1)}%`}
                        y1={`${ann.y + 2}%`}
                        x2={`${ann.anchorX}%`}
                        y2={`${ann.anchorY}%`}
                        stroke="rgba(244, 247, 255, 0.6)"
                        strokeWidth="1.5"
                        style={{ opacity: 0 }}
                      />
                    ))}
                    {phase.annotations.map((ann, ai) => (
                      <circle
                        key={`dot-${ai}`}
                        cx={`${ann.anchorX}%`}
                        cy={`${ann.anchorY}%`}
                        r="4"
                        fill="#F4F7FF"
                        style={{ opacity: 0 }}
                        className="annotation-dot"
                      />
                    ))}
                  </svg>

                  {phase.annotations.map((ann, ai) => (
                    <div
                      key={ai}
                      ref={(el) => {
                        if (!annotationRefs.current[pi]) annotationRefs.current[pi] = [];
                        annotationRefs.current[pi][ai] = el;
                      }}
                      className={`absolute max-w-[250px] ${ann.x < 50 ? "text-left" : "text-right"}`}
                      style={{
                        left: `${ann.x}%`,
                        top: `${ann.y}%`,
                        opacity: 0,
                        fontFamily: "'Nunito', sans-serif",
                      }}
                    >
                      <div
                        className="font-black text-lg md:text-xl"
                        style={{
                          color: "#F4F7FF",
                          textShadow: "0 2px 15px rgba(0,0,0,0.6)",
                        }}
                      >
                        {ann.label}
                      </div>
                      <div
                        className="font-medium text-xs md:text-sm mt-1 leading-snug"
                        style={{
                          color: "rgba(244, 247, 255, 0.7)",
                          textShadow: "0 1px 8px rgba(0,0,0,0.5)",
                        }}
                      >
                        {ann.detail}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Nunito font */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&subset=vietnamese&display=swap');`}</style>
    </section>
  );
}
