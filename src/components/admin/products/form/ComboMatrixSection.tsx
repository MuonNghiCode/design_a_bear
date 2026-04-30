"use client";

import React, { useRef } from "react";
import { 
  MdGridOn, 
  MdAdd, 
  MdImage, 
  MdCloudUpload, 
  MdAutoAwesome, 
  MdDelete, 
  MdCheckCircle, 
  MdRadioButtonUnchecked,
  MdRefresh
} from "react-icons/md";

interface ComboMatrixSectionProps {
  comboImages: any[];
  selectedAccessories: any[];
  isGeneratingAI: number | null;
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpload: (index: number, file: File) => void;
  onAIGenerate: (index: number) => void;
  onToggleAccessory: (index: number, accId: string) => void;
}

export const ComboMatrixSection = ({
  comboImages,
  selectedAccessories,
  isGeneratingAI,
  onAdd,
  onRemove,
  onUpload,
  onAIGenerate,
  onToggleAccessory
}: ComboMatrixSectionProps) => {
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  return (
    <section className="bg-white rounded-[32px] p-8 shadow-sm border border-white/50 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-[16px] bg-amber-50 flex items-center justify-center text-amber-600">
            <MdGridOn className="text-2xl" />
          </div>
          <div className="space-y-0.5">
            <h2 className="text-2xl font-black text-[#1A1A2E]">Ma trận ảnh Combo</h2>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Dựa trên ảnh gấu gốc & AI Gemini</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onAdd}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-50 text-amber-600 text-[11px] font-black uppercase tracking-widest hover:bg-amber-100 transition-all shadow-sm"
        >
          <MdAdd className="text-xl" /> Thêm tổ hợp
        </button>
      </div>

      <div className="space-y-6">
        {comboImages?.map((c, idx) => {
          const currentAccIds = c.combinationKey ? c.combinationKey.split("|") : [];
          const isAILoading = isGeneratingAI === idx;

          return (
            <div key={idx} className="p-8 bg-[#F4F7FF] rounded-[32px] border border-white shadow-sm space-y-6">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Left: Image Box */}
                <div className="w-full lg:w-48 space-y-3 shrink-0">
                  <div className="aspect-square rounded-2xl bg-white border border-gray-100 overflow-hidden flex items-center justify-center relative group shadow-sm">
                    {c.imageUrl ? (
                      <>
                        {isAILoading && (
                          <div className="absolute inset-0 z-10 bg-white/60 flex flex-col items-center justify-center gap-2">
                            <div className="w-8 h-8 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
                          </div>
                        )}
                        <img 
                          src={c.imageUrl} 
                          alt="Combo"
                          className="w-full h-full object-contain"
                          loading="lazy"
                        />
                      </>
                    ) : (
                      <div className="flex flex-col items-center gap-1.5 text-gray-300">
                        <MdImage className="text-4xl" />
                        <span className="text-[9px] font-black uppercase tracking-widest">Trống</span>
                      </div>
                    )}
                    
                    {/* Overlay Upload Button */}
                    <div 
                      onClick={() => fileInputRefs.current[idx]?.click()}
                      className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-all z-20"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <MdCloudUpload className="text-white text-3xl" />
                        <span className="text-white text-[10px] font-black uppercase tracking-tighter">Tải ảnh lên</span>
                      </div>
                    </div>
                    
                    <input
                      type="file"
                      ref={el => { fileInputRefs.current[idx] = el; }}
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          onUpload(idx, file);
                          e.target.value = ''; // Reset để chọn lại cùng file nếu cần
                        }
                      }}
                    />
                  </div>
                  
                  <button
                    type="button"
                    disabled={isGeneratingAI !== null}
                    onClick={() => onAIGenerate(idx)}
                    className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg ${
                      isAILoading 
                        ? "bg-amber-100 text-amber-600" 
                        : "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:scale-[1.02] active:scale-95"
                    }`}
                  >
                    {isAILoading ? "Đang xử lý..." : <><MdAutoAwesome className="text-lg" /> AI Gen</>}
                  </button>
                </div>

                {/* Right: Controls */}
                <div className="flex-1 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-0.5">
                      <h3 className="text-base font-black text-[#1A1A2E]">Tổ hợp phụ kiện</h3>
                      <p className="text-[10px] font-bold text-gray-400">Tích chọn để định nghĩa ảnh</p>
                    </div>
                    <div className="flex gap-2">
                       <button
                        type="button"
                        onClick={() => onAIGenerate(idx)}
                        className="p-2.5 rounded-lg bg-gray-50 text-gray-400 hover:bg-gray-100 transition-all shadow-sm"
                      >
                        <MdRefresh className="text-xl" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onRemove(idx)}
                        className="p-2.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                      >
                        <MdDelete className="text-xl" />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {selectedAccessories.map(acc => {
                      const isSelected = currentAccIds.includes(acc.accessoryId);
                      return (
                        <button
                          key={acc.accessoryId}
                          type="button"
                          onClick={() => onToggleAccessory(idx, acc.accessoryId)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all shadow-sm ${
                            isSelected 
                              ? "bg-white border-[#17409A] text-[#17409A] shadow-[#17409A]/10" 
                              : "bg-white border-transparent text-gray-400 opacity-60 hover:opacity-100"
                          }`}
                        >
                          {isSelected ? <MdCheckCircle className="text-base" /> : <MdRadioButtonUnchecked className="text-base" />}
                          {acc.name}
                        </button>
                      );
                    })}
                  </div>
                  <div className="pt-3 border-t border-white/50">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Key: {c.combinationKey || "null"}</label>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
