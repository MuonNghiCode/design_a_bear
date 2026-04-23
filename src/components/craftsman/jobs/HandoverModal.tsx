"use client";

import { useState, useRef } from "react";
import { MdClose, MdCloudUpload, MdDelete, MdInfoOutline } from "react-icons/md";
import { GiHammerBreak } from "react-icons/gi";
import { mediaService } from "@/services/media.service";
import Image from "next/image";

interface HandoverModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (photoUrls: string[], note: string) => Promise<void>;
  partType: string;
  productName: string;
}

export default function HandoverModal({
  isOpen,
  onClose,
  onSubmit,
  partType,
  productName,
}: HandoverModalProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
      
      const newPreviews = newFiles.map((f) => URL.createObjectURL(f));
      setPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async () => {
    if (files.length === 0) {
      alert("Vui lòng tải lên ít nhất một ảnh minh chứng!");
      return;
    }

    setLoading(true);
    try {
      // 1. Upload images
      const uploadPromises = files.map((file) => mediaService.uploadMedia(file, "handover"));
      const uploadResults = await Promise.all(uploadPromises);
      
      const photoUrls = uploadResults
        .filter((r) => r.isSuccess && r.value)
        .map((r) => r.value!.publicUrl);

      if (photoUrls.length === 0) {
        throw new Error("Không thể tải ảnh lên máy chủ");
      }

      // 2. Submit handover
      await onSubmit(photoUrls, note);
      
      // Reset & Close
      setFiles([]);
      setPreviews([]);
      setNote("");
      onClose();
    } catch (error) {
      console.error("Handover failed", error);
      alert("Có lỗi xảy ra khi bàn giao. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-xl rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#17409A] px-8 py-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
              <GiHammerBreak className="text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-black uppercase tracking-wider">Bàn giao sản phẩm</h3>
              <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest leading-none mt-1">
                {partType} — {productName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-2xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
          >
            <MdClose className="text-xl" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 flex-1 overflow-y-auto space-y-6">
          {/* Photo Upload */}
          <div className="space-y-3">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              Ảnh minh chứng <span className="text-red-500">*</span>
            </label>
            
            <div className="grid grid-cols-3 gap-4">
              {previews.map((url, i) => (
                <div key={i} className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 group">
                  <Image src={url} alt="preview" fill className="object-cover" />
                  <button
                    onClick={() => removeFile(i)}
                    className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MdDelete />
                  </button>
                </div>
              ))}
              
              <button
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-[#17409A] hover:text-[#17409A] transition-all bg-slate-50/50 hover:bg-blue-50"
              >
                <MdCloudUpload className="text-3xl" />
                <span className="text-[10px] font-black uppercase">Thêm ảnh</span>
              </button>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple
              accept="image/*"
              className="hidden"
            />
          </div>

          {/* Note */}
          <div className="space-y-3">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">
              Ghi chú thêm
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Nhập thông tin bàn giao, lưu ý về chất lượng..."
              className="w-full h-32 px-5 py-4 rounded-3xl border border-slate-200 focus:border-[#17409A] focus:ring-4 focus:ring-[#17409A]/5 outline-none transition-all resize-none text-sm font-medium"
            />
          </div>

          {/* Info */}
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-blue-50/50 border border-blue-100/50">
            <MdInfoOutline className="text-lg text-blue-500 shrink-0 mt-0.5" />
            <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
              Thông tin bàn giao sẽ được gửi tới bộ phận <b>Kiểm định chất lượng (QC)</b>. 
              Vui lòng chụp ảnh rõ nét các góc cạnh của sản phẩm.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 pt-0 flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-4 rounded-2xl border-2 border-slate-200 text-slate-500 font-black uppercase tracking-widest text-xs hover:bg-slate-50 transition-all"
          >
            Hủy bỏ
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-[2] py-4 rounded-2xl bg-[#17409A] text-white font-black uppercase tracking-widest text-xs hover:bg-[#0E2A66] shadow-xl shadow-blue-900/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Đang xử lý...
              </>
            ) : (
              "Gửi bàn giao"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
