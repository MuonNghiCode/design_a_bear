"use client";

import { GiPawPrint } from "react-icons/gi";

export default function ProfileMembershipCard() {
  return (
    <div className="relative overflow-hidden bg-linear-to-br from-[#17409A] to-[#7C5CFC] rounded-3xl p-6 shadow-lg shadow-[#17409A]/20">
      <GiPawPrint
        className="absolute -bottom-6 -right-6 text-white/8 pointer-events-none"
        style={{ fontSize: 120 }}
      />
      <p className="text-white/60 text-[9px] font-black tracking-[0.22em] uppercase mb-1">
        Hạng thành viên
      </p>
      <p className="text-white font-black text-xl mb-3">Thành Viên Bạc</p>
      <div className="flex items-center justify-between text-white/70 text-[10px] font-semibold mb-2">
        <span>1.260 điểm</span>
        <span>2.000 điểm → Vàng</span>
      </div>
      <div className="h-2 bg-white/20 rounded-full overflow-hidden">
        <div
          className="h-full bg-white rounded-full transition-all"
          style={{ width: "63%" }}
        />
      </div>
      <p className="text-white/50 text-[10px] font-semibold mt-2">
        Còn 740 điểm để lên hạng Vàng
      </p>
    </div>
  );
}
