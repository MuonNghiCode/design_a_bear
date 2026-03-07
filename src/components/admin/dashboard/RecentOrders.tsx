import { RECENT_ORDERS } from "@/data/admin";

const STATUS_MAP = {
  done: { label: "Hoàn thành", color: "#4ECDC4", bg: "#4ECDC418" },
  shipping: { label: "Đang giao", color: "#17409A", bg: "#17409A18" },
  pending: { label: "Chờ xử lý", color: "#FF8C42", bg: "#FF8C4218" },
};

const AVATAR_COLORS = ["#17409A", "#7C5CFC", "#4ECDC4", "#FF8C42", "#FF6B9D"];

export default function RecentOrders() {
  return (
    <div className="bg-white rounded-3xl p-6 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <p className="text-[#9CA3AF] text-[10px] font-black tracking-[0.22em] uppercase">
            Đơn hàng
          </p>
          <p className="text-[#1A1A2E] font-black text-xl mt-0.5">
            Gần đây nhất
          </p>
        </div>
        <button className="text-[#17409A] text-xs font-black hover:underline underline-offset-2">
          Xem tất cả
        </button>
      </div>

      {/* Orders */}
      <div className="flex flex-col gap-1.5 flex-1">
        {RECENT_ORDERS.map((o, i) => {
          const st = STATUS_MAP[o.status];
          return (
            <div
              key={o.id}
              className="flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-[#F4F7FF] transition-colors cursor-pointer group"
            >
              {/* Avatar */}
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-white font-black text-sm group-hover:scale-105 transition-transform duration-200"
                style={{
                  backgroundColor: AVATAR_COLORS[i % AVATAR_COLORS.length],
                }}
              >
                {o.avatar}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-[#1A1A2E] font-bold text-sm truncate leading-tight">
                  {o.customer}
                </p>
                <p className="text-[#9CA3AF] text-[11px] font-semibold truncate leading-tight">
                  {o.product}
                </p>
              </div>

              {/* Amount */}
              <p className="text-[#1A1A2E] font-black text-sm whitespace-nowrap shrink-0">
                {o.amount}
              </p>

              {/* Status pill */}
              <span
                className="text-[10px] font-black px-2.5 py-1 rounded-full whitespace-nowrap shrink-0"
                style={{ color: st.color, backgroundColor: st.bg }}
              >
                {st.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Footer: summary pills */}
      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[#F4F7FF]">
        {[
          { label: "Hoàn thành", count: 2, color: "#4ECDC4" },
          { label: "Đang giao", count: 2, color: "#17409A" },
          { label: "Chờ xử lý", count: 1, color: "#FF8C42" },
        ].map((s) => (
          <div key={s.label} className="flex items-center gap-1.5">
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: s.color }}
            />
            <span className="text-[11px] text-[#9CA3AF] font-semibold">
              {s.count} {s.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
