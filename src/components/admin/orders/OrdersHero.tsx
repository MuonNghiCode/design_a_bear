import {
  MdTrendingUp,
  MdAttachMoney,
  MdCheckCircle,
  MdAccessTime,
  MdPieChart,
} from "react-icons/md";
import { GiPawPrint } from "react-icons/gi";
import { ORDERS_LAST_7 } from "@/data/admin";
import { formatPrice } from "@/utils/currency";

const DAYS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

const HERO_STATS = [
  {
    label: "Doanh thu hôm nay",
    value: formatPrice(4320000),
    unit: "",
    color: "#FFD93D",
    Icon: MdAttachMoney,
  },
  {
    label: "Giá trị đơn TB",
    value: formatPrice(418000),
    unit: "",
    color: "#4ECDC4",
    Icon: MdCheckCircle,
  },
  {
    label: "T/g xử lý TB",
    value: "1.4",
    unit: "giờ",
    color: "#FF8C42",
    Icon: MdAccessTime,
  },
  {
    label: "Tỷ lệ hoàn thành",
    value: "94",
    unit: "%",
    color: "#7C5CFC",
    Icon: MdPieChart,
  },
];

const MAX_BAR = Math.max(...ORDERS_LAST_7);

export default function OrdersHero() {
  return (
    <div className="relative bg-[#17409A] rounded-3xl overflow-hidden p-6 sm:p-8 h-full flex flex-col justify-between">
      {/* Paw watermarks */}
      <GiPawPrint
        className="absolute -top-10 -right-10 text-white/4 pointer-events-none"
        style={{ fontSize: 290 }}
      />
      <GiPawPrint
        className="absolute bottom-4 right-48 text-white/5 pointer-events-none -rotate-12"
        style={{ fontSize: 88 }}
      />

      <div className="relative flex flex-col lg:flex-row gap-6">
        {/* ── Left: headline + sparkline ── */}
        <div className="flex-1">
          <p className="text-white/50 text-[10px] font-black tracking-[0.25em] uppercase mb-2">
            Đơn hàng hôm nay
          </p>

          {/* Giant count + trend */}
          <div className="flex items-end gap-4 flex-wrap mb-5">
            <span
              className="text-white font-black leading-none"
              style={{ fontSize: "clamp(3.8rem, 7vw, 6.5rem)", lineHeight: 1 }}
            >
              47
            </span>
            <div className="flex items-center gap-1.5 mb-1.5 bg-white/15 backdrop-blur-sm rounded-2xl px-3 py-1.5">
              <MdTrendingUp className="text-[#4ECDC4] text-sm" />
              <span className="text-white text-xs font-black">+12%</span>
              <span className="text-white/50 text-xs font-semibold">
                so với hôm qua
              </span>
            </div>
          </div>

          {/* 7-day sparkline */}
          <div>
            <p className="text-white/30 text-[9px] font-black tracking-[0.22em] uppercase mb-2.5">
              7 ngày gần nhất
            </p>
            <div className="flex items-end gap-1.5" style={{ height: 44 }}>
              {ORDERS_LAST_7.map((v, i) => {
                const h = Math.round((v / MAX_BAR) * 36) + 6;
                const isToday = i === ORDERS_LAST_7.length - 1;
                return (
                  <div
                    key={i}
                    className="flex flex-col items-center gap-1 flex-1"
                  >
                    <div
                      className="w-full rounded-sm transition-all"
                      style={{
                        height: h,
                        backgroundColor: isToday
                          ? "#4ECDC4"
                          : "rgba(255,255,255,0.18)",
                        borderRadius: "4px 4px 2px 2px",
                      }}
                    />
                    <span
                      className="text-[8px] font-black leading-none"
                      style={{
                        color: isToday ? "#4ECDC4" : "rgba(255,255,255,0.3)",
                      }}
                    >
                      {DAYS[i]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Right: 2×2 stat pills ── */}
        <div className="grid grid-cols-2 gap-3 lg:w-68 xl:w-72 shrink-0">
          {HERO_STATS.map(({ label, value, unit, color, Icon }) => (
            <div
              key={label}
              className="bg-white/10 rounded-2xl px-4 py-3.5 relative overflow-hidden hover:bg-white/15 transition-colors duration-200"
            >
              {/* Top accent line */}
              <div
                className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl"
                style={{ backgroundColor: color }}
              />
              <div className="flex items-center gap-1.5 mb-2">
                <Icon
                  className="text-sm shrink-0"
                  style={{ color: color + "cc" }}
                />
                <p className="text-white/40 text-[9px] font-black tracking-wider uppercase leading-tight">
                  {label}
                </p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-white font-black text-xl leading-tight">
                  {value}
                </span>
                <span className="text-white/40 text-[10px] font-semibold">
                  {unit}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
