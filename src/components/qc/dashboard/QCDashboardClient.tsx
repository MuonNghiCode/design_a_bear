"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/contexts/ToastContext";
import { productionJobService } from "@/services";
import { ProductionJob } from "@/types";
import { MdFactCheck, MdPendingActions, MdCheckCircle, MdOutlineTimer, MdArrowForward } from "react-icons/md";
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

  const pendingJobs = jobs.filter(j => j.status === "AWAITING_QC");
  const pendingCount = pendingJobs.length;
  const completedCount = jobs.filter(j => j.status === "FINISHED").length;

  return (
    <div className="w-full max-w-[1440px] mx-auto space-y-8 animate-in fade-in duration-700 pb-12" style={{ fontFamily: "'Nunito', sans-serif" }}>
      
      {/* ── Header Area ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#1A1A2E] flex items-center gap-3 tracking-tight">
            <span className="w-1.5 h-8 rounded-full bg-[#17409A]"></span>
            Sảnh Kiểm Định Chất Lượng
          </h1>
          <p className="text-slate-500 mt-1.5 font-medium text-sm md:text-base">
            Theo dõi tiến độ, đánh giá chất lượng sản phẩm gấu bông và ký duyệt bàn giao.
          </p>
        </div>
      </div>

      {/* ── Stats Area ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between h-44 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full opacity-40 translate-x-8 -translate-y-8 z-0 pointer-events-none group-hover:scale-110 transition-transform duration-500" />
          
          <div className="relative z-10 flex justify-between items-start">
            <div className="text-slate-400 text-xs font-black uppercase tracking-[0.2em]">
              Chờ kiểm định
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center transition-all group-hover:scale-110 duration-300 shadow-sm border border-amber-100/30">
              <MdPendingActions className="text-2xl" />
            </div>
          </div>

          <div className="relative z-10">
            <div className="text-3xl md:text-4xl font-black text-slate-700 tracking-tight">
              {loading ? "..." : pendingCount}
            </div>
            <div className="text-[10px] text-slate-400 font-bold tracking-wider mt-1.5 uppercase">
              Yêu cầu phê duyệt chất lượng
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between h-44 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full opacity-40 translate-x-8 -translate-y-8 z-0 pointer-events-none group-hover:scale-110 transition-transform duration-500" />
          
          <div className="relative z-10 flex justify-between items-start">
            <div className="text-slate-400 text-xs font-black uppercase tracking-[0.2em]">
              Đã kiểm định (Hôm nay)
            </div>
            <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-500 flex items-center justify-center transition-all group-hover:scale-110 duration-300 shadow-sm border border-green-100/30">
              <MdCheckCircle className="text-2xl" />
            </div>
          </div>

          <div className="relative z-10">
            <div className="text-3xl md:text-4xl font-black text-slate-700 tracking-tight">
              {loading ? "..." : completedCount}
            </div>
            <div className="text-[10px] text-slate-400 font-bold tracking-wider mt-1.5 uppercase">
              Đã hoàn thành bàn giao
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between h-44 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full opacity-40 translate-x-8 -translate-y-8 z-0 pointer-events-none group-hover:scale-110 transition-transform duration-500" />
          
          <div className="relative z-10 flex justify-between items-start">
            <div className="text-slate-400 text-xs font-black uppercase tracking-[0.2em]">
              Thời gian xử lý TB
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center transition-all group-hover:scale-110 duration-300 shadow-sm border border-blue-100/30">
              <MdOutlineTimer className="text-2xl" />
            </div>
          </div>

          <div className="relative z-10">
            <div className="text-3xl md:text-4xl font-black text-slate-700 tracking-tight">
              {loading ? "..." : "15"} <span className="text-base font-normal text-slate-400">phút</span>
            </div>
            <div className="text-[10px] text-slate-400 font-bold tracking-wider mt-1.5 uppercase">
              Hiệu suất duyệt chuẩn
            </div>
          </div>
        </div>

      </div>

      {/* ── Action and Pending Jobs Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* ── Left column: CTA ── */}
        <div className="lg:col-span-2 bg-white rounded-[32px] border border-slate-50 shadow-sm p-8 flex flex-col items-center justify-center text-center relative overflow-hidden group hover:shadow-lg transition-all duration-300 h-full min-h-[380px]">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#F4F7FF]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />
          
          <div className="w-16 h-16 rounded-full bg-[#17409A]/5 text-[#17409A] flex items-center justify-center mb-5 group-hover:scale-105 duration-300 relative z-10 border border-blue-100/50 shadow-sm">
            <MdFactCheck className="text-3xl" />
          </div>
          <h3 className="text-lg font-black text-[#1A1A2E] mb-2 relative z-10">Điểm kiểm định chất lượng</h3>
          <p className="text-slate-500 font-medium leading-relaxed max-w-sm mx-auto mb-6 relative z-10 text-sm">
            Vào ngay danh sách kiểm định để bắt đầu xem xét, đánh giá chất lượng sản phẩm đang chờ duyệt.
          </p>
          <Link 
            href="/qc/inspections"
            className="px-8 py-3.5 bg-[#17409A] text-white font-black rounded-2xl shadow-xl shadow-[#17409A]/20 hover:bg-[#0E2A66] transition-all uppercase tracking-wider text-xs hover:-translate-y-0.5 relative z-10 duration-300 flex items-center gap-2"
          >
            Bắt đầu công việc
            <MdArrowForward className="text-lg" />
          </Link>
          <div className="w-12 h-1 rounded-full bg-blue-100 mt-6 relative z-10 group-hover:w-20 transition-all duration-300" />
        </div>

        {/* ── Right column: List of pending jobs ── */}
        <div className="lg:col-span-3 bg-white rounded-[32px] border border-slate-50 shadow-sm p-8 flex flex-col h-full min-h-[380px]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-black text-[#1A1A2E]">Danh sách chờ kiểm định</h3>
              <p className="text-slate-400 font-medium text-xs mt-0.5">Các công việc mới nhất cần xử lý</p>
            </div>
            <Link 
              href="/qc/inspections" 
              className="text-xs font-black text-[#17409A] bg-[#F4F7FF] px-4 py-2 rounded-xl hover:bg-[#17409A] hover:text-white transition-all tracking-wider uppercase shadow-sm"
            >
              Xem tất cả
            </Link>
          </div>

          <div className="flex-1 flex flex-col justify-center">
            {loading ? (
              <div className="text-center text-slate-400 text-sm py-12">Đang tải danh sách...</div>
            ) : pendingJobs.length === 0 ? (
              <div className="text-center text-slate-400 text-sm py-12 flex flex-col items-center justify-center gap-2">
                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                  <MdCheckCircle className="text-2xl" />
                </div>
                <span>Không có công việc nào đang chờ kiểm định!</span>
              </div>
            ) : (
              <div className="divide-y divide-slate-50 space-y-3">
                {pendingJobs.slice(0, 4).map((job) => (
                  <div key={job.jobId} className="flex items-center justify-between py-3.5 hover:bg-slate-50/50 px-2 rounded-xl transition-colors duration-200">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center font-bold text-xs shrink-0 border border-amber-100/30">
                        QC
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-[#1A1A2E] leading-snug">
                          {job.productName || job.buildName || "Đơn sản xuất gấu bông"}
                        </h4>
                        <p className="text-slate-400 font-bold text-[10px] mt-0.5 tracking-widest uppercase">
                          Mã: <span className="text-[#17409A]">{job.jobId.substring(0, 8) || "N/A"}</span> • Số lượng: <span className="text-slate-600">1</span>
                        </p>
                      </div>
                    </div>
                    <Link 
                      href={`/qc/inspections/${job.jobId}`}
                      className="text-xs font-black text-[#17409A] hover:underline flex items-center gap-1"
                    >
                      Kiểm tra
                      <MdArrowForward className="text-base" />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
