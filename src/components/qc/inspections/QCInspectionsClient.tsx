"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MdFactCheck, MdSearch, MdRefresh } from "react-icons/md";
import { productionJobService } from "@/services";
import { ProductionJob } from "@/types";
import { useToast } from "@/contexts/ToastContext";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

export default function QCInspectionsClient() {
  const [jobs, setJobs] = useState<ProductionJob[]>([]);
  const [loading, setLoading] = useState(true);
  const { error } = useToast();

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await productionJobService.getByStatus("AWAITING_QC");
      if (response.isSuccess) {
        setJobs(response.value || []);
      }
    } catch (err) {
      error("Không thể tải danh sách chờ kiểm định");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-[#17409A] tracking-tight">
            Danh sách chờ kiểm định
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Các sản phẩm đã hoàn thiện 100% và đang chờ QC phê duyệt.
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={fetchJobs}
            disabled={loading}
            className="h-12 px-6 bg-white border border-slate-200 text-slate-600 font-black rounded-2xl hover:bg-slate-50 transition-all flex items-center gap-2 uppercase tracking-wider text-xs shadow-sm"
          >
            <MdRefresh className={`text-lg ${loading ? 'animate-spin' : ''}`} />
            Làm mới
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-[32px] h-64 border border-slate-100 animate-pulse" />
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-12 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 rounded-[32px] bg-slate-50 text-slate-300 flex items-center justify-center mb-6">
            <MdFactCheck className="text-4xl" />
          </div>
          <h3 className="text-lg font-black text-slate-400">Không có việc chờ kiểm định</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div key={job.jobId} className="bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-sm flex flex-col group hover:shadow-lg transition-shadow">
              <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center gap-4 relative">
                <div className="relative w-20 h-20 bg-white rounded-2xl shadow-sm overflow-hidden flex-shrink-0">
                  <Image
                    src={job.imageUrl || "/teddy_bear.png"}
                    alt={job.productName || "Product"}
                    fill
                    className="object-contain p-2"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-slate-800 text-lg truncate" title={job.productName}>
                    {job.productName || "Sản phẩm"}
                  </h3>
                  <div className="flex gap-2 mt-2">
                    <span className="text-[10px] font-black bg-[#17409A]/10 text-[#17409A] px-2 py-0.5 rounded-lg uppercase tracking-wider">
                      QC PENDING
                    </span>
                    {job.sizeTag && (
                      <span className="text-[10px] font-black bg-slate-200 text-slate-600 px-2 py-0.5 rounded-lg uppercase tracking-wider">
                        {job.sizeTag}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-xs font-medium text-slate-500">
                    <span>Mã lệnh:</span>
                    <span className="font-black text-slate-700">{job.jobId.slice(0,8).toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between text-xs font-medium text-slate-500">
                    <span>Thời gian hoàn thành:</span>
                    <span className="font-black text-slate-700">
                      {job.completedAt ? formatDistanceToNow(new Date(job.completedAt), { addSuffix: true, locale: vi }) : "-"}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs font-medium text-slate-500">
                    <span>Thợ thực hiện:</span>
                    <span className="font-black text-slate-700">{job.technicianName || "N/A"}</span>
                  </div>
                </div>

                <Link
                  href={`/qc/inspections/${job.jobId}`}
                  className="w-full py-4 rounded-2xl bg-[#17409A]/5 text-[#17409A] font-black text-xs uppercase tracking-widest hover:bg-[#17409A] hover:text-white transition-colors flex items-center justify-center gap-2"
                >
                  <MdSearch className="text-base" />
                  Kiểm tra chi tiết
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
