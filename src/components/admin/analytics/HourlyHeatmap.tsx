import { HOURLY_HEATMAP } from "@/data/admin";

const DAYS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
const HOURS = Array.from({ length: 24 }, (_, i) => i);
const LABELS = [0, 3, 6, 9, 12, 15, 18, 21];

// 0=none, 1=low, 2=med, 3=high
const COLORS = ["#E5E7EB", "#BFDBFE", "#60A5FA", "#ffffff"];
const LABELS_TEXT = ["Không có", "Thấp", "Vừa", "Cao"];

export default function HourlyHeatmap() {
  const totalOrders = HOURLY_HEATMAP.flat().reduce((a, v) => a + v, 0);

  return (
    <div className="bg-[#17409A] rounded-3xl p-6 relative overflow-hidden">
      {/* Decorative paw watermark */}
      <div className="absolute -top-6 -right-6 text-white/5 text-[180px] select-none pointer-events-none leading-none rotate-12">
        🐾
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <p className="text-white/50 text-[10px] font-black tracking-[0.22em] uppercase">
            Phân tích thời gian
          </p>
          <p className="text-white font-black text-xl mt-0.5">
            Mật độ đơn hàng theo giờ
          </p>
          <p className="text-white/40 text-xs font-semibold mt-0.5">
            7 ngày gần nhất · {DAYS.length} × 24 giờ
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 flex-wrap justify-end">
          {COLORS.map((c, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <div
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: c, opacity: i === 0 ? 0.4 : 1 }}
              />
              <span className="text-white/50 text-[10px] font-semibold">
                {LABELS_TEXT[i]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Grid — tự co dãn fill đầy chiều rộng */}
      <div className="w-full">
        {/* Hour axis header */}
        <div
          className="grid gap-1 mb-1"
          style={{ gridTemplateColumns: "28px repeat(24, 1fr)" }}
        >
          <div />
          {HOURS.map((h) => (
            <div
              key={h}
              className="text-[9px] text-white/30 font-semibold text-center"
            >
              {LABELS.includes(h) ? h : ""}
            </div>
          ))}
        </div>

        {/* Day rows */}
        {HOURLY_HEATMAP.map((row, d) => (
          <div
            key={d}
            className="grid gap-1 mb-1"
            style={{ gridTemplateColumns: "28px repeat(24, 1fr)" }}
          >
            {/* Day label */}
            <div className="text-right text-[10px] font-black text-white/40 pr-1 flex items-center justify-end">
              {DAYS[d]}
            </div>
            {/* Hour cells */}
            {HOURS.map((h) => {
              const v = row[h];
              return (
                <div
                  key={h}
                  title={`${DAYS[d]} ${h}:00 — ${LABELS_TEXT[v]}`}
                  className="rounded-sm cursor-default transition-transform hover:scale-110 aspect-square w-full"
                  style={{
                    backgroundColor: COLORS[v],
                    opacity: v === 0 ? 0.35 : 1,
                  }}
                />
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer insight */}
      <div className="mt-4 flex items-center gap-6">
        <div>
          <p className="text-white/40 text-[10px] font-black uppercase tracking-wider">
            Giờ cao điểm
          </p>
          <p className="text-white font-black text-sm">19:00 – 21:00</p>
        </div>
        <div>
          <p className="text-white/40 text-[10px] font-black uppercase tracking-wider">
            Ngày bận nhất
          </p>
          <p className="text-white font-black text-sm">Thứ 7</p>
        </div>
        <div>
          <p className="text-white/40 text-[10px] font-black uppercase tracking-wider">
            Chỉ số hoạt động
          </p>
          <p className="text-white font-black text-sm">{totalOrders} điểm</p>
        </div>
      </div>
    </div>
  );
}
