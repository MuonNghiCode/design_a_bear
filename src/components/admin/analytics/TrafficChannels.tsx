import { TRAFFIC_CHANNELS } from "@/data/admin";

export default function TrafficChannels() {
  return (
    <div className="bg-white rounded-3xl p-6 flex flex-col h-full">
      <p className="text-[#9CA3AF] text-[10px] font-black tracking-[0.22em] uppercase">
        Kênh truy cập
      </p>
      <p className="text-[#1A1A2E] font-black text-lg mt-0.5 mb-5">
        Nguồn khách hàng
      </p>

      <div className="flex flex-col gap-3.5 flex-1 justify-between">
        {TRAFFIC_CHANNELS.map((ch, i) => (
          <div key={ch.channel}>
            {/* Row: name + sessions */}
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                {/* Rank badge */}
                <span
                  className="w-5 h-5 rounded-md flex items-center justify-center text-[9px] font-black text-white shrink-0"
                  style={{ backgroundColor: ch.color }}
                >
                  {i + 1}
                </span>
                <span className="text-[12px] font-bold text-[#374151]">
                  {ch.channel}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="text-[11px] font-black"
                  style={{ color: ch.color }}
                >
                  {ch.pct}%
                </span>
                <span className="text-[10px] text-[#9CA3AF] font-semibold">
                  {ch.sessions.toLocaleString()}
                </span>
              </div>
            </div>
            {/* Progress bar */}
            <div className="h-1.5 bg-[#F4F7FF] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${ch.pct}%`, backgroundColor: ch.color }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="mt-5 pt-4 border-t border-[#F4F7FF] flex items-center justify-between">
        <span className="text-[10px] font-black text-[#9CA3AF] tracking-wider uppercase">
          Tổng phiên
        </span>
        <span className="font-black text-[#17409A] text-base">
          {TRAFFIC_CHANNELS.reduce(
            (s, c) => s + c.sessions,
            0,
          ).toLocaleString()}
        </span>
      </div>
    </div>
  );
}
