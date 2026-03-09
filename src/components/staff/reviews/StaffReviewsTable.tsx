"use client";

import { useState } from "react";
import { ADMIN_REVIEWS, type AdminReview } from "@/data/admin";
import {
  MdSearch,
  MdStar,
  MdStarBorder,
  MdReply,
  MdClose,
  MdSend,
} from "react-icons/md";

// Staff can only see + reply — no approve/hide/flag actions

const STATUS_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  published: { label: "Đã duyệt",   color: "#4ECDC4", bg: "#4ECDC415" },
  pending:   { label: "Chờ duyệt",  color: "#e6a800", bg: "#FFD93D15" },
  flagged:   { label: "Bị báo cáo", color: "#FF6B9D", bg: "#FF6B9D15" },
  hidden:    { label: "Đã ẩn",      color: "#9CA3AF", bg: "#9CA3AF15" },
};

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) =>
        s <= rating ? (
          <MdStar key={s} className="text-[#FFD93D]" style={{ fontSize: 14 }} />
        ) : (
          <MdStarBorder key={s} className="text-[#D1D5DB]" style={{ fontSize: 14 }} />
        ),
      )}
    </div>
  );
}

function ReplyModal({ review, onClose }: { review: AdminReview; onClose: () => void }) {
  const [reply, setReply] = useState(review.reply ?? "");
  const [saved, setSaved] = useState(false);

  const handleSend = () => {
    if (!reply.trim()) return;
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 1500);
  };

  const cfg = STATUS_LABELS[review.status] ?? STATUS_LABELS.published;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#17409A] px-6 py-5 flex items-start justify-between gap-3">
          <div>
            <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-1">Phản hồi đánh giá</p>
            <p className="text-white font-black text-base leading-snug">{review.title}</p>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 w-8 h-8 rounded-xl bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <MdClose className="text-lg" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-6 flex flex-col gap-5">
          {/* Customer info */}
          <div className="flex items-start gap-4">
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center font-black text-white text-base shrink-0"
              style={{ backgroundColor: review.avatarColor }}
            >
              {review.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-[#1A1A2E] text-sm">{review.customer}</p>
              <p className="text-[#9CA3AF] text-xs truncate">{review.product}</p>
              <div className="flex items-center gap-2 mt-1">
                <Stars rating={review.rating} />
                <span className="text-[#9CA3AF] text-xs">{review.date}</span>
              </div>
            </div>
            <span className={`shrink-0 text-xs font-bold px-2.5 py-1 rounded-xl ${cfg.bg}`} style={{ color: cfg.color }}>
              {cfg.label}
            </span>
          </div>

          {/* Review content */}
          <div className="bg-[#F4F7FF] rounded-2xl p-4">
            <p className="text-[#374151] text-sm font-bold mb-1">{review.title}</p>
            <p className="text-[#374151] text-sm leading-relaxed">{review.content}</p>
          </div>

          {/* Helpful */}
          <p className="text-[#9CA3AF] text-xs">{review.helpful} người thấy hữu ích</p>

          {/* Reply textarea */}
          <div className="flex flex-col gap-2">
            <label className="text-[#1A1A2E] font-bold text-sm">Phản hồi của bạn</label>
            <textarea
              rows={4}
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Nhập phản hồi thân thiện cho khách hàng…"
              className="w-full bg-[#F4F7FF] rounded-2xl px-4 py-3 text-sm text-[#1A1A2E] placeholder-[#9CA3AF] outline-none focus:ring-2 focus:ring-[#17409A]/30 resize-none transition"
            />
            <p className="text-[#9CA3AF] text-xs">Phản hồi sẽ được admin xem xét trước khi hiển thị công khai.</p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#F4F7FF] flex items-center gap-3">
          <button
            onClick={handleSend}
            disabled={!reply.trim()}
            className="flex items-center gap-2 bg-[#17409A] hover:bg-[#1a3a8a] disabled:opacity-40 text-white text-sm font-bold px-5 py-2.5 rounded-2xl transition-colors cursor-pointer disabled:cursor-not-allowed flex-1 justify-center"
          >
            <MdSend className="text-base" />
            {saved ? "Đã gửi!" : "Gửi phản hồi"}
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

export default function StaffReviewsTable() {
  const [search, setSearch]     = useState("");
  const [filter, setFilter]     = useState<"all" | "pending" | "unanswered">("all");
  const [selected, setSelected] = useState<AdminReview | null>(null);

  const filtered = ADMIN_REVIEWS.filter((r) => {
    if (filter === "pending"    && r.status !== "pending")   return false;
    if (filter === "unanswered" && r.reply)                  return false;
    if (search) {
      const q = search.toLowerCase();
      return r.customer.toLowerCase().includes(q) || r.product.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <>
      <div className="bg-white rounded-3xl overflow-hidden">
        {/* Toolbar */}
        <div className="p-5 border-b border-[#F4F7FF] flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="relative flex-1 w-full sm:max-w-xs">
            <MdSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] text-lg" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm khách hàng, sản phẩm…"
              className="w-full bg-[#F4F7FF] rounded-2xl pl-10 pr-4 py-2.5 text-sm text-[#1A1A2E] placeholder-[#9CA3AF] outline-none focus:ring-2 focus:ring-[#17409A]/20 transition"
            />
          </div>
          <div className="flex gap-1">
            {(["all", "pending", "unanswered"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  filter === f
                    ? "bg-[#17409A] text-white"
                    : "bg-[#F4F7FF] text-[#9CA3AF] hover:bg-[#EEF1FF] hover:text-[#17409A]"
                }`}
              >
                {f === "all" ? "Tất cả" : f === "pending" ? "Chờ duyệt" : "Chưa trả lời"}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto hidden sm:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#F4F7FF]">
                {["Khách hàng", "Sản phẩm", "Đánh giá", "Nội dung", "Ngày", ""].map((h) => (
                  <th key={h} className="text-left text-[#9CA3AF] font-semibold text-xs uppercase tracking-wide px-5 py-3">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center text-[#9CA3AF] text-sm py-10">Không tìm thấy đánh giá</td>
                </tr>
              ) : (
                filtered.map((r) => {
                  const cfg = STATUS_LABELS[r.status] ?? STATUS_LABELS.published;
                  return (
                    <tr key={r.id} className="border-b border-[#F4F7FF] last:border-0 hover:bg-[#F4F7FF]/60 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-white text-sm shrink-0" style={{ backgroundColor: r.avatarColor }}>
                            {r.avatar}
                          </div>
                          <span className="font-semibold text-[#1A1A2E] whitespace-nowrap">{r.customer}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 max-w-40">
                        <span className="text-[#374151] truncate block">{r.product}</span>
                      </td>
                      <td className="px-5 py-4">
                        <Stars rating={r.rating} />
                      </td>
                      <td className="px-5 py-4 max-w-52">
                        <p className="text-[#374151] line-clamp-2 text-xs leading-relaxed">{r.content}</p>
                        {r.reply && (
                          <span className="inline-flex items-center gap-1 mt-1 text-[#17409A] text-[10px] font-bold">
                            <MdReply className="text-xs" /> Đã phản hồi
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-[#9CA3AF] text-xs">{r.date}</td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => setSelected(r)}
                          className="flex items-center gap-1.5 bg-[#17409A]/10 hover:bg-[#17409A]/20 text-[#17409A] text-xs font-bold px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
                        >
                          <MdReply className="text-sm" />
                          {r.reply ? "Xem & sửa" : "Phản hồi"}
                        </button>
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
          {filtered.map((r) => (
            <div key={r.id} className="p-4 flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-sm shrink-0" style={{ backgroundColor: r.avatarColor }}>
                  {r.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[#1A1A2E] text-sm">{r.customer}</p>
                  <p className="text-[#9CA3AF] text-xs truncate">{r.product}</p>
                  <Stars rating={r.rating} />
                </div>
              </div>
              <p className="text-[#374151] text-xs line-clamp-3">{r.content}</p>
              <button
                onClick={() => setSelected(r)}
                className="flex items-center gap-1.5 bg-[#17409A] text-white text-xs font-bold px-3 py-1.5 rounded-xl cursor-pointer self-start"
              >
                <MdReply /> {r.reply ? "Sửa phản hồi" : "Phản hồi"}
              </button>
            </div>
          ))}
          {filtered.length === 0 && <p className="text-center text-[#9CA3AF] text-sm py-10">Không tìm thấy</p>}
        </div>
      </div>

      {selected && <ReplyModal review={selected} onClose={() => setSelected(null)} />}
    </>
  );
}
