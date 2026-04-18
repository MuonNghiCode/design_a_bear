"use client";

import { useEffect, useState } from "react";
import { productIssueService } from "@/services/productIssue.service";
import type { ProductIssueReport } from "@/types";
import { formatDateTime } from "@/utils/date";

export default function ProductIssuesTab() {
  const [issues, setIssues] = useState<ProductIssueReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 3;

  useEffect(() => {
    let active = true;
    const fetchIssues = async () => {
      try {
        setLoading(true);
        const res = await productIssueService.getMyIssues({
          pageIndex: 1,
          pageSize: 50,
        });
        if (active && res.isSuccess && res.value) {
          const data = Array.isArray(res.value)
            ? res.value
            : (res.value as any).items || [];
          setIssues(data);
        } else if (active && !res.isSuccess) {
          setError(res.error?.description || "Không thể tải dữ liệu");
        }
      } catch (err: any) {
        if (active) setError(err.message || "Lỗi khi tải lịch sử báo cáo");
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchIssues();
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="bg-[#F8F9FF] rounded-2xl p-6 text-center text-sm text-[#6B7280]">
        Đang tải lịch sử...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#FFF1F5] border border-[#FF6B9D33] rounded-2xl p-6 text-sm text-[#C43D6B]">
        {error}
      </div>
    );
  }

  if (issues.length === 0) {
    return (
      <div className="bg-[#F8F9FF] rounded-2xl p-6 text-center text-sm text-[#6B7280]">
        Bạn chưa tạo yêu cầu bảo hành / báo lỗi nào.
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return {
          label: "Chờ xử lý",
          classes: "bg-[#FF8C42]/20 text-[#FF8C42]",
        };
      case "PROCESSING":
        return {
          label: "Đang giải quyết",
          classes: "bg-[#7C5CFC]/20 text-[#7C5CFC]",
        };
      case "RESOLVED":
        return {
          label: "Đã có hướng xử lý",
          classes: "bg-[#1D4ED8]/20 text-[#1D4ED8]",
        };
      case "CLOSED":
        return { label: "Hoàn tất", classes: "bg-[#4ECDC4]/20 text-[#4ECDC4]" };
      case "REJECTED":
        return { label: "Từ chối", classes: "bg-red-100 text-red-600" };
      default:
        return { label: status, classes: "bg-gray-200 text-gray-700" };
    }
  };

  const totalPages = Math.max(1, Math.ceil(issues.length / PAGE_SIZE));
  const pagedIssues = issues.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[#1A1A2E] font-black text-xl">
          Lịch sử Yêu cầu bảo hành / Báo lỗi
        </p>
      </div>

      <div className="space-y-4">
        {pagedIssues.map((issue) => {
          const st = getStatusColor(issue.status);
          const dateStr = formatDateTime(issue.createdAt);

          return (
            <div
              key={issue.reportId}
              className="bg-[#F8F9FF] rounded-2xl p-5 border border-[#E5E7EB]"
            >
              <div className="flex justify-between items-start mb-3 gap-4 flex-wrap">
                <div>
                  <p className="text-xs text-[#9CA3AF] font-bold">
                    Mã lỗi: #{issue.reportId?.slice(-6).toUpperCase() || "..."}
                  </p>
                  <p className="text-[#1A1A2E] font-black mt-1">
                    {issue.requestRefund
                      ? "Yêu cầu hoàn tiền"
                      : "Yêu cầu bảo hành/sửa chữa"}
                  </p>
                  <p className="text-[10px] text-[#6B7280] font-semibold mt-0.5 capitalize">
                    {dateStr}
                  </p>
                </div>
                <span
                  className={`text-[10px] font-black px-2.5 py-1 rounded-full ${st.classes}`}
                >
                  {st.label}
                </span>
              </div>

              <div className="mb-4">
                <p className="text-xs font-bold text-[#1A1A2E] mb-1">Mô tả:</p>
                <p className="text-sm text-[#4B5563] leading-relaxed">
                  {issue.description}
                </p>
              </div>

              {issue.evidenceUrls && issue.evidenceUrls.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-bold text-[#1A1A2E] mb-2">
                    Hình ảnh đính kèm:
                  </p>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {issue.evidenceUrls.map((url, i) => (
                      <a
                        key={i}
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-[#E5E7EB] hover:opacity-80"
                      >
                        <img
                          src={url}
                          alt="Evidence"
                          className="w-full h-full object-cover"
                        />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Staff Notes section if any */}
              {(issue.resolution ||
                issue.staffNotes ||
                issue.repairNotes ||
                issue.finalNotes) && (
                <div className="bg-white rounded-xl p-4 border border-[#E5E7EB] mt-4">
                  <p className="text-xs font-black text-[#17409A] mb-2">
                    Phản hồi từ bộ phận xử lý
                  </p>
                  <ul className="text-sm text-[#1A1A2E] space-y-2">
                    {issue.resolution && (
                      <li>
                        <span className="font-semibold">Hướng giải quyết:</span>{" "}
                        {issue.resolution}
                      </li>
                    )}
                    {issue.staffNotes && (
                      <li>
                        <span className="font-semibold">Ghi chú:</span>{" "}
                        {issue.staffNotes}
                      </li>
                    )}
                    {issue.repairNotes && (
                      <li>
                        <span className="font-semibold">
                          Chi tiết sửa chữa:
                        </span>{" "}
                        {issue.repairNotes}
                      </li>
                    )}
                    {issue.finalNotes && (
                      <li>
                        <span className="font-semibold">Kết luận:</span>{" "}
                        {issue.finalNotes}
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {issues.length > PAGE_SIZE && (
        <div className="mt-2 flex items-center justify-between rounded-2xl bg-[#F8F9FF] p-4 border border-[#E5E7EB]">
          <p className="text-sm font-semibold text-[#6B7280]">
            Trang {currentPage}/{totalPages} • Tổng {issues.length} yêu cầu
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-xl text-sm font-black border border-[#D7DEEF] text-[#17409A] disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:bg-white"
            >
              Trước
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-xl text-sm font-black bg-[#17409A] text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:bg-[#1A1A2E]/90"
            >
              Sau
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
