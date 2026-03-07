import {
  MdDiamond,
  MdEmojiEvents,
  MdMilitaryTech,
  MdStar,
} from "react-icons/md";
import { CUSTOMER_TIER_STATS, CUSTOMERS } from "@/data/admin";

function TierIcon({ tier, color }: { tier: string; color: string }) {
  const icons: Record<string, typeof MdStar> = {
    "Diamond VIP": MdDiamond,
    Gold: MdEmojiEvents,
    Silver: MdMilitaryTech,
    Bronze: MdStar,
  };
  const Icon = icons[tier] ?? MdStar;
  return <Icon style={{ color, fontSize: 18 }} />;
}

const TIER_LABELS: Record<string, string> = {
  diamond: "Diamond VIP",
  gold: "Gold",
  silver: "Silver",
  bronze: "Bronze",
};

const total = CUSTOMER_TIER_STATS.reduce((s, t) => s + t.count, 0);

// Top 3 spenders for "big spender" highlight
const TOP3 = [...CUSTOMERS]
  .sort((a, b) => b.totalSpent - a.totalSpent)
  .slice(0, 3);

export default function CustomersTierChart() {
  return (
    <div className="bg-white rounded-3xl p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <p className="text-[#9CA3AF] text-[10px] font-black tracking-[0.22em] uppercase mb-0.5">
            Phân hạng
          </p>
          <p className="text-[#1A1A2E] font-black text-lg">Thành viên</p>
        </div>
        <span className="text-[10px] font-black text-[#17409A] bg-[#17409A]/8 px-3 py-1.5 rounded-full">
          {total} khách
        </span>
      </div>

      {/* Tier rows */}
      <div className="flex flex-col gap-3.5 flex-1">
        {CUSTOMER_TIER_STATS.map((t) => {
          const pct = Math.round((t.count / total) * 100);
          return (
            <div key={t.tier} className="group">
              <div className="flex items-center gap-3 mb-1.5">
                {/* Tier icon circle */}
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110"
                  style={{ backgroundColor: t.color + "18" }}
                >
                  <TierIcon tier={t.tier} color={t.color} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[#1A1A2E] font-bold text-sm">
                      {t.tier}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span
                        className="font-black text-sm"
                        style={{ color: t.color }}
                      >
                        {t.count}
                      </span>
                      <span className="text-[#9CA3AF] text-[10px] font-semibold">
                        ({pct}%)
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="h-1.5 bg-[#F4F7FF] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: t.color,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Divider */}
      <div className="border-t border-[#F4F7FF] my-4" />

      {/* Top spenders */}
      <div>
        <p className="text-[#9CA3AF] text-[9px] font-black tracking-[0.2em] uppercase mb-3">
          Chi tiêu nhiều nhất
        </p>
        <div className="flex flex-col gap-2">
          {TOP3.map((c, i) => (
            <div key={c.id} className="flex items-center gap-2.5">
              {/* Rank */}
              <span
                className="w-5 h-5 rounded-full text-white text-[9px] font-black flex items-center justify-center shrink-0"
                style={{
                  backgroundColor:
                    i === 0 ? "#FFD93D" : i === 1 ? "#9CA3AF" : "#FF8C42",
                }}
              >
                {i + 1}
              </span>
              {/* Avatar */}
              <div
                className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-white text-[10px] font-black"
                style={{ backgroundColor: c.avatarColor }}
              >
                {c.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[#1A1A2E] font-bold text-xs truncate">
                  {c.name}
                </p>
                <p className="text-[#9CA3AF] text-[9px] font-semibold">
                  {TIER_LABELS[c.tier]}
                </p>
              </div>
              <span className="text-[#1A1A2E] font-black text-xs shrink-0">
                {(c.totalSpent / 1_000_000).toFixed(1)}M
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
