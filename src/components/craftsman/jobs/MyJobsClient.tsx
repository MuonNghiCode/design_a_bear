"use client";

import { useEffect, useState } from "react";
import { MdAssignmentInd, MdRefresh } from "react-icons/md";
import { productionJobService } from "@/services";
import { useToast } from "@/contexts/ToastContext";
import { useAuth } from "@/contexts/AuthContext";
import type { ProductionJob, ProductionPartType, ProductionStatus } from "@/types";
import JobProgressCard from "./JobProgressCard";
import HandoverModal from "./HandoverModal";

export default function MyJobsClient() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<ProductionJob[]>([]);
  const [loading, setLoading] = useState(true);
  const { success, error } = useToast();

  const [handoverData, setHandoverData] = useState<{ job: ProductionJob; partType: ProductionPartType } | null>(null);

  const fetchMyJobs = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const response = await productionJobService.getByTechnician(user.id);
      if (response.isSuccess) {
        setJobs(response.value || []);
      }
    } catch (err) {
      error("Không thể tải danh sách công việc");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyJobs();
  }, [user?.id]);

  const updateStatus = async (jobId: string, partType: ProductionPartType, status: ProductionStatus) => {
    try {
      const response = await productionJobService.updatePartStatus(jobId, partType, status);
      if (response.isSuccess) {
        success(`Đã cập nhật trạng thái ${partType}`);
        fetchMyJobs();
      } else {
        error(response.error?.description || "Cập nhật thất bại");
      }
    } catch (err) {
      error("Có lỗi xảy ra");
    }
  };

  const handleHandoverSubmit = async (photoUrls: string[], note: string) => {
    if (!handoverData) return;
    
    try {
      const response = await productionJobService.handoverPart(
        handoverData.job.jobId, 
        handoverData.partType, 
        photoUrls, 
        note
      );
      if (response.isSuccess) {
        success(`Đã bàn giao phần ${handoverData.partType} thành công!`);
        fetchMyJobs();
      } else {
        error(response.error?.description || "Bàn giao thất bại");
      }
    } catch (err) {
      error("Có lỗi xảy ra khi bàn giao");
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#17409A] flex items-center gap-3">
            <MdAssignmentInd className="text-3xl" />
            Việc của tôi
          </h1>
          <p className="text-slate-500 mt-1 font-medium">
            Quản lý và cập nhật tiến độ các đơn hàng bạn đang đảm nhiệm.
          </p>
        </div>
        <button
          onClick={fetchMyJobs}
          className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-[#17409A] hover:bg-[#17409A] hover:text-white transition-all cursor-pointer"
        >
          <MdRefresh className={`text-2xl ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-[#17409A]/20 border-t-[#17409A] rounded-full animate-spin mb-4" />
          <p className="text-[#17409A] font-black uppercase tracking-widest text-xs">Đang tải danh sách...</p>
        </div>
      ) : jobs.length === 0 ? (
        <div className="bg-white rounded-[40px] p-20 flex flex-col items-center justify-center text-center border border-slate-100">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-6">
            <MdAssignmentInd className="text-4xl" />
          </div>
          <h2 className="text-xl font-black text-slate-400">Bạn chưa nhận đơn hàng nào</h2>
          <p className="text-slate-400 mt-2">Hãy vào Sảnh việc để bắt đầu nhé!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {jobs.map((job) => (
            <JobProgressCard 
              key={job.jobId} 
              job={job} 
              onUpdateStatus={updateStatus} 
              onOpenHandover={(job, partType) => setHandoverData({ job, partType })} 
            />
          ))}
        </div>
      )}

      {handoverData && (
        <HandoverModal
          isOpen={!!handoverData}
          onClose={() => setHandoverData(null)}
          onSubmit={handleHandoverSubmit}
          partType={handoverData.partType}
          productName={handoverData.job.productName || "Sản phẩm"}
        />
      )}
    </div>
  );
}
