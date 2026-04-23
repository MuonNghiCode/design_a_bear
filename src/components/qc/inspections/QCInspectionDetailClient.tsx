"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MdArrowBack, MdCheck, MdClose, MdImage, MdFactCheck } from "react-icons/md";
import { productionJobService } from "@/services";
import { ProductionJob } from "@/types";
import { useToast } from "@/contexts/ToastContext";
import Link from "next/link";

interface Props {
  jobId: string;
}

interface EvidenceImage {
  tag: string;
  url: string;
  createdAt: string;
  uploadedBy: string;
}

export default function QCInspectionDetailClient({ jobId }: Props) {
  const [job, setJob] = useState<ProductionJob | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [score, setScore] = useState<number>(100);
  const [notes, setNotes] = useState("");
  const { success, error } = useToast();
  const router = useRouter();

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await productionJobService.getById(jobId);
        if (response.isSuccess && response.value) {
          setJob(response.value);
        } else {
          error("Không tìm thấy thông tin sản phẩm");
        }
      } catch (err) {
        error("Lỗi tải thông tin chi tiết");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [jobId]);

  const handleSubmit = async (isApproved: boolean) => {
    if (!job) return;
    
    if (!isApproved && !notes.trim()) {
      error("Vui lòng nhập lý do từ chối (Ghi chú)");
      return;
    }

    setSubmitting(true);
    try {
      const response = await productionJobService.submitInspection(jobId, score, notes, isApproved);

      if (response.isSuccess) {
        success(isApproved ? "Đã duyệt thành công!" : "Đã gửi yêu cầu làm lại!");
        router.push("/qc/inspections");
      } else {
        error(response.error?.description || "Xử lý thất bại");
      }
    } catch (err) {
      error("Có lỗi xảy ra");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="w-8 h-8 border-4 border-[#17409A] border-t-transparent rounded-full animate-spin" /></div>;
  }

  if (!job) {
    return <div className="text-center text-slate-500 mt-10">Không tìm thấy thông tin sản phẩm.</div>;
  }

  // Parse evidence images safely
  let evidenceList: EvidenceImage[] = [];
  try {
    if (job.evidenceImages) {
      // Sometimes it comes back as string, sometimes as object array depending on axios config
      evidenceList = typeof job.evidenceImages === 'string' 
        ? JSON.parse(job.evidenceImages) 
        : job.evidenceImages;
    }
  } catch (e) {
    console.error("Failed to parse evidence images", e);
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center gap-4">
        <Link href="/qc/inspections" className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-all shadow-sm">
          <MdArrowBack className="text-xl" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-[#17409A] tracking-tight">Chi tiết kiểm định</h1>
          <p className="text-slate-500 font-medium mt-1">Mã lệnh: {job.jobId.slice(0, 8).toUpperCase()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Col: Info & Evidence */}
        <div className="lg:col-span-2 space-y-8">
          
          <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm flex flex-col md:flex-row gap-8">
            <div className="relative w-40 h-40 bg-slate-50 rounded-[24px] shadow-sm flex-shrink-0 flex items-center justify-center">
              <Image src={job.imageUrl || "/teddy_bear.png"} alt="Product" fill className="object-contain p-4" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-black text-slate-800 mb-4">{job.productName || "Sản phẩm"}</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Thợ thực hiện</p>
                  <p className="text-sm font-black text-slate-700">{job.technicianName || "N/A"}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Loại kích thước</p>
                  <p className="text-sm font-black text-slate-700">{job.sizeTag || "Tiêu chuẩn"}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Mạch thông minh</p>
                  <p className="text-sm font-black text-slate-700">{job.hasSmartChip ? "Có" : "Không"}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Trạng thái</p>
                  <p className="text-sm font-black text-[#17409A]">{job.status}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
              <MdImage className="text-[#17409A]" /> Hình ảnh minh chứng
            </h3>
            
            {evidenceList.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {evidenceList.map((img, i) => (
                  <div key={i} className="group relative aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                    <Image src={img.url} alt={`Evidence ${i}`} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-3 left-3">
                        <span className="text-[9px] font-black bg-[#17409A] text-white px-2 py-0.5 rounded uppercase tracking-widest">
                          {img.tag}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-sm italic p-4 bg-slate-50 rounded-2xl">Không có ảnh minh chứng.</p>
            )}
          </div>
        </div>

        {/* Right Col: Inspection Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm sticky top-24 space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-[#17409A]/10 text-[#17409A] flex items-center justify-center">
                <MdFactCheck className="text-xl" />
              </div>
              <h3 className="text-lg font-black text-slate-800">Đánh giá QC</h3>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Điểm chất lượng (0-100)</label>
              <input 
                type="number"
                min="0"
                max="100"
                value={score}
                onChange={(e) => setScore(Number(e.target.value))}
                className="w-full h-14 px-5 rounded-2xl border-2 border-slate-200 focus:border-[#17409A] focus:ring-4 focus:ring-[#17409A]/10 outline-none transition-all font-black text-slate-700 text-lg"
              />
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Ghi chú / Nhận xét</label>
              <textarea 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Nhập ghi chú cho thợ (nếu có)..."
                className="w-full h-32 px-5 py-4 rounded-2xl border-2 border-slate-200 focus:border-[#17409A] focus:ring-4 focus:ring-[#17409A]/10 outline-none transition-all font-medium text-slate-700 resize-none text-sm"
              />
            </div>

            <div className="pt-4 space-y-3">
              <button 
                onClick={() => handleSubmit(true)}
                disabled={submitting}
                className="w-full h-14 bg-green-500 text-white font-black rounded-2xl shadow-lg shadow-green-500/20 hover:bg-green-600 transition-all uppercase tracking-wider text-sm flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <MdCheck className="text-xl" /> Duyệt Sản Phẩm
              </button>
              
              <button 
                onClick={() => handleSubmit(false)}
                disabled={submitting}
                className="w-full h-14 bg-red-50 text-red-600 border border-red-200 font-black rounded-2xl hover:bg-red-100 hover:border-red-300 transition-all uppercase tracking-wider text-sm flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <MdClose className="text-xl" /> Yêu Cầu Làm Lại
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
