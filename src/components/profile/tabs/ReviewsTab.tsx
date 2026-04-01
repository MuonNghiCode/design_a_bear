"use client";

import { useEffect, useMemo, useState } from "react";
import {
  IoStarOutline,
  IoCreateOutline,
  IoTrashOutline,
} from "react-icons/io5";
import { useAuth } from "@/contexts/AuthContext";
import { useProductDetailApi } from "@/hooks/useProductDetailApi";
import { useReviewApi } from "@/hooks/useReviewApi";
import type { ProductReview } from "@/types";

type StatusStyle = { label: string; fg: string; bg: string };

const STATUS_STYLES: Record<string, StatusStyle> = {
  PENDING: { label: "Chờ duyệt", fg: "#FF8C42", bg: "#FF8C4218" },
  PUBLISHED: { label: "Đã duyệt", fg: "#4ECDC4", bg: "#4ECDC418" },
  REJECTED: { label: "Từ chối", fg: "#FF6B9D", bg: "#FF6B9D18" },
};

function formatDate(dateText: string) {
  const date = new Date(dateText);
  return date.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function canModifyReview(status: string) {
  return status !== "PUBLISHED" && status !== "REJECTED";
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, si) => (
        <IoStarOutline
          key={si}
          className={`text-sm ${si < rating ? "text-[#FFD93D]" : "text-[#E5E7EB]"}`}
          style={{ fill: si < rating ? "#FFD93D" : "none" }}
        />
      ))}
    </div>
  );
}

