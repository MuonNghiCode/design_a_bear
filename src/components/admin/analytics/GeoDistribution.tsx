import { GEO_DISTRIBUTION } from "@/data/admin";

const ACCENT = "#17409A";

export default function GeoDistribution() {
  const max = GEO_DISTRIBUTION[0].pct;

  return (
    <div className="bg-white rounded-3xl p-6 flex flex-col h-full">
      <p className="text-[#9CA3AF] text-[10px] font-black tracking-[0.22em] uppercase">
        Phân bổ địa lý
      </p>
      <p className="text-[#1A1A2E] font-black text-lg mt-0.5 mb-5">
        Top tỉnh thành
      </p>

      <div className="flex flex-col gap-3 flex-1 justify-between">
        {GEO_DISTRIBUTION.map((g, i) => {
          const isTop = i === 0;
          return (
            <div key={g.province}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2.5">
                  {/* Rank */}
                  <div
                    className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0"
                    style={
                      isTop
                        ? { backgroundColor: ACCENT, color: "white" }
                        : { backgroundColor: "#F4F7FF", color: "#9CA3AF" }
                    }
                  >
                    {i + 1}
                  </div>
                  <span
                    className={`text-[12px] font-bold ${isTop ? "text-[#1A1A2E]" : "text-[#4B5563]"}`}
                  >
                    {g.province}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span
                    className="text-[11px] font-black"
                    style={{ color: isTop ? ACCENT : "#9CA3AF" }}
                  >
                    {g.pct}%
                  </span>
                  <span className="text-[10px] text-[#9CA3AF]">
                    ({g.orders})
                  </span>
                </div>
              </div>
              {/* Bar */}
              <div className="h-1.5 bg-[#F4F7FF] rounded-full overflow-hidden ml-8">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${(g.pct / max) * 100}%`,
                    backgroundColor: isTop ? ACCENT : "#D1D5DB",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-[#F4F7FF] flex items-center justify-between">
        <span className="text-[10px] font-black text-[#9CA3AF] tracking-wider uppercase">
          Tổng đơn hàng
        </span>
        <span className="font-black text-[#17409A] text-base">
          {GEO_DISTRIBUTION.reduce((s, g) => s + g.orders, 0)}
        </span>
      </div>
    </div>
  );
}
