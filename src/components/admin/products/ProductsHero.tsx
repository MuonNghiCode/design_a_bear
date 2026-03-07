import { MdTrendingUp, MdStar, MdInventory2 } from "react-icons/md";
import { GiPawPrint } from "react-icons/gi";
import { PRODUCTS_ADMIN, PRODUCT_CATEGORY_STATS } from "@/data/admin";

const activeCount = PRODUCTS_ADMIN.filter((p) => p.status === "active").length;
const draftCount = PRODUCTS_ADMIN.filter((p) => p.status === "draft").length;
const totalSold = PRODUCTS_ADMIN.reduce((s, p) => s + p.sold, 0);
const totalRevenue = PRODUCTS_ADMIN.reduce((s, p) => s + p.price * p.sold, 0);
const lowStockCount = PRODUCTS_ADMIN.filter(
  (p) => p.status === "active" && p.stock <= 10 && p.stock > 0,
).length;
const MAX_SOLD = Math.max(...PRODUCT_CATEGORY_STATS.map((c) => c.sold));

const META = [
  {
    label: "Đang bán",
    value: String(activeCount),
    unit: "sp",
    color: "#4ECDC4",
    Icon: MdInventory2,
  },
  {
    label: "Tổng đơn",
    value: String(totalSold),
    unit: "đơn",
    color: "#FFD93D",
    Icon: MdTrendingUp,
  },
  {
    label: "Tồn kho ít",
    value: String(lowStockCount),
    unit: "sp",
    color: "#FF8C42",
    Icon: MdStar,
  },
  {
    label: "Bản nháp",
    value: String(draftCount),
    unit: "sp",
    color: "#7C5CFC",
    Icon: MdStar,
  },
];

export default function ProductsHero() {
  return (
    <div className="relative bg-[#17409A] rounded-3xl overflow-hidden p-6 sm:p-8 h-full flex flex-col justify-between min-h-64">
      {/* Paw watermarks */}
      <GiPawPrint
        className="absolute -top-12 -right-10 text-white/4 pointer-events-none"
        style={{ fontSize: 300 }}
      />
      <GiPawPrint
        className="absolute bottom-6 left-52 text-white/5 pointer-events-none rotate-12"
        style={{ fontSize: 80 }}
      />

      <div className="relative">
        <p className="text-white/50 text-[10px] font-black tracking-[0.28em] uppercase mb-2">
          Danh mục sản phẩm
        </p>

        {/* Giant number */}
        <div className="flex items-end gap-4 flex-wrap mb-6">
          <span
            className="text-white font-black leading-none"
            style={{ fontSize: "clamp(3.5rem, 6.5vw, 6rem)", lineHeight: 1 }}
          >
            {PRODUCTS_ADMIN.length}
          </span>
          <div className="flex flex-col mb-1.5">
            <span className="text-white/50 text-xs font-semibold leading-tight">
              sản phẩm
            </span>
            <span className="text-[#4ECDC4] font-black text-xs leading-tight">
              {(totalRevenue / 1_000_000).toFixed(1)}M VND doanh thu
            </span>
          </div>
        </div>

        {/* Category bars */}
        <div className="flex flex-col gap-2.5 mb-6">
          {PRODUCT_CATEGORY_STATS.map((cat) => {
            const pct = Math.round((cat.sold / MAX_SOLD) * 100);
            // "complete" shares #17409A with the hero bg — use white instead
            const barColor = cat.color === "#17409A" ? "#FFFFFF" : cat.color;
            const textColor = cat.color === "#17409A" ? "#FFFFFF" : cat.color;
            return (
              <div key={cat.key} className="flex items-center gap-3">
                <span className="text-white/50 text-[9px] font-black tracking-wider uppercase w-28 shrink-0 leading-tight">
                  {cat.label}
                </span>
                <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${pct}%`, backgroundColor: barColor }}
                  />
                </div>
                <span
                  className="text-[10px] font-black shrink-0"
                  style={{ color: textColor }}
                >
                  {cat.sold}
                </span>
              </div>
            );
          })}
        </div>

        {/* Stat pills row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {META.map(({ label, value, unit, color, Icon }) => (
            <div
              key={label}
              className="relative bg-white/10 rounded-2xl px-3 py-3 overflow-hidden hover:bg-white/15 transition-colors duration-200"
            >
              <div
                className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl"
                style={{ backgroundColor: color }}
              />
              <div className="flex items-center gap-1 mb-1.5">
                <Icon
                  className="text-xs shrink-0"
                  style={{ color: color + "cc" }}
                />
                <p className="text-white/40 text-[8px] font-black tracking-wider uppercase leading-none">
                  {label}
                </p>
              </div>
              <div className="flex items-baseline gap-0.5">
                <span className="text-white font-black text-lg leading-none">
                  {value}
                </span>
                <span className="text-white/40 text-[9px] font-semibold">
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
