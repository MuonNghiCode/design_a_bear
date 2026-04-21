import AccessoriesGrid from "@/components/admin/accessories/AccessoriesGrid";

export const metadata = {
  title: "Quản lý phụ kiện | Admin Dashboard",
  description: "Trang quản trị phụ kiện gấu bông DesignABear"
};

export default function AccessoriesPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#F4F7FF]">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#17409A]/10 flex items-center justify-center text-[#17409A]">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 11-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 011 1V4z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-black text-[#1A1A2E]">Phụ kiện & Linh kiện</h1>
            <p className="text-sm font-semibold text-[#6B7280]">Quản lý chip AI, bông nhồi và các phụ kiện đi kèm</p>
          </div>
        </div>
      </div>

      <AccessoriesGrid />
    </div>
  );
}
