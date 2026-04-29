"use client";

import React, { useState, useRef } from "react";
import { MdClose, MdCloudUpload, MdImage, MdSend } from "react-icons/md";
import { useToast } from "@/contexts/ToastContext";
import { mediaService } from "@/services";
import { compressImage } from "@/utils/image";

interface HandoverModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (photoUrls: string[], note: string) => void;
  partType: string;
  productName: string;
}

export default function HandoverModal({
  isOpen,
  onClose,
  onSubmit,
  partType,
  productName
}: HandoverModalProps) {
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [note, setNote] = useState("");
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const file = files[0];
      const compressed = await compressImage(file);
      const res = await mediaService.uploadMedia(compressed);
      
      if (res.isSuccess) {
        setPhotoUrls(prev => [...prev, res.value.publicUrl]);
        toast.success("Tải ảnh lên thành công!");
      } else {
        toast.error("Tải ảnh thất bại");
      }
    } catch (err) {
      toast.error("Lỗi khi tải ảnh");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removePhoto = (index: number) => {
    setPhotoUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (photoUrls.length === 0) {
      toast.error("Vui lòng cung cấp ít nhất 1 ảnh bằng chứng");
      return;
    }
    setIsSubmitting(true);
    try {
      await onSubmit(photoUrls, note);
      onClose();
    } catch (err) {
      // Error handled by parent
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6 bg-[#1A1A2E]/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-[#17409A]">Bàn giao công việc</h2>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">
              Phần: <span className="text-[#17409A]">{partType}</span> - {productName}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="w-12 h-12 rounded-2xl hover:bg-slate-50 flex items-center justify-center text-slate-300 hover:text-slate-600 transition-all"
          >
            <MdClose className="text-2xl" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
          {/* Note */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Ghi chú bàn giao</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Nhập thông tin chi tiết về việc bàn giao..."
              className="w-full bg-slate-50 rounded-[24px] px-6 py-4 min-h-[120px] outline-none border-2 border-transparent focus:border-[#17409A]/20 transition-all text-slate-700 font-medium placeholder:text-slate-300 shadow-inner"
            />
          </div>

          {/* Photos */}
          <div className="space-y-4">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Ảnh bằng chứng ({photoUrls.length})</label>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {photoUrls.map((url, idx) => (
                <div key={idx} className="group relative aspect-square rounded-[24px] bg-slate-50 border border-slate-100 overflow-hidden">
                  <img src={url} className="w-full h-full object-cover" />
                  <button
                    onClick={() => removePhoto(idx)}
                    className="absolute top-2 right-2 w-8 h-8 rounded-xl bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform scale-90 group-hover:scale-100"
                  >
                    <MdClose />
                  </button>
                </div>
              ))}
              
              <button
                disabled={isUploading}
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square rounded-[24px] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 text-slate-300 hover:border-[#17409A]/30 hover:text-[#17409A] transition-all bg-slate-50/50"
              >
                {isUploading ? (
                  <div className="w-8 h-8 border-3 border-[#17409A]/20 border-t-[#17409A] rounded-full animate-spin" />
                ) : (
                  <>
                    <MdCloudUpload className="text-3xl" />
                    <span className="text-[10px] font-black uppercase tracking-wider">Tải ảnh lên</span>
                  </>
                )}
              </button>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleUpload} 
              className="hidden" 
              accept="image/*" 
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 bg-slate-50/50 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-all"
          >
            Hủy bỏ
          </button>
          <button
            disabled={isSubmitting || isUploading || photoUrls.length === 0}
            onClick={handleSubmit}
            className="px-10 py-4 rounded-2xl bg-[#17409A] text-white font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-[#17409A]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-3 disabled:opacity-50 disabled:hover:scale-100"
          >
            {isSubmitting ? "Đang gửi..." : "Hoàn tất bàn giao"}
            <MdSend />
          </button>
        </div>
      </div>
    </div>
  );
}
