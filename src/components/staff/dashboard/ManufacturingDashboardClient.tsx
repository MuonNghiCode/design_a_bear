"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import {
  MdEngineering,
  MdCheckCircle,
  MdAssignment,
  MdAccessTime,
  MdTrendingUp,
  MdBuild,
  MdAdd,
  MdClose,
  MdUploadFile,
  MdWarning,
  MdFactCheck,
  MdRefresh,
  MdMemory,
  MdSdStorage,
  MdSettingsInputComponent,
  MdListAlt,
  MdSettings,
  MdContentPaste,
  MdStraighten,
  MdLineWeight,
  MdQrCode,
  MdSettingsSuggest,
  MdOutlineHistory,
  MdLabelImportant,
  MdInfoOutline,
} from "react-icons/md";
import { GiPawPrint, GiWeight } from "react-icons/gi";
import { productionService, type ProductionJob } from "@/services/production.service";
import { mediaService } from "@/services/media.service";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { useToast } from "@/contexts/ToastContext";

// Current shift determination
function getCurrentShift() {
  const h = new Date().getHours();
  if (h >= 6 && h < 14) return "morning";
  if (h >= 14 && h < 22) return "afternoon";
  return "evening";
}

const SHIFT_MAP = {
  morning: { label: "Ca sáng", color: "#FFD93D" },
  afternoon: { label: "Ca chiều", color: "#FF8C42" },
  evening: { label: "Ca tối", color: "#7C5CFC" },
};

const STATUS_CFG: Record<string, { label: string; color: string; bg: string }> = {
  IN_QUEUE: { label: "Đang chờ", color: "#9CA3AF", bg: "#9CA3AF15" },
  ASSIGNED: { label: "Đã nhận", color: "#17409A", bg: "#17409A15" },
  IN_PROGRESS: { label: "Đang may", color: "#7C5CFC", bg: "#7C5CFC15" },
  REWORK_PENDING: { label: "Chờ sửa", color: "#FF6B9D", bg: "#FF6B9D15" },
  REWORK_IN_PROGRESS: { label: "Đang sửa", color: "#EF4444", bg: "#EF444415" },
  AWAITING_QC: { label: "Đã xong - Chờ QC", color: "#4ECDC4", bg: "#4ECDC415" },
  UNDER_QC: { label: "QC đang kiểm", color: "#17409A", bg: "#17409A15" },
  FINISHED: { label: "Hoàn tất", color: "#10B981", bg: "#10B98115" },
};

