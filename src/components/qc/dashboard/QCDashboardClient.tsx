"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/contexts/ToastContext";
import { productionJobService } from "@/services";
import { ProductionJob } from "@/types";
import { MdFactCheck, MdPendingActions, MdCheckCircle } from "react-icons/md";
import Link from "next/link";

export default function QCDashboardClient() {
  const [jobs, setJobs] = useState<ProductionJob[]>([]);
  const [loading, setLoading] = useState(true);
  const { error } = useToast();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const [pendingRes, completedRes] = await Promise.all([
          productionJobService.getByStatus("AWAITING_QC"),
          productionJobService.getByStatus("FINISHED"),
        ]);
        
        const allJobs = [];
        if (pendingRes.isSuccess && pendingRes.value) allJobs.push(...pendingRes.value);
        if (completedRes.isSuccess && completedRes.value) allJobs.push(...completedRes.value);
        
        setJobs(allJobs);
      } catch (err) {
        error("Không thể tải dữ liệu kiểm định");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const pendingCount = jobs.filter(j => j.status === "AWAITING_QC").length;
  const completedCount = jobs.filter(j => j.status === "FINISHED").length;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-[#17409A] tracking-tight">
            Tổng quan Kiểm định
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Theo dõi tiến độ kiểm định chất lượng sản phẩm
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center text-2xl">
            <MdPendingActions />
          </div>
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Chờ kiểm định</p>
            <p className="text-3xl font-black text-slate-700">{loading ? "..." : pendingCount}</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-green-50 text-green-500 flex items-center justify-center text-2xl">
            <MdCheckCircle />
          </div>
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Đã kiểm định (Hôm nay)</p>
            <p className="text-3xl font-black text-slate-700">{loading ? "..." : completedCount}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-8 flex flex-col items-center justify-center text-center min-h-[300px]">
        <div className="w-20 h-20 rounded-full bg-[#17409A]/10 text-[#17409A] flex items-center justify-center mb-6">
          <MdFactCheck className="text-4xl" />
        </div>
        <h3 className="text-lg font-black text-slate-700 mb-2">Bắt đầu công việc</h3>
        <p className="text-slate-500 font-medium max-w-md mx-auto mb-8">
          Vào danh sách kiểm định để xem các sản phẩm đang chờ phê duyệt.
        </p>
        <Link 
          href="/qc/inspections"
          className="px-8 py-4 bg-[#17409A] text-white font-black rounded-2xl shadow-xl shadow-[#17409A]/20 hover:bg-[#0E2A66] transition-all uppercase tracking-wider text-sm"
        >
          Đi tới danh sách
        </Link>
      </div>
    </div>
  );
}
