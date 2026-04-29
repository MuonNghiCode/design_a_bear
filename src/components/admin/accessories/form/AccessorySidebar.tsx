"use client";

import { MdSettings, MdVisibility, MdVisibilityOff } from "react-icons/md";

interface SidebarSettingsProps {
  isActive: boolean;
  onToggle: () => void;
}

export function AccessorySidebar({ isActive, onToggle }: SidebarSettingsProps) {
  return (
    <div className="bg-white rounded-[32px] p-8 border border-[#F4F7FF] shadow-sm space-y-8 h-fit">
      <div className="flex items-center gap-3 pb-2 border-b border-[#F4F7FF]">
        <div className="w-10 h-10 rounded-2xl bg-[#7C5CFC]/10 flex items-center justify-center text-[#7C5CFC]">
          <MdSettings className="text-xl" />
        </div>
        <h2 className="text-lg font-black text-[#1A1A2E] font-fredoka uppercase tracking-wider">Thiết lập</h2>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-black text-[#1A1A2E]">Trạng thái</p>
            <p className="text-[10px] font-bold text-gray-400">Hiển thị trên cửa hàng</p>
          </div>
          <button
            type="button"
            onClick={onToggle}
            className={`w-14 h-8 rounded-full transition-all relative ${
              isActive ? "bg-[#10B981]" : "bg-gray-200"
            }`}
          >
            <div
              className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-sm flex items-center justify-center ${
                isActive ? "left-7" : "left-1"
              }`}
            >
              {isActive ? (
                <MdVisibility className="text-[#10B981] text-xs" />
              ) : (
                <MdVisibilityOff className="text-gray-400 text-xs" />
              )}
            </div>
          </button>
        </div>

        <div className="pt-6 border-t border-[#F4F7FF]">
           <div className={`p-4 rounded-2xl border-2 transition-all ${
             isActive ? "bg-emerald-50 border-emerald-100" : "bg-gray-50 border-gray-100"
           }`}>
             <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${
               isActive ? "text-emerald-600" : "text-gray-400"
             }`}>
               Chế độ hiện tại
             </p>
             <p className="text-sm font-bold text-[#1A1A2E]">
               {isActive ? "Đang hoạt động (Public)" : "Bản nháp (Private)"}
             </p>
           </div>
        </div>
      </div>
    </div>
  );
}
