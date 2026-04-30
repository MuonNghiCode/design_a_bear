"use client";

import React from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  isLoading,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPages = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, start + maxVisible - 1);
      
      if (end === totalPages) {
        start = Math.max(1, end - maxVisible + 1);
      }
      
      for (let i = start; i <= end; i++) pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || isLoading}
        className="w-10 h-10 rounded-xl bg-white border border-white/50 shadow-sm flex items-center justify-center text-gray-400 hover:text-[#17409A] hover:bg-[#F4F7FF] transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-90"
      >
        <MdChevronLeft className="text-xl" />
      </button>

      <div className="flex items-center gap-1.5">
        {getPages().map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            disabled={isLoading}
            className={`w-10 h-10 rounded-xl text-[13px] font-black transition-all border ${
              currentPage === p
                ? "bg-[#17409A] text-white border-[#17409A] shadow-md shadow-blue-900/10"
                : "bg-white text-gray-400 border-white/50 shadow-sm hover:bg-gray-50 hover:text-[#17409A]"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || isLoading}
        className="w-10 h-10 rounded-xl bg-white border border-white/50 shadow-sm flex items-center justify-center text-gray-400 hover:text-[#17409A] hover:bg-[#F4F7FF] transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-90"
      >
        <MdChevronRight className="text-xl" />
      </button>
    </div>
  );
}
