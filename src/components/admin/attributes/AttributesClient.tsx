"use client";

import { useState, useRef } from "react";
import CategoryTable, { type CategoryTableRef } from "./CategoryTable";
import CharacterTable, { type CharacterTableRef } from "./CharacterTable";
import { MdAdd } from "react-icons/md";

type TabToken = "categories" | "characters";

export default function AttributesClient() {
  const [activeTab, setActiveTab] = useState<TabToken>("categories");
  const categoryRef = useRef<CategoryTableRef>(null);
  const characterRef = useRef<CharacterTableRef>(null);

  const handleOpenCreate = () => {
    if (activeTab === "categories") {
      categoryRef.current?.handleOpenCreate();
    } else {
      characterRef.current?.handleOpenCreate();
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#F4F7FF]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div>
          <p className="text-[#9CA3AF] text-[10px] font-black tracking-[0.22em] uppercase mb-0.5">
            Danh sách
          </p>
          <p className="text-[#1A1A2E] font-black text-xl">
            Thuộc tính sản phẩm
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-1.5 bg-[#17409A] text-white text-xs font-black px-4 py-2.5 rounded-xl hover:bg-[#0f2d70] transition-colors whitespace-nowrap shadow-sm"
          >
            <MdAdd className="text-base" />
            Tạo mới
          </button>
        </div>
      </div>

      <div className="flex gap-1 mb-5 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab("categories")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all duration-150 ${
            activeTab === "categories"
              ? "bg-[#17409A] text-white shadow-sm"
              : "bg-[#F4F7FF] text-[#9CA3AF] hover:bg-[#E8EEFF] hover:text-[#17409A]"
          }`}
        >
          Danh mục
        </button>
        <button
          onClick={() => setActiveTab("characters")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all duration-150 ${
            activeTab === "characters"
              ? "bg-[#17409A] text-white shadow-sm"
              : "bg-[#F4F7FF] text-[#9CA3AF] hover:bg-[#E8EEFF] hover:text-[#17409A]"
          }`}
        >
          Tính cách
        </button>
      </div>

      <div className="mt-2">
        {activeTab === "categories" && <CategoryTable ref={categoryRef} />}
        {activeTab === "characters" && <CharacterTable ref={characterRef} />}
      </div>
    </div>
  );
}
