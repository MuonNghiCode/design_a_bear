"use client";

import Image from "next/image";
import { GiHammerBreak, GiPawPrint, GiStarSattelites } from "react-icons/gi";
import { 
  MdCheckCircle, 
  MdTimelapse, 
  MdCloudUpload,
  MdInfoOutline
} from "react-icons/md";
import type { ProductionJob, ProductionPartType, ProductionStatus } from "@/types";

interface JobProgressCardProps {
  job: ProductionJob;
  onUpdateStatus: (jobId: string, partType: ProductionPartType, status: ProductionStatus) => void;
  onOpenHandover: (job: ProductionJob, partType: ProductionPartType) => void;
}

export default function JobProgressCard({ job, onUpdateStatus, onOpenHandover }: JobProgressCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED": return "bg-green-100 text-green-600 border-green-200";
      case "IN_PROGRESS": return "bg-blue-100 text-blue-600 border-blue-200";
      case "AWAITING_QC": return "bg-amber-100 text-amber-600 border-amber-200";
      case "FINISHED": return "bg-indigo-100 text-indigo-600 border-indigo-200";
      default: return "bg-slate-100 text-slate-500 border-slate-200";
    }
  };

  return (
    <div className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-slate-100 flex flex-col md:flex-row">
      {/* Product Info */}
      <div className="md:w-64 bg-slate-50 p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-100">
        <div className="relative w-32 h-32 mb-4">
          <Image
            src={job.imageUrl || "/teddy_bear.png"}
            alt={job.productName || "Teddy Bear"}
            fill
            className="object-contain"
          />
        </div>
        <h3 className="text-base font-black text-[#17409A] text-center leading-tight">
          {job.productName}
        </h3>
        <div className="mt-2 flex items-center gap-1.5">
          <span className="text-[10px] font-black bg-[#17409A] text-white px-2 py-0.5 rounded-lg uppercase tracking-wider">
            {job.sizeTag || "STD"}
          </span>
          <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg border uppercase tracking-wider ${getStatusColor(job.status)}`}>
            {job.status.replace("_", " ")}
          </span>
        </div>
      </div>

      {/* Progress Tracking */}
      <div className="flex-1 p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Part 1: ESP CORE */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-black text-[#17409A] uppercase tracking-widest flex items-center gap-2">
              <GiStarSattelites className="text-lg" />
              Hệ thống ESP Core
            </h4>
            <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg border uppercase ${getStatusColor(job.espStatus)}`}>
              {job.espStatus.replace("_", " ")}
            </span>
          </div>
          
          <div className="flex gap-2">
            {job.espStatus === "ASSIGNED" && (
              <button 
                onClick={() => onUpdateStatus(job.jobId, "ESP_CORE", "IN_PROGRESS")}
                className="flex-1 py-3 rounded-2xl bg-blue-50 text-blue-600 font-black text-[10px] uppercase tracking-wider hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-2"
              >
                <MdTimelapse className="text-base" /> Bắt đầu làm
              </button>
            )}
            {job.espStatus === "IN_PROGRESS" && (
              <button 
                onClick={() => onOpenHandover(job, "ESP_CORE")}
                className="flex-1 py-3 rounded-2xl bg-green-50 text-green-600 font-black text-[10px] uppercase tracking-wider hover:bg-green-600 hover:text-white transition-all flex items-center justify-center gap-2"
              >
                <MdCloudUpload className="text-base" /> Bàn giao phần này
              </button>
            )}
            {job.espStatus === "COMPLETED" && (
              <div className="flex-1 py-3 rounded-2xl bg-slate-50 text-slate-400 font-black text-[10px] uppercase tracking-wider flex items-center justify-center gap-2 cursor-default">
                <MdCheckCircle className="text-base text-green-500" /> Đã hoàn thành
              </div>
            )}
          </div>
        </div>

        {/* Part 2: PLUSH SHELL */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-black text-[#17409A] uppercase tracking-widest flex items-center gap-2">
              <GiPawPrint className="text-lg" />
              Vỏ gấu bông
            </h4>
            <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg border uppercase ${getStatusColor(job.shellStatus)}`}>
              {job.shellStatus.replace("_", " ")}
            </span>
          </div>
          
          <div className="flex gap-2">
            {job.shellStatus === "ASSIGNED" && (
              <button 
                onClick={() => onUpdateStatus(job.jobId, "PLUSH_SHELL", "IN_PROGRESS")}
                className="flex-1 py-3 rounded-2xl bg-blue-50 text-blue-600 font-black text-[10px] uppercase tracking-wider hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-2"
              >
                <MdTimelapse className="text-base" /> Bắt đầu làm
              </button>
            )}
            {job.shellStatus === "IN_PROGRESS" && (
              <button 
                onClick={() => onOpenHandover(job, "PLUSH_SHELL")}
                className="flex-1 py-3 rounded-2xl bg-green-50 text-green-600 font-black text-[10px] uppercase tracking-wider hover:bg-green-600 hover:text-white transition-all flex items-center justify-center gap-2"
              >
                <MdCloudUpload className="text-base" /> Bàn giao phần này
              </button>
            )}
            {job.shellStatus === "COMPLETED" && (
              <div className="flex-1 py-3 rounded-2xl bg-slate-50 text-slate-400 font-black text-[10px] uppercase tracking-wider flex items-center justify-center gap-2 cursor-default">
                <MdCheckCircle className="text-base text-green-500" /> Đã hoàn thành
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 pt-4 border-t border-slate-50 flex items-center justify-between text-[11px] font-bold text-slate-400">
          <div className="flex items-center gap-2">
            <MdInfoOutline className="text-base" />
            <span>Sau khi bàn giao đủ 2 phần, QC sẽ tiến hành kiểm định chất lượng.</span>
          </div>
          <div className="text-[#17409A]">
            ID: {job.jobId.slice(0, 8)}...
          </div>
        </div>
      </div>
    </div>
  );
}
