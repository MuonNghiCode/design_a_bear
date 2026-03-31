"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type Review } from "@/types/review";
import { type ProductReview, type ReviewReply } from "@/types";
import { useReviewApi } from "@/hooks";

gsap.registerPlugin(ScrollTrigger);

/* ── Inline filled star SVG ── */
function StarFilled({
  size = 16,
  color = "#FFD93D",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill={color}
      aria-hidden="true"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

/* ── Quote mark SVG ── */
function QuoteIcon({
  color = "#17409A",
  opacity = 0.1,
}: {
  color?: string;
  opacity?: number;
}) {
  return (
    <svg
      width="80"
      height="60"
      viewBox="0 0 80 60"
      style={{ opacity }}
      aria-hidden="true"
    >
      <path
        d="M0 36C0 20 8 8 24 0L30 10C20 15 15 22 15 30H28V60H0V36ZM48 36C48 20 56 8 72 0L78 10C68 15 63 22 63 30H76V60H48V36Z"
        fill={color}
      />
    </svg>
  );
}

/* ── Chevron arrows ── */
function IconChevronLeft() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}
function IconChevronRight() {
  return (
    <svg
      width="20"
      height="20"
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

function ReviewCard({
  review,
  accentColor,
}: {
  review: ReviewView;
  accentColor: string;
}) {
  return (
    <div className="relative bg-white rounded-3xl p-8 shadow-lg h-full flex flex-col">
      {/* Large quote mark — decorative background */}
      <div className="absolute top-4 right-6 pointer-events-none">
        <QuoteIcon color={accentColor} opacity={0.08} />
      </div>

      {/* Accent top border */}
      <div
        className="absolute top-0 left-8 w-14 h-1 rounded-full"
        style={{ backgroundColor: accentColor }}
      />

      {/* Stars */}
      <div className="flex items-center gap-1 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <StarFilled
            key={i}
            size={16}
            color={i < review.rating ? "#FFD93D" : "#E5E7EB"}
          />
        ))}
        <span className="ml-2 text-xs text-[#9CA3AF]">{review.date}</span>
        {review.verified && (
          <span className="ml-auto text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#4ECDC4]/15 text-[#4ECDC4]">
            Đã mua
          </span>
        )}
      </div>

      {/* Review text */}
      <p className="text-[#1A1A2E] text-base leading-relaxed mb-6 relative z-10 flex-1">
        {review.text}
      </p>

      {review.replies.length > 0 && (
        <div className="mb-5 space-y-2">
          {review.replies.map((reply) => (
            <div
              key={reply.replyId}
              className="rounded-2xl bg-[#F4F7FF] px-4 py-3 border border-[#E5E7EB]"
            >
              <p className="text-xs font-black text-[#17409A] mb-1">
                Phản hồi từ nhân viên
              </p>
              <p className="text-sm text-[#1A1A2E] leading-relaxed">
                {reply.content}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Author */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-black shrink-0"
          style={{ backgroundColor: accentColor }}
        >
          {review.avatar}
        </div>
        <div>
          <p className="font-black text-sm text-[#1A1A2E]">{review.name}</p>
          <p className="text-xs text-[#9CA3AF]">Khách hàng</p>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────
   Review Carousel
   ──────────────────────────────────────────── */
const CARDS_VISIBLE = 3;

function ReviewCarousel({
  reviews,
  accentColor,
}: {
  reviews: ReviewView[];
  accentColor: string;
}) {
  const [page, setPage] = useState(0);
  const [cardWidth, setCardWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const GAP = 24;
  const total = reviews.length;
  const maxPage = Math.max(0, total - CARDS_VISIBLE);

  // Measure container and derive card width
  useEffect(() => {
    const update = () => {
      if (containerRef.current) {
        setCardWidth(
          (containerRef.current.clientWidth - GAP * (CARDS_VISIBLE - 1)) /
            CARDS_VISIBLE,
        );
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const goTo = useCallback(
    (next: number) => {
      const clamped = Math.max(0, Math.min(next, maxPage));
      setPage(clamped);
    },
    [maxPage],
  );

  useEffect(() => {
    if (!trackRef.current || cardWidth === 0) return;
    gsap.to(trackRef.current, {
      x: -(page * (cardWidth + GAP)),
      duration: 0.45,
      ease: "power3.out",
    });
  }, [page, cardWidth]);

  useEffect(() => {
    setPage(0);
    if (trackRef.current) gsap.set(trackRef.current, { x: 0 });
  }, [reviews]);

  if (total === 0) {
    return (
      <div className="py-16 flex flex-col items-center gap-3 text-center">
        <p className="font-black text-lg text-[#1A1A2E]">
          Chưa có đánh giá cho mức này
        </p>
        <p className="text-sm text-[#6B7280]">Hãy thử chọn số sao khác.</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div ref={containerRef} className="overflow-hidden">
        <div
          ref={trackRef}
          className="flex"
          style={{ gap: GAP, willChange: "transform" }}
        >
          {reviews.map((review) => (
            <div
              key={review.id}
              className="shrink-0"
              style={{
                width:
                  cardWidth ||
                  `calc((100cqw - ${GAP * (CARDS_VISIBLE - 1)}px) / ${CARDS_VISIBLE})`,
              }}
            >
              <ReviewCard review={review} accentColor={accentColor} />
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mt-8">
        {/* Dot indicators */}
        <div className="flex items-center gap-2">
          {Array.from({ length: maxPage + 1 }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              className="rounded-full transition-all duration-300 cursor-pointer"
              style={{
                width: i === page ? 28 : 8,
                height: 8,
                backgroundColor: i === page ? accentColor : "#E5E7EB",
              }}
              aria-label={`Trang ${i + 1}`}
            />
          ))}
        </div>

        {/* Prev / Next arrows */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => goTo(page - 1)}
            disabled={page === 0}
            className="w-11 h-11 rounded-2xl border-2 border-[#E5E7EB] flex items-center justify-center text-[#6B7280] hover:border-[#1A1A2E] hover:text-[#1A1A2E] transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            aria-label="Trước"
          >
            <IconChevronLeft />
          </button>
          <button
            type="button"
            onClick={() => goTo(page + 1)}
            disabled={page >= maxPage}
            className="w-11 h-11 rounded-2xl flex items-center justify-center text-white transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            style={{ backgroundColor: accentColor }}
            aria-label="Tiếp"
          >
            <IconChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────
   Main section
   ──────────────────────────────────────────── */
interface Props {
  productId: string;
  accentColor: string;
  reviews?: ProductReview[];
}

const STAR_FILTERS = [0, 5, 4, 3, 2, 1] as const;
const STAR_LABELS: Record<number, string> = {
  0: "Tất cả",
  5: "5 ★",
  4: "4 ★",
  3: "3 ★",
  2: "2 ★",
  1: "1 ★",
};

interface ReviewView extends Review {
  replies: ReviewReply[];
}

function toShortUserLabel(userId: string): { name: string; avatar: string } {
  const suffix = userId.slice(-4).toUpperCase();
  return {
    name: `Khách hàng #${suffix}`,
    avatar: suffix.slice(0, 2),
  };
}

function mapApiReviewToView(r: ProductReview): ReviewView {
  const date = new Date(r.createdAt);
  const formattedDate = `${date.getDate().toString().padStart(2, "0")}/${(
    date.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}/${date.getFullYear()}`;
  const userMeta = toShortUserLabel(r.userId);

  return {
    id: r.reviewId,
    name: userMeta.name,
    avatar: userMeta.avatar,
    rating: r.rating,
    date: formattedDate,
    text: r.body || r.title,
    verified: true,
    replies: r.reviewReplies ?? [],
  };
}

export default function ProductReviews({
  productId,
  accentColor,
  reviews = [],
}: Props) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [filterStar, setFilterStar] = useState<number>(0);
  const [apiReviews, setApiReviews] = useState<ProductReview[]>(reviews);
  const [canReview, setCanReview] = useState(false);
  const { getProductReviews, canReviewProduct } = useReviewApi();

  useEffect(() => {
    let active = true;

    getProductReviews(productId, { pageIndex: 1, pageSize: 10 })
      .then((data) => {
        if (!active) return;
        setApiReviews(data.items ?? []);
      })
      .catch(() => {
        if (!active) return;
        setApiReviews(reviews);
      });

    canReviewProduct(productId).then((allowed) => {
      if (!active) return;
      setCanReview(allowed === true);
    });

    return () => {
      active = false;
    };
  }, [productId, getProductReviews, canReviewProduct, reviews]);

  const rawReviews = apiReviews.map(mapApiReviewToView);

  const filtered =
    filterStar === 0
      ? rawReviews
      : rawReviews.filter((r) => r.rating === filterStar);

  // Calculate average rating dynamically based on provided reviews
  const avgRating =
    rawReviews.length > 0
      ? (
          rawReviews.reduce((acc, curr) => acc + curr.rating, 0) /
          rawReviews.length
        ).toFixed(1)
      : "5.0";
  const numReviews = rawReviews.length;
  // Estimate satisfaction
  const satisfaction =
    rawReviews.length > 0
      ? Math.round(
          (rawReviews.filter((r) => r.rating >= 4).length / rawReviews.length) *
            100,
        )
      : 100;

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".reviews-header",
        { opacity: 0, y: 30 },
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
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-white">
      <div className="max-w-screen-2xl mx-auto px-8 md:px-16">
        {/* Section header */}
        <div className="reviews-header flex items-start justify-between gap-10 mb-12 flex-wrap">
          <div className="relative">
            {/* Giant background quote */}
            <div className="absolute -top-6 -left-4 pointer-events-none">
              <QuoteIcon color={accentColor} opacity={0.06} />
            </div>
            <p
              className="text-xs font-black tracking-[0.35em] uppercase mb-3 relative z-10"
              style={{ color: accentColor }}
            >
              Đánh giá thực tế
            </p>
            <h2
              className="text-4xl md:text-5xl font-black text-[#1A1A2E] leading-tight relative z-10"
              style={{ fontFamily: "'Fredoka', 'Nunito', sans-serif" }}
            >
              Phụ huynh nói
              <br />
              <span style={{ color: accentColor }}>gì về chúng tôi?</span>
            </h2>
          </div>

          {/* Summary stats */}
          <div className="flex items-center gap-6 bg-[#F4F7FF] rounded-3xl p-6 shrink-0">
            <div className="text-center">
              <p
                className="text-5xl font-black leading-none"
                style={{ color: accentColor }}
              >
                {avgRating}
              </p>
              <div className="flex gap-0.5 mt-2 justify-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarFilled key={i} size={14} />
                ))}
              </div>
              <p className="text-xs text-[#6B7280] mt-1">Trung bình</p>
            </div>
            <div className="w-px h-16 bg-[#E5E7EB]" />
            <div className="text-center">
              <p className="text-5xl font-black text-[#1A1A2E] leading-none">
                {numReviews >= 1000
                  ? (numReviews / 1000).toFixed(1) + "k"
                  : numReviews}
              </p>
              <p className="text-xs text-[#6B7280] mt-2">Đánh giá</p>
            </div>
            <div className="w-px h-16 bg-[#E5E7EB]" />
            <div className="text-center">
              <p className="text-5xl font-black text-[#1A1A2E] leading-none">
                {satisfaction}%
              </p>
              <p className="text-xs text-[#6B7280] mt-2">Hài lòng</p>
            </div>
          </div>
        </div>

        {/* ── Star filter pills ── */}
        <div className="reviews-header flex items-center gap-3 flex-wrap mb-10">
          {STAR_FILTERS.map((star) => {
            const count =
              star === 0
                ? rawReviews.length
                : rawReviews.filter((r) => r.rating === star).length;
            const active = filterStar === star;
            return (
              <button
                key={star}
                type="button"
                onClick={() => setFilterStar(star)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-black border-2 transition-all duration-200 cursor-pointer"
                style={{
                  backgroundColor: active ? accentColor : "white",
                  borderColor: active ? accentColor : "#E5E7EB",
                  color: active ? "white" : "#6B7280",
                }}
              >
                {star > 0 && (
                  <span className="flex gap-0.5">
                    {Array.from({ length: star }).map((_, i) => (
                      <StarFilled key={i} size={13} />
                    ))}
                  </span>
                )}
                {STAR_LABELS[star]}
                <span
                  className="text-xs px-1.5 py-0.5 rounded-full font-black"
                  style={{
                    backgroundColor: active
                      ? "rgba(255,255,255,0.25)"
                      : "#F4F7FF",
                    color: active ? "white" : "#9CA3AF",
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Carousel ── */}
        <ReviewCarousel reviews={filtered} accentColor={accentColor} />

        {/* ── Write a comment form ── */}
        {canReview && <WriteReviewForm accentColor={accentColor} />}
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────
   Write Review Form
   ──────────────────────────────────────────── */
function StarSelector({
  value,
  onChange,
  accentColor,
}: {
  value: number;
  onChange: (v: number) => void;
  accentColor: string;
}) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < (hovered || value);
        return (
          <button
            key={i}
            type="button"
            onClick={() => onChange(i + 1)}
            onMouseEnter={() => setHovered(i + 1)}
            onMouseLeave={() => setHovered(0)}
            className="transition-transform duration-150 hover:scale-110 cursor-pointer"
            aria-label={`${i + 1} sao`}
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 20 20"
              fill={filled ? "#FFD93D" : "#E5E7EB"}
              aria-hidden="true"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        );
      })}
      {value > 0 && (
        <span className="ml-2 text-sm font-bold" style={{ color: accentColor }}>
          {["Rất tệ", "Tệ", "Bình thường", "Tốt", "Xuất sắc"][value - 1]}
        </span>
      )}
    </div>
  );
}

function WriteReviewForm({ accentColor }: { accentColor: string }) {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || rating === 0 || !text.trim()) return;
    // TODO: send to API
    setSubmitted(true);
  };

  return (
    <div className="mt-16 relative">
      {/* Divider */}
      <div className="flex items-center gap-4 mb-10">
        <div className="flex-1 h-px bg-[#E5E7EB]" />
        <p
          className="text-xs font-black tracking-[0.3em] uppercase px-1"
          style={{ color: accentColor }}
        >
          Viết đánh giá của bạn
        </p>
        <div className="flex-1 h-px bg-[#E5E7EB]" />
      </div>

      {submitted ? (
        <div className="flex flex-col items-center gap-4 py-14 rounded-3xl bg-[#F4F7FF] text-center">
          <svg
            width="56"
            height="56"
            viewBox="0 0 56 56"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="28" cy="28" r="28" fill={accentColor} opacity="0.12" />
            <path
              d="M16 28l8 8 16-16"
              stroke={accentColor}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p className="font-black text-xl text-[#1A1A2E]">
            Cảm ơn bạn đã đánh giá!
          </p>
          <p className="text-sm text-[#6B7280]">
            Đánh giá của bạn sẽ được duyệt và hiển thị sớm.
          </p>
          <button
            type="button"
            onClick={() => {
              setName("");
              setRating(0);
              setText("");
              setSubmitted(false);
            }}
            className="mt-2 text-sm font-bold underline underline-offset-2 cursor-pointer"
            style={{ color: accentColor }}
          >
            Viết thêm đánh giá
          </button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-[#F4F7FF] rounded-3xl p-8 md:p-10 border border-[#E5E7EB]"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="review-name"
                className="text-xs font-black tracking-widest uppercase text-[#1A1A2E]"
              >
                Tên của bạn
              </label>
              <input
                id="review-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ví dụ: Nguyễn Thị Mai"
                maxLength={60}
                required
                className="w-full px-5 py-3.5 rounded-2xl border-2 border-[#E5E7EB] bg-white text-[#1A1A2E] text-sm font-medium placeholder:text-[#9CA3AF] outline-none transition-all duration-200 focus:border-current"
                style={
                  { "--tw-ring-color": accentColor } as React.CSSProperties
                }
                onFocus={(e) =>
                  (e.currentTarget.style.borderColor = accentColor)
                }
                onBlur={(e) => (e.currentTarget.style.borderColor = "#E5E7EB")}
              />
            </div>

            {/* Star rating */}
            <div className="flex flex-col gap-2">
              <p className="text-xs font-black tracking-widest uppercase text-[#1A1A2E]">
                Đánh giá
              </p>
              <div className="flex items-center h-12.5">
                <StarSelector
                  value={rating}
                  onChange={setRating}
                  accentColor={accentColor}
                />
              </div>
            </div>

            {/* Comment textarea — full width */}
            <div className="flex flex-col gap-2 md:col-span-2">
              <label
                htmlFor="review-text"
                className="text-xs font-black tracking-widest uppercase text-[#1A1A2E]"
              >
                Nhận xét
              </label>
              <textarea
                id="review-text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
                rows={4}
                maxLength={500}
                required
                className="w-full px-5 py-4 rounded-2xl border-2 border-[#E5E7EB] bg-white text-[#1A1A2E] text-sm font-medium placeholder:text-[#9CA3AF] outline-none resize-none transition-all duration-200"
                onFocus={(e) =>
                  (e.currentTarget.style.borderColor = accentColor)
                }
                onBlur={(e) => (e.currentTarget.style.borderColor = "#E5E7EB")}
              />
              <p className="text-xs text-[#9CA3AF] text-right">
                {text.length} / 500
              </p>
            </div>
          </div>

          {/* Submit */}
          <div className="mt-6 flex items-center justify-between flex-wrap gap-4">
            <p className="text-xs text-[#9CA3AF] leading-relaxed max-w-xs">
              Đánh giá của bạn sẽ được kiểm duyệt trước khi hiển thị công khai.
            </p>
            <button
              type="submit"
              disabled={!name.trim() || rating === 0 || !text.trim()}
              className="px-8 py-3.5 rounded-2xl text-white font-black text-sm tracking-wide shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100 cursor-pointer"
              style={{ backgroundColor: accentColor }}
            >
              Gửi đánh giá
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
