"use client";

import { useMemo, useState } from "react";
import type { ProductReview } from "@/types";
import {
  MdSearch,
  MdStar,
  MdStarBorder,
  MdReply,
  MdClose,
  MdSend,
  MdCheckCircle,
  MdBlock,
} from "react-icons/md";

type ReviewStatusTab =
  | "ALL"
  | "PENDING"
  | "PUBLISHED"
  | "REJECTED"
  | "UNANSWERED";

interface StaffReviewsTableProps {
  reviews: ProductReview[];
  usersMap: Record<string, string>;
  productsMap: Record<string, string>;
  currentStaffUserId?: string | null;
  loading?: boolean;
  statusTab: ReviewStatusTab;
  pendingCount: number;
  onStatusTabChange: (value: ReviewStatusTab) => void;
  onApprove: (reviewId: string) => Promise<void> | void;
  onReject: (reviewId: string) => Promise<void> | void;
  onReply: (review: ProductReview, content: string) => Promise<void> | void;
  pageIndex: number;
  totalPages: number;
  totalCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  onChangePage: (page: number) => void;
}

const STATUS_LABELS: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  PUBLISHED: { label: "Đã duyệt", color: "#4ECDC4", bg: "#4ECDC415" },
  PENDING: { label: "Chờ duyệt", color: "#e6a800", bg: "#FFD93D15" },
  REJECTED: { label: "Từ chối", color: "#FF6B9D", bg: "#FF6B9D15" },
};

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) =>
        star <= rating ? (
          <MdStar
            key={star}
            className="text-[#FFD93D]"
            style={{ fontSize: 14 }}
          />
        ) : (
          <MdStarBorder
            key={star}
            className="text-[#D1D5DB]"
            style={{ fontSize: 14 }}
          />
        ),
      )}
    </div>
  );
}

function shortId(value: string) {
  if (!value) return "--";
  if (value.length <= 12) return value;
  return `${value.slice(0, 8)}...${value.slice(-4)}`;
}

function safeName(value: string | undefined, fallback: string) {
  const text = (value || "").trim();
  if (!text || text === "--") return fallback;
  return text;
}

