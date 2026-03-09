"use client";

import { useState } from "react";
import {
  MdExpandMore,
  MdExpandLess,
  MdCheckCircle,
  MdClose,
  MdWarning,
  MdOutlineInventory2,
  MdLocalShipping,
  MdCardGiftcard,
  MdChat,
  MdAssignment,
  MdStickyNote2,
} from "react-icons/md";
import {
  STAFF_REPORTS,
  REPORT_TYPE_CFG,
  REPORT_STATUS_CFG,
  SHIFT_CFG,
  type StaffReport,
  type ReportStatus,
} from "@/data/staff";

type FilterTab = "all" | ReportStatus;

const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: "all", label: "Tất cả" },
  { key: "submitted", label: "Chờ duyệt" },
  { key: "reviewed", label: "Đã xem" },
  { key: "acknowledged", label: "Đã ghi nhận" },
  { key: "draft", label: "Nháp" },
];

const SEV_COLOR: Record<string, string> = {
  low: "#4ECDC4",
  medium: "#FF8C42",
  high: "#FF6B9D",
};
const SEV_LABEL: Record<string, string> = {
  low: "Thấp",
  medium: "Trung bình",
  high: "Cao",
};

// ── Review/acknowledge modal ─────────────────────────────────────────────────
function ReviewModal({
  report,
  onClose,
  onReview,
}: {
  report: StaffReport;
  onClose: () => void;
  onReview: (
    id: string,
    status: "reviewed" | "acknowledged",
    note: string,
  ) => void;
}) {
  const [note, setNote] = useState(report.reviewNote ?? "");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-[#17409A] px-6 py-5 flex items-start justify-between">
          <div>
            <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-0.5">
              Xét duyệt báo cáo
            </p>
            <p className="text-white font-black text-base">{report.title}</p>
            <p className="text-white/50 text-xs mt-0.5">
              {report.staffName} · {report.createdAt}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors cursor-pointer shrink-0"
          >
            <MdClose className="text-lg" />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-4">
          <div>
            <label className="text-[#1A1A2E] text-sm font-bold block mb-2">
              Ghi chú phản hồi cho nhân viên
            </label>
            <textarea
              rows={4}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Nhận xét, nhắc nhở hoặc ghi nhận thành tích…"
              className="w-full bg-[#F4F7FF] rounded-2xl px-4 py-3 text-sm text-[#1A1A2E] placeholder-[#9CA3AF] outline-none focus:ring-2 focus:ring-[#17409A]/30 resize-none transition"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {
                onReview(report.id, "reviewed", note);
                onClose();
              }}
              className="flex-1 py-2.5 rounded-2xl bg-[#FF8C42]/10 hover:bg-[#FF8C42]/20 text-[#FF8C42] font-bold text-sm transition-colors cursor-pointer"
            >
              Đánh dấu đã xem
            </button>
            <button
              onClick={() => {
                onReview(report.id, "acknowledged", note);
                onClose();
              }}
              className="flex-1 py-2.5 rounded-2xl bg-[#4ECDC4] hover:bg-[#3dbdb5] text-white font-bold text-sm transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <MdCheckCircle className="text-base" />
              Ghi nhận
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function AdminStaffReports() {
  const [reports, setReports] = useState<StaffReport[]>(STAFF_REPORTS);
  const [filter, setFilter] = useState<FilterTab>("all");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [reviewingId, setReviewingId] = useState<string | null>(null);

  const filtered =
    filter === "all" ? reports : reports.filter((r) => r.status === filter);
  const reviewingReport = reviewingId
    ? (reports.find((r) => r.id === reviewingId) ?? null)
    : null;
  const pendingCount = reports.filter((r) => r.status === "submitted").length;

  function toggleExpand(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function handleReview(
    id: string,
    status: "reviewed" | "acknowledged",
    note: string,
  ) {
    setReports((rs) =>
      rs.map((r) =>
        r.id === id
          ? { ...r, status, reviewNote: note, reviewedBy: "Admin Gấu Bông" }
          : r,
      ),
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-[#F4F7FF] overflow-hidden">
      {/* Header row */}
      <div className="px-5 py-4 border-b border-[#F4F7FF] flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <p className="font-black text-[#1A1A2E] text-base">
            Báo cáo từ nhân viên
          </p>
          {pendingCount > 0 && (
            <span className="w-5 h-5 bg-[#FF8C42] text-white text-[9px] font-black rounded-full flex items-center justify-center">
              {pendingCount}
            </span>
          )}
        </div>
        {/* Filter tabs */}
        <div className="flex gap-1 flex-wrap">
          {FILTER_TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filter === key
                  ? "bg-[#17409A] text-white"
                  : "bg-[#F4F7FF] text-[#9CA3AF] hover:text-[#1A1A2E]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Report list */}
      <div className="divide-y divide-[#F4F7FF]">
        {filtered.length === 0 && (
          <div className="p-8 text-center text-[#9CA3AF] text-sm">
            Không có báo cáo nào
          </div>
        )}

        {filtered.map((r) => {
          const typeCfg = REPORT_TYPE_CFG[r.type];
          const statusCfg = REPORT_STATUS_CFG[r.status];
          const shiftCfg = SHIFT_CFG[r.shift];
          const isExpanded = expanded.has(r.id);

          return (
            <div key={r.id}>
              {/* Summary row */}
              <div className="px-5 py-4 flex items-start gap-4">
                {/* Staff avatar */}
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-black text-sm shrink-0 shadow-sm"
                  style={{ backgroundColor: r.staffAvatarColor }}
                >
                  {r.staffAvatar}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap mb-2">
                    <div>
                      <p className="font-black text-[#1A1A2E] text-sm">
                        {r.title}
                      </p>
                      <p className="text-[#9CA3AF] text-xs">
                        {r.staffName} · {r.createdAt}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span
                        className="text-[9px] font-black px-2 py-1 rounded-full"
                        style={{
                          color: typeCfg.color,
                          backgroundColor: typeCfg.bg,
                        }}
                      >
                        {typeCfg.label}
                      </span>
                      <span
                        className="text-[9px] font-black px-2 py-1 rounded-full"
                        style={{
                          color: shiftCfg.color,
                          backgroundColor: shiftCfg.color + "18",
                        }}
                      >
                        {shiftCfg.label}
                      </span>
                      <span
                        className="text-[9px] font-black px-2 py-1 rounded-full"
                        style={{
                          color: statusCfg.color,
                          backgroundColor: statusCfg.bg,
                        }}
                      >
                        {statusCfg.label}
                      </span>
                    </div>
                  </div>

                  {/* Quick stats */}
                  <div className="flex items-center gap-3 flex-wrap text-xs text-[#6B7280]">
                    <span className="flex items-center gap-1">
                      <MdLocalShipping className="text-[#9CA3AF]" />
                      {r.ordersProcessed} đơn
                    </span>
                    <span className="flex items-center gap-1">
                      <MdCardGiftcard className="text-[#9CA3AF]" />
                      {r.packagingDone} đóng gói
                    </span>
                    <span className="flex items-center gap-1">
                      <MdChat className="text-[#9CA3AF]" />
                      {r.reviewsAnswered} phản hồi
                    </span>
                    {r.issuesCount > 0 && (
                      <span className="text-[#FF8C42] font-bold flex items-center gap-1">
                        <MdWarning className="text-sm" /> {r.issuesCount} sự cố
                      </span>
                    )}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {r.status === "submitted" && (
                    <button
                      onClick={() => setReviewingId(r.id)}
                      className="text-[10px] font-black px-3 py-1.5 rounded-xl bg-[#17409A] text-white hover:bg-[#1a3a8a] transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Duyệt
                    </button>
                  )}
                  <button
                    onClick={() => toggleExpand(r.id)}
                    className="w-8 h-8 rounded-xl bg-[#F4F7FF] hover:bg-[#EEF1FF] flex items-center justify-center text-[#9CA3AF] hover:text-[#17409A] transition-colors cursor-pointer"
                  >
                    {isExpanded ? <MdExpandLess /> : <MdExpandMore />}
                  </button>
                </div>
              </div>

              {/* Expanded detail */}
              {isExpanded && (
                <div className="px-5 pb-5 bg-[#F8F9FF] border-t border-[#F4F7FF]">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                    {/* Issues */}
                    {r.issues.length > 0 && (
                      <div>
                        <p className="text-xs font-black text-[#1A1A2E] mb-2 flex items-center gap-1.5">
                          <MdWarning style={{ color: "#FF8C42" }} /> Sự cố ghi
                          nhận
                        </p>
                        <div className="flex flex-col gap-2">
                          {r.issues.map((issue) => (
                            <div
                              key={issue.id}
                              className="bg-white rounded-2xl p-3 flex items-start gap-2 shadow-sm"
                            >
                              <span
                                className="text-[9px] font-black px-2 py-0.5 rounded-full shrink-0 mt-0.5"
                                style={{
                                  color: SEV_COLOR[issue.severity],
                                  backgroundColor:
                                    SEV_COLOR[issue.severity] + "18",
                                }}
                              >
                                {SEV_LABEL[issue.severity]}
                              </span>
                              <p className="text-xs text-[#4B5563] leading-snug flex-1">
                                {issue.description}
                              </p>
                              {issue.resolved && (
                                <MdCheckCircle
                                  style={{ color: "#4ECDC4", fontSize: 14 }}
                                  className="shrink-0 mt-0.5"
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Stock notes */}
                    {r.stockNotes && (
                      <div>
                        <p className="text-xs font-black text-[#1A1A2E] mb-2 flex items-center gap-1.5">
                          <MdOutlineInventory2 className="text-[#FFD93D]" />{" "}
                          Tình trạng kho
                        </p>
                        <div className="bg-white rounded-2xl p-3 shadow-sm">
                          <p className="text-xs text-[#4B5563] leading-relaxed">
                            {r.stockNotes}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Handover notes */}
                    {r.handoverNotes && (
                      <div className="sm:col-span-2">
                        <p className="text-xs font-black text-[#1A1A2E] mb-2 flex items-center gap-1.5">
                          <MdAssignment style={{ color: "#FFD93D" }} /> Bàn giao
                          ca
                        </p>
                        <div className="bg-[#FFD93D]/10 border border-[#FFD93D]/30 rounded-2xl p-3">
                          <p className="text-xs text-[#374151] leading-relaxed">
                            {r.handoverNotes}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* General notes */}
                    {r.generalNotes && (
                      <div className="sm:col-span-2">
                        <p className="text-xs font-black text-[#1A1A2E] mb-2 flex items-center gap-1.5">
                          <MdStickyNote2 style={{ color: "#4ECDC4" }} /> Ghi chú
                          chung
                        </p>
                        <div className="bg-white rounded-2xl p-3 shadow-sm">
                          <p className="text-xs text-[#4B5563] leading-relaxed">
                            {r.generalNotes}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Admin review note */}
                    {r.reviewNote && (
                      <div className="sm:col-span-2">
                        <p className="text-xs font-black text-[#1A1A2E] mb-2 flex items-center gap-1.5">
                          <MdCheckCircle style={{ color: "#4ECDC4" }} /> Phản
                          hồi của Admin
                        </p>
                        <div className="bg-[#17409A]/5 border border-[#17409A]/15 rounded-2xl p-3">
                          <p className="text-xs text-[#17409A] leading-relaxed font-semibold">
                            {r.reviewNote}
                          </p>
                          {r.reviewedBy && (
                            <p className="text-[10px] text-[#9CA3AF] mt-1">
                              — {r.reviewedBy}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Inline review action */}
                  {r.status === "submitted" && (
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() => setReviewingId(r.id)}
                        className="text-xs font-black px-5 py-2.5 rounded-2xl bg-[#17409A] text-white hover:bg-[#1a3a8a] transition-colors cursor-pointer"
                      >
                        Xét duyệt báo cáo này →
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Review modal */}
      {reviewingReport && (
        <ReviewModal
          report={reviewingReport}
          onClose={() => setReviewingId(null)}
          onReview={handleReview}
        />
      )}
    </div>
  );
}
