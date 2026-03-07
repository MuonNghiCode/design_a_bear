import {
  MdCheckCircle,
  MdAccessTime,
  MdTrendingUp,
  MdShoppingBag,
} from "react-icons/md";
import { GiPawPrint } from "react-icons/gi";
import { QUICK_STATS } from "@/data/admin";

const MINI = [
  { icon: MdTrendingUp, label: "Doanh thu", value: "12.8M", color: "#FFD93D" },
  { icon: MdCheckCircle, label: "Hoàn thành", value: "38", color: "#4ECDC4" },
  { icon: MdAccessTime, label: "Đang xử lý", value: "9", color: "#FF8C42" },
];

const BEAR_DECOS = [
  { size: 220, opacity: 0.04, top: "-30px", right: "-25px", rotate: -10 },
  { size: 75, opacity: 0.06, top: "55%", right: "13%", rotate: 18 },
  { size: 48, opacity: 0.05, top: "12%", right: "37%", rotate: -6 },
];

export default function StatsHeroCard() {
  return (
    <div className="relative bg-[#17409A] rounded-3xl p-5 sm:p-8 overflow-hidden flex flex-col justify-between min-h-75">
      {/* Paw watermarks */}
      {BEAR_DECOS.map((d, i) => (
        <GiPawPrint
          key={i}
          className="absolute pointer-events-none"
          style={{
            fontSize: d.size,
            opacity: d.opacity,
            top: d.top,
            right: d.right,
            color: "white",
            transform: `rotate(${d.rotate}deg)`,
          }}
        />
      ))}

      {/* Top section */}
      <div>
        <p className="text-white/50 text-[10px] font-black tracking-[0.25em] uppercase mb-2">
          Đơn hàng hôm nay
        </p>

        <div className="flex items-end gap-4 flex-wrap">
          {/* Giant number */}
          <span
            className="text-white font-black leading-none"
            style={{ fontSize: "clamp(4.5rem, 9vw, 7.5rem)", lineHeight: 1 }}
          >
            47
          </span>
          {/* Trend badge */}
          <div className="flex items-center gap-1.5 mb-3 bg-white/15 backdrop-blur-sm rounded-2xl px-3 py-1.5">
            <MdTrendingUp className="text-[#4ECDC4] text-sm" />
            <span className="text-white text-xs font-black">+12%</span>
            <span className="text-white/50 text-xs">so với hôm qua</span>
          </div>
        </div>

        {/* Mini stat pills */}
        <div className="flex gap-3 mt-5 flex-wrap">
          {MINI.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.label}
                className="flex items-center gap-2.5 bg-white/10 hover:bg-white/15 transition-colors rounded-2xl px-4 py-3 flex-1 min-w-27.5 cursor-default"
              >
                <Icon className="text-xl shrink-0" style={{ color: s.color }} />
                <div>
                  <p className="text-white font-black text-base leading-none">
                    {s.value}
                  </p>
                  <p className="text-white/45 text-[10px] mt-0.5 font-semibold">
                    {s.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="flex items-center justify-between mt-6 pt-5 border-t border-white/10">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-[#4ECDC4] rounded-full animate-pulse" />
          <span className="text-white/40 text-[11px] font-semibold">
            Cập nhật lần cuối: 2 phút trước
          </span>
        </div>
        <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-colors rounded-xl px-4 py-2 text-white text-[11px] font-black tracking-wider">
          <MdShoppingBag className="text-sm" />
          XEM BÁO CÁO →
        </button>
      </div>
    </div>
  );
}
