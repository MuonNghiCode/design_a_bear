"use client";

import { useEffect, useState } from "react";
import { GiPawPrint } from "react-icons/gi";
import { MdAddCircleOutline, MdRefresh } from "react-icons/md";
import { productionJobService } from "@/services";
import { useToast } from "@/contexts/ToastContext";
import type { ProductionJob } from "@/types";
import LobbyJobCard from "./LobbyJobCard";

export default function CraftsmanLobbyClient() {
  const [jobs, setJobs] = useState<ProductionJob[]>([]);
  const [loading, setLoading] = useState(true);
  const { success, error } = useToast();

  const fetchLobby = async () => {
    setLoading(true);
    try {
      const response = await productionJobService.getLobby();
      if (response.isSuccess) {
        setJobs(response.value || []);
      }
    } catch (err) {
      error("Không thể tải danh sách sảnh việc");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLobby();
  }, []);

  const handleClaim = async (jobId: string) => {
    try {
      const response = await productionJobService.claimJob(jobId);
      if (response.isSuccess) {
        success("Đã nhận việc thành công!");
        setJobs((prev) => prev.filter((j) => j.jobId !== jobId));
      } else {
        error(response.error?.description || "Không thể nhận việc");
      }
    } catch (err) {
      error("Có lỗi xảy ra khi nhận việc");
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#17409A] flex items-center gap-3">
            <MdAddCircleOutline className="text-3xl" />
            Sảnh chờ việc (Lobby)
          </h1>
          <p className="text-slate-500 mt-1 font-medium">
            Chọn một đơn hàng để bắt đầu quy trình chế tác gấu bông.
          </p>
        </div>
        <button
          onClick={fetchLobby}
          className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-[#17409A] hover:bg-[#17409A] hover:text-white transition-all cursor-pointer"
          title="Làm mới"
        >
          <MdRefresh className={`text-2xl ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-12 h-12 border-4 border-[#17409A]/20 border-t-[#17409A] rounded-full animate-spin" />
          <p className="text-[#17409A] font-black uppercase tracking-widest text-xs">Đang tìm đơn mới...</p>
        </div>
      ) : jobs.length === 0 ? (
        <div className="bg-white rounded-[40px] p-20 flex flex-col items-center justify-center text-center border border-dashed border-slate-200">
          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-6">
            <GiPawPrint className="text-5xl" />
          </div>
          <h2 className="text-xl font-black text-slate-400">Sảnh việc hiện đang trống</h2>
          <p className="text-slate-400 mt-2 max-w-xs">
            Hiện chưa có đơn hàng nào cần chế tác. Hãy quay lại sau nhé!
          </p>
          <button 
            onClick={fetchLobby}
            className="mt-8 px-8 py-3 rounded-2xl bg-[#17409A] text-white font-black uppercase tracking-widest text-sm hover:scale-105 active:scale-95 transition-all shadow-lg shadow-blue-900/20"
          >
            Thử lại
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <LobbyJobCard key={job.jobId} job={job} onClaim={handleClaim} />
          ))}
        </div>
      )}
    </div>
  );
}
