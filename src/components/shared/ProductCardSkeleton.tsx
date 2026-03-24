/* ────────────────────────────────────────────
   ProductCardSkeleton
   Khớp đúng layout của ProductCard:
   - aspect-3/4 container
   - Overlay badge góc trên phải
   - Info block ở đáy (name, description, price, actions)
   ──────────────────────────────────────────── */
export default function ProductCardSkeleton() {
  return (
    <div className="relative block rounded-3xl overflow-hidden shadow-lg">
      {/* ── Main image area ── */}
      <div className="relative aspect-3/4 overflow-hidden bg-[#E5E7EB] animate-pulse">

        {/* Badge góc trên phải */}
        <div className="absolute top-4 right-4 w-14 h-6 rounded-full bg-[#D1D5DB] animate-pulse" />

        {/* Overlay gradient giả */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[70%] pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(200,200,210,0.7) 0%, rgba(200,200,210,0.4) 40%, transparent 100%)",
          }}
        />

        {/* ── Info block ở đáy ── */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          {/* Name */}
          <div className="h-5 w-3/4 rounded-lg bg-[#D1D5DB] mb-3 animate-pulse" />

          {/* Description lines */}
          <div className="h-3.5 w-full rounded-md bg-[#D1D5DB] mb-1.5 animate-pulse" />
          <div className="h-3.5 w-2/3 rounded-md bg-[#D1D5DB] mb-4 animate-pulse" />

          {/* Price */}
          <div className="h-6 w-1/3 rounded-lg bg-[#C7D2E8] mb-4 animate-pulse" />

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <div className="flex-1 h-10 rounded-xl bg-[#C7D2E8] animate-pulse" />
            <div className="w-11 h-11 rounded-xl bg-[#D1D5DB] animate-pulse" />
            <div className="w-11 h-11 rounded-xl bg-[#D1D5DB] animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
