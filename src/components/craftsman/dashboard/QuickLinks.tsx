"use client";

import Link from "next/link";
import { MdList, MdAssignmentInd } from "react-icons/md";
import { GiPawPrint } from "react-icons/gi";

export default function QuickLinks() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
        <h2 className="text-xl font-black text-[#17409A] mb-6 flex items-center gap-2">
          <MdList className="text-2xl" />
          Lối tắt nhanh
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <Link 
            href="/craftsman/lobby"
            className="flex flex-col items-center justify-center p-6 rounded-3xl bg-[#F4F7FF] hover:bg-[#17409A] text-[#17409A] hover:text-white transition-all group border border-blue-50"
          >
            <MdList className="text-4xl mb-2 group-hover:scale-110 transition-transform" />
            <span className="font-black text-sm uppercase tracking-wider">Nhận đơn mới</span>
          </Link>
          <Link 
            href="/craftsman/jobs"
            className="flex flex-col items-center justify-center p-6 rounded-3xl bg-[#F4F7FF] hover:bg-[#17409A] text-[#17409A] hover:text-white transition-all group border border-blue-50"
          >
            <MdAssignmentInd className="text-4xl mb-2 group-hover:scale-110 transition-transform" />
            <span className="font-black text-sm uppercase tracking-wider">Việc của tôi</span>
          </Link>
        </div>
      </div>

      <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 flex flex-col justify-center items-center text-center">
        <div className="w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 mb-4 animate-bounce">
          <GiPawPrint className="text-4xl" />
        </div>
        <h3 className="text-lg font-black text-[#17409A]">Hệ thống thợ thủ công</h3>
        <p className="text-slate-500 text-sm mt-2 max-w-[280px]">
          Hãy kiểm tra sảnh việc thường xuyên để không bỏ lỡ các đơn hàng gấu bông mới nhất!
        </p>
      </div>
    </div>
  );
}
