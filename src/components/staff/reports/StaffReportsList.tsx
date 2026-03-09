"use client";

import { useState } from "react";
import {
  MdExpandMore,
  MdExpandLess,
  MdWarning,
  MdCheckCircle,
  MdAssignment,
  MdClose,
} from "react-icons/md";
import {
  STAFF_REPORTS,
  SHIFT_CFG,
  REPORT_TYPE_CFG,
  REPORT_STATUS_CFG,
  type StaffReport,
  type IssueSeverity,
} from "@/data/staff";

const SEVERITY_CFG: Record<
  IssueSeverity,
  { label: string; color: string; bg: string }
> = {
  low: { label: "Thấp", color: "#4ECDC4", bg: "#4ECDC415" },
  medium: { label: "Trung bình", color: "#FF8C42", bg: "#FF8C4215" },
  high: { label: "Cao", color: "#FF6B9D", bg: "#FF6B9D15" },
};

function DetailModal({
  report,
  onClose,
}: {
  report: StaffReport;
  onClose: () => void;
}) {
  const typeCfg = REPORT_TYPE_CFG[report.type];
  const statusCfg = REPORT_STATUS_CFG[report.status];
  const shiftCfg = SHIFT_CFG[report.shift];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden max-h-[92vh]">
        {/* Header */}
        <div className="bg-[#17409A] px-6 py-5 flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="text-xs font-black px-2.5 py-0.5 rounded-xl"
                style={{
                  color: typeCfg.color,
                  backgroundColor: `${typeCfg.color}30`,
                }}
              >
                {typeCfg.label}
              </span>
              <span
                className="text-xs font-black px-2.5 py-0.5 rounded-xl"
                style={{
                  color: statusCfg.color,
                  backgroundColor: `${statusCfg.color}30`,
                }}
              >
                {statusCfg.label}
              </span>
            </div>
            <p className="text-white font-black text-lg leading-snug">
              {report.title}
            </p>
            <p className="text-white/60 text-xs mt-0.5">
              {report.staffName} · {report.date} · {shiftCfg.label}
            </p>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 w-8 h-8 rounded-xl bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <MdClose className="text-lg" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-6 flex flex-col gap-5">
          {/* Summary grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Đơn đã xử lý", value: report.ordersProcessed },
              { label: "Đơn đóng gói", value: report.packagingDone },
              { label: "Phản hồi đánh giá", value: report.reviewsAnswered },
              { label: "Sự cố phát sinh", value: report.issuesCount },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="bg-[#F4F7FF] rounded-2xl px-4 py-3 text-center"
              >
                <p className="text-[#9CA3AF] text-[10px] font-semibold uppercase tracking-wide">
                  {label}
                </p>
                <p className="text-[#1A1A2E] font-black text-xl mt-0.5">
                  {value}
                </p>
              </div>
            ))}
          </div>

          {/* Issues */}
          {report.issues.length > 0 && (
            <div className="flex flex-col gap-2">
              <p className="font-black text-[#1A1A2E] text-sm flex items-center gap-1.5">
                <MdWarning className="text-[#FF8C42]" /> Sự cố trong ca
              </p>
              {report.issues.map((issue) => {
                const sev = SEVERITY_CFG[issue.severity];
                return (
                  <div
                    key={issue.id}
                    className="bg-[#F4F7FF] rounded-2xl p-4 flex items-start gap-3"
                  >
                    <span
                      className="shrink-0 text-[10px] font-black px-2 py-0.5 rounded-lg mt-0.5"
                      style={{ color: sev.color, backgroundColor: sev.bg }}
                    >
                      {sev.label}
                    </span>
                    <p className="text-[#374151] text-sm flex-1">
                      {issue.description}
                    </p>
                    {issue.resolved ? (
                      <MdCheckCircle
                        className="text-[#4ECDC4] shrink-0 text-lg"
                        title="Đã giải quyết"
                      />
                    ) : (
                      <MdWarning
                        className="text-[#FF8C42] shrink-0 text-lg"
                        title="Chưa giải quyết"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Stock notes */}
          {report.stockNotes && (
            <div className="flex flex-col gap-1.5">
              <p className="font-black text-[#1A1A2E] text-sm">
                Tình trạng kho
              </p>
              <div className="bg-[#F4F7FF] rounded-2xl p-4">
                <p className="text-[#374151] text-sm leading-relaxed">
                  {report.stockNotes}
                </p>
              </div>
            </div>
          )}

          {/* Handover notes */}
          {report.handoverNotes && (
            <div className="flex flex-col gap-1.5">
              <p className="font-black text-[#1A1A2E] text-sm">
                Ghi chú bàn giao
              </p>
              <div className="bg-[#FFD93D]/10 border border-[#FFD93D]/30 rounded-2xl p-4">
                <p className="text-[#374151] text-sm leading-relaxed">
                  {report.handoverNotes}
                </p>
              </div>
            </div>
          )}

          {/* General notes */}
          {report.generalNotes && (
            <div className="flex flex-col gap-1.5">
              <p className="font-black text-[#1A1A2E] text-sm">Ghi chú chung</p>
              <div className="bg-[#F4F7FF] rounded-2xl p-4">
                <p className="text-[#374151] text-sm leading-relaxed">
                  {report.generalNotes}
                </p>
              </div>
            </div>
          )}

          {/* Admin review note */}
          {report.reviewNote && (
            <div className="flex flex-col gap-1.5">
              <p className="font-black text-[#1A1A2E] text-sm">
                Phản hồi từ Admin
              </p>
              <div className="bg-[#17409A]/10 border border-[#17409A]/20 rounded-2xl p-4">
                <p className="text-[#17409A] text-xs font-semibold mb-1">
                  {report.reviewedBy}
                </p>
                <p className="text-[#374151] text-sm leading-relaxed">
                  {report.reviewNote}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function StaffReportsList() {
  const [selected, setSelected] = useState<StaffReport | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <>
      <div className="bg-white rounded-3xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#F4F7FF]">
          <p className="font-black text-[#1A1A2E] text-base">Lịch sử báo cáo</p>
          <p className="text-[#9CA3AF] text-xs mt-0.5">
            {STAFF_REPORTS.length} báo cáo
          </p>
        </div>

        <div className="divide-y divide-[#F4F7FF]">
          {STAFF_REPORTS.map((r) => {
            const typeCfg = REPORT_TYPE_CFG[r.type];
            const statusCfg = REPORT_STATUS_CFG[r.status];
            const shiftCfg = SHIFT_CFG[r.shift];
            const isOpen = expanded === r.id;

            return (
              <div key={r.id} className="group">
                {/* Row */}
                <div
                  className="flex items-center gap-4 px-6 py-4 hover:bg-[#F4F7FF]/60 transition-colors cursor-pointer"
                  onClick={() => setExpanded(isOpen ? null : r.id)}
                >
                  {/* Type badge */}
                  <span
                    className="shrink-0 text-[10px] font-black px-2 py-0.5 rounded-lg"
                    style={{
                      color: typeCfg.color,
                      backgroundColor: typeCfg.bg,
                    }}
                  >
                    {typeCfg.label}
                  </span>

                  {/* Title + meta */}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[#1A1A2E] text-sm truncate">
                      {r.title}
                    </p>
                    <p className="text-[#9CA3AF] text-xs">
                      {r.date} ·{" "}
                      <span style={{ color: shiftCfg.color }}>
                        {shiftCfg.label}
                      </span>
                      {r.issuesCount > 0 && (
                        <span className="ml-1.5 text-[#FF8C42]">
                          · {r.issuesCount} sự cố
                        </span>
                      )}
                    </p>
                  </div>

                  {/* Status */}
                  <span
                    className="shrink-0 flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-xl"
                    style={{
                      color: statusCfg.color,
                      backgroundColor: statusCfg.bg,
                    }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full inline-block"
                      style={{ backgroundColor: statusCfg.dot }}
                    />
                    {statusCfg.label}
                  </span>

                  {/* View */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelected(r);
                    }}
                    className="shrink-0 flex items-center gap-1 text-[#17409A] text-xs font-bold bg-[#17409A]/10 hover:bg-[#17409A]/20 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
                  >
                    <MdAssignment className="text-sm" />
                    <span className="hidden sm:inline">Xem</span>
                  </button>

                  {/* Expand toggle */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpanded(isOpen ? null : r.id);
                    }}
                    className="shrink-0 w-7 h-7 rounded-xl bg-[#F4F7FF] hover:bg-[#EEF1FF] flex items-center justify-center text-[#9CA3AF] transition-colors cursor-pointer"
                  >
                    {isOpen ? <MdExpandLess /> : <MdExpandMore />}
                  </button>
                </div>

                {/* Expanded summary */}
                {isOpen && (
                  <div className="px-6 pb-4 grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#F4F7FF]/40">
                    {[
                      { label: "Đơn xử lý", value: r.ordersProcessed },
                      { label: "Đóng gói xong", value: r.packagingDone },
                      { label: "Phản hồi ĐG", value: r.reviewsAnswered },
                    ].map(({ label, value }) => (
                      <div
                        key={label}
                        className="bg-white rounded-xl px-4 py-2.5 flex items-center justify-between"
                      >
                        <span className="text-[#9CA3AF] text-xs">{label}</span>
                        <span className="text-[#1A1A2E] font-black text-sm">
                          {value}
                        </span>
                      </div>
                    ))}
                    {r.handoverNotes && (
                      <div className="sm:col-span-3 bg-[#FFD93D]/10 rounded-xl px-4 py-2.5">
                        <p className="text-[#e6a800] text-[10px] font-black uppercase tracking-wide mb-0.5">
                          Bàn giao
                        </p>
                        <p className="text-[#374151] text-xs line-clamp-2">
                          {r.handoverNotes}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {selected && (
        <DetailModal report={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}
