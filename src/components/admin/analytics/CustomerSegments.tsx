import { CUSTOMER_SEGMENTS } from "@/data/admin";

const R = 68;
const STROKE_W = 22;
const CIRC = 2 * Math.PI * R;
const CX = 100,
  CY = 100;

// Dominant segment
const dominant = CUSTOMER_SEGMENTS.reduce((a, b) =>
  a.value > b.value ? a : b,
);

function buildSegments() {
  let cum = 0;
  return CUSTOMER_SEGMENTS.map((s) => {
    const len = (s.value / 100) * CIRC * 0.965; // 3.5% gap
    const offset = -(cum / 100) * CIRC;
    cum += s.value;
    return { ...s, len, offset };
  });
}

const segments = buildSegments();

export default function CustomerSegments() {
  return (
    <div className="bg-white rounded-3xl p-6 flex flex-col h-full">
      <p className="text-[#9CA3AF] text-[10px] font-black tracking-[0.22em] uppercase">
        Phân khúc khách hàng
      </p>
      <p className="text-[#1A1A2E] font-black text-lg mt-0.5 mb-4">
        Độ tuổi mục tiêu
      </p>

      <div className="flex items-center gap-4 flex-1 min-h-0">
        {/* Donut SVG */}
        <div className="shrink-0 relative" style={{ width: 180, height: 180 }}>
          <svg viewBox="0 0 200 200" width={180} height={180}>
            {/* Track */}
            <circle
              cx={CX}
              cy={CY}
              r={R}
              fill="none"
              stroke="#F4F7FF"
              strokeWidth={STROKE_W}
            />
            {/* Segments */}
            {segments.map((s) => (
              <circle
                key={s.label}
                cx={CX}
                cy={CY}
                r={R}
                fill="none"
                stroke={s.color}
                strokeWidth={STROKE_W}
                strokeDasharray={`${s.len} ${CIRC}`}
                strokeDashoffset={s.offset}
                transform={`rotate(-90 ${CX} ${CY})`}
                strokeLinecap="butt"
              />
            ))}
            {/* Center text */}
            <text
              x={CX}
              y={CY - 8}
              textAnchor="middle"
              fontSize="24"
              fontWeight="900"
              fill="#1A1A2E"
              fontFamily="Nunito, sans-serif"
            >
              {dominant.value}%
            </text>
            <text
              x={CX}
              y={CY + 10}
              textAnchor="middle"
              fontSize="9"
              fontWeight="700"
              fill="#9CA3AF"
              fontFamily="Nunito, sans-serif"
            >
              {dominant.label}
            </text>
          </svg>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-2.5 flex-1">
          {CUSTOMER_SEGMENTS.map((s) => (
            <div key={s.label} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: s.color }}
                />
                <span className="text-[11px] font-semibold text-[#4B5563]">
                  {s.label}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {/* Mini bar */}
                <div className="w-14 h-1 bg-[#F4F7FF] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${s.value}%`, backgroundColor: s.color }}
                  />
                </div>
                <span
                  className="text-[11px] font-black w-7 text-right"
                  style={{ color: s.color }}
                >
                  {s.value}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
