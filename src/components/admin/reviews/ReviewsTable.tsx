"use client";

import { useState } from "react";
import { ADMIN_REVIEWS, AdminReview, ReviewStatus } from "@/data/admin";
import {
  MdSearch,
  MdStar,
  MdStarBorder,
  MdVisibility,
  MdVisibilityOff,
  MdCheckCircle,
  MdFlag,
  MdReply,
  MdClose,
  MdSend,
} from "react-icons/md";

// ─── Config ──────────────────────────────────────────────────────────────────

const STATUS_CFG: Record<
  ReviewStatus,
  { label: string; bg: string; text: string; dot: string }
> = {
  published: {
    label: "Đã duyệt",
    bg: "bg-[#4ECDC4]/10",
    text: "text-[#4ECDC4]",
    dot: "#4ECDC4",
  },
  pending: {
    label: "Chờ duyệt",
    bg: "bg-[#FFD93D]/10",
    text: "text-[#e6a800]",
    dot: "#FFD93D",
  },
  flagged: {
    label: "Bị báo cáo",
    bg: "bg-[#FF6B9D]/10",
    text: "text-[#FF6B9D]",
    dot: "#FF6B9D",
  },
  hidden: {
    label: "Đã ẩn",
    bg: "bg-[#9CA3AF]/10",
    text: "text-[#9CA3AF]",
    dot: "#9CA3AF",
  },
};

const TABS: { key: ReviewStatus | "all"; label: string }[] = [
  { key: "all", label: "Tất cả" },
  { key: "published", label: "Đã duyệt" },
  { key: "pending", label: "Chờ duyệt" },
  { key: "flagged", label: "Bị báo cáo" },
  { key: "hidden", label: "Đã ẩn" },
];

// ─── Star renderer ───────────────────────────────────────────────────────────

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) =>
        s <= rating ? (
          <MdStar key={s} className="text-[#FFD93D]" style={{ fontSize: 14 }} />
        ) : (
          <MdStarBorder
            key={s}
            className="text-[#D1D5DB]"
            style={{ fontSize: 14 }}
          />
        ),
      )}
    </div>
  );
}

// ─── Reply / Detail Modal ────────────────────────────────────────────────────

