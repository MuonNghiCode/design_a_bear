"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  className?: string;
  align?: "left" | "center" | "right";
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  isLoading?: boolean;
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
}

export default function DataTable<T extends { id: string | number }>({
  data,
  columns,
  isLoading,
  onRowClick,
  emptyMessage = "Không có dữ liệu hiển thị",
}: DataTableProps<T>) {
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (tableRef.current && !isLoading && data.length > 0) {
      gsap.fromTo(
        tableRef.current.querySelectorAll("tbody tr"),
        { y: 10, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.4, 
          stagger: 0.05, 
          ease: "power2.out",
          clearProps: "all"
        }
      );
    }
  }, [isLoading, data]);

  return (
    <div className="bg-white rounded-[32px] overflow-hidden border border-white/50 shadow-sm border-b-8 border-b-[#f4f7ff]">
      <div className="overflow-x-auto" ref={tableRef}>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F4F7FF]/50 border-b border-[#f4f7ff]">
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className={`px-6 py-5 text-[11px] font-black text-[#6B7280] uppercase tracking-wider ${
                    col.align === "center"
                      ? "text-center"
                      : col.align === "right"
                        ? "text-right"
                        : "text-left"
                  } ${col.className || ""}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {columns.map((_, idx) => (
                    <td key={idx} className="px-6 py-6">
                      <div className="h-4 bg-gray-100 rounded-lg w-full" />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length > 0 ? (
              data.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => onRowClick?.(item)}
                  className={`group transition-all ${
                    onRowClick ? "cursor-pointer hover:bg-[#F4F7FF]/30" : ""
                  }`}
                >
                  {columns.map((col, idx) => (
                    <td
                      key={idx}
                      className={`px-6 py-5 ${
                        col.align === "center"
                          ? "text-center"
                          : col.align === "right"
                            ? "text-right"
                            : "text-left"
                      } ${col.className || ""}`}
                    >
                      {typeof col.accessor === "function"
                        ? col.accessor(item)
                        : (item[col.accessor] as React.ReactNode)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-8 py-20 text-center text-gray-400 font-bold uppercase text-sm"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
