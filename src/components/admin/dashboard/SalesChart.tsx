import { MdCalendarToday } from "react-icons/md";
import { MONTHLY_REVENUE } from "@/data/admin";

const MAX_VALUE = 35;

export default function SalesChart() {
  const total = MONTHLY_REVENUE[MONTHLY_REVENUE.length - 1].value;

  return (
    <div className="bg-white rounded-3xl p-6 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <p className="text-[#9CA3AF] text-[10px] font-black tracking-[0.22em] uppercase">
            Doanh thu
          </p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-[#1A1A2E] font-black text-3xl leading-none">
              {total}M
            </span>
            <span className="text-[#6B7280] text-sm font-semibold ml-1">
              VND
            </span>
          </div>
          <div className="flex items-center gap-1 mt-1.5">
            <span className="text-[#4ECDC4] font-black text-sm">↑ +8.3%</span>
            <span className="text-[#9CA3AF] text-xs font-semibold">
              tháng này
            </span>
          </div>
        </div>

        <button className="flex items-center gap-1.5 text-[#9CA3AF] hover:text-[#17409A] transition-colors text-[11px] font-bold border border-[#E5E7EB] hover:border-[#17409A]/30 rounded-xl px-3 py-1.5">
          <MdCalendarToday className="text-xs" />6 tháng
        </button>
      </div>

      {/* Grid lines */}
      <div
        className="flex-1 flex flex-col justify-between mb-2"
        style={{ minHeight: 120 }}
      >
        {[MAX_VALUE, MAX_VALUE * 0.66, MAX_VALUE * 0.33, 0].map((line) => (
          <div key={line} className="flex items-center gap-2">
            <span className="text-[#E5E7EB] text-[9px] font-semibold w-6 text-right shrink-0">
              {line > 0 ? `${line.toFixed(0)}M` : ""}
            </span>
            <div className="flex-1 h-px bg-[#F4F7FF]" />
          </div>
        ))}
      </div>

      {/* Bars */}
      <div className="flex items-end gap-1.5 h-32">
        {MONTHLY_REVENUE.map((m, i) => {
          const heightPct = (m.value / MAX_VALUE) * 100;
          const isCurrent = i === MONTHLY_REVENUE.length - 1;
          const isPrev = i === MONTHLY_REVENUE.length - 2;
          return (
            <div
              key={m.month}
              className="flex-1 flex flex-col items-center gap-2 group cursor-pointer"
            >
              <div
                className={`w-full rounded-t-xl relative transition-all duration-300 group-hover:opacity-90 ${
                  isCurrent
                    ? "bg-[#17409A]"
                    : isPrev
                      ? "bg-[#17409A]/35"
                      : "bg-[#17409A]/15"
                }`}
                style={{ height: `${heightPct}%` }}
              >
                {/* Hover tooltip */}
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#0E2A66] text-white text-[10px] px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg pointer-events-none">
                  {m.value}M VND
                </div>
                {/* Current month label on bar */}
                {isCurrent && (
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-white/60 rounded-full" />
                )}
              </div>
              <span
                className={`text-[10px] font-black ${
                  isCurrent ? "text-[#17409A]" : "text-[#9CA3AF]"
                }`}
              >
                {m.month}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