function ReviewModal({
  review,
  onClose,
}: {
  review: AdminReview;
  onClose: () => void;
}) {
  const [reply, setReply] = useState(review.reply ?? "");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (!reply.trim()) return;
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const cfg = STATUS_CFG[review.status];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#17409A] px-6 py-5 flex items-start justify-between gap-3">
          <div>
            <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-1">
              Chi tiết đánh giá
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

        {/* Body — scrollable */}
        <div className="overflow-y-auto flex-1 p-6 flex flex-col gap-5">
          {/* Customer + product row */}
          <div className="flex items-start gap-4">
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center font-black text-white text-base shrink-0"
              style={{ backgroundColor: review.avatarColor }}
            >
              {review.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-[#1A1A2E] text-sm">
                {review.customer}
              </p>
              <p className="text-[#9CA3AF] text-xs truncate">
                {review.product}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <Stars rating={review.rating} />
                <span className="text-[#9CA3AF] text-xs">{review.date}</span>
              </div>
            </div>
            <span
              className={`shrink-0 text-xs font-bold px-2.5 py-1 rounded-xl ${cfg.bg} ${cfg.text}`}
            >
              {cfg.label}
            </span>
          </div>

          {/* Review content */}
          <div className="bg-[#F4F7FF] rounded-2xl p-4">
            <p className="text-[#374151] text-sm leading-relaxed">
              {review.content}
            </p>
          </div>

          {/* Helpful stat */}
          <div className="flex items-center gap-2 text-[#9CA3AF] text-xs">
            <MdCheckCircle className="text-[#4ECDC4]" />
            <span>{review.helpful} người thấy hữu ích</span>
          </div>

          {/* Reply area */}
          <div className="flex flex-col gap-2">
            <label className="text-[#1A1A2E] font-bold text-sm">
              Phản hồi của Admin
            </label>
            <textarea
              rows={4}
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Nhập phản hồi cho khách hàng…"
              className="w-full bg-[#F4F7FF] rounded-2xl px-4 py-3 text-sm text-[#1A1A2E] placeholder-[#9CA3AF] outline-none focus:ring-2 focus:ring-[#17409A]/30 resize-none transition"
            />
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-[#F4F7FF] flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={!reply.trim()}
            className="flex items-center gap-2 bg-[#17409A] hover:bg-[#1a3a8a] disabled:opacity-40 text-white text-sm font-bold px-5 py-2.5 rounded-2xl transition-colors cursor-pointer disabled:cursor-not-allowed flex-1 justify-center"
          >
            <MdSend className="text-base" />
            {saved ? "Đã lưu!" : "Gửi phản hồi"}
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

// ─── Main Table ──────────────────────────────────────────────────────────────

export default function ReviewsTable() {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<ReviewStatus | "all">("all");
  const [selected, setSelected] = useState<AdminReview | null>(null);
  const [rows, setRows] = useState<AdminReview[]>(ADMIN_REVIEWS);

  const filtered = rows.filter((r) => {
    const matchTab = tab === "all" || r.status === tab;
    const q = search.toLowerCase();
    const matchText =
      !q ||
      r.customer.toLowerCase().includes(q) ||
      r.product.toLowerCase().includes(q) ||
      r.title.toLowerCase().includes(q);
    return matchTab && matchText;
  });

  const approve = (id: string) =>
    setRows((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: "published" as ReviewStatus } : r,
      ),
    );
  const hide = (id: string) =>
    setRows((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: "hidden" as ReviewStatus } : r,
      ),
    );

  return (
    <>
      <div className="bg-white rounded-3xl overflow-hidden">
        {/* Toolbar */}
        <div className="p-5 border-b border-[#F4F7FF] flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 w-full sm:max-w-xs">
            <MdSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] text-lg" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm khách hàng, sản phẩm…"
              className="w-full bg-[#F4F7FF] rounded-2xl pl-10 pr-4 py-2.5 text-sm text-[#1A1A2E] placeholder-[#9CA3AF] outline-none focus:ring-2 focus:ring-[#17409A]/20 transition"
            />
          </div>

          {/* Tab filters */}
          <div className="flex gap-1 flex-wrap">
            {TABS.map(({ key, label }) => {
              const count =
                key === "all"
                  ? rows.length
                  : rows.filter((r) => r.status === key).length;
              return (
                <button
                  key={key}
                  onClick={() => setTab(key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    tab === key
                      ? "bg-[#17409A] text-white"
                      : "bg-[#F4F7FF] text-[#9CA3AF] hover:bg-[#EEF1FF] hover:text-[#17409A]"
                  }`}
                >
                  {label}
                  <span
                    className={`rounded-lg px-1.5 py-0.5 text-[10px] font-black ${
                      tab === key
                        ? "bg-white/20 text-white"
                        : "bg-white text-[#17409A]"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Table — desktop */}
        <div className="overflow-x-auto hidden sm:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#F4F7FF]">
                {[
                  "Khách hàng",
                  "Sản phẩm",
                  "Đánh giá",
                  "Nội dung",
                  "Ngày",
                  "Trạng thái",
                  "",
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
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center text-[#9CA3AF] text-sm py-10"
                  >
                    Không tìm thấy đánh giá nào
                  </td>
                </tr>
              ) : (
                filtered.map((r) => {
                  const cfg = STATUS_CFG[r.status];
                  return (
                    <tr
                      key={r.id}
                      className="border-b border-[#F4F7FF] last:border-0 hover:bg-[#F4F7FF]/60 transition-colors"
                    >
                      {/* Customer */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-white text-sm shrink-0"
                            style={{ backgroundColor: r.avatarColor }}
                          >
                            {r.avatar}
                          </div>
                          <span className="font-semibold text-[#1A1A2E] whitespace-nowrap">
                            {r.customer}
                          </span>
                        </div>
                      </td>

                      {/* Product */}
                      <td className="px-5 py-4">
                        <span className="text-[#374151] max-w-40 truncate block">
                          {r.product}
                        </span>
                      </td>

                      {/* Rating */}
                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-0.5">
                          <Stars rating={r.rating} />
                          <span className="text-[#9CA3AF] text-xs">
                            {r.rating}/5
                          </span>
                        </div>
                      </td>

                      {/* Content */}
                      <td className="px-5 py-4 max-w-55">
                        <p className="text-[#374151] line-clamp-2 text-xs leading-relaxed">
                          {r.content}
                        </p>
                        {r.reply && (
                          <span className="inline-flex items-center gap-1 mt-1 text-[#17409A] text-[10px] font-bold">
                            <MdReply className="text-xs" /> Đã phản hồi
                          </span>
                        )}
                      </td>

                      {/* Date */}
                      <td className="px-5 py-4 whitespace-nowrap text-[#9CA3AF] text-xs">
                        {r.date}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-xl ${cfg.bg} ${cfg.text}`}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full inline-block"
                            style={{ backgroundColor: cfg.dot }}
                          />
                          {cfg.label}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5">
                          {/* Reply / view */}
                          <button
                            onClick={() => setSelected(r)}
                            title="Xem & phản hồi"
                            className="w-8 h-8 rounded-xl bg-[#F4F7FF] hover:bg-[#17409A]/10 text-[#9CA3AF] hover:text-[#17409A] flex items-center justify-center transition-colors cursor-pointer"
                          >
                            <MdReply className="text-base" />
                          </button>

                          {/* Approve — only if not already published */}
                          {r.status !== "published" &&
                            r.status !== "hidden" && (
                              <button
                                onClick={() => approve(r.id)}
                                title="Duyệt"
                                className="w-8 h-8 rounded-xl bg-[#4ECDC4]/10 hover:bg-[#4ECDC4]/20 text-[#4ECDC4] flex items-center justify-center transition-colors cursor-pointer"
                              >
                                <MdCheckCircle className="text-base" />
                              </button>
                            )}

                          {/* Hide — only if not already hidden */}
                          {r.status !== "hidden" && (
                            <button
                              onClick={() => hide(r.id)}
                              title="Ẩn"
                              className="w-8 h-8 rounded-xl bg-[#FF6B9D]/10 hover:bg-[#FF6B9D]/20 text-[#FF6B9D] flex items-center justify-center transition-colors cursor-pointer"
                            >
                              <MdVisibilityOff className="text-base" />
                            </button>
                          )}

                          {/* Unhide — only if hidden */}
                          {r.status === "hidden" && (
                            <button
                              onClick={() => approve(r.id)}
                              title="Hiện lại"
                              className="w-8 h-8 rounded-xl bg-[#4ECDC4]/10 hover:bg-[#4ECDC4]/20 text-[#4ECDC4] flex items-center justify-center transition-colors cursor-pointer"
                            >
                              <MdVisibility className="text-base" />
                            </button>
                          )}

                          {/* Flag */}
                          {r.status !== "flagged" && (
                            <button
                              onClick={() =>
                                setRows((prev) =>
                                  prev.map((x) =>
                                    x.id === r.id
                                      ? {
                                          ...x,
                                          status: "flagged" as ReviewStatus,
                                        }
                                      : x,
                                  ),
                                )
                              }
                              title="Gắn cờ"
                              className="w-8 h-8 rounded-xl bg-[#FFD93D]/10 hover:bg-[#FFD93D]/20 text-[#e6a800] flex items-center justify-center transition-colors cursor-pointer"
                            >
                              <MdFlag className="text-base" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Cards — mobile */}
        <div className="sm:hidden flex flex-col divide-y divide-[#F4F7FF]">
          {filtered.map((r) => {
            const cfg = STATUS_CFG[r.status];
            return (
              <div key={r.id} className="p-4 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-sm shrink-0"
                      style={{ backgroundColor: r.avatarColor }}
                    >
                      {r.avatar}
                    </div>
                    <div>
                      <p className="font-bold text-[#1A1A2E] text-sm">
                        {r.customer}
                      </p>
                      <p className="text-[#9CA3AF] text-xs truncate max-w-40">
                        {r.product}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-xl ${cfg.bg} ${cfg.text}`}
                  >
                    {cfg.label}
                  </span>
                </div>
                <Stars rating={r.rating} />
                <p className="text-[#374151] text-xs line-clamp-3">
                  {r.content}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelected(r)}
                    className="flex items-center gap-1.5 bg-[#17409A] text-white text-xs font-bold px-3 py-1.5 rounded-xl cursor-pointer hover:bg-[#1a3a8a] transition-colors"
                  >
                    <MdReply className="text-sm" /> Phản hồi
                  </button>
                  {r.status !== "published" && r.status !== "hidden" && (
                    <button
                      onClick={() => approve(r.id)}
                      className="text-[#4ECDC4] text-xs font-bold px-2.5 py-1.5 rounded-xl bg-[#4ECDC4]/10 cursor-pointer"
                    >
                      Duyệt
                    </button>
                  )}
                  {r.status !== "hidden" && (
                    <button
                      onClick={() => hide(r.id)}
                      className="text-[#FF6B9D] text-xs font-bold px-2.5 py-1.5 rounded-xl bg-[#FF6B9D]/10 cursor-pointer"
                    >
                      Ẩn
                    </button>
                  )}
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <p className="text-center text-[#9CA3AF] text-sm py-10">
              Không tìm thấy đánh giá
            </p>
          )}
        </div>
      </div>

      {/* Modal */}
      {selected && (
        <ReviewModal review={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}