export default function ManufacturingDashboardClient() {
  const ref = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<"my-tasks" | "pool">("my-tasks");
  const [tasks, setTasks] = useState<ProductionJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [completingJob, setCompletingJob] = useState<ProductionJob | null>(null);
  const [uploading, setUploading] = useState(false);
  const [handoverNote, setHandoverNote] = useState("");
  const [selectedPhotos, setSelectedPhotos] = useState<File[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [chipStep, setChipStep] = useState(0); // 0: Solder, 1: Flash, 2: Install, 3: Photos
  const [isFlashing, setIsFlashing] = useState(false);
  const [flashProgress, setFlashProgress] = useState(0);
  
  const { user } = useAuth();
  const toast = useToast();
  const currentShift = getCurrentShift();
  const shift = SHIFT_MAP[currentShift as keyof typeof SHIFT_MAP];

  const fetchData = async (isAuto = false) => {
    try {
      if (!isAuto) setRefreshing(true);
      const poolRes = await productionService.getManufacturingPool().catch(() => ({ isSuccess: false, value: [] }));
      const myRes = await productionService.getMyProductionJobs().catch(() => ({ isSuccess: false, value: [] }));
      
      let all: ProductionJob[] = [];
      if (poolRes.isSuccess && poolRes.value) all = [...all, ...(poolRes.value as ProductionJob[])];
      if (myRes.isSuccess && myRes.value) all = [...all, ...(myRes.value as ProductionJob[])];
      
      setTasks(all);
      if (isAuto) toast.success("Dữ liệu đã tự động cập nhật", { id: 'auto-refresh' });
    } catch (error) {
      console.error("Fetch Data Error:", error);
      if (!isAuto) toast.error("Không thể tải danh sách công việc");
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchData().finally(() => setLoading(false));

    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchData(true);
    }, 30000);

    return () => clearInterval(interval);
  }, [user?.id]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".ac", { opacity: 0, y: 15 }, {
        opacity: 1, y: 0, duration: 0.4, ease: "power2.out", stagger: 0.05, clearProps: "all"
      });
    }, ref);
    return () => ctx.revert();
  }, [loading, activeTab]);

  const handleClaim = async (jobId: string) => {
    try {
      const res = await productionService.claim(jobId);
      if (res.isSuccess) {
        toast.success("Đã nhận việc thành công!");
        fetchData();
      } else {
        toast.error("Không thể nhận việc");
      }
    } catch (e) {
      toast.error("Lỗi hệ thống");
    }
  };

  const handleConfirmRework = async (jobId: string) => {
    try {
      const res = await productionService.confirmRework(jobId);
      if (res.isSuccess) {
        toast.success("Đã xác nhận làm lại");
        fetchData();
      }
    } catch (e) {
      toast.error("Lỗi hệ thống");
    }
  };

  const handleSubmitHandover = async () => {
    if (!completingJob) return;
    if (selectedPhotos.length === 0) {
      toast.error("Vui lòng chụp ảnh sản phẩm hoàn thiện");
      return;
    }

    try {
      setUploading(true);
      const photoUrls: string[] = [];
      for (const file of selectedPhotos) {
        const up = await mediaService.uploadMedia(file, "handover");
        if (up.isSuccess && up.value?.publicUrl) photoUrls.push(up.value.publicUrl);
      }

      const res = await productionService.finish(completingJob.jobId, {
        photoUrls,
        note: handoverNote,
        metadata: completingJob.hasSmartChip ? JSON.stringify({
          chip_workflow: "Completed",
          steps: ["soldering", "firmware_flashing", "installation"],
          timestamp: new Date().toISOString()
        }) : undefined
      });

      if (res.isSuccess) {
        toast.success("Đã gửi hàng cho QC!");
        setCompletingJob(null);
        setSelectedPhotos([]);
        setHandoverNote("");
        setChipStep(0);
        setFlashProgress(0);
        fetchData();
      }
    } catch (e) {
      toast.error("Lỗi khi upload ảnh hoặc gửi báo cáo");
    } finally {
      setUploading(false);
    }
  };

  const handleFlashFirmware = () => {
    setIsFlashing(true);
    setFlashProgress(0);
    const obj = { val: 0 };
    gsap.to(obj, {
      val: 100,
      duration: 3,
      ease: "power1.inOut",
      onUpdate: () => setFlashProgress(Math.round(obj.val)),
      onComplete: () => {
        setIsFlashing(false);
        setChipStep(2);
        toast.success("Firmware đã được nạp thành công!");
      }
    });
  };

  const poolTasks = tasks.filter(t => t.status === "IN_QUEUE");
  const myTasks = tasks.filter(t => t.status !== "IN_QUEUE" && t.status !== "FINISHED");
  const displayTasks = activeTab === "my-tasks" ? myTasks : poolTasks;

  const doneCount = tasks.filter(t => t.status === "FINISHED" || t.status === "AWAITING_QC").length;
  const totalCount = myTasks.length + doneCount;
  const pct = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  return (
    <div ref={ref} className="space-y-6">
      {/* ── Header ── */}
      <div className="ac flex items-end justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <MdEngineering className="text-[#17409A] transition-transform hover:scale-110" style={{ fontSize: 28 }} />
            <h1 className="font-black text-[#1A1A2E] text-2xl tracking-tight uppercase">Xưởng Thủ Công</h1>
          </div>
          <p className="text-[#9CA3AF] text-sm font-medium">
            Nghệ nhân: <span className="text-[#17409A] font-bold">{user?.name}</span> · {shift.label}
          </p>
        </div>
        <div className="flex items-center gap-3">
             <button
               onClick={() => fetchData()}
               disabled={refreshing}
               className={`w-10 h-10 rounded-2xl bg-white border border-[#F4F7FF] shadow-sm flex items-center justify-center text-[#17409A] transition-all hover:shadow-md active:scale-95 ${refreshing ? 'opacity-50' : ''}`}
               title="Làm mới dữ liệu"
             >
                <MdRefresh className={`text-xl ${refreshing ? 'animate-spin' : ''}`} />
             </button>
             <div className="bg-white px-4 py-2 rounded-2xl flex items-center gap-3 border border-[#F4F7FF] shadow-sm">
                 <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: shift.color }} />
                 <span className="text-[#1A1A2E] text-xs font-bold uppercase">{shift.label}</span>
             </div>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="ac grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 relative bg-[#17409A] rounded-[2rem] p-8 overflow-hidden min-h-[160px] flex flex-col justify-between group">
              <MdFactCheck className="absolute -bottom-10 -right-5 text-white/5 text-[200px] pointer-events-none transition-transform group-hover:scale-110 duration-700" />
              <div className="relative z-10 flex items-center justify-between">
                  <div>
                      <p className="text-white/60 text-[10px] font-black tracking-widest uppercase mb-2">Tiến độ cá nhân</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-white text-5xl font-black">{pct}%</span>
                        <span className="text-white/40 text-sm font-bold">/ {totalCount} jobs</span>
                      </div>
                  </div>
                  <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                      <MdTrendingUp className="text-[#4ECDC4] text-3xl" />
                  </div>
              </div>
              <div className="relative z-10 mt-6 h-2 bg-black/20 rounded-full overflow-hidden">
                  <div className="h-full bg-[#4ECDC4] rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(78,205,196,0.5)]" style={{ width: `${pct}%` }} />
              </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-[2rem] p-5 border border-[#F4F7FF] shadow-sm hover:shadow-md transition-all">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center mb-3">
                      <MdBuild className="text-orange-500 text-xl" />
                  </div>
                  <p className="text-2xl font-black text-[#1A1A2E]">{myTasks.length}</p>
                  <p className="text-[#9CA3AF] text-[10px] font-bold uppercase">Đang làm</p>
              </div>
              <div className="bg-white rounded-[2rem] p-5 border border-[#F4F7FF] shadow-sm hover:shadow-md transition-all">
                  <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center mb-3">
                      <MdWarning className="text-red-500 text-xl" />
                  </div>
                  <p className="text-2xl font-black text-[#1A1A2E]">{myTasks.filter(t => t.status.includes('REWORK')).length}</p>
                  <p className="text-[#9CA3AF] text-[10px] font-bold uppercase">Hàng lỗi</p>
              </div>
          </div>
      </div>

      {/* ── Tabs ── */}
      <div className="ac flex gap-1 bg-[#F4F7FF] p-1.5 rounded-2xl w-fit">
          <button 
            onClick={() => setActiveTab('my-tasks')}
            className={`px-6 py-2 rounded-[14px] text-xs font-black transition-all ${activeTab === 'my-tasks' ? 'bg-[#17409A] text-white shadow-lg' : 'text-[#9CA3AF] hover:text-[#17409A]'}`}
          >
              VIỆC CỦA TÔI ({myTasks.length})
          </button>
          <button 
            onClick={() => setActiveTab('pool')}
            className={`px-6 py-2 rounded-[14px] text-xs font-black transition-all ${activeTab === 'pool' ? 'bg-[#17409A] text-white shadow-lg' : 'text-[#9CA3AF] hover:text-[#17409A]'}`}
          >
              TÌM VIỆC MỚI ({poolTasks.length})
          </button>
      </div>

      {/* ── Task List ── */}
      <div className="ac grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {loading ? (
            <div className="col-span-full py-20 text-center text-[#9CA3AF] font-bold animate-pulse">ĐANG TẢI DỮ LIỆU...</div>
          ) : displayTasks.length === 0 ? (
            <div className="col-span-full py-20 text-center bg-white rounded-[2rem] border-2 border-dashed border-[#F4F7FF]">
               <MdAssignment className="mx-auto text-4xl text-[#F4F7FF] mb-3" />
               <p className="text-[#9CA3AF] font-bold italic">Không có công việc nào trong danh sách này.</p>
            </div>
           ) : displayTasks.map(task => (
             <div key={task.jobId} className="bg-white rounded-[2.5rem] p-6 border border-[#F4F7FF] shadow-sm hover:shadow-[0_20px_50px_rgba(23,64,154,0.1)] transition-all group flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#17409A] bg-opacity-5 rounded-bl-[5rem] -mr-10 -mt-10 transition-transform group-hover:scale-110 duration-500" />
                
                <div>
                   <div className="flex items-start justify-between mb-5 relative z-10">
                      <div className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider" style={{ color: STATUS_CFG[task.status]?.color, backgroundColor: STATUS_CFG[task.status]?.bg }}>
                         {STATUS_CFG[task.status]?.label}
                      </div>
                      <div className="flex items-center gap-1.5 text-[#9CA3AF]">
                         <MdOutlineHistory size={14} />
                         <span className="text-[10px] font-bold uppercase">{new Date(task.startedAt || new Date()).toLocaleDateString('vi-VN')}</span>
                      </div>
                   </div>

                   <div className="flex gap-4 mb-6 relative z-10">
                      <div className="w-20 h-20 rounded-3xl bg-[#F4F7FF] overflow-hidden shrink-0 border border-[#F4F7FF] shadow-inner group-hover:border-[#17409A] group-hover:border-opacity-20 transition-colors">
                         {task.imageUrl ? (
                            <img src={task.imageUrl} alt={task.productName} className="w-full h-full object-cover" />
                         ) : (
                            <div className="w-full h-full flex items-center justify-center text-[#17409A]/20">
                               <MdAssignment size={32} />
                            </div>
                         )}
                      </div>
                      <div className="flex-1 min-w-0">
                         <div className="flex items-center gap-2 mb-1">
                            <MdLabelImportant className="text-[#17409A] shrink-0" size={16} />
                            <h3 className="font-black text-[#1A1A2E] text-lg group-hover:text-[#17409A] transition-colors truncate">
                               {task.productName}
                            </h3>
                         </div>
                         <div className="flex items-center gap-2 text-[#9CA3AF] text-[9px] font-bold uppercase tracking-widest pl-6">
                            <span>SERIAL:</span>
                            <span className="text-[#1A1A2E] bg-[#F4F7FF] px-1.5 py-0.5 rounded-md">{task.jobId.slice(0,8).toUpperCase()}</span>
                         </div>
                         
                         {/* Technical Specs Row */}
                         <div className="flex items-center gap-3 mt-3 pl-6">
                            <div className="flex items-center gap-1 text-[#9CA3AF]">
                               <MdStraighten size={12} />
                               <span className="text-[10px] font-bold">{task.size || "Standard"}</span>
                            </div>
                            <div className="w-1 h-1 rounded-full bg-[#F4F7FF]" />
                            <div className="flex items-center gap-1 text-[#9CA3AF]">
                               <GiWeight size={12} />
                               <span className="text-[10px] font-bold">{task.weightGram || 500}g</span>
                            </div>
                         </div>
                      </div>
                   </div>
                   
                   {task.hasSmartChip && (
                      <div className="bg-[#17409A] p-4 rounded-3xl mb-5 relative overflow-hidden shadow-lg shadow-black/20 group">
                         <GiPawPrint className="absolute -right-2 -bottom-2 text-white/10 text-6xl transition-transform group-hover:scale-125 duration-700" />
                         <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-1.5">
                              <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center backdrop-blur-sm">
                                <GiPawPrint className="text-white text-xs" />
                              </div>
                              <span className="text-[10px] font-black text-white uppercase tracking-tighter">Smart Tech (ESP32)</span>
                            </div>
                            <p className="text-[9px] font-bold text-white/70 uppercase ml-8 leading-tight">
                               Hardware: Hàn &rarr; Nạp &rarr; Lắp
                            </p>
                         </div>
                      </div>
                   )}

                   <div className="bg-[#F4F7FF] bg-opacity-40 p-5 rounded-[2rem] mb-5 border border-[#F4F7FF] relative group">
                       <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2 text-[#1A1A2E]/50">
                             <MdListAlt size={16} className="text-[#17409A]" />
                             <span className="text-[9px] font-black uppercase tracking-[0.2em]">Cấu thành sản phẩm</span>
                          </div>
                          <span className="text-[8px] font-black text-[#17409A] bg-white px-2 py-0.5 rounded-full border border-[#F4F7FF]">{task.components?.length || 0} ITEMS</span>
                       </div>
                       
                       <div className="grid grid-cols-1 gap-3">
                          {task.components && task.components.length > 0 ? (
                             task.components.map((comp, idx) => (
                                <div key={idx} className="flex items-center gap-3 group/item">
                                   <div className="w-8 h-8 rounded-xl bg-white border border-[#F4F7FF] overflow-hidden shrink-0 shadow-sm transition-transform group-hover/item:scale-110">
                                      {comp.imageUrl ? (
                                         <img src={comp.imageUrl} alt={comp.productName} className="w-full h-full object-cover" />
                                      ) : (
                                         <div className="w-full h-full flex items-center justify-center text-[#9CA3AF]">
                                            < GiPawPrint size={12} />
                                         </div>
                                      )}
                                   </div>
                                   <div className="flex-1 min-w-0">
                                      <div className="flex items-center justify-between">
                                         <span className="text-[10px] font-bold text-[#1A1A2E]/80 group-hover/item:text-[#17409A] transition-colors truncate">{comp.productName}</span>
                                         <span className="text-[10px] font-black text-[#17409A] ml-2">x{comp.quantity}</span>
                                      </div>
                                      {comp.size && (
                                         <span className="text-[8px] text-[#9CA3AF] font-bold uppercase tracking-wider">{comp.size}</span>
                                      )}
                                   </div>
                                </div>
                             ))
                          ) : (
                             <div className="flex flex-col items-center py-4 bg-white/50 rounded-2xl border border-dashed border-[#F4F7FF]">
                                <MdInfoOutline className="text-[#9CA3AF] mb-1" size={16} />
                                <p className="text-[9px] text-[#9CA3AF] font-bold uppercase tracking-widest">Sản phẩm cơ bản</p>
                             </div>
                          )}
                       </div>
                   </div>

                   {task.status === "REWORK_PENDING" && (
                    <div className="bg-red-50 border border-red-100 p-4 rounded-3xl mb-4 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-2 opacity-10">
                           <MdWarning size={40} className="text-red-500" />
                        </div>
                        <p className="text-red-500 text-[10px] font-black uppercase mb-2 flex items-center gap-1">
                           <MdInfoOutline /> Yêu cầu chỉnh sửa:
                        </p>
                        <div className="bg-white/60 p-3 rounded-xl">
                           <p className="text-red-600 text-xs italic font-medium leading-relaxed">"{task.rejectionReason || "Cần kiểm tra lại toàn bộ quy trình lắp ráp"}"</p>
                        </div>
                    </div>
                   )}
                </div>

                <div className="pt-4 border-t border-[#F4F7FF]">
                   {activeTab === 'pool' ? (
                     <button 
                       onClick={() => handleClaim(task.jobId)}
                       className="w-full bg-[#17409A] hover:bg-[#1a3a8a] text-white py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2"
                     >
                        <MdAdd className="text-lg" /> Nhận việc ngay
                     </button>
                   ) : (
                     <div className="flex gap-2">
                        {task.status === "REWORK_PENDING" ? (
                           <button 
                             onClick={() => handleConfirmRework(task.jobId)}
                             className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-2xl text-xs font-black uppercase transition-all shadow-md"
                           >
                             Xác nhận sửa lỗi
                           </button>
                        ) : (
                          <button 
                            onClick={() => setCompletingJob(task)}
                            className="flex-1 bg-[#17409A] hover:bg-[#1a3a8a] text-white py-3 rounded-2xl text-xs font-black uppercase transition-all shadow-lg flex items-center justify-center gap-2"
                            disabled={task.status === "AWAITING_QC" || task.status === "UNDER_QC"}
                          >
                             {task.status === "AWAITING_QC" ? "Chờ QC kiểm" : task.status === "UNDER_QC" ? "Đang kiểm định..." : "Gửi hàng cho QC"}
                          </button>
                        )}
                     </div>
                   )}
                </div>
            </div>
          ))}
      </div>

      {/* ── Handover Modal ── */}
      {completingJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A1A2E]/60 backdrop-blur-md p-4 overflow-y-auto">
            <div className="bg-white rounded-[2.5rem] w-full max-w-2xl my-8 overflow-hidden shadow-2xl relative">
                <button onClick={() => setCompletingJob(null)} className="absolute top-6 right-6 z-20 w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-colors">
                    <MdClose size={24} />
                </button>
                <div className="p-8">
                    <h2 className="text-3xl font-black text-[#1A1A2E] mb-1 tracking-tight">Hồ Sơ Gia Công</h2>
                    <p className="text-[#9CA3AF] text-sm mb-8 font-medium italic">Xưởng Sản Xuất · Hồ sơ kỹ thuật #JOB-{completingJob.jobId.slice(0,6).toUpperCase()}</p>

                    {/* --- Production Blueprint Card --- */}
                    <div className="bg-[#17409A] rounded-[2.5rem] p-8 mb-8 text-white relative overflow-hidden shadow-2xl shadow-[#17409A]/30 transition-all animate-in zoom-in-95 duration-500">
                       <MdSettingsSuggest className="absolute -right-6 -bottom-6 text-white/5 text-[180px] pointer-events-none" />
                       
                       <div className="relative z-10">
                          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                             {/* Main Product Image */}
                             <div className="w-40 h-40 bg-white/10 backdrop-blur-md rounded-[2.5rem] overflow-hidden border border-white/20 shadow-2xl shrink-0">
                                {completingJob.imageUrl ? (
                                   <img src={completingJob.imageUrl} alt={completingJob.productName} className="w-full h-full object-cover" />
                                ) : (
                                   <div className="w-full h-full flex items-center justify-center text-white/20">
                                      <GiPawPrint size={64} />
                                   </div>
                                )}
                             </div>
                             
                             {/* Meta Info */}
                             <div className="flex-1 text-center md:text-left">
                                <div className="flex items-center gap-2 mb-2 justify-center md:justify-start">
                                   <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#4ECDC4]">Bản Thiết Kế Kỹ Thuật</span>
                                   <div className="h-[1px] w-12 bg-[#4ECDC4]/30" />
                                </div>
                                <h3 className="text-3xl font-black mb-6 uppercase tracking-tight leading-tight">{completingJob.productName}</h3>
                                
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                   <div className="flex flex-col">
                                      <span className="text-[8px] font-black text-white/40 uppercase tracking-widest mb-1">Kích thước</span>
                                      <div className="flex items-center gap-2">
                                         <MdStraighten className="text-[#4ECDC4] text-lg" />
                                         <span className="text-sm font-black">{completingJob.size || "Mặc định (40cm)"}</span>
                                      </div>
                                   </div>
                                   <div className="flex flex-col">
                                      <span className="text-[8px] font-black text-white/40 uppercase tracking-widest mb-1">Trọng lượng</span>
                                      <div className="flex items-center gap-2">
                                         <GiWeight className="text-[#4ECDC4] text-lg" />
                                         <span className="text-sm font-black">{completingJob.weightGram || 500}g (+/- 10g)</span>
                                      </div>
                                   </div>
                                   <div className="flex flex-col col-span-2 md:col-span-1">
                                      <span className="text-[8px] font-black text-white/40 uppercase tracking-widest mb-1">Mã tham chiếu</span>
                                      <div className="flex items-center gap-2">
                                         <MdQrCode className="text-[#4ECDC4] text-lg" />
                                         <span className="font-mono text-sm font-black text-white/90">{completingJob.jobId.slice(0,10).toUpperCase()}</span>
                                      </div>
                                   </div>
                                </div>
                             </div>
                          </div>

                          <div className="mt-8 pt-8 border-t border-white/10">
                             <div className="flex items-center gap-2 mb-5">
                                <MdListAlt size={18} className="text-[#4ECDC4]" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Cấu thành sản phẩm cụ thể (BOM)</span>
                             </div>
                             
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {completingJob.components && completingJob.components.length > 0 ? (
                                   completingJob.components.map((comp, idx) => (
                                      <div key={idx} className="bg-white bg-opacity-5 backdrop-blur-sm rounded-3xl p-4 flex items-center gap-4 border border-white border-opacity-10 group hover:bg-white hover:bg-opacity-10 transition-colors">
                                         <div className="w-14 h-14 rounded-2xl bg-white overflow-hidden border border-white border-opacity-10 shadow-lg shrink-0">
                                            {comp.imageUrl ? (
                                               <img src={comp.imageUrl} alt={comp.productName} className="w-full h-full object-cover" />
                                            ) : (
                                               <div className="w-full h-full flex items-center justify-center text-[#17409A] text-opacity-40 bg-white">
                                                  <GiPawPrint size={24} />
                                               </div>
                                            )}
                                         </div>
                                         <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                               <h4 className="text-xs font-black text-white truncate">{comp.productName}</h4>
                                               <span className="text-[10px] font-black text-[#4ECDC4] bg-[#4ECDC4] bg-opacity-10 px-2 py-0.5 rounded-lg">x{comp.quantity}</span>
                                            </div>
                                            <div className="flex items-center gap-3 mt-1 opacity-60">
                                               <span className="text-[8px] font-bold text-white text-opacity-40 uppercase tracking-widest">{comp.size || "N/A"}</span>
                                               <div className="w-1 h-1 rounded-full bg-white bg-opacity-20" />
                                               <span className="text-[8px] font-bold text-white text-opacity-40 uppercase tracking-widest">{comp.weightGram ? `${comp.weightGram}g` : "N/A"}</span>
                                            </div>
                                         </div>
                                      </div>
                                   ))
                                ) : (
                                   <div className="col-span-full py-6 flex flex-col items-center border border-dashed border-white border-opacity-10 rounded-3xl">
                                      <p className="text-[10px] text-white text-opacity-40 font-black uppercase tracking-[0.3em]">Sản phẩm tiêu chuẩn (Không tùy biến)</p>
                                   </div>
                                )}
                             </div>
                          </div>
                       </div>
                    </div>
                    
                    <div className="space-y-6">
                        {completingJob.hasSmartChip && chipStep < 3 ? (
                          <div className="space-y-6">
                             {/* --- Multi-step Wizard --- */}
                             <div className="flex items-center justify-between mb-8">
                                {[0,1,2].map((s) => (
                                  <div key={s} className="flex flex-col items-center gap-2 flex-1 relative">
                                     <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all border-2 ${chipStep > s ? 'bg-[#10B981] border-[#10B981] text-white' : chipStep === s ? 'bg-[#17409A] border-[#17409A] text-white' : 'bg-white border-[#F4F7FF] text-[#9CA3AF]'}`}>
                                        {chipStep > s ? <MdCheckCircle /> : s + 1}
                                     </div>
                                     <span className={`text-[8px] font-black uppercase tracking-widest ${chipStep === s ? 'text-[#17409A]' : 'text-[#9CA3AF]'}`}>
                                        {s === 0 ? "Hàn Chip" : s === 1 ? "Nạp Code" : "Gắn Gấu"}
                                     </span>
                                     {s < 2 && <div className={`absolute top-4 left-[60%] w-[80%] h-[2px] -z-10 ${chipStep > s ? 'bg-[#10B981]' : 'bg-[#F4F7FF]'}`} />}
                                  </div>
                                ))}
                             </div>

                             {chipStep === 0 && (
                               <div className="ac bg-[#F4F7FF] p-6 rounded-3xl text-center">
                                  <div className="w-16 h-16 bg-white rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-sm">
                                     <MdMemory className="text-3xl text-[#17409A]" />
                                  </div>
                                  <h4 className="font-black text-[#1A1A2E] uppercase tracking-wider mb-2">Bước 1: Hàn Chip ESP32</h4>
                                  <p className="text-[#9CA3AF] text-[10px] leading-relaxed mb-6">Xác nhận Chip đã được hàn chắc chắn vào board mạch điều khiển chính.</p>
                                  <button 
                                    onClick={() => setChipStep(1)}
                                    className="w-full bg-white hover:bg-[#17409A] hover:text-white text-[#17409A] py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-[#17409A]/10"
                                  >
                                    Đã hàn xong
                                  </button>
                               </div>
                             )}

                             {chipStep === 1 && (
                               <div className="ac bg-[#F4F7FF] p-6 rounded-3xl text-center">
                                  <div className="w-16 h-16 bg-white rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-sm overflow-hidden relative">
                                     <MdSdStorage className={`text-3xl text-[#17409A] ${isFlashing ? 'animate-pulse' : ''}`} />
                                     {isFlashing && (
                                        <div className="absolute inset-0 bg-[#17409A]/10 flex items-end">
                                           <div className="w-full bg-[#17409A]" style={{ height: `${flashProgress}%`, transition: 'height 0.1s' }} />
                                        </div>
                                     )}
                                  </div>
                                  <h4 className="font-black text-[#1A1A2E] uppercase tracking-wider mb-2">Bước 2: Nạp Firmware</h4>
                                  <p className="text-[#9CA3AF] text-[10px] leading-relaxed mb-6">Kết nối USB-C và nạp mã nguồn điều khiển AI tương ứng.</p>
                                  
                                  {isFlashing ? (
                                    <div className="space-y-2">
                                       <div className="w-full h-1 bg-white rounded-full overflow-hidden">
                                          <div className="h-full bg-[#17409A]" style={{ width: `${flashProgress}%` }} />
                                       </div>
                                       <span className="text-[10px] font-black text-[#17409A]">{flashProgress}% - Đang ghi...</span>
                                    </div>
                                  ) : (
                                    <button 
                                      onClick={handleFlashFirmware}
                                      className="w-full bg-[#17409A] text-white py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg"
                                    >
                                      Bắt đầu nạp code
                                    </button>
                                  )}
                               </div>
                             )}

                             {chipStep === 2 && (
                               <div className="ac bg-[#F4F7FF] p-6 rounded-3xl text-center">
                                  <div className="w-16 h-16 bg-white rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-sm">
                                     <MdSettingsInputComponent className="text-3xl text-[#17409A]" />
                                  </div>
                                  <h4 className="font-black text-[#1A1A2E] uppercase tracking-wider mb-2">Bước 3: Lắp ráp & Gắn Tag</h4>
                                  <p className="text-[#9CA3AF] text-[10px] leading-relaxed mb-6">Xác nhận đã bỏ chip vào túi bảo vệ và gắn tag số serial lên gấu.</p>
                                  <button 
                                    onClick={() => setChipStep(3)}
                                    className="w-full bg-[#10B981] text-white py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg"
                                  >
                                    Hoàn tất quy trình chip
                                  </button>
                               </div>
                             )}
                          </div>
                        ) : (
                          <>
                            {completingJob.hasSmartChip && (
                              <div className="flex items-center gap-3 bg-green-50 p-4 rounded-2xl border border-green-100 mb-6 font-bold uppercase transition-all animate-in fade-in slide-in-from-top-2">
                                  <MdCheckCircle className="text-green-500 text-2xl shrink-0" />
                                  <p className="text-green-600 text-xs leading-relaxed">
                                     Phần cứng thông minh đã sẵn sàng!
                                  </p>
                                  <button onClick={() => setChipStep(0)} className="ml-auto text-[8px] font-black uppercase text-green-700 underline">Làm lại</button>
                              </div>
                            )}

                            <div>
                                <label className="text-[10px] font-black text-[#1A1A2E] uppercase mb-2 block">Hình ảnh hoàn thiện (Bắt buộc)</label>
                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[#F4F7FF] rounded-3xl cursor-pointer hover:bg-[#F4F7FF] transition-colors relative group">
                                    <input 
                                      type="file" 
                                      multiple 
                                      accept="image/*"
                                      className="hidden" 
                                      onChange={(e) => {
                                        if (e.target.files) setSelectedPhotos(Array.from(e.target.files));
                                      }}
                                    />
                                    {selectedPhotos.length > 0 ? (
                                      <div className="flex items-center gap-2">
                                         <MdCheckCircle className="text-[#4ECDC4] text-xl" />
                                         <span className="text-[#1A1A2E] font-bold text-sm">Đã chọn {selectedPhotos.length} ảnh</span>
                                      </div>
                                    ) : (
                                      <>
                                        <MdUploadFile className="text-[#9CA3AF] text-3xl group-hover:text-[#17409A] transition-colors" />
                                        <span className="text-[#9CA3AF] text-[10px] font-bold mt-2">Nhắp vào để chọn hoặc kéo thả</span>
                                      </>
                                    )}
                                </label>
                            </div>

                            <div>
                                <label className="text-[10px] font-black text-[#1A1A2E] uppercase mb-2 block">Ghi chú (Tùy chọn)</label>
                                <textarea 
                                  placeholder="Ví dụ: Gấu may kỹ phần chân, chip đã test ổn định..."
                                  value={handoverNote}
                                  onChange={(e) => setHandoverNote(e.target.value)}
                                  className="w-full h-24 bg-[#F4F7FF] rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-[#17409A] outline-none border-none resize-none"
                                />
                            </div>

                            <button 
                              onClick={handleSubmitHandover}
                              disabled={uploading}
                              className="w-full bg-[#17409A] hover:bg-[#1a3a8a] text-white py-4 rounded-2xl font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 disabled:bg-[#9CA3AF]"
                            >
                                {uploading ? (
                                  <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Đang xử lý...
                                  </>
                                ) : "Xác nhận gửi hàng"}
                            </button>
                          </>
                        )}
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