function fmtDate(input: string) {
  if (!input) return "--";
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return input;
  return d.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function ReplyModal({
  review,
  userName,
  productName,
  currentStaffUserId,
  onClose,
  onSubmit,
}: {
  review: ProductReview;
  userName: string;
  productName: string;
  currentStaffUserId?: string | null;
  onClose: () => void;
  onSubmit: (content: string) => Promise<void>;
}) {
  const myLatestReply =
    review.reviewReplies
      ?.filter(
        (r) => !!currentStaffUserId && r.staffUserId === currentStaffUserId,
      )
      .at(-1) || null;
  const hasExistingReply = !!myLatestReply;
  const [reply, setReply] = useState(myLatestReply?.content || "");
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    const content = reply.trim();
    if (!content) return;

    setSaving(true);
    try {
      await onSubmit(content);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-xl flex flex-col overflow-hidden max-h-[90vh]">
        <div className="bg-[#17409A] px-6 py-5 flex items-start justify-between gap-3">
          <div>
            <p className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-1">
              Trả lời đánh giá
            </p>
            <p className="text-white font-black text-base leading-snug">
              {review.title}
            </p>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 w-8 h-8 rounded-xl bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <MdClose className="text-lg" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-6 flex flex-col gap-4">
          <div className="bg-[#F4F7FF] rounded-2xl p-4">
            <p className="text-[#374151] text-sm font-bold mb-1">
              {review.title}
            </p>
            <p className="text-[#374151] text-sm leading-relaxed">
              {review.body}
            </p>
          </div>

          <div className="text-xs text-[#6B7280]">
            <p>User: {safeName(userName, "Khách hàng")}</p>
            <p>Product: {safeName(productName, "Sản phẩm")}</p>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[#1A1A2E] font-bold text-sm">
              Nội dung phản hồi
            </label>
            <textarea
              rows={4}
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Nhập phản hồi cho khách hàng..."
              className="w-full bg-[#F4F7FF] rounded-2xl px-4 py-3 text-sm text-[#1A1A2E] placeholder-[#9CA3AF] outline-none focus:ring-2 focus:ring-[#17409A]/30 resize-none transition"
            />
          </div>
        </div>

        <div className="px-6 py-4 border-t border-[#F4F7FF] flex items-center gap-3">
          <button
            onClick={submit}
            disabled={!reply.trim() || saving}
            className="flex items-center gap-2 bg-[#17409A] hover:bg-[#1a3a8a] disabled:opacity-40 text-white text-sm font-bold px-5 py-2.5 rounded-2xl transition-colors cursor-pointer disabled:cursor-not-allowed flex-1 justify-center"
          >
            <MdSend className="text-base" />
            {saving
              ? "Đang lưu..."
              : hasExistingReply
                ? "Lưu chỉnh sửa"
                : "Gửi phản hồi"}
          </button>
          <button
            onClick={onClose}
            className="text-[#9CA3AF] hover:text-[#1A1A2E] text-sm font-semibold px-4 py-2.5 rounded-2xl hover:bg-[#F4F7FF] transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}

export default function StaffReviewsTable({
  reviews,
  usersMap,
  productsMap,
  currentStaffUserId,
  loading = false,
  statusTab,
  pendingCount,
  onStatusTabChange,
  onApprove,
  onReject,
  onReply,
  pageIndex,
  totalPages,
  totalCount,
  hasPreviousPage,
  hasNextPage,
  onChangePage,
}: StaffReviewsTableProps) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<ProductReview | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const baseList =
      statusTab === "UNANSWERED"
        ? reviews.filter((review) => (review.reviewReplies?.length || 0) === 0)
        : reviews;

    if (!search.trim()) return baseList;
    const q = search.toLowerCase();
    return baseList.filter((review) => {
      const userName = usersMap[review.userId] || "";
      const productName = productsMap[review.productId] || "";

      return (
        review.title.toLowerCase().includes(q) ||
        review.body.toLowerCase().includes(q) ||
        review.userId.toLowerCase().includes(q) ||
        review.productId.toLowerCase().includes(q) ||
        userName.toLowerCase().includes(q) ||
        productName.toLowerCase().includes(q)
      );
    });
  }, [productsMap, reviews, search, statusTab, usersMap]);

  const counts = useMemo(() => {
    const base = {
      ALL: reviews.length,
      PENDING: 0,
      PUBLISHED: 0,
      REJECTED: 0,
      UNANSWERED: 0,
    };
    reviews.forEach((review) => {
      const key = review.status?.toUpperCase();
      if (key === "PENDING" || key === "PUBLISHED" || key === "REJECTED") {
        base[key] += 1;
      }
      if ((review.reviewReplies?.length || 0) === 0) {
        base.UNANSWERED += 1;
      }
    });
    return base;
  }, [reviews]);

  const runAction = async (
    reviewId: string,
    action: () => Promise<void> | void,
  ) => {
    setProcessingId(reviewId);
    try {
      await action();
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <>
      <div className="bg-white rounded-3xl overflow-hidden">
        <div className="p-5 border-b border-[#F4F7FF] flex flex-col lg:flex-row items-start lg:items-center gap-3">
          <div className="relative flex-1 w-full lg:max-w-xs">
            <MdSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] text-lg" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm nội dung, userId, productId..."
              className="w-full bg-[#F4F7FF] rounded-2xl pl-10 pr-4 py-2.5 text-sm text-[#1A1A2E] placeholder-[#9CA3AF] outline-none focus:ring-2 focus:ring-[#17409A]/20 transition"
            />
          </div>

          <div className="flex gap-1 flex-wrap">
            {(
              [
                ["ALL", "Tất cả"],
                ["PENDING", "Chờ duyệt"],
                ["UNANSWERED", "Chưa phản hồi"],
                ["PUBLISHED", "Đã duyệt"],
                ["REJECTED", "Từ chối"],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                onClick={() => onStatusTabChange(key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  statusTab === key
                    ? "bg-[#17409A] text-white"
                    : "bg-[#F4F7FF] text-[#9CA3AF] hover:bg-[#EEF1FF] hover:text-[#17409A]"
                }`}
              >
                {label}
                <span
                  className={`ml-1.5 rounded-lg px-1.5 py-0.5 text-[10px] font-black ${
                    statusTab === key
                      ? "bg-white/20 text-white"
                      : "bg-white text-[#17409A]"
                  }`}
                >
                  {key === "PENDING" ? pendingCount : counts[key]}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto hidden sm:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#F4F7FF]">
                {[
                  "User",
                  "Product",
                  "Đánh giá",
                  "Nội dung",
                  "Trạng thái",
                  "Ngày",
                  "Hành động",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left text-[#9CA3AF] font-semibold text-xs uppercase tracking-wide px-5 py-3"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading && filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center text-[#9CA3AF] text-sm py-10"
                  >
                    Đang tải đánh giá...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center text-[#9CA3AF] text-sm py-10"
                  >
                    Không tìm thấy đánh giá
                  </td>
                </tr>
              ) : (
                filtered.map((review) => {
                  const statusKey = review.status?.toUpperCase() || "PENDING";
                  const cfg = STATUS_LABELS[statusKey] || STATUS_LABELS.PENDING;
                  const canModerate = statusKey === "PENDING";
                  const hasReply = (review.reviewReplies?.length || 0) > 0;
                  const isActing = processingId === review.reviewId;
                  const userName =
                    (review.authorName || "").trim() ||
                    usersMap[review.userId] ||
                    `Khách hàng ${shortId(review.userId)}`;
                  const productName =
                    productsMap[review.productId] ||
                    `Sản phẩm ${shortId(review.productId)}`;

                  return (
                    <tr
                      key={review.reviewId}
                      className="border-b border-[#F4F7FF] last:border-0 hover:bg-[#F4F7FF]/60 transition-colors"
                    >
                      <td className="px-5 py-4 text-xs font-semibold text-[#1A1A2E]">
                        <p className="line-clamp-1">
                          {safeName(userName, "Khách hàng")}
                        </p>
                      </td>
                      <td className="px-5 py-4 text-xs text-[#374151]">
                        <p className="line-clamp-1">
                          {safeName(productName, "Sản phẩm")}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <Stars rating={review.rating} />
                      </td>
                      <td className="px-5 py-4 max-w-60">
                        <p className="text-[#374151] line-clamp-1 font-semibold text-xs">
                          {review.title}
                        </p>
                        <p className="text-[#6B7280] line-clamp-2 text-xs leading-relaxed">
                          {review.body}
                        </p>
                        {hasReply && (
                          <span className="inline-flex items-center gap-1 mt-1 text-[#17409A] text-[10px] font-bold">
                            <MdReply className="text-xs" /> Đã phản hồi
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-xl"
                          style={{ color: cfg.color, backgroundColor: cfg.bg }}
                        >
                          {cfg.label}
                        </span>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-[#9CA3AF] text-xs">
                        {fmtDate(review.createdAt)}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 flex-wrap">
                          {canModerate && (
                            <button
                              onClick={() =>
                                runAction(review.reviewId, () =>
                                  onApprove(review.reviewId),
                                )
                              }
                              disabled={isActing}
                              className="inline-flex items-center gap-1.5 bg-[#4ECDC4]/15 hover:bg-[#4ECDC4]/25 text-[#0f766e] text-xs font-bold px-3 py-1.5 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                            >
                              <MdCheckCircle className="text-sm" />
                              Duyệt
                            </button>
                          )}

                          {canModerate && (
                            <button
                              onClick={() =>
                                runAction(review.reviewId, () =>
                                  onReject(review.reviewId),
                                )
                              }
                              disabled={isActing}
                              className="inline-flex items-center gap-1.5 bg-[#FF6B9D]/15 hover:bg-[#FF6B9D]/25 text-[#BE123C] text-xs font-bold px-3 py-1.5 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                            >
                              <MdBlock className="text-sm" />
                              Từ chối
                            </button>
                          )}

                          <button
                            onClick={() => setSelected(review)}
                            className="inline-flex items-center gap-1.5 bg-[#17409A]/10 hover:bg-[#17409A]/20 text-[#17409A] text-xs font-bold px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
                          >
                            <MdReply className="text-sm" />
                            {hasReply ? "Xem / sửa" : "Phản hồi"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="sm:hidden flex flex-col divide-y divide-[#F4F7FF]">
          {filtered.map((review) => {
            const statusKey = review.status?.toUpperCase() || "PENDING";
            const cfg = STATUS_LABELS[statusKey] || STATUS_LABELS.PENDING;
            const canModerate = statusKey === "PENDING";
            const hasReply = (review.reviewReplies?.length || 0) > 0;
            const isActing = processingId === review.reviewId;
            const userName =
              (review.authorName || "").trim() ||
              usersMap[review.userId] ||
              `Khách hàng ${shortId(review.userId)}`;
            const productName =
              productsMap[review.productId] ||
              `Sản phẩm ${shortId(review.productId)}`;

            return (
              <div key={review.reviewId} className="p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="font-bold text-[#1A1A2E] text-sm">
                      {review.title}
                    </p>
                    <p className="text-[#9CA3AF] text-xs line-clamp-1">
                      {safeName(userName, "Khách hàng")}
                    </p>
                    <p className="text-[#9CA3AF] text-xs line-clamp-1">
                      {safeName(productName, "Sản phẩm")}
                    </p>
                  </div>
                  <span
                    className="text-xs font-bold px-2.5 py-1 rounded-xl"
                    style={{ color: cfg.color, backgroundColor: cfg.bg }}
                  >
                    {cfg.label}
                  </span>
                </div>

                <Stars rating={review.rating} />
                <p className="text-[#374151] text-xs line-clamp-3">
                  {review.body}
                </p>

                <div className="flex flex-wrap gap-2">
                  {canModerate && (
                    <button
                      onClick={() =>
                        runAction(review.reviewId, () =>
                          onApprove(review.reviewId),
                        )
                      }
                      disabled={isActing}
                      className="inline-flex items-center gap-1.5 bg-[#4ECDC4]/15 text-[#0f766e] text-xs font-bold px-3 py-1.5 rounded-xl disabled:opacity-50"
                    >
                      <MdCheckCircle /> Duyệt
                    </button>
                  )}

                  {canModerate && (
                    <button
                      onClick={() =>
                        runAction(review.reviewId, () =>
                          onReject(review.reviewId),
                        )
                      }
                      disabled={isActing}
                      className="inline-flex items-center gap-1.5 bg-[#FF6B9D]/15 text-[#BE123C] text-xs font-bold px-3 py-1.5 rounded-xl disabled:opacity-50"
                    >
                      <MdBlock /> Từ chối
                    </button>
                  )}

                  <button
                    onClick={() => setSelected(review)}
                    className="inline-flex items-center gap-1.5 bg-[#17409A] text-white text-xs font-bold px-3 py-1.5 rounded-xl"
                  >
                    <MdReply /> {hasReply ? "Xem / sửa" : "Phản hồi"}
                  </button>
                </div>
              </div>
            );
          })}

          {!loading && filtered.length === 0 && (
            <p className="text-center text-[#9CA3AF] text-sm py-10">
              Không tìm thấy đánh giá
            </p>
          )}
        </div>

        <div className="px-4 sm:px-5 py-4 border-t border-[#F4F7FF] flex items-center justify-between gap-3 flex-wrap">
          <p className="text-xs text-[#9CA3AF]">
            Trang <span className="font-black text-[#1A1A2E]">{pageIndex}</span>{" "}
            / {Math.max(1, totalPages)} · Tổng {totalCount} đánh giá
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onChangePage(Math.max(1, pageIndex - 1))}
              disabled={!hasPreviousPage || loading}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#F4F7FF] text-[#6B7280] hover:bg-[#E9EEFF] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Trang trước
            </button>

            <button
              onClick={() => onChangePage(Math.min(totalPages, pageIndex + 1))}
              disabled={!hasNextPage || loading}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#17409A] text-white hover:bg-[#13357f] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Trang sau
            </button>
          </div>
        </div>
      </div>

      {selected && (
        <ReplyModal
          review={selected}
          userName={usersMap[selected.userId] || "Khách hàng"}
          productName={productsMap[selected.productId] || "Sản phẩm"}
          currentStaffUserId={currentStaffUserId}
          onClose={() => setSelected(null)}
          onSubmit={(content) => Promise.resolve(onReply(selected, content))}
        />
      )}
    </>
  );
}
