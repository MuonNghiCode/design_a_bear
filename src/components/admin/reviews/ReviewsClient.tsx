"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import gsap from "gsap";
import { MdStar } from "react-icons/md";
import { GiPawPrint } from "react-icons/gi";
import { useReviewApi } from "@/hooks";
import { useToast } from "@/contexts/ToastContext";
import { useAuth } from "@/contexts/AuthContext";
import { userService } from "@/services/user.service";
import { productService } from "@/services/product.service";
import AdminReviewsTable from "./AdminReviewsTable";
import type { ProductReview } from "@/types";

type ReviewStatusTab =
  | "ALL"
  | "PENDING"
  | "PUBLISHED"
  | "REJECTED"
  | "UNANSWERED";

export default function ReviewsClient() {
  const ref = useRef<HTMLDivElement>(null);
  const {
    loading,
    getAllReviews,
    getReviewReplies,
    approveReview,
    rejectReview,
    replyReview,
  } = useReviewApi();
  const { success, error } = useToast();
  const { user } = useAuth();

  const [items, setItems] = useState<ProductReview[]>([]);
  const [pageIndex, setPageIndex] = useState(1);
  const pageSize = 10;
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [statusTab, setStatusTab] = useState<ReviewStatusTab>("ALL");
  const [usersMap, setUsersMap] = useState<Record<string, string>>({});
  const [productsMap, setProductsMap] = useState<Record<string, string>>({});

  const loadReviews = useCallback(async () => {
    try {
      const response = await getAllReviews({
        pageIndex,
        pageSize,
        status:
          statusTab === "ALL" || statusTab === "UNANSWERED"
            ? undefined
            : statusTab,
      });

      setTotalCount(response.totalCount || 0);
      setTotalPages(response.totalPages || 1);
      setHasPreviousPage(response.hasPreviousPage || false);
      setHasNextPage(response.hasNextPage || false);

      const nextItems = response.items || [];
      const enrichedItems = await Promise.all(
        nextItems.map(async (review) => {
          try {
            const replies = await getReviewReplies(review.reviewId);
            return { ...review, reviewReplies: replies };
          } catch {
            return review;
          }
        }),
      );
      setItems(enrichedItems);

      const uniqueUserIds = Array.from(new Set(nextItems.map((r) => r.userId)));
      const uniqueProductIds = Array.from(
        new Set(nextItems.map((r) => r.productId)),
      );

      const missingUserIds = uniqueUserIds.filter((id) => !usersMap[id]);
      const missingProductIds = uniqueProductIds.filter(
        (id) => !productsMap[id],
      );

      if (missingUserIds.length > 0) {
        const userResults = await Promise.all(
          missingUserIds.map(async (id) => {
            try {
              const res = await userService.getUserById(id);
              return {
                id,
                name: res.isSuccess ? res.value?.fullName || id : id,
              };
            } catch {
              return { id, name: id };
            }
          }),
        );

        setUsersMap((prev) => {
          const next = { ...prev };
          userResults.forEach((item) => {
            next[item.id] = item.name;
          });
          return next;
        });
      }

      if (missingProductIds.length > 0) {
        const productResults = await Promise.all(
          missingProductIds.map(async (id) => {
            try {
              const res = await productService.getProductById(id);
              return {
                id,
                name: res.isSuccess ? res.value?.name || id : id,
              };
            } catch {
              return { id, name: id };
            }
          }),
        );

        setProductsMap((prev) => {
          const next = { ...prev };
          productResults.forEach((item) => {
            next[item.id] = item.name;
          });
          return next;
        });
      }
    } catch (e) {
      error(
        e instanceof Error ? e.message : "Không thể tải danh sách đánh giá",
      );
    }
  }, [
    error,
    getAllReviews,
    getReviewReplies,
    pageIndex,
    productsMap,
    statusTab,
    usersMap,
  ]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  useEffect(() => {
    setPageIndex(1);
  }, [statusTab]);

  const handleApprove = useCallback(
    async (reviewId: string) => {
      try {
        await approveReview(reviewId);
        success("Duyệt đánh giá thành công");
        loadReviews();
      } catch (e) {
        error(e instanceof Error ? e.message : "Không thể duyệt đánh giá");
      }
    },
    [approveReview, error, loadReviews, success],
  );

  const handleReject = useCallback(
    async (reviewId: string) => {
      try {
        await rejectReview(reviewId);
        success("Từ chối đánh giá thành công");
        loadReviews();
      } catch (e) {
        error(e instanceof Error ? e.message : "Không thể từ chối đánh giá");
      }
    },
    [error, loadReviews, rejectReview, success],
  );

  const handleReply = useCallback(
    async (review: ProductReview, content: string) => {
      if (!user?.id) {
        error("Không xác định được admin/staff userId để phản hồi");
        return;
      }

      try {
        await replyReview(review.reviewId, {
          staffUserId: user.id,
          reviewId: review.reviewId,
          content,
        });
        success("Phản hồi đánh giá thành công");
        loadReviews();
      } catch (e) {
        error(e instanceof Error ? e.message : "Không thể phản hồi đánh giá");
      }
    },
    [error, loadReviews, replyReview, success, user?.id],
  );

  const answered = items.filter(
    (r) => (r.reviewReplies?.length ?? 0) > 0,
  ).length;
  const pending = items.filter(
    (r) => r.status?.toUpperCase() === "PENDING",
  ).length;
  const avgValue =
    items.length > 0
      ? (
          items.reduce((sum, review) => sum + (review.rating || 0), 0) /
          items.length
        ).toFixed(1)
      : "0.0";

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".ac",
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
          stagger: 0.07,
          clearProps: "all",
        },
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="space-y-5">
      <div className="ac flex items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <MdStar className="text-[#FFD93D]" style={{ fontSize: 22 }} />
            <h1 className="font-black text-[#1A1A2E] text-2xl tracking-tight">
              Đánh giá
            </h1>
          </div>
          <p className="text-[#9CA3AF] text-sm">
            Quản trị duyệt và phản hồi đánh giá khách hàng
          </p>
        </div>
      </div>

      <div className="ac grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Tổng đánh giá", value: totalCount, color: "#17409A" },
          {
            label: "Chờ trả lời",
            value: Math.max(items.length - answered, 0),
            color: "#FF8C42",
          },
          { label: "Đã phản hồi", value: answered, color: "#4ECDC4" },
          { label: "Điểm trung bình", value: avgValue, color: "#FFD93D" },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            className="bg-white rounded-2xl px-5 py-4 flex items-center gap-3"
          >
            <div
              className="w-2.5 h-10 rounded-full shrink-0"
              style={{ backgroundColor: color }}
            />
            <div>
              <p className="text-[#9CA3AF] text-[10px] font-black tracking-wider uppercase">
                {label}
              </p>
              <p className="text-[#1A1A2E] font-black text-xl">{value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="ac rounded-3xl bg-[#17409A] p-4 text-white flex items-center gap-3">
        <GiPawPrint className="text-xl text-[#FFD93D]" />
        <p className="text-sm font-semibold">
          Admin đang dùng cùng chuẩn duyệt đánh giá như staff để đảm bảo nhất
          quán vận hành.
        </p>
      </div>

      <div className="ac">
        <AdminReviewsTable
          reviews={items}
          usersMap={usersMap}
          productsMap={productsMap}
          loading={loading}
          statusTab={statusTab}
          pendingCount={pending}
          onStatusTabChange={setStatusTab}
          onApprove={handleApprove}
          onReject={handleReject}
          onReply={handleReply}
          pageIndex={pageIndex}
          totalPages={totalPages}
          totalCount={totalCount}
          hasPreviousPage={hasPreviousPage}
          hasNextPage={hasNextPage}
          onChangePage={setPageIndex}
        />
      </div>
    </div>
  );
}