export default function ReviewsTab() {
  const { user } = useAuth();
  const { getProductById } = useProductDetailApi();
  const { getUserReviews, updateReview, deleteReview, loading, error } =
    useReviewApi();

  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [productNameMap, setProductNameMap] = useState<Record<string, string>>(
    {},
  );
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");
  const [editRating, setEditRating] = useState(0);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const sortedReviews = useMemo(
    () =>
      [...reviews].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    [reviews],
  );

  const loadReviews = async () => {
    if (!user?.id) return;

    const data = await getUserReviews(user.id);
    setReviews(data);

    const ids = Array.from(new Set(data.map((r) => r.productId)));
    const missingIds = ids.filter((id) => !productNameMap[id]);
    if (missingIds.length === 0) return;

    const fetched = await Promise.allSettled(
      missingIds.map(async (pid) => {
        const product = await getProductById(pid);
        return { productId: pid, name: product.name };
      }),
    );

    const nextMap: Record<string, string> = {};
    fetched.forEach((result, idx) => {
      if (result.status === "fulfilled") {
        nextMap[result.value.productId] = result.value.name;
      } else {
        const pid = missingIds[idx];
        nextMap[pid] = `Sản phẩm #${pid.slice(-6)}`;
      }
    });

    setProductNameMap((prev) => ({ ...prev, ...nextMap }));
  };

  useEffect(() => {
    loadReviews().catch(() => {
      // error state is handled by hook
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const startEdit = (review: ProductReview) => {
    setEditingReviewId(review.reviewId);
    setEditTitle(review.title || "");
    setEditBody(review.body || "");
    setEditRating(review.rating);
  };

  const cancelEdit = () => {
    setEditingReviewId(null);
    setEditTitle("");
    setEditBody("");
    setEditRating(0);
  };

  const handleSaveEdit = async (reviewId: string) => {
    if (
      !editTitle.trim() ||
      !editBody.trim() ||
      editRating < 1 ||
      editRating > 5
    ) {
      return;
    }

    setActionLoadingId(reviewId);
    try {
      await updateReview(reviewId, {
        rating: editRating,
        title: editTitle.trim(),
        body: editBody.trim(),
      });
      await loadReviews();
      cancelEdit();
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (review: ProductReview) => {
    const accepted = window.confirm("Bạn có chắc muốn xóa đánh giá này?");
    if (!accepted) return;

    setActionLoadingId(review.reviewId);
    try {
      await deleteReview(review.reviewId);
      await loadReviews();
      if (editingReviewId === review.reviewId) {
        cancelEdit();
      }
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-[#1A1A2E] font-black text-base mb-1">
        Đánh giá của bạn
      </p>

      {loading && reviews.length === 0 && (
        <div className="bg-[#F8F9FF] rounded-2xl p-6 text-sm text-[#6B7280] text-center">
          Đang tải danh sách đánh giá...
        </div>
      )}

      {error && reviews.length === 0 && (
        <div className="bg-[#FFF1F5] border border-[#FF6B9D33] rounded-2xl p-6 text-sm text-[#C43D6B]">
          Không thể tải đánh giá: {error}
        </div>
      )}

      {!loading && sortedReviews.length === 0 && !error && (
        <div className="bg-[#F8F9FF] rounded-2xl p-6 text-sm text-[#6B7280] text-center">
          Bạn chưa có đánh giá nào.
        </div>
      )}

      {sortedReviews.map((r) => {
        const statusStyle = STATUS_STYLES[r.status] ?? {
          label: r.status,
          fg: "#17409A",
          bg: "#17409A18",
        };

        const isEditable = canModifyReview(r.status);
        const isEditing = editingReviewId === r.reviewId;

        return (
          <div key={r.reviewId} className="bg-[#F8F9FF] rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[#1A1A2E] font-bold text-sm">
                {productNameMap[r.productId] ??
                  `Sản phẩm #${r.productId.slice(-6)}`}
              </p>
              <span className="text-[#9CA3AF] text-[10px] font-semibold">
                {formatDate(r.createdAt)}
              </span>
            </div>

            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <StarRating rating={r.rating} />
              <span
                className="text-[10px] font-black px-2.5 py-1 rounded-full"
                style={{
                  color: statusStyle.fg,
                  backgroundColor: statusStyle.bg,
                }}
              >
                {statusStyle.label}
              </span>
            </div>

            {isEditing ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  maxLength={120}
                  className="w-full rounded-xl border border-[#E5E7EB] px-3 py-2 text-sm font-semibold text-[#1A1A2E]"
                  placeholder="Tiêu đề đánh giá"
                />
                <textarea
                  value={editBody}
                  onChange={(e) => setEditBody(e.target.value)}
                  rows={3}
                  maxLength={500}
                  className="w-full rounded-xl border border-[#E5E7EB] px-3 py-2 text-sm font-semibold text-[#4B5563] resize-none"
                  placeholder="Nội dung đánh giá"
                />
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, idx) => {
                    const star = idx + 1;
                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setEditRating(star)}
                        className="cursor-pointer"
                      >
                        <IoStarOutline
                          className={`text-lg ${star <= editRating ? "text-[#FFD93D]" : "text-[#E5E7EB]"}`}
                          style={{
                            fill: star <= editRating ? "#FFD93D" : "none",
                          }}
                        />
                      </button>
                    );
                  })}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => void handleSaveEdit(r.reviewId)}
                    disabled={actionLoadingId === r.reviewId}
                    className="px-4 py-2 rounded-xl text-xs font-black bg-[#17409A] text-white disabled:opacity-50"
                  >
                    Lưu
                  </button>
                  <button
                    type="button"
                    onClick={cancelEdit}
                    disabled={actionLoadingId === r.reviewId}
                    className="px-4 py-2 rounded-xl text-xs font-black border border-[#D1D5DB] text-[#6B7280]"
                  >
                    Hủy
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p className="text-[#1A1A2E] text-sm font-black mb-1">
                  {r.title}
                </p>
                <p className="text-[#4B5563] text-sm font-semibold leading-relaxed">
                  {r.body}
                </p>

                {r.reviewReplies.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {r.reviewReplies.map((reply) => (
                      <div
                        key={reply.replyId}
                        className="rounded-xl bg-white border border-[#E5E7EB] px-3 py-2"
                      >
                        <p className="text-[11px] font-black text-[#17409A] mb-1">
                          Phản hồi từ nhân viên
                        </p>
                        <p className="text-xs text-[#4B5563] font-semibold leading-relaxed">
                          {reply.content}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-3 flex items-center gap-2">
                  <button
                    type="button"
                    disabled={!isEditable || actionLoadingId === r.reviewId}
                    onClick={() => startEdit(r)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-black border border-[#D7DEEF] text-[#17409A] disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <IoCreateOutline className="text-sm" /> Sửa
                  </button>
                  <button
                    type="button"
                    disabled={!isEditable || actionLoadingId === r.reviewId}
                    onClick={() => void handleDelete(r)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-black border border-[#FFD2E1] text-[#C43D6B] disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <IoTrashOutline className="text-sm" /> Xóa
                  </button>
                  {!isEditable && (
                    <span className="text-[11px] font-semibold text-[#9CA3AF]">
                      Trạng thái này không thể sửa/xóa
                    </span>
                  )}
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
