import { MdTrendingUp } from "react-icons/md";
import { GiBearFace } from "react-icons/gi";

const VALUE = 73;
// Semi-circle gauge: M 15 100 A 85 85 0 0 1 185 100
// Arc length = π * 85 ≈ 267.04
const ARC_LENGTH = Math.PI * 85;
const FILLED = (VALUE / 100) * ARC_LENGTH;

export default function ConversionCard() {
  return (
    <div className="bg-white rounded-3xl p-8 flex flex-col justify-between min-h-75 relative overflow-hidden">
      {/* Decorative orange circle top-right */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#FF8C42]/6 rounded-full pointer-events-none" />
      <div className="absolute -top-3 -right-3 w-16 h-16 bg-[#FF8C42]/8 rounded-full pointer-events-none" />

      {/* Thin orange left accent border */}
      <div className="absolute left-0 top-8 bottom-8 w-0.75 bg-[#FF8C42] rounded-full" />

      {/* Header */}
      <div className="pl-2">
        <p className="text-[#9CA3AF] text-[10px] font-black tracking-[0.22em] uppercase">
          Tỷ lệ chuyển đổi
        </p>
        <div className="flex items-baseline gap-1 mt-1">
          <span className="text-[#1A1A2E] font-black text-6xl leading-none">
            {VALUE}
          </span>
          <span className="text-[#FF8C42] font-black text-2xl">%</span>
        </div>
      </div>

      {/* Gauge SVG + overlaid number */}
      <div
        className="relative flex justify-center items-end"
        style={{ height: 110 }}
      >
        <svg
          width="200"
          height="110"
          viewBox="0 0 200 110"
          className="overflow-visible"
        >
          {/* Track */}
          <path
            d="M 15 100 A 85 85 0 0 1 185 100"
            fill="none"
            stroke="#FF8C42"
            strokeOpacity={0.12}
            strokeWidth={14}
            strokeLinecap="round"
          />
          {/* Progress */}
          <path
            d="M 15 100 A 85 85 0 0 1 185 100"
            fill="none"
            stroke="#FF8C42"
            strokeWidth={14}
            strokeLinecap="round"
            strokeDasharray={`${FILLED} ${ARC_LENGTH}`}
          />
          {/* Tick marks */}
          {[0, 25, 50, 75, 100].map((tick) => {
            const angle = Math.PI * (tick / 100); // 0..π
            const cx = 100 - 85 * Math.cos(angle);
            const cy = 100 - 85 * Math.sin(angle);
            return (
              <circle
                key={tick}
                cx={cx}
                cy={cy}
                r={tick === VALUE ? 0 : 2}
                fill="#FF8C42"
                fillOpacity={0.3}
              />
            );
          })}
          {/* Needle dot on progress end */}
          {(() => {
            const angle = Math.PI * (VALUE / 100);
            const cx = 100 - 85 * Math.cos(angle);
            const cy = 100 - 85 * Math.sin(angle);
            return <circle cx={cx} cy={cy} r={7} fill="#FF8C42" />;
          })()}
        </svg>

        {/* Bear icon center-bottom of gauge */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center -mb-1">
          <GiBearFace className="text-[#FF8C42]/25 text-4xl" />
        </div>
      </div>

      {/* Footer */}
      <div className="pl-2">
        <p className="text-[#6B7280] text-sm leading-relaxed">
          Tăng <span className="text-[#FF8C42] font-black">+4.2%</span> nhờ cải
          thiện UX trang sản phẩm
        </p>
        <div className="flex items-center gap-1.5 mt-2.5">
          <MdTrendingUp className="text-[#4ECDC4] text-lg" />
          <span className="text-[#4ECDC4] font-bold text-sm">
            Tốt hơn tháng trước
          </span>
        </div>
      </div>
    </div>
  );
}
