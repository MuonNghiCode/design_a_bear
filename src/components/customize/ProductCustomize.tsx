"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import BearModel3D from "./BearModel3D";
import {
  FUR_OPTIONS,
  THEME_OPTIONS,
  SUBJECT_OPTIONS,
  VOICE_OPTIONS,
} from "@/data/customize";
import { type CustomizeConfig, type AIRecommendation } from "@/types/customize";
import { useCart } from "@/contexts/CartContext";
import { type ProductItem } from "@/types/products";

gsap.registerPlugin(ScrollTrigger);

/* ────────────────────────────────────────────
   Inline SVG icons
   ──────────────────────────────────────────── */
function IconSparkle({ color = "currentColor" }: { color?: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z"
        fill={color}
      />
      <path
        d="M19 2L19.8 5.2L23 6L19.8 6.8L19 10L18.2 6.8L15 6L18.2 5.2L19 2Z"
        fill={color}
        opacity="0.6"
      />
    </svg>
  );
}

function IconBrain({ color = "currentColor" }: { color?: string }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-1.66Z" />
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-1.66Z" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="2 8 6 12 14 4" />
    </svg>
  );
}

function IconChevronRight() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

/* ── Theme icons ── */
function ThemeIcon({ id, color }: { id: string; color: string }) {
  const props = {
    width: 28,
    height: 28,
    viewBox: "0 0 32 32",
    fill: "none",
    "aria-hidden": true as const,
  };
  switch (id) {
    case "astronaut":
      return (
        <svg {...props}>
          <circle cx="16" cy="16" r="10" stroke={color} strokeWidth="2" />
          <circle cx="16" cy="16" r="5" fill={color} opacity="0.3" />
          <path
            d="M8 16h3M21 16h3M16 8v3M16 21v3"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );
    case "forest":
      return (
        <svg {...props}>
          <path
            d="M16 4L6 18h7l-3 10h12l-3-10h7L16 4Z"
            fill={color}
            opacity="0.8"
          />
        </svg>
      );
    case "music":
      return (
        <svg {...props}>
          <path
            d="M10 22V10l14-3v12"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="10" cy="22" r="3" fill={color} />
          <circle cx="24" cy="19" r="3" fill={color} />
        </svg>
      );
    case "scientist":
      return (
        <svg {...props}>
          <path
            d="M12 4v10L7 24h18l-5-10V4"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M10 4h12"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="13" cy="19" r="1.5" fill={color} />
          <circle cx="18" cy="21" r="1" fill={color} />
        </svg>
      );
    case "chef":
      return (
        <svg {...props}>
          <path d="M10 14h12v10H10z" fill={color} opacity="0.3" />
          <path d="M10 14h12v10H10z" stroke={color} strokeWidth="2" />
          <path d="M16 8a5 5 0 0 1 5 5H11a5 5 0 0 1 5-5Z" fill={color} />
        </svg>
      );
    case "athlete":
      return (
        <svg {...props}>
          <circle cx="16" cy="10" r="4" fill={color} />
          <path
            d="M10 20l2-6h8l2 6"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M10 20l-2 6M22 20l2 6"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );
    default:
      return (
        <svg {...props}>
          <circle cx="16" cy="16" r="10" fill={color} opacity="0.5" />
        </svg>
      );
  }
}

function SubjectIcon({ id, color }: { id: string; color: string }) {
  const p = {
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "none",
    "aria-hidden": true as const,
  };
  switch (id) {
    case "math":
      return (
        <svg {...p}>
          <path
            d="M4 6h16M4 12h16M4 18h16"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="9" cy="6" r="1.5" fill={color} />
          <path
            d="M15 10l2 4-2 4"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "language":
      return (
        <svg {...p}>
          <path
            d="M4 6h10M4 10h7M4 14h10"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M15 12l2-4 2 4M15.5 11h3"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      );
    case "science":
      return (
        <svg {...p}>
          <path
            d="M9 4v6L5 18h14L15 10V4"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="10" cy="15" r="1.5" fill={color} />
          <circle cx="14" cy="17" r="1" fill={color} />
        </svg>
      );
    case "music":
      return (
        <svg {...p}>
          <path
            d="M9 18V7l12-2v11"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="9" cy="18" r="2" fill={color} />
          <circle cx="21" cy="16" r="2" fill={color} />
        </svg>
      );
    case "art":
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="8" stroke={color} strokeWidth="2" />
          <path
            d="M12 8v8M8 12h8"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );
    case "nature":
      return (
        <svg {...p}>
          <path
            d="M12 22V10M12 10C12 10 8 6 4 8c2 4 6 4 8 2ZM12 10C12 10 16 6 20 8c-2 4-6 4-8 2Z"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "code":
      return (
        <svg {...p}>
          <path
            d="M8 9l-4 3 4 3M16 9l4 3-4 3"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M14 6l-4 12"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );
    case "social":
      return (
        <svg {...p}>
          <circle cx="9" cy="8" r="3" stroke={color} strokeWidth="2" />
          <circle cx="17" cy="10" r="2.5" stroke={color} strokeWidth="2" />
          <path
            d="M3 20c0-3.3 2.7-6 6-6h2c3.3 0 6 2.7 6 6"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );
    default:
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="8" fill={color} opacity="0.4" />
        </svg>
      );
  }
}

/* ────────────────────────────────────────────
   Step indicators
   ──────────────────────────────────────────── */
const STEPS = [
  "Ngoại hình",
  "Chủ đề",
  "Kiến thức",
  "Giọng nói",
  "AI gợi ý",
] as const;
type StepIndex = 0 | 1 | 2 | 3 | 4;

/* ────────────────────────────────────────────
   Main component
   ──────────────────────────────────────────── */
interface Props {
  accentColor: string;
  product: ProductItem;
  quantity: number;
}

import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function ProductCustomize({
  accentColor,
  product,
  quantity,
}: Props) {
  const [addingToCart, setAddingToCart] = useState(false);
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const sectionRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const [step, setStep] = useState<StepIndex>(0);
  const [config, setConfig] = useState<CustomizeConfig>({
    fur: "",
    theme: "",
    subjects: [],
    voice: "",
    childAge: 5,
    childName: "",
  });
  const [aiRecs, setAiRecs] = useState<AIRecommendation[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiApplied, setAiApplied] = useState(false);

  /* GSAP section entrance */
  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".customize-header",
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            once: true,
          },
        },
      );
      gsap.fromTo(
        ".step-pill",
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.06,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            once: true,
          },
        },
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  /* Animate panel on step change */
  const animatePanel = useCallback((cb: () => void) => {
    if (!panelRef.current) {
      cb();
      return;
    }
    gsap.to(panelRef.current, {
      opacity: 0,
      y: 12,
      duration: 0.18,
      ease: "power2.in",
      onComplete: () => {
        cb();
        gsap.to(panelRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.3,
          ease: "power2.out",
        });
      },
    });
  }, []);

  const goToStep = (s: StepIndex) => animatePanel(() => setStep(s));

  /* AI recommendations mock */
  const generateAI = useCallback(() => {
    setAiLoading(true);
    setTimeout(() => {
      const age = config.childAge;
      const recs: AIRecommendation[] = [];
      const subjects = SUBJECT_OPTIONS.filter(
        (s) => age >= s.ageMin && age <= s.ageMax,
      );

      if (subjects.length > 0) {
        recs.push({
          subjectId: subjects[0].id,
          themeId: age <= 5 ? "forest" : "astronaut",
          reason: `Bé ${config.childName || "yêu"} ${age} tuổi phù hợp nhất với ${subjects[0].label.toLowerCase()} qua chủ đề ${age <= 5 ? "Khu rừng ma thuật" : "Phi hành gia"} — kích thích trí tưởng tượng và tư duy.`,
        });
      }
      if (subjects.length > 1) {
        recs.push({
          subjectId: subjects[1].id,
          themeId: "music",
          reason: `${subjects[1].label} kết hợp âm nhạc giúp bé học qua giai điệu, tăng trí nhớ dài hạn đến 60%.`,
        });
      }
      setAiRecs(recs);
      setAiLoading(false);
    }, 1600);
  }, [config.childAge, config.childName]);

  const applyRec = (rec: AIRecommendation) => {
    const subject = SUBJECT_OPTIONS.find((s) => s.id === rec.subjectId);
    if (!subject) return;
    setConfig((prev) => ({
      ...prev,
      theme: rec.themeId,
      subjects: Array.from(new Set([...prev.subjects, rec.subjectId])),
    }));
    setAiApplied(true);
  };

  const toggleSubject = (id: string) => {
    setConfig((prev) => ({
      ...prev,
      subjects: prev.subjects.includes(id)
        ? prev.subjects.filter((s) => s !== id)
        : prev.subjects.length < 3
          ? [...prev.subjects, id]
          : prev.subjects,
    }));
  };

  const isComplete =
    config.fur && config.theme && config.subjects.length > 0 && config.voice;

  const { addItem } = useCart();

  const onAddToCart = async () => {
    if (!isAuthenticated) {
      router.push("/auth");
      return;
    }

    try {
      setAddingToCart(true);
      // Pass null for buildId temporarily as requested by user
      await addItem(
        {
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          image: product.image || "/teddy_bear.png",
          badge: product.badge,
          badgeColor: product.badgeColor,
          slug: product.slug,
          href: `/products/${product.slug || product.id}`,
        },
        quantity,
      );
      // alert("Đã thêm gấu tuỳ chỉnh vào giỏ hàng!");
      // Context will handle opening the drawer
    } catch (err) {
      alert(
        "Lỗi khi thêm vào giỏ: " + (err instanceof Error ? err.message : ""),
      );
    } finally {
      setAddingToCart(false);
    }
  };

  /* ── Render step content ── */
  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <StepAppearance
            config={config}
            setConfig={setConfig}
            accentColor={accentColor}
          />
        );
      case 1:
        return (
          <StepTheme
            config={config}
            setConfig={setConfig}
            accentColor={accentColor}
          />
        );
      case 2:
        return (
          <StepSubjects
            config={config}
            toggleSubject={toggleSubject}
            accentColor={accentColor}
          />
        );
      case 3:
        return (
          <StepVoice
            config={config}
            setConfig={setConfig}
            accentColor={accentColor}
          />
        );
      case 4:
        return (
          <StepAI
            config={config}
            setConfig={setConfig}
            aiRecs={aiRecs}
            aiLoading={aiLoading}
            aiApplied={aiApplied}
            generateAI={generateAI}
            applyRec={applyRec}
            accentColor={accentColor}
          />
        );
    }
  };

  return (
    <section ref={sectionRef} className="py-24 bg-[#F4F7FF] overflow-hidden">
      <div className="max-w-screen-2xl mx-auto px-8 md:px-16">
        {/* ── Header ── */}
        <div className="customize-header flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-14">
          <div className="relative">
            {/* Decorative bear silhouette */}
            <div
              className="absolute -top-8 -left-10 opacity-5 pointer-events-none"
              style={{ color: accentColor }}
            >
              <svg
                width="120"
                height="120"
                viewBox="0 0 48 48"
                fill="currentColor"
                aria-hidden="true"
              >
                <circle cx="14" cy="12" r="7" />
                <circle cx="34" cy="12" r="7" />
                <ellipse cx="24" cy="30" rx="16" ry="14" />
              </svg>
            </div>
            <p
              className="text-xs font-black tracking-[0.35em] uppercase mb-3 relative z-10"
              style={{ color: accentColor }}
            >
              Tạo ra một người bạn độc nhất
            </p>
            <h2
              className="text-4xl md:text-5xl font-black text-[#1A1A2E] leading-tight relative z-10"
              style={{ fontFamily: "'Fredoka', 'Nunito', sans-serif" }}
            >
              Thiết kế gấu
              <br />
              <span style={{ color: accentColor }}>theo ý con bé</span>
            </h2>
          </div>

          {/* Live config preview badges */}
          <div className="flex flex-wrap items-center gap-3">
            {config.fur && (
              <ConfigBadge
                label={
                  FUR_OPTIONS.find((f) => f.id === config.fur)?.label ?? ""
                }
                color={accentColor}
              />
            )}
            {config.theme && (
              <ConfigBadge
                label={
                  THEME_OPTIONS.find((t) => t.id === config.theme)?.label ?? ""
                }
                color={accentColor}
              />
            )}
            {config.subjects.map((s) => (
              <ConfigBadge
                key={s}
                label={SUBJECT_OPTIONS.find((o) => o.id === s)?.label ?? ""}
                color={accentColor}
              />
            ))}
            {config.voice && (
              <ConfigBadge
                label={
                  VOICE_OPTIONS.find((v) => v.id === config.voice)?.label ?? ""
                }
                color={accentColor}
              />
            )}
          </div>
        </div>

        {/* ── Step pills nav ── */}
        <div className="customize-header flex items-center gap-2 md:gap-3 mb-10 overflow-x-auto pb-2">
          {STEPS.map((label, i) => {
            const done = i < step;
            const active = i === step;
            return (
              <button
                key={i}
                type="button"
                onClick={() => goToStep(i as StepIndex)}
                className="step-pill flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-black whitespace-nowrap transition-all duration-200 cursor-pointer border-2"
                style={{
                  backgroundColor: active
                    ? accentColor
                    : done
                      ? `${accentColor}18`
                      : "white",
                  borderColor: active
                    ? accentColor
                    : done
                      ? accentColor
                      : "#E5E7EB",
                  color: active ? "white" : done ? accentColor : "#6B7280",
                }}
              >
                {done && (
                  <span
                    className="w-4 h-4 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: accentColor }}
                  >
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="white"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <polyline points="2 8 6 12 14 4" />
                    </svg>
                  </span>
                )}
                {!done && (
                  <span
                    className="w-5 h-5 rounded-full text-xs font-black flex items-center justify-center"
                    style={{
                      backgroundColor: active
                        ? "rgba(255,255,255,0.25)"
                        : "#F4F7FF",
                      color: active ? "white" : "#9CA3AF",
                    }}
                  >
                    {i + 1}
                  </span>
                )}
                {label}
              </button>
            );
          })}
        </div>

        {/* ── Main panel ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
          {/* Step content */}
          <div
            ref={panelRef}
            className="bg-white rounded-3xl p-8 md:p-10 shadow-lg min-h-80"
          >
            {renderStep()}
          </div>

          {/* Summary sidebar */}
          <CustomizeSummary
            config={config}
            setConfig={setConfig}
            accentColor={accentColor}
            isComplete={!!isComplete}
            currentStep={step}
            goToStep={goToStep}
            onAddToCart={onAddToCart}
            addingToCart={addingToCart}
          />
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────
   Config badge
   ──────────────────────────────────────────── */
function ConfigBadge({ label, color }: { label: string; color: string }) {
  return (
    <span
      className="text-xs font-black px-3 py-1.5 rounded-full"
      style={{ backgroundColor: `${color}15`, color }}
    >
      {label}
    </span>
  );
}

/* ────────────────────────────────────────────
   Summary sidebar
   ──────────────────────────────────────────── */
function CustomizeSummary({
  config,
  setConfig,
  accentColor,
  isComplete,
  currentStep,
  goToStep,
  onAddToCart,
  addingToCart,
}: {
  config: CustomizeConfig;
  setConfig: React.Dispatch<React.SetStateAction<CustomizeConfig>>;
  accentColor: string;
  isComplete: boolean;
  currentStep: StepIndex;
  goToStep: (s: StepIndex) => void;
  onAddToCart: () => Promise<void>;
  addingToCart: boolean;
}) {
  const selectedFur = FUR_OPTIONS.find((f) => f.id === config.fur);
  const selectedTheme = THEME_OPTIONS.find((t) => t.id === config.theme);
  const selectedSubjects = SUBJECT_OPTIONS.filter((s) =>
    config.subjects.includes(s.id),
  );
  const selectedVoice = VOICE_OPTIONS.find((v) => v.id === config.voice);

  const rows: { label: string; value: string | null; step: StepIndex }[] = [
    {
      label: "Ngoại hình",
      value: selectedFur
        ? `${selectedFur.label} · ${selectedFur.textureLabel}`
        : null,
      step: 0,
    },
    {
      label: "Chủ đề",
      value: selectedTheme ? selectedTheme.label : null,
      step: 1,
    },
    {
      label: "Kiến thức",
      value:
        selectedSubjects.length > 0
          ? selectedSubjects.map((s) => s.label).join(", ")
          : null,
      step: 2,
    },
    {
      label: "Giọng nói",
      value: selectedVoice ? selectedVoice.label : null,
      step: 3,
    },
  ];

  return (
    <div className="bg-white rounded-3xl p-7 shadow-lg flex flex-col gap-6 h-fit">
      {/* 3D Bear preview */}
      <div className="relative">
        <BearModel3D
          furColor={selectedFur?.color || "#F5E6C8"}
          themeColor={selectedTheme?.accent}
          themeId={selectedTheme?.id}
        />
        <p className="absolute bottom-2 right-3 text-[10px] font-bold text-[#9CA3AF] select-none">
          Kéo để xoay
        </p>
      </div>

      {/* Config rows */}
      <div className="flex flex-col gap-3">
        {rows.map((row) => (
          <button
            key={row.label}
            type="button"
            onClick={() => goToStep(row.step)}
            className="flex items-center justify-between gap-2 group cursor-pointer"
          >
            <div className="flex-1 text-left">
              <p className="text-xs font-black uppercase tracking-widest text-[#9CA3AF]">
                {row.label}
              </p>
              <p
                className={`text-sm font-bold mt-0.5 ${row.value ? "text-[#1A1A2E]" : "text-[#D1D5DB]"}`}
              >
                {row.value || "Chưa chọn"}
              </p>
            </div>
            <span className="text-[#E5E7EB] group-hover:text-[#9CA3AF] transition-colors duration-150">
              <IconChevronRight />
            </span>
          </button>
        ))}
      </div>

      {/* Name input */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="child-name"
          className="text-xs font-black uppercase tracking-widest text-[#9CA3AF]"
        >
          Tên cho gấu
        </label>
        <input
          id="child-name"
          type="text"
          value={config.childName}
          onChange={(e) =>
            setConfig((p) => ({ ...p, childName: e.target.value }))
          }
          placeholder="Ví dụ: Gấu Brownie"
          maxLength={30}
          className="w-full px-4 py-3 rounded-2xl border-2 border-[#E5E7EB] text-sm font-medium text-[#1A1A2E] placeholder:text-[#D1D5DB] outline-none transition-all duration-200"
          onFocus={(e) => (e.currentTarget.style.borderColor = accentColor)}
          onBlur={(e) => (e.currentTarget.style.borderColor = "#E5E7EB")}
        />
      </div>

      {/* CTA */}
      <button
        type="button"
        disabled={!isComplete || addingToCart}
        onClick={isComplete ? onAddToCart : undefined}
        className="w-full py-4 rounded-2xl text-white font-black text-sm tracking-wide shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100 cursor-pointer"
        style={{ backgroundColor: accentColor }}
      >
        {addingToCart
          ? "Đang xử lý..."
          : isComplete
            ? "Thêm vào giỏ hàng"
            : "Hoàn tất để tiếp tục"}
      </button>

      {isComplete && (
        <p className="text-center text-xs text-[#9CA3AF]">
          Giao hàng trong 5–7 ngày làm việc
        </p>
      )}
    </div>
  );
}

/* ────────────────────────────────────────────
   Step 0 — Appearance
   ──────────────────────────────────────────── */
function StepAppearance({
  config,
  setConfig,
  accentColor,
}: {
  config: CustomizeConfig;
  setConfig: React.Dispatch<React.SetStateAction<CustomizeConfig>>;
  accentColor: string;
}) {
  return (
    <div>
      <StepHeading
        number="01"
        title="Chọn bộ lông"
        subtitle="Mỗi màu sắc mang một cá tính riêng cho người bạn nhỏ"
        accentColor={accentColor}
      />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-8">
        {FUR_OPTIONS.map((fur) => {
          const active = config.fur === fur.id;
          return (
            <button
              key={fur.id}
              type="button"
              onClick={() => setConfig((p) => ({ ...p, fur: fur.id }))}
              className="relative flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all duration-200 cursor-pointer group"
              style={{
                borderColor: active ? accentColor : "#E5E7EB",
                backgroundColor: active ? `${accentColor}08` : "white",
              }}
            >
              {active && (
                <span
                  className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full flex items-center justify-center text-white"
                  style={{ backgroundColor: accentColor }}
                >
                  <IconCheck />
                </span>
              )}
              {/* Fur swatch */}
              <div
                className="w-14 h-14 rounded-full shadow-md border-4 border-white"
                style={{ backgroundColor: fur.color }}
              />
              <div className="text-center">
                <p className="font-black text-sm text-[#1A1A2E]">{fur.label}</p>
                <p className="text-xs text-[#9CA3AF] mt-0.5">
                  {fur.textureLabel}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Child age slider */}
      <div className="mt-10">
        <StepHeading
          number="02"
          title="Tuổi của bé"
          subtitle={`Hiện tại: ${config.childAge} tuổi — AI sẽ gợi ý nội dung phù hợp`}
          accentColor={accentColor}
        />
        <div className="mt-6 flex items-center gap-5">
          <span className="text-xs font-black text-[#9CA3AF]">2</span>
          {/* Slider wrapper — 40px tall for easy grab */}
          <div className="relative flex-1 h-10 flex items-center">
            {/* Track bg */}
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-2 rounded-full bg-[#E5E7EB]" />
            {/* Fill */}
            <div
              className="absolute left-0 top-1/2 -translate-y-1/2 h-2 rounded-full transition-all duration-150 pointer-events-none"
              style={{
                width: `${((config.childAge - 2) / 12) * 100}%`,
                backgroundColor: accentColor,
              }}
            />
            {/* Thumb */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-2 border-white shadow-md transition-all duration-150 pointer-events-none"
              style={{
                left: `calc(${((config.childAge - 2) / 12) * 100}% - 10px)`,
                backgroundColor: accentColor,
              }}
            />
            {/* Invisible native input — full 40px height for easy interaction */}
            <input
              type="range"
              min={2}
              max={14}
              value={config.childAge}
              onChange={(e) =>
                setConfig((p) => ({ ...p, childAge: Number(e.target.value) }))
              }
              className="absolute inset-0 w-full opacity-0 cursor-pointer"
            />
          </div>
          <span className="text-xs font-black text-[#9CA3AF]">14</span>
          <span
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-lg shrink-0"
            style={{ backgroundColor: accentColor }}
          >
            {config.childAge}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────
   Step 1 — Theme
   ──────────────────────────────────────────── */
function StepTheme({
  config,
  setConfig,
  accentColor,
}: {
  config: CustomizeConfig;
  setConfig: React.Dispatch<React.SetStateAction<CustomizeConfig>>;
  accentColor: string;
}) {
  return (
    <div>
      <StepHeading
        number="02"
        title="Chủ đề Tính cách"
        subtitle="Trang phục và câu chuyện sẽ xoay quanh chủ đề bé yêu thích"
        accentColor={accentColor}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        {THEME_OPTIONS.map((theme) => {
          const active = config.theme === theme.id;
          return (
            <button
              key={theme.id}
              type="button"
              onClick={() => setConfig((p) => ({ ...p, theme: theme.id }))}
              className="relative flex flex-col gap-4 p-6 rounded-2xl border-2 text-left transition-all duration-200 cursor-pointer"
              style={{
                borderColor: active ? theme.accent : "#E5E7EB",
                backgroundColor: active ? `${theme.accent}10` : "white",
              }}
            >
              {active && (
                <span
                  className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center text-white"
                  style={{ backgroundColor: theme.accent }}
                >
                  <IconCheck />
                </span>
              )}
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: `${theme.accent}18` }}
              >
                <ThemeIcon id={theme.id} color={theme.accent} />
              </div>
              <div>
                <p className="font-black text-[#1A1A2E]">{theme.label}</p>
                <p className="text-xs text-[#6B7280] mt-1 leading-relaxed">
                  {theme.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────
   Step 2 — Subjects
   ──────────────────────────────────────────── */
function StepSubjects({
  config,
  toggleSubject,
  accentColor,
}: {
  config: CustomizeConfig;
  toggleSubject: (id: string) => void;
  accentColor: string;
}) {
  const available = SUBJECT_OPTIONS.filter(
    (s) => config.childAge >= s.ageMin && config.childAge <= s.ageMax,
  );
  const locked = SUBJECT_OPTIONS.filter(
    (s) => !(config.childAge >= s.ageMin && config.childAge <= s.ageMax),
  );

  return (
    <div>
      <StepHeading
        number="03"
        title="Nội dung học tập"
        subtitle={`Chọn tối đa 3 môn — đã chọn ${config.subjects.length}/3`}
        accentColor={accentColor}
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
        {available.map((subj) => {
          const active = config.subjects.includes(subj.id);
          const disabled = !active && config.subjects.length >= 3;
          return (
            <button
              key={subj.id}
              type="button"
              onClick={() => !disabled && toggleSubject(subj.id)}
              disabled={disabled}
              className="relative flex flex-col items-center gap-3 p-5 rounded-2xl border-2 text-center transition-all duration-200 cursor-pointer"
              style={{
                borderColor: active ? subj.accent : "#E5E7EB",
                backgroundColor: active
                  ? `${subj.accent}12`
                  : disabled
                    ? "#FAFAFA"
                    : "white",
                opacity: disabled ? 0.45 : 1,
              }}
            >
              {active && (
                <span
                  className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center text-white"
                  style={{ backgroundColor: subj.accent }}
                >
                  <IconCheck />
                </span>
              )}
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${subj.accent}18` }}
              >
                <SubjectIcon id={subj.id} color={subj.accent} />
              </div>
              <p className="font-black text-sm text-[#1A1A2E]">{subj.label}</p>
            </button>
          );
        })}
      </div>

      {locked.length > 0 && (
        <div className="mt-6">
          <p className="text-xs font-black uppercase tracking-widest text-[#9CA3AF] mb-3">
            Mở khoá khi bé lớn hơn
          </p>
          <div className="flex flex-wrap gap-2">
            {locked.map((subj) => (
              <span
                key={subj.id}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-[#F4F7FF] text-[#9CA3AF]"
              >
                <SubjectIcon id={subj.id} color="#9CA3AF" />
                {subj.label}
                <span className="text-[10px]">
                  ({subj.ageMin}–{subj.ageMax}t)
                </span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ────────────────────────────────────────────
   Step 3 — Voice
   ──────────────────────────────────────────── */
function StepVoice({
  config,
  setConfig,
  accentColor,
}: {
  config: CustomizeConfig;
  setConfig: React.Dispatch<React.SetStateAction<CustomizeConfig>>;
  accentColor: string;
}) {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [sysVoices, setSysVoices] = useState<SpeechSynthesisVoice[]>([]);

  // Load system voices (async on Chrome)
  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const load = () => setSysVoices(window.speechSynthesis.getVoices());
    load();
    window.speechSynthesis.addEventListener("voiceschanged", load);
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", load);
      window.speechSynthesis.cancel();
    };
  }, []);

  // Pick best matching system voice for gender — prefer different actual voices for male vs female
  const pickVoice = (gender: string): SpeechSynthesisVoice | null => {
    if (!sysVoices.length) return null;
    const vi = sysVoices.filter((v) => v.lang.startsWith("vi"));
    const pool = vi.length > 0 ? vi : sysVoices;

    const femaleKeys = [
      "linh",
      "hoai",
      "hoa",
      "my",
      "nu",
      "female",
      "woman",
      "girl",
      "zira",
      "aria",
      "jenny",
      "sonia",
    ];
    const maleKeys = [
      "namminh",
      "nam minh",
      " an",
      "duc",
      "hung",
      "male",
      "man",
      "david",
      "mark",
      "daniel",
      "ryan",
      "guy",
    ];

    const femaleVoice = pool.find((v) =>
      femaleKeys.some((k) =>
        v.name.toLowerCase().replace(/\s/g, "").includes(k.replace(/\s/g, "")),
      ),
    );
    const maleVoice = pool.find((v) =>
      maleKeys.some((k) =>
        v.name.toLowerCase().replace(/\s/g, "").includes(k.replace(/\s/g, "")),
      ),
    );

    if (gender === "male") {
      // Prefer a distinct male voice; if not found, use last in pool to differ from female fallback
      return maleVoice ?? (pool.length > 1 ? pool[pool.length - 1] : pool[0]);
    }
    if (gender === "female" || gender === "child") {
      return femaleVoice ?? pool[0];
    }
    return pool[0];
  };

  const handlePreview = (
    e: React.MouseEvent,
    voice: (typeof VOICE_OPTIONS)[0],
  ) => {
    e.stopPropagation();
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    if (playingId === voice.id) {
      setPlayingId(null);
      return;
    }

    const utter = new SpeechSynthesisUtterance(voice.sampleText);
    utter.lang = "vi-VN";
    utter.pitch = voice.pitch;
    utter.rate = voice.rate;
    utter.volume = 1;
    const sv = pickVoice(voice.gender);
    if (sv) utter.voice = sv;
    utter.onstart = () => setPlayingId(voice.id);
    utter.onend = () => setPlayingId(null);
    utter.onerror = () => setPlayingId(null);
    window.speechSynthesis.speak(utter);
  };

  const GENDER_META: Record<
    string,
    { label: string; bg: string; color: string; icon: React.ReactNode }
  > = {
    female: {
      label: "Nữ",
      bg: "#FFF0F6",
      color: "#FF6B9D",
      icon: (
        <svg
          width="14"
          height="14"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="8" cy="6" r="4.5" stroke="#FF6B9D" strokeWidth="1.8" />
          <path
            d="M8 10.5V15M6 13h4"
            stroke="#FF6B9D"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
    male: {
      label: "Nam",
      bg: "#EFF6FF",
      color: "#3B82F6",
      icon: (
        <svg
          width="14"
          height="14"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="7" cy="9" r="4.5" stroke="#3B82F6" strokeWidth="1.8" />
          <path
            d="M10.5 5.5L14 2M14 2h-3M14 2v3"
            stroke="#3B82F6"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    child: {
      label: "Trẻ em",
      bg: "#FFFBEB",
      color: "#F59E0B",
      icon: (
        <svg
          width="14"
          height="14"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="8" cy="6" r="3.5" stroke="#F59E0B" strokeWidth="1.8" />
          <path
            d="M3 14c0-2.8 2.2-5 5-5s5 2.2 5 5"
            stroke="#F59E0B"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
  };

  return (
    <div>
      <StepHeading
        number="04"
        title="Giọng nói của gấu"
        subtitle="Chọn giọng phù hợp nhất — nhấn Nghe thử để cảm nhận trước khi quyết định"
        accentColor={accentColor}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
        {VOICE_OPTIONS.map((voice) => {
          const active = config.voice === voice.id;
          const playing = playingId === voice.id;
          const meta = GENDER_META[voice.gender];
          return (
            <button
              key={voice.id}
              type="button"
              onClick={() => setConfig((p) => ({ ...p, voice: voice.id }))}
              className="flex flex-col gap-3 p-5 rounded-2xl border-2 text-left transition-all duration-200 cursor-pointer"
              style={{
                borderColor: active ? accentColor : "#E5E7EB",
                backgroundColor: active ? `${accentColor}08` : "white",
              }}
            >
              {/* Top row: gender badge + radio */}
              <div className="flex items-center justify-between">
                <span
                  className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-black"
                  style={{ backgroundColor: meta.bg, color: meta.color }}
                >
                  {meta.icon}
                  {meta.label}
                </span>
                <div
                  className="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200"
                  style={{
                    borderColor: active ? accentColor : "#E5E7EB",
                    backgroundColor: active ? accentColor : "white",
                  }}
                >
                  {active && (
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 12 12"
                      fill="white"
                      aria-hidden="true"
                    >
                      <circle cx="6" cy="6" r="3" />
                    </svg>
                  )}
                </div>
              </div>

              {/* Voice name */}
              <p className="font-black text-[#1A1A2E]">{voice.label}</p>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                {voice.description}
              </p>

              {/* Preview button */}
              <button
                type="button"
                onClick={(e) => handlePreview(e, voice)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-black transition-all duration-150 cursor-pointer border w-fit"
                style={{
                  backgroundColor: playing ? accentColor : `${accentColor}12`,
                  borderColor: playing ? accentColor : `${accentColor}30`,
                  color: playing ? "white" : accentColor,
                }}
                aria-label={playing ? "Dừng" : "Nghe thử"}
              >
                {playing ? (
                  <>
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <rect x="1" y="1" width="4" height="10" rx="1" />
                      <rect x="7" y="1" width="4" height="10" rx="1" />
                    </svg>
                    Dừng
                  </>
                ) : (
                  <>
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M2 1.5l9 4.5-9 4.5V1.5Z" />
                    </svg>
                    Nghe thử
                  </>
                )}
              </button>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────
   Step 4 — AI Recommendations
   ──────────────────────────────────────────── */
function StepAI({
  config,
  setConfig,
  aiRecs,
  aiLoading,
  aiApplied,
  generateAI,
  applyRec,
  accentColor,
}: {
  config: CustomizeConfig;
  setConfig: React.Dispatch<React.SetStateAction<CustomizeConfig>>;
  aiRecs: AIRecommendation[];
  aiLoading: boolean;
  aiApplied: boolean;
  generateAI: () => void;
  applyRec: (rec: AIRecommendation) => void;
  accentColor: string;
}) {
  return (
    <div>
      <StepHeading
        number="05"
        title="AI gợi ý cho bé"
        subtitle="Dựa trên độ tuổi và sở thích, AI sẽ đề xuất lộ trình học tối ưu"
        accentColor={accentColor}
      />

      {/* Age + interest input for AI */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 p-6 rounded-2xl bg-[#F4F7FF] border border-[#E5E7EB]">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-black uppercase tracking-widest text-[#9CA3AF]">
            Tên bé
          </label>
          <input
            type="text"
            value={config.childName}
            onChange={(e) =>
              setConfig((p) => ({ ...p, childName: e.target.value }))
            }
            placeholder="Ví dụ: Bé Minh"
            maxLength={30}
            className="px-4 py-3 rounded-2xl border-2 border-[#E5E7EB] bg-white text-sm font-medium text-[#1A1A2E] placeholder:text-[#D1D5DB] outline-none"
            onFocus={(e) => (e.currentTarget.style.borderColor = accentColor)}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#E5E7EB")}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-black uppercase tracking-widest text-[#9CA3AF]">
            Tuổi: {config.childAge}
          </label>
          <div className="flex items-center gap-3">
            <span className="text-xs text-[#9CA3AF] shrink-0">2t</span>
            <div className="relative flex-1 h-10 flex items-center">
              <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-2 rounded-full bg-[#E5E7EB]" />
              <div
                className="absolute left-0 top-1/2 -translate-y-1/2 h-2 rounded-full pointer-events-none"
                style={{
                  width: `${((config.childAge - 2) / 12) * 100}%`,
                  backgroundColor: accentColor,
                }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-2 border-white shadow-md pointer-events-none"
                style={{
                  left: `calc(${((config.childAge - 2) / 12) * 100}% - 10px)`,
                  backgroundColor: accentColor,
                }}
              />
              <input
                type="range"
                min={2}
                max={14}
                value={config.childAge}
                onChange={(e) =>
                  setConfig((p) => ({ ...p, childAge: Number(e.target.value) }))
                }
                className="absolute inset-0 w-full opacity-0 cursor-pointer"
              />
            </div>
            <span className="text-xs text-[#9CA3AF] shrink-0">14t</span>
          </div>
        </div>
      </div>

      {/* Generate button */}
      <button
        type="button"
        onClick={generateAI}
        disabled={aiLoading}
        className="mt-6 flex items-center gap-3 px-7 py-4 rounded-2xl text-white font-black text-sm shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
        style={{ backgroundColor: accentColor }}
      >
        {aiLoading ? (
          <>
            <svg
              className="animate-spin"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
            AI đang phân tích...
          </>
        ) : (
          <>
            <IconSparkle />
            Nhận gợi ý từ AI
          </>
        )}
      </button>

      {/* Recommendations */}
      {aiRecs.length > 0 && !aiLoading && (
        <div className="mt-8 flex flex-col gap-4">
          <p
            className="text-xs font-black uppercase tracking-widest"
            style={{ color: accentColor }}
          >
            Gợi ý dành cho {config.childName || "bé"}
          </p>
          {aiRecs.map((rec, i) => {
            const subj = SUBJECT_OPTIONS.find((s) => s.id === rec.subjectId);
            const theme = THEME_OPTIONS.find((t) => t.id === rec.themeId);
            if (!subj || !theme) return null;
            return (
              <div
                key={i}
                className="flex flex-col sm:flex-row gap-4 p-6 rounded-2xl border-2 border-[#E5E7EB] bg-white"
              >
                <div className="flex items-start gap-4 flex-1">
                  <div className="flex items-center gap-2 shrink-0">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${subj.accent}18` }}
                    >
                      <SubjectIcon id={subj.id} color={subj.accent} />
                    </div>
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${theme.accent}18` }}
                    >
                      <ThemeIcon id={theme.id} color={theme.accent} />
                    </div>
                  </div>
                  <div>
                    <p className="font-black text-[#1A1A2E] text-sm">
                      {subj.label} × {theme.label}
                    </p>
                    <p className="text-xs text-[#6B7280] mt-1 leading-relaxed">
                      {rec.reason}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => applyRec(rec)}
                  className="px-5 py-2.5 rounded-xl text-sm font-black whitespace-nowrap transition-all duration-200 cursor-pointer self-end sm:self-center"
                  style={{
                    backgroundColor: `${accentColor}12`,
                    color: accentColor,
                  }}
                >
                  Áp dụng
                </button>
              </div>
            );
          })}
          {aiApplied && (
            <div
              className="flex items-center gap-3 p-4 rounded-2xl"
              style={{ backgroundColor: `${accentColor}10` }}
            >
              <IconBrain color={accentColor} />
              <p className="text-sm font-bold" style={{ color: accentColor }}>
                Đã áp dụng gợi ý AI vào cấu hình gấu của bé!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ────────────────────────────────────────────
   Step heading helper
   ──────────────────────────────────────────── */
function StepHeading({
  number,
  title,
  subtitle,
  accentColor,
}: {
  number: string;
  title: string;
  subtitle: string;
  accentColor: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <span
        className="text-3xl font-black leading-none opacity-15 shrink-0 select-none"
        style={{ color: accentColor, fontFamily: "'Fredoka', sans-serif" }}
      >
        {number}
      </span>
      <div>
        <h3
          className="text-xl font-black text-[#1A1A2E]"
          style={{ fontFamily: "'Fredoka', 'Nunito', sans-serif" }}
        >
          {title}
        </h3>
        <p className="text-sm text-[#6B7280] mt-1">{subtitle}</p>
      </div>
    </div>
  );
}
