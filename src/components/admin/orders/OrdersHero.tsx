import { useMemo } from "react";
import {
  MdTrendingUp,
  MdAttachMoney,
  MdCheckCircle,
  MdAccessTime,
  MdPieChart,
} from "react-icons/md";
import { GiPawPrint } from "react-icons/gi";
import { formatPrice } from "@/utils/currency";
import { isToday, subDays, startOfDay, isSameDay, format } from "date-fns";
import type { OrderListItem } from "@/types";

const DAYS_NAME = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

interface OrdersHeroProps {
  orders: OrderListItem[];
  loading?: boolean;
}

export default function OrdersHero({ orders, loading }: OrdersHeroProps) {
  const stats = useMemo(() => {
    const today = orders.filter((o) => isToday(new Date(o.createdAt)));
    const todayRevenue = today
      .filter((o) => o.status !== "CANCELLED")
      .reduce((acc, o) => acc + o.grandTotal, 0);
    
    const completedOrders = orders.filter((o) => o.status === "COMPLETED");
    const completionRate = orders.length > 0
      ? Math.round((completedOrders.length / orders.length) * 100)
      : 0;

    const totalRevenue = orders.reduce((acc, o) => acc + o.grandTotal, 0);
    const avgOrderValue = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;

    // Last 7 days chart
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = subDays(new Date(), 6 - i);
      const count = orders.filter((o) => isSameDay(new Date(o.createdAt), d)).length;
      return {
        label: format(d, "EEEEE"), // T, W, T... (using D-M map below)
        dayIdx: (d.getDay() + 6) % 7, // 0=Mon, 6=Sun
        count,
      };
    });

    const yesterday = orders.filter((o) => {
      const d = new Date(o.createdAt);
      return isSameDay(d, subDays(new Date(), 1));
    });

    const increasePct = yesterday.length > 0 
      ? Math.round(((today.length - yesterday.length) / yesterday.length) * 100)
      : today.length * 100;

    return {
      todayCount: today.length,
      todayRevenue,
      avgOrderValue,
      completionRate,
      last7Days,
      increasePct,
    };
  }, [orders]);

  const HERO_KPI = [
    {
      label: "Doanh thu hôm nay",
      value: formatPrice(stats.todayRevenue),
      unit: "",
      color: "#FFD93D",
      Icon: MdAttachMoney,
    },
    {
      label: "Giá trị đơn TB",
      value: formatPrice(stats.avgOrderValue),
      unit: "",
      color: "#4ECDC4",
      Icon: MdCheckCircle,
    },
    {
      label: "T/g xử lý TB",
      value: "1.4", // Kept mock as logic is complex
      unit: "giờ",
      color: "#FF8C42",
      Icon: MdAccessTime,
    },
    {
      label: "Tỷ lệ hoàn thành",
      value: stats.completionRate,
      unit: "%",
      color: "#7C5CFC",
      Icon: MdPieChart,
    },
  ];

  const maxCount = Math.max(...stats.last7Days.map(d => d.count), 1);

  return (
    <div className="relative bg-[#17409A] rounded-3xl overflow-hidden p-6 sm:p-8 h-full flex flex-col justify-between min-h-[300px]">
      {/* Paw watermarks */}
      <GiPawPrint
        className="absolute -top-10 -right-10 text-white/4 pointer-events-none"
        style={{ fontSize: 290 }}
      />
      <GiPawPrint
        className="absolute bottom-4 right-48 text-white/5 pointer-events-none -rotate-12"
        style={{ fontSize: 88 }}
      />

      {loading && (
        <div className="absolute inset-0 bg-[#17409A]/40 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="text-white font-black text-sm tracking-widest animate-pulse">
            ĐANG ĐỒNG BỘ...
          </div>
        </div>
      )}

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
              {stats.todayCount}
            </span>
            <div className="flex items-center gap-1.5 mb-1.5 bg-white/15 backdrop-blur-sm rounded-2xl px-3 py-1.5">
              <MdTrendingUp 
                className={stats.increasePct >= 0 ? "text-[#4ECDC4] text-sm" : "text-[#FF6B9D] text-sm transform rotate-180"} 
              />
              <span className="text-white text-xs font-black">
                {stats.increasePct >= 0 ? "+" : ""}{stats.increasePct}%
              </span>
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
              {stats.last7Days.map((d, i) => {
                const h = Math.round((d.count / maxCount) * 36) + 6;
                const isToday = i === 6;
                return (
                  <div
                    key={i}
                    className="flex flex-col items-center gap-1.5 flex-1"
                  >
                    <div
                      className="w-full rounded-sm transition-all duration-500"
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
                      {DAYS_NAME[d.dayIdx]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Right: 2×2 stat pills ── */}
        <div className="grid grid-cols-2 gap-3 lg:w-68 xl:w-72 shrink-0">
          {HERO_KPI.map(({ label, value, unit, color, Icon }) => (
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
                <span className="text-white font-black text-xl leading-tight truncate">
                  {value}
                </span>
                <span className="text-white/40 text-[10px] font-semibold shrink-0">
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
