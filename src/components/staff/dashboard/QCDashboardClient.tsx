"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import {
  MdFactCheck,
  MdCheckCircle,
  MdAssignment,
  MdAccessTime,
  MdTrendingUp,
  MdWarning,
  MdLocalShipping,
  MdClose,
  MdStar,
  MdOutlineRemoveRedEye,
  MdShoppingBag,
  MdRefresh,
} from "react-icons/md";
import { productionService, type ProductionJob } from "@/services/production.service";
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
  AWAITING_QC: { label: "Chờ nhận hàng", color: "#FF8C42", bg: "#FF8C4215" },
  UNDER_QC: { label: "Đang kiểm định", color: "#17409A", bg: "#17409A15" },
  FINISHED: { label: "Đã hoàn tất", color: "#10B981", bg: "#10B98115" },
  REWORK_PENDING: { label: "Đã trả hàng", color: "#EF4444", bg: "#EF444415" },
};

export default function QCDashboardClient() {
  const ref = useRef<HTMLDivElement>(null);
  const [tasks, setTasks] = useState<ProductionJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [inspectingJob, setInspectingJob] = useState<ProductionJob | null>(null);
  const [score, setScore] = useState(100);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<"incoming" | "active">("incoming");
  const [refreshing, setRefreshing] = useState(false);

  const { user } = useAuth();
  const toast = useToast();
  const currentShift = getCurrentShift();
  const shift = SHIFT_MAP[currentShift as keyof typeof SHIFT_MAP];

  const fetchData = async (isAuto = false) => {
    try {
      if (!isAuto) setRefreshing(true);
      const [awaitingRes, activeRes] = await Promise.all([
        productionService.getByStatus("AWAITING_QC"),
        productionService.getByStatus("UNDER_QC"),
      ]);

      let all: ProductionJob[] = [];
      if (awaitingRes.isSuccess && awaitingRes.value) all = [...all, ...(awaitingRes.value as ProductionJob[])];
      if (activeRes.isSuccess && activeRes.value) all = [...all, ...(activeRes.value as ProductionJob[])];

      setTasks(all);
      if (isAuto) toast.success("Dữ liệu đã cập nhật", { id: 'auto-refresh' });
    } catch (error) {
      console.error("QC Fetch Error:", error);
      if (!isAuto) toast.error("Không thể tải danh sách kiểm định");
    } finally {
      if (!isAuto) setRefreshing(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchData().finally(() => setLoading(false));

    const interval = setInterval(() => {
      fetchData(true);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".ac", { opacity: 0, y: 15 }, {
        opacity: 1, y: 0, duration: 0.4, ease: "power2.out", stagger: 0.05, clearProps: "all"
      });
    }, ref);
    return () => ctx.revert();
  }, [loading, activeTab]);

  const handleReceive = async (jobId: string) => {
    try {
      const res = await productionService.qcReceive(jobId);
      if (res.isSuccess) {
        toast.success("Đã nhận hàng vật lý!");
        fetchData();
      }
    } catch (e) {
      toast.error("Lỗi khi nhận hàng");
    }
  };

  const handleSubmitInspection = async (isApproved: boolean) => {
    if (!inspectingJob) return;
    try {
      setIsSubmitting(true);
      const res = await productionService.inspect(inspectingJob.jobId, {
        score,
        notes,
        isApproved
      });

      if (res.isSuccess) {
        toast.success(isApproved ? "Đã duyệt và đóng gói!" : "Đã gửi trả hàng lỗi");
        setInspectingJob(null);
        setScore(100);
        setNotes("");
        fetchData();
      }
    } catch (e) {
      toast.error("Lỗi khi gửi kết quả");
    } finally {
      setIsSubmitting(false);
    }
  };

  const incomingTasks = tasks.filter(t => t.status === "AWAITING_QC");
  const activeTasks = tasks.filter(t => t.status === "UNDER_QC" && t.assignedUser === user?.id);
  const displayTasks = activeTab === "incoming" ? incomingTasks : activeTasks;

  const doneToday = 12; // Static for now, or sum from history
  const totalToday = 15;
  const pct = Math.round((doneToday / totalToday) * 100);

  return (
    <div ref={ref} className="space-y-6">
      {/* ── Header ── */}
      <div className="ac flex items-end justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <MdFactCheck className="text-[#17409A]" style={{ fontSize: 28 }} />
            <h1 className="font-black text-[#1A1A2E] text-2xl tracking-tight uppercase">Kiểm Định & Đóng Gói</h1>
          </div>
          <p className="text-[#9CA3AF] text-sm font-medium">
            Thanh tra: <span className="text-[#17409A] font-bold">{user?.name}</span> · {shift.label}
          </p>
        </div>
        <div className="flex gap-2">
            <button
               onClick={() => fetchData()}
               disabled={refreshing}
               className={`w-10 h-10 rounded-2xl bg-white border border-[#F4F7FF] shadow-sm flex items-center justify-center text-[#17409A] transition-all hover:shadow-md active:scale-95 ${refreshing ? 'opacity-50' : ''}`}
               title="Làm mới dữ liệu"
             >
                <MdRefresh className={`text-xl ${refreshing ? 'animate-spin' : ''}`} />
             </button>
            <Link href="/staff/orders" className="flex items-center gap-2 bg-[#17409A] text-white text-xs font-black px-5 py-2.5 rounded-2xl shadow-lg hover:shadow-xl transition-all">
                <MdLocalShipping className="text-base" /> XUẤT XƯỞNG
            </Link>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="ac grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 relative bg-white rounded-[2rem] p-8 overflow-hidden border border-[#F4F7FF] shadow-sm group">
              <MdCheckCircle className="absolute -bottom-10 -right-5 text-[#4ECDC4]/5 text-[200px] pointer-events-none transition-transform group-hover:scale-110 duration-700" />
              <div className="relative z-10 flex items-center justify-between">
                  <div>
                      <p className="text-[#9CA3AF] text-[10px] font-black tracking-widest uppercase mb-2">Tỷ lệ đạt chuẩn ca</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-[#1A1A2E] text-5xl font-black">{pct}%</span>
                        <span className="text-[#9CA3AF] text-sm font-bold">/ {totalToday} Đơn</span>
                      </div>
                  </div>
                  <div className="w-16 h-16 rounded-2xl bg-[#4ECDC4]/10 flex items-center justify-center border border-[#4ECDC4]/20">
                      <MdTrendingUp className="text-[#4ECDC4] text-3xl" />
                  </div>
              </div>
              <div className="relative z-10 mt-6 h-2 bg-[#F4F7FF] rounded-full overflow-hidden">
                  <div className="h-full bg-[#4ECDC4] rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(78,205,196,0.3)]" style={{ width: `${pct}%` }} />
              </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
              <div className="bg-[#17409A] rounded-[2rem] p-6 text-white shadow-xl relative overflow-hidden flex flex-col justify-center">
                  <MdShoppingBag className="absolute -right-4 -bottom-4 text-white/10 text-7xl" />
                  <p className="text-3xl font-black">{incomingTasks.length}</p>
                  <p className="text-white/60 text-[10px] font-black uppercase tracking-tighter">Hàng đang chờ nhận</p>
              </div>
          </div>
      </div>

      {/* ── Tabs ── */}
      <div className="ac flex gap-1 bg-[#F4F7FF] p-1.5 rounded-2xl w-fit">
          <button 
            onClick={() => setActiveTab('incoming')}
            className={`px-6 py-2 rounded-[14px] text-xs font-black transition-all ${activeTab === 'incoming' ? 'bg-[#17409A] text-white shadow-lg' : 'text-[#9CA3AF] hover:text-[#17409A]'}`}
          >
              CHỜ NHẬN HÀNG ({incomingTasks.length})
          </button>
          <button 
            onClick={() => setActiveTab('active')}
            className={`px-6 py-2 rounded-[14px] text-xs font-black transition-all ${activeTab === 'active' ? 'bg-[#17409A] text-white shadow-lg' : 'text-[#9CA3AF] hover:text-[#17409A]'}`}
          >
              ĐANG KIỂM TRA ({activeTasks.length})
          </button>
      </div>

      {/* ── Task List ── */}
      <div className="ac grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {loading ? (
            <div className="col-span-full py-20 text-center text-[#9CA3AF] font-bold animate-pulse">ĐANG TẢI DỮ LIỆU...</div>
          ) : displayTasks.length === 0 ? (
            <div className="col-span-full py-20 text-center bg-white rounded-[2rem] border-2 border-dashed border-[#F4F7FF]">
               <MdFactCheck className="mx-auto text-4xl text-[#F4F7FF] mb-3" />
               <p className="text-[#9CA3AF] font-bold italic">Bàn làm việc đang trống.</p>
            </div>
          ) : displayTasks.map(task => (
            <div key={task.jobId} className="bg-white rounded-[2rem] p-6 border border-[#F4F7FF] shadow-sm hover:shadow-xl transition-all group flex flex-col justify-between">
                <div>
                   <div className="flex items-start justify-between mb-4">
                      <div className="px-3 py-1 rounded-full text-[10px] font-black uppercase" style={{ color: STATUS_CFG[task.status]?.color, backgroundColor: STATUS_CFG[task.status]?.bg }}>
                         {STATUS_CFG[task.status]?.label}
                      </div>
                      <div className="text-[10px] font-black text-[#9CA3AF] uppercase">Ticket: #{task.jobId.slice(0,4)}</div>
                   </div>
                   <h3 className="font-black text-[#1A1A2E] text-lg mb-1 group-hover:text-[#17409A] transition-colors">{task.productName}</h3>
                   <p className="text-[#9CA3AF] text-[10px] font-bold mb-4 uppercase">Người làm: {task.technicianName || "N/A"}</p>
                   
                   {task.hasSmartChip && (
                      <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-xl mb-4 border border-blue-100">
                        <MdOutlineRemoveRedEye className="text-blue-500" />
                        <span className="text-[10px] font-black text-blue-600 uppercase">Cần test Bluetooth Chip</span>
                      </div>
                   )}
                </div>

                <div className="pt-4 border-t border-[#F4F7FF]">
                   {task.status === 'AWAITING_QC' ? (
                     <button 
                       onClick={() => handleReceive(task.jobId)}
                       className="w-full bg-[#17409A] hover:bg-[#1a3a8a] text-white py-3 rounded-2xl text-xs font-black uppercase transition-all shadow-md flex items-center justify-center gap-2"
                     >
                        Xác nhận nhận hàng
                     </button>
                   ) : (
                     <button 
                        onClick={() => setInspectingJob(task)}
                        className="w-full bg-white border-2 border-[#17409A] text-[#17409A] hover:bg-[#17409A] hover:text-white py-2.5 rounded-2xl text-xs font-black uppercase transition-all flex items-center justify-center gap-2"
                     >
                        Bắt đầu chấm điểm
                     </button>
                   )}
                </div>
            </div>
          ))}
      </div>

      {/* ── Inspection Modal ── */}
      {inspectingJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A1A2E]/60 backdrop-blur-md p-4">
            <div className="bg-white rounded-[2.5rem] w-full max-w-xl overflow-hidden shadow-2xl relative">
                <button onClick={() => setInspectingJob(null)} className="absolute top-6 right-6 text-[#9CA3AF] hover:text-[#1A1A2E]">
                    <MdClose size={24} />
                </button>
                <div className="p-8">
                    <h2 className="text-2xl font-black text-[#1A1A2E] mb-1 italic">Forms Kiểm Định</h2>
                    <p className="text-[#9CA3AF] text-sm mb-6 uppercase font-bold tracking-widest">Sản phẩm: {inspectingJob.productName}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div>
                            <p className="text-[10px] font-black text-[#1A1A2E] uppercase mb-3 text-center">Hình ảnh hoàn thiện từ xưởng</p>
                            <div className="aspect-square bg-[#F4F7FF] rounded-3xl overflow-hidden group relative border-2 border-[#F4F7FF]">
                                {inspectingJob.shellHandoverPhotoUrls ? (
                                    <img 
                                        src={JSON.parse(inspectingJob.shellHandoverPhotoUrls)[0]} 
                                        alt="Handover" 
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-[#9CA3AF] italic text-xs">Không có ảnh</div>
                                )}
                            </div>
                        </div>
                        <div className="space-y-5">
                            <div>
                                <label className="text-[10px] font-black text-[#1A1A2E] uppercase mb-2 block">Điểm chất lượng: {score}/100</label>
                                <input 
                                  type="range" min="0" max="100" 
                                  value={score}
                                  onChange={(e) => setScore(parseInt(e.target.value))}
                                  className="w-full h-2 bg-[#F4F7FF] rounded-full appearance-none cursor-pointer accent-[#17409A]" 
                                />
                                <div className="flex justify-between mt-1 px-1">
                                    <span className="text-[10px] font-bold text-[#9CA3AF]">FAIL</span>
                                    <span className="text-[10px] font-bold text-[#9CA3AF]">EXCELLENT</span>
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-[#1A1A2E] uppercase mb-2 block">Biên bản kiểm định</label>
                                <textarea 
                                  placeholder="Ghi chú về đường may, độ sạch, hoặc lỗi chip..." 
                                  value={notes}
                                  onChange={(e) => setNotes(e.target.value)}
                                  className="w-full h-28 bg-[#F4F7FF] rounded-2xl p-4 text-xs font-bold focus:ring-2 focus:ring-[#17409A] outline-none border-none resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button 
                           onClick={() => handleSubmitInspection(false)}
                           disabled={isSubmitting}
                           className="flex-1 bg-white border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white py-4 rounded-2xl font-black uppercase tracking-widest transition-all"
                        >
                            TRẢ HÀNG LỖI
                        </button>
                        <button 
                           onClick={() => handleSubmitInspection(true)}
                           disabled={isSubmitting}
                           className="flex-1 bg-[#17409A] hover:bg-[#1a3a8a] text-white py-4 rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? "ĐANG XỬ LÝ..." : (
                                <>
                                    <MdCheckCircle className="text-xl" /> DUYỆT & ĐÓNG GÓI
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
