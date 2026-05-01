"use client";

import Link from "next/link";
import { MdList, MdAssignmentInd } from "react-icons/md";
import { GiPawPrint } from "react-icons/gi";

export default function QuickLinks() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" style={{ fontFamily: "'Nunito', sans-serif" }}>
      <div className="bg-white p-8 md:p-10 rounded-[32px] shadow-sm border border-slate-50 relative overflow-hidden flex flex-col justify-between">
        <div className="absolute top-0 right-0 w-40 h-40 bg-[#F4F7FF] rounded-full opacity-30 translate-x-12 -translate-y-12 z-0 pointer-events-none" />

        <div className="relative z-10">
          <h2 className="text-xl font-black text-[#17409A] mb-2 flex items-center gap-3">
            <MdList className="text-2xl text-[#17409A]" />
            Lối tắt nhanh
          </h2>
          <p className="text-slate-400 font-bold text-xs tracking-wider uppercase mb-8">
            Quản lý công việc thợ thủ công
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 relative z-10">
          <Link 
            href="/craftsman/lobby"
            className="flex flex-col items-start justify-between p-6 h-40 rounded-3xl bg-[#F4F7FF] hover:bg-[#17409A] text-[#17409A] hover:text-white transition-all group border border-blue-50/50 shadow-sm hover:shadow-xl hover:-translate-y-1 duration-300"
          >
            <div className="w-12 h-12 rounded-2xl bg-white/60 group-hover:bg-white/10 flex items-center justify-center text-[#17409A] group-hover:text-white transition-colors duration-300 shadow-sm">
              <MdList className="text-2xl group-hover:scale-110 transition-transform duration-300" />
            </div>
            <div>
              <span className="font-black text-sm tracking-wide block mb-1">Nhận đơn mới</span>
              <span className="text-[10px] opacity-70 group-hover:opacity-90 font-medium">Tìm đơn tại sảnh công việc</span>
            </div>
          </Link>

          <Link 
            href="/craftsman/jobs"
            className="flex flex-col items-start justify-between p-6 h-40 rounded-3xl bg-[#F4F7FF] hover:bg-[#17409A] text-[#17409A] hover:text-white transition-all group border border-blue-50/50 shadow-sm hover:shadow-xl hover:-translate-y-1 duration-300"
          >
            <div className="w-12 h-12 rounded-2xl bg-white/60 group-hover:bg-white/10 flex items-center justify-center text-[#17409A] group-hover:text-white transition-colors duration-300 shadow-sm">
              <MdAssignmentInd className="text-2xl group-hover:scale-110 transition-transform duration-300" />
            </div>
            <div>
              <span className="font-black text-sm tracking-wide block mb-1">Việc của tôi</span>
              <span className="text-[10px] opacity-70 group-hover:opacity-90 font-medium">Theo dõi tiến độ sản xuất</span>
            </div>
          </Link>
        </div>
      </div>

      <div className="bg-white p-8 md:p-10 rounded-[32px] shadow-sm border border-slate-50 flex flex-col justify-center items-center text-center relative overflow-hidden group hover:shadow-lg transition-shadow duration-300">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#F4F7FF]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />
        
        <div className="w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 mb-6 group-hover:scale-105 duration-300 relative z-10 border border-amber-100/50 shadow-sm">
          <GiPawPrint className="text-4xl" />
        </div>
        <h3 className="text-lg font-black text-[#17409A] mb-3 relative z-10">Hệ thống thợ thủ công</h3>
        <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-[320px] relative z-10">
          Hãy kiểm tra sảnh việc thường xuyên để không bỏ lỡ các đơn hàng gấu bông mới nhất từ khách hàng!
        </p>
        <div className="w-12 h-1 rounded-full bg-amber-200 mt-6 relative z-10 group-hover:w-20 transition-all duration-300" />
      </div>
    </div>
  );
}
