"use client";

import React from "react";
import { MdPhotoLibrary, MdCloudUpload, MdImage, MdDelete } from "react-icons/md";

interface MediaSectionProps {
  media: any[];
  isUploading: boolean;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, field: string, value: any) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

export const MediaSection = ({ 
  media, 
  isUploading, 
  onUpload, 
  onRemove, 
  onUpdate, 
  inputRef 
}: MediaSectionProps) => {
  return (
    <section className="bg-white rounded-[32px] p-8 shadow-sm border border-white/50 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-[16px] bg-pink-50 flex items-center justify-center text-pink-600">
            <MdPhotoLibrary className="text-2xl" />
          </div>
          <h2 className="text-2xl font-black text-[#1A1A2E]">Ảnh sản phẩm gốc</h2>
        </div>
        <div className="flex gap-3">
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            ref={inputRef}
            onChange={onUpload}
          />
          <button
            type="button"
            disabled={isUploading}
            onClick={() => inputRef.current?.click()}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-pink-50 text-pink-600 text-[11px] font-black uppercase tracking-widest hover:bg-pink-100 transition-all disabled:opacity-50 shadow-sm"
          >
            <MdCloudUpload className="text-xl" /> {isUploading ? "Đang tải..." : "Tải ảnh lên"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {media.map((m, idx) => (
          <div key={idx} className="p-6 bg-[#F4F7FF] rounded-[24px] border border-white relative group overflow-hidden shadow-sm">
            <div className="aspect-video rounded-xl bg-white mb-4 overflow-hidden border border-gray-100 flex items-center justify-center">
              <img src={m.url} alt="" className="w-full h-full object-contain" />
            </div>
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-wider ml-1">Alt Text</label>
                <input
                  value={m.altText}
                  onChange={(e) => onUpdate(idx, "altText", e.target.value)}
                  className="w-full bg-white rounded-lg px-4 py-2 text-xs font-bold outline-none"
                />
              </div>
              <div className="flex gap-3">
                <div className="flex-1 space-y-1">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-wider ml-1">Thứ tự</label>
                  <input
                    type="number"
                    value={m.sortOrder}
                    onChange={(e) => onUpdate(idx, "sortOrder", Number(e.target.value))}
                    className="w-full bg-white rounded-lg px-4 py-2 text-xs font-bold outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => onRemove(idx)}
                  className="self-end p-2.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                >
                  <MdDelete className="text-lg" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {media.length === 0 && (
          <div className="md:col-span-2 text-center py-12 border-2 border-dashed border-[#F4F7FF] rounded-[32px] text-gray-400 font-bold text-base uppercase tracking-widest flex flex-col items-center gap-3">
            <MdImage className="text-4xl opacity-20" />
            Chưa có hình ảnh nào
          </div>
        )}
      </div>
    </section>
  );
};
