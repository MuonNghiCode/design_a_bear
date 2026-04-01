import {
  MdPeople,
  MdPersonAdd,
  MdTrendingUp,
  MdDiamond,
  MdRepeat,
} from "react-icons/md";
import { GiPawPrint } from "react-icons/gi";
import { CUSTOMERS, CUSTOMER_MONTHLY } from "@/data/admin";
import { formatPrice } from "@/utils/currency";

const totalCustomers = CUSTOMERS.length;
const vipCount = CUSTOMERS.filter((c) => c.status === "vip").length;
const newCount = CUSTOMERS.filter((c) => c.status === "new").length;
const totalSpent = CUSTOMERS.reduce((s, c) => s + c.totalSpent, 0);
const avgSpend = Math.round(totalSpent / totalCustomers);
const MAX_BAR = Math.max(...CUSTOMER_MONTHLY.map((m) => m.value));

const META = [
  {
    label: "Khách VIP",
    value: String(vipCount),
    unit: "người",
    color: "#7C5CFC",
    Icon: MdDiamond,
  },
  {
    label: "Mới tháng này",
    value: String(newCount),
    unit: "người",
    color: "#4ECDC4",
    Icon: MdPersonAdd,
  },
  {
    label: "Chi tiêu TB",
    value: formatPrice(avgSpend),
    unit: "",
    color: "#FFD93D",
    Icon: MdTrendingUp,
  },
  {
    label: "Quay lại",
    value: "78",
    unit: "%",
    color: "#FF8C42",
    Icon: MdRepeat,
  },
];

export default function CustomersHero() {
  return (
    <div className="relative bg-[#17409A] rounded-3xl overflow-hidden p-6 sm:p-8 flex flex-col min-h-64">
      {/* Paw watermarks */}
      <GiPawPrint
        className="absolute -top-12 -right-8 text-white/4 pointer-events-none"
        style={{ fontSize: 300 }}
      />
      <GiPawPrint
        className="absolute bottom-6 left-56 text-white/5 pointer-events-none rotate-12"
        style={{ fontSize: 80 }}
      />

      <div className="relative flex flex-col lg:flex-row gap-6">
        {/* ── Left: headline + stat pills ── */}
        <div className="flex-1">
          <p className="text-white/50 text-[10px] font-black tracking-[0.28em] uppercase mb-2">
            Khách hàng
          </p>

          {/* Giant number */}
          <div className="flex items-end gap-4 flex-wrap mb-5">
            <span
              className="text-white font-black leading-none"
              style={{ fontSize: "clamp(3.5rem, 6.5vw, 6rem)", lineHeight: 1 }}
            >
              {totalCustomers + 302}
            </span>
            <div className="flex flex-col mb-1.5">
              <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm rounded-2xl px-3 py-1.5">
                <MdTrendingUp className="text-[#4ECDC4] text-sm" />
                <span className="text-white text-xs font-black">+22%</span>
                <span className="text-white/50 text-xs font-semibold">
                  so với tháng trước
                </span>
              </div>
            </div>
          </div>

          {/* Stat pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {META.map(({ label, value, unit, color, Icon }) => (
              <div
                key={label}
                className="bg-white/10 backdrop-blur-sm rounded-2xl px-3 py-2.5 flex flex-col gap-1"
              >
                <div className="flex items-center gap-1.5">
                  <Icon style={{ color, fontSize: 14 }} />
                  <span className="text-white/50 text-[9px] font-black tracking-widest uppercase">
                    {label}
                  </span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-white font-black text-xl leading-none">
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

        {/* ── Right: monthly acquisition bars ── */}
        <div className="w-full lg:w-52 flex flex-col justify-between shrink-0">
          <div className="flex items-center gap-2 mb-3">
            <MdPeople className="text-white/40 text-base" />
            <span className="text-white/50 text-[10px] font-black tracking-[0.2em] uppercase">
              Khách hàng mới / tháng
            </span>
          </div>

          {/* Bars */}
          <div className="flex items-end gap-1.5 h-20">
            {CUSTOMER_MONTHLY.map((m) => {
              const pct = Math.round((m.value / MAX_BAR) * 100);
              const isLatest =
                m.month === CUSTOMER_MONTHLY[CUSTOMER_MONTHLY.length - 1].month;
              return (
                <div
                  key={m.month}
                  className="flex-1 flex flex-col items-center gap-1"
                >
                  <div className="w-full flex items-end" style={{ height: 56 }}>
                    <div
                      className="w-full rounded-t-lg transition-all duration-500"
                      style={{
                        height: `${pct}%`,
                        backgroundColor: isLatest
                          ? "#4ECDC4"
                          : "rgba(255,255,255,0.25)",
                        minHeight: 4,
                      }}
                    />
                  </div>
                  <span className="text-white/40 text-[8px] font-black">
                    {m.month}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Peak label */}
          <div className="flex items-center justify-between mt-2">
            <span className="text-white/35 text-[9px] font-semibold">0</span>
            <span className="text-[#4ECDC4] text-[9px] font-black">
              {MAX_BAR} người
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
