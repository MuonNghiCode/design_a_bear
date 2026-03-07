import { REVENUE_COMPARISON } from "@/data/admin";

// SVG dimensions
const W = 480,
  H = 160;
const PAD_L = 36,
  PAD_R = 20,
  PAD_T = 12,
  PAD_B = 28;
const CHART_W = W - PAD_L - PAD_R;
const CHART_H = H - PAD_T - PAD_B;
const MAX_V = 36;
const N = REVENUE_COMPARISON.thisYear.length;

function xAt(i: number) {
  return PAD_L + (i / (N - 1)) * CHART_W;
}
function yAt(v: number) {
  return PAD_T + (1 - v / MAX_V) * CHART_H;
}
function smoothPath(values: number[]) {
  const cp = (xAt(1) - xAt(0)) * 0.38;
  return values.reduce((acc, v, i) => {
    const x = xAt(i),
      y = yAt(v);
    if (i === 0) return `M ${x.toFixed(1)} ${y.toFixed(1)}`;
    const px = xAt(i - 1),
      py = yAt(values[i - 1]);
    return `${acc} C ${(px + cp).toFixed(1)} ${py.toFixed(1)} ${(x - cp).toFixed(1)} ${y.toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }, "");
}

const thisYearPath = smoothPath(REVENUE_COMPARISON.thisYear);
const lastYearPath = smoothPath(REVENUE_COMPARISON.lastYear);
const thisYearPts = REVENUE_COMPARISON.thisYear.map((v, i) => ({
  x: xAt(i),
  y: yAt(v),
}));
const lastYearPts = REVENUE_COMPARISON.lastYear.map((v, i) => ({
  x: xAt(i),
  y: yAt(v),
}));

// Grid y lines at 0, 12, 24, 36
const GRID_Y = [36, 24, 12];

export default function RevenueComparison() {
  const thisTotal = REVENUE_COMPARISON.thisYear
    .reduce((a, b) => a + b, 0)
    .toFixed(1);
  const lastTotal = REVENUE_COMPARISON.lastYear
    .reduce((a, b) => a + b, 0)
    .toFixed(1);
  const growth = (((+thisTotal - +lastTotal) / +lastTotal) * 100).toFixed(1);

  return (
    <div className="bg-white rounded-3xl p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-[#9CA3AF] text-[10px] font-black tracking-[0.22em] uppercase">
            So sánh doanh thu
          </p>
          <p className="text-[#1A1A2E] font-black text-xl mt-0.5">
            Năm nay vs Năm ngoái
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs font-black">
          <span className="flex items-center gap-1.5">
            <span className="w-6 h-0.5 bg-[#17409A] rounded inline-block" />
            <span className="text-[#6B7280]">2026</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span
              className="w-6 h-0.5 bg-[#9CA3AF] rounded inline-block border-dashed"
              style={{ borderTop: "2px dashed #9CA3AF", height: 0 }}
            />
            <span className="text-[#9CA3AF]">2025</span>
          </span>
        </div>
      </div>

      {/* SVG chart */}
      <div className="flex-1 min-h-0">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Grid lines */}
          {GRID_Y.map((v) => {
            const y = yAt(v);
            return (
              <g key={v}>
                <line
                  x1={PAD_L}
                  y1={y}
                  x2={W - PAD_R}
                  y2={y}
                  stroke="#F4F7FF"
                  strokeWidth={1}
                />
                <text
                  x={PAD_L - 4}
                  y={y + 3.5}
                  textAnchor="end"
                  fontSize={8}
                  fill="#9CA3AF"
                  fontFamily="Nunito, sans-serif"
                >
                  {v}M
                </text>
              </g>
            );
          })}

          {/* Last year — dashed, gray */}
          <path
            d={lastYearPath}
            fill="none"
            stroke="#D1D5DB"
            strokeWidth={2}
            strokeDasharray="6 3"
          />

          {/* This year — solid, navy */}
          <path
            d={thisYearPath}
            fill="none"
            stroke="#17409A"
            strokeWidth={2.5}
          />

          {/* Dots — last year */}
          {lastYearPts.map((pt, i) => (
            <circle key={i} cx={pt.x} cy={pt.y} r={3.5} fill="#D1D5DB" />
          ))}

          {/* Dots — this year */}
          {thisYearPts.map((pt, i) => (
            <g key={i}>
              <circle
                cx={pt.x}
                cy={pt.y}
                r={5}
                fill="white"
                stroke="#17409A"
                strokeWidth={2}
              />
              {/* Value label on last point */}
              {i === N - 1 && (
                <text
                  x={pt.x + 8}
                  y={pt.y + 4}
                  fontSize={9}
                  fill="#17409A"
                  fontFamily="Nunito, sans-serif"
                  fontWeight="800"
                >
                  {REVENUE_COMPARISON.thisYear[i]}M
                </text>
              )}
            </g>
          ))}

          {/* Month labels */}
          {REVENUE_COMPARISON.labels.map((label, i) => (
            <text
              key={i}
              x={xAt(i)}
              y={H - 4}
              textAnchor="middle"
              fontSize={9}
              fill={i === N - 1 ? "#17409A" : "#9CA3AF"}
              fontFamily="Nunito, sans-serif"
              fontWeight={i === N - 1 ? "800" : "600"}
            >
              {label}
            </text>
          ))}
        </svg>
      </div>

      {/* Footer summary */}
      <div className="flex items-center gap-6 mt-3 pt-4 border-t border-[#F4F7FF]">
        <div>
          <p className="text-[#9CA3AF] text-[10px] font-black tracking-wider uppercase">
            Năm nay
          </p>
          <p className="text-[#1A1A2E] font-black text-lg">{thisTotal}M</p>
        </div>
        <div>
          <p className="text-[#9CA3AF] text-[10px] font-black tracking-wider uppercase">
            Năm ngoái
          </p>
          <p className="text-[#9CA3AF] font-black text-lg">{lastTotal}M</p>
        </div>
        <div className="ml-auto">
          <span className="bg-[#4ECDC4]/15 text-[#4ECDC4] font-black text-sm px-3 py-1.5 rounded-xl">
            ↑ +{growth}% tăng trưởng
          </span>
        </div>
      </div>
    </div>
  );
}
