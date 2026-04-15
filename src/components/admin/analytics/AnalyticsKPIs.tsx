import { ANALYTICS_KPIS } from "@/data/admin";

export interface KPIItem {
  label: string;
  value: string | number;
  unit: string;
  trend?: string;
  up?: boolean;
  accent?: string;
}

interface AnalyticsKPIsProps {
  stats?: KPIItem[];
}

export default function AnalyticsKPIs({ stats }: AnalyticsKPIsProps = {}) {
  const displayItems = stats || ANALYTICS_KPIS;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {displayItems.map((k, i) => {
        const isHero = i === 0;
        return (
          <div
            key={k.label}
            className={`ac rounded-2xl px-5 py-5 flex flex-col justify-between min-h-28 relative overflow-hidden cursor-default transition-all duration-300 hover:shadow-lg ${
              isHero ? "bg-[#17409A]" : "bg-white shadow-sm"
            }`}
          >
            {/* Accent bar top */}
            {!isHero && (
              <div
                className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl"
                style={{ backgroundColor: k.accent }}
              />
            )}

            {/* Label */}
            <p
              className={`text-[10px] font-black tracking-[0.22em] uppercase ${
                isHero ? "text-white/50" : "text-[#9CA3AF]"
              }`}
            >
              {k.label}
            </p>

            {/* Value */}
            <div className="mt-2">
              <div className="flex items-baseline gap-1">
                <span
                  className={`font-black leading-none ${
                    isHero ? "text-white text-4xl" : "text-[#1A1A2E] text-3xl"
                  }`}
                >
                  {k.value}
                </span>
                <span
                  className={`text-xs font-semibold ${
                    isHero ? "text-white/50" : "text-[#9CA3AF]"
                  }`}
                >
                  {k.unit}
                </span>
              </div>
            </div>

            {/* Hero: paw watermark */}
            {isHero && (
              <div className="absolute -bottom-3 -right-3 text-white/5 text-8xl select-none pointer-events-none">
                🐾
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
