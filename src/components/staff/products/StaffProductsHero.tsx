import { MdInventory2, MdWarning } from "react-icons/md";
import { GiPawPrint } from "react-icons/gi";
import type { StaffProductView } from "./StaffProductsGrid";

interface StaffProductsHeroProps {
  products: StaffProductView[];
  loading?: boolean;
}

export default function StaffProductsHero({
  products,
  loading = false,
}: StaffProductsHeroProps) {
  const activeCount = products.filter((p) => p.status === "active").length;
  const outOfStock = products.filter((p) => p.stock === 0).length;
  const lowStockCount = products.filter(
    (p) => p.status === "active" && p.stock > 0 && p.stock <= 10,
  ).length;
  const totalStock = products.reduce((s, p) => s + p.stock, 0);

  const categoryStats = [
    {
      key: "complete",
      label: "Gấu hoàn chỉnh",
      color: "#17409A",
      sold: products
        .filter((p) => p.category === "complete")
        .reduce((sum, p) => sum + p.sold, 0),
    },
    {
      key: "bear",
      label: "Thân gấu",
      color: "#7C5CFC",
      sold: products
        .filter((p) => p.category === "bear")
        .reduce((sum, p) => sum + p.sold, 0),
    },
    {
      key: "accessory",
      label: "Phụ kiện",
      color: "#4ECDC4",
      sold: products
        .filter((p) => p.category === "accessory")
        .reduce((sum, p) => sum + p.sold, 0),
    },
  ];

  const maxSold = Math.max(1, ...categoryStats.map((c) => c.sold));

  const pills = [
    { label: "Đang bán", value: String(activeCount), color: "#4ECDC4" },
    { label: "Tồn kho thấp", value: String(lowStockCount), color: "#FF8C42" },
    { label: "Hết hàng", value: String(outOfStock), color: "#FF6B9D" },
    { label: "Tổng tồn kho", value: String(totalStock), color: "#FFD93D" },
  ];

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
            {loading ? "..." : products.length}
          </span>
          <div className="flex flex-col mb-1.5">
            <span className="text-white/50 text-xs font-semibold leading-tight">
              sản phẩm
            </span>
            <span className="text-[#FF8C42] font-black text-xs leading-tight flex items-center gap-1">
              <MdWarning /> {loading ? "..." : lowStockCount + outOfStock} cần
              bổ sung kho
            </span>
          </div>
        </div>

        {/* Category stock bars */}
        <div className="flex flex-col gap-2.5 mb-6">
          {categoryStats.map((cat) => {
            const pct = Math.round((cat.sold / maxSold) * 100);
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
          {pills.map(({ label, value, color }) => (
            <div
              key={label}
              className="flex items-center gap-2 bg-white/8 rounded-2xl px-3 py-1.5"
            >
              <MdInventory2 style={{ color, fontSize: 14 }} />
              <div>
                <span className="text-white font-black text-sm leading-none">
                  {loading ? "..." : value}
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
