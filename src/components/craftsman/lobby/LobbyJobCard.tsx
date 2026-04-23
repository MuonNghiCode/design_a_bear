"use client";

import Image from "next/image";
import { GiHammerBreak } from "react-icons/gi";
import { MdAddCircleOutline, MdOutlineCategory } from "react-icons/md";
import type { ProductionJob } from "@/types";

interface LobbyJobCardProps {
  job: ProductionJob;
  onClaim: (jobId: string) => void;
}

export default function LobbyJobCard({ job, onClaim }: LobbyJobCardProps) {
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-500 group flex flex-col">
      {/* Product Image */}
      <div className="relative h-48 bg-slate-100 overflow-hidden">
        <Image
          src={job.imageUrl || "/teddy_bear.png"}
          alt={job.productName || "Teddy Bear"}
          fill
          className="object-contain p-4 group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-white/90 backdrop-blur px-3 py-1.5 rounded-xl text-[10px] font-black text-[#17409A] uppercase tracking-wider shadow-sm border border-white">
            {job.sizeTag || "Standard"}
          </span>
        </div>
        {job.hasSmartChip && (
          <div className="absolute top-4 right-4">
            <span className="bg-blue-600 text-white px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-lg flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-blue-300 rounded-full animate-pulse" />
              Smart Chip
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-lg font-black text-[#17409A] line-clamp-1">{job.productName}</h3>
        
        <div className="mt-4 space-y-3 flex-1">
          <div className="flex items-center gap-2 text-slate-500">
            <MdOutlineCategory className="text-lg text-[#17409A]" />
            <span className="text-sm font-bold">{job.size || "Kích thước chuẩn"}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-500">
            <GiHammerBreak className="text-lg text-[#17409A]" />
            <span className="text-sm font-bold">Thù lao: <span className="text-[#17409A]">{job.craftsmanCommission.toLocaleString()}đ</span></span>
          </div>
        </div>

        <button
          onClick={() => onClaim(job.jobId)}
          className="mt-6 w-full py-4 rounded-2xl bg-[#F4F7FF] text-[#17409A] font-black uppercase tracking-widest text-xs hover:bg-[#17409A] hover:text-white transition-all group/btn flex items-center justify-center gap-2"
        >
          <MdAddCircleOutline className="text-lg group-hover/btn:rotate-90 transition-transform" />
          Nhận đơn này
        </button>
      </div>
    </div>
  );
}
