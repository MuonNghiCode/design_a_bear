import { PRODUCT_MIX } from "@/data/admin";

const R = 36;
const CX = 42,
  CY = 42;
const CIRC = 2 * Math.PI * R;
const STROKE_W = 10;
const TRACK_COLOR = "#F4F7FF";

export default function ProductMix() {
  return (
    <div className="bg-white rounded-3xl p-6 flex flex-col h-full">
      <p className="text-[#9CA3AF] text-[10px] font-black tracking-[0.22em] uppercase">
        Cơ cấu sản phẩm
      </p>
      <p className="text-[#1A1A2E] font-black text-lg mt-0.5 mb-5">
        Tỷ lệ danh mục
      </p>

      <div className="flex flex-col gap-5 flex-1 justify-center">
        {PRODUCT_MIX.map((p) => {
          const arcLen = (p.value / 100) * CIRC;
          return (
            <div key={p.label} className="flex items-center gap-4">
              {/* Arc SVG */}
              <div className="shrink-0">
                <svg width={84} height={84} viewBox="0 0 84 84">
                  {/* Track */}
                  <circle
                    cx={CX}
                    cy={CY}
                    r={R}
                    fill="none"
                    stroke={TRACK_COLOR}
                    strokeWidth={STROKE_W}
                  />
                  {/* Progress */}
                  <circle
                    cx={CX}
                    cy={CY}
                    r={R}
                    fill="none"
                    stroke={p.color}
                    strokeWidth={STROKE_W}
                    strokeDasharray={`${arcLen} ${CIRC}`}
                    strokeDashoffset={CIRC * 0.25}
                    strokeLinecap="round"
                    transform={`rotate(-90 ${CX} ${CY})`}
                  />
                  {/* Percentage in center */}
                  <text
                    x={CX}
                    y={CY + 1}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="14"
                    fontWeight="900"
                    fill={p.color}
                    fontFamily="Nunito, sans-serif"
                  >
                    {p.value}%
                  </text>
                </svg>
              </div>

              {/* Label + bar */}
              <div className="flex-1">
                <p className="text-[#1A1A2E] font-black text-sm mb-1">
                  {p.label}
                </p>
                <div className="h-1.5 bg-[#F4F7FF] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${p.value}%`,
                      backgroundColor: p.color,
                    }}
                  />
                </div>
                <p className="text-[10px] text-[#9CA3AF] font-semibold mt-1">
                  {Math.round((p.value / 100) * 312)} sản phẩm
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
