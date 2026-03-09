import { MdInventory2, MdWarning } from "react-icons/md";
import { GiPawPrint } from "react-icons/gi";
import { PRODUCTS_ADMIN, PRODUCT_CATEGORY_STATS } from "@/data/admin";

const activeCount = PRODUCTS_ADMIN.filter((p) => p.status === "active").length;
const outOfStock = PRODUCTS_ADMIN.filter((p) => p.stock === 0).length;
const lowStockCount = PRODUCTS_ADMIN.filter(
  (p) => p.status === "active" && p.stock > 0 && p.stock <= 10,
).length;
const totalStock = PRODUCTS_ADMIN.reduce((s, p) => s + p.stock, 0);
const MAX_SOLD = Math.max(...PRODUCT_CATEGORY_STATS.map((c) => c.sold));

const PILLS = [
  { label: "Đang bán", value: String(activeCount), color: "#4ECDC4" },
  { label: "Tồn kho thấp", value: String(lowStockCount), color: "#FF8C42" },
  { label: "Hết hàng", value: String(outOfStock), color: "#FF6B9D" },
  { label: "Tổng tồn kho", value: String(totalStock), color: "#FFD93D" },
];

export default function StaffProductsHero() {
  return (
    <div className="relative bg-[#17409A] rounded-3xl overflow-hidden p-6 sm:p-8 h-full flex flex-col justify-between min-h-64">
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
          Tình trạng kho hàng
        </p>

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
            <span className="text-[#FF8C42] font-black text-xs leading-tight flex items-center gap-1">
              <MdWarning /> {lowStockCount + outOfStock} cần bổ sung kho
            </span>
          </div>
        </div>

        {/* Category stock bars */}
        <div className="flex flex-col gap-2.5 mb-6">
          {PRODUCT_CATEGORY_STATS.map((cat) => {
            const pct = Math.round((cat.sold / MAX_SOLD) * 100);
            const barColor = cat.color === "#17409A" ? "#FFFFFF" : cat.color;
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
                  style={{ color: barColor }}
                >
                  {cat.sold}
                </span>
              </div>
            );
          })}
        </div>

        {/* Stat pills */}
        <div className="grid grid-cols-2 gap-2">
          {PILLS.map(({ label, value, color }) => (
            <div
              key={label}
              className="flex items-center gap-2 bg-white/8 rounded-2xl px-3 py-1.5"
            >
              <MdInventory2 style={{ color, fontSize: 14 }} />
              <div>
                <span className="text-white font-black text-sm leading-none">
                  {value}
                </span>
                <span className="text-white/40 text-[9px] font-semibold block leading-tight">
                  {label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
