"use client";

export function SkeletonTableRow() {
  return (
    <tr className="border-t border-[#F4F7FF] animate-pulse">
      <td className="py-4 px-6">
        <div className="h-4 bg-[#E5E7EB] rounded w-3/4" />
      </td>
      <td className="py-4 px-6">
        <div className="h-4 bg-[#E5E7EB] rounded w-1/2" />
      </td>
      <td className="py-4 px-6">
        <div className="h-4 bg-[#E5E7EB] rounded w-1/4 ml-auto" />
      </td>
    </tr>
  );
}

export function SkeletonTableRowWithLicense() {
  return (
    <tr className="border-t border-[#F4F7FF] animate-pulse">
      <td className="py-4 px-6">
        <div className="h-4 bg-[#E5E7EB] rounded w-3/4" />
      </td>
      <td className="py-4 px-6">
        <div className="h-4 bg-[#E5E7EB] rounded w-1/2" />
      </td>
      <td className="py-4 px-6">
        <div className="h-6 bg-[#E5E7EB] rounded-full w-24" />
      </td>
      <td className="py-4 px-6">
        <div className="h-4 bg-[#E5E7EB] rounded w-1/4 ml-auto" />
      </td>
    </tr>
  );
}

export function SkeletonCategoryTable() {
  return (
    <div className="overflow-x-auto -mx-6">
      <table className="w-full min-w-175">
        <thead>
          <tr>
            <th className="text-left text-[9px] font-black text-[#9CA3AF] tracking-[0.18em] uppercase px-6 pb-3">
              Tên Danh Mục
            </th>
            <th className="text-left text-[9px] font-black text-[#9CA3AF] tracking-[0.18em] uppercase px-6 pb-3">
              Slug
            </th>
            <th className="text-right text-[9px] font-black text-[#9CA3AF] tracking-[0.18em] uppercase px-6 pb-3">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonTableRow key={i} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function SkeletonCharacterTable() {
  return (
    <div className="overflow-x-auto -mx-6">
      <table className="w-full min-w-175">
        <thead>
          <tr>
            <th className="text-left text-[9px] font-black text-[#9CA3AF] tracking-[0.18em] uppercase px-6 pb-3">
              Tên Tính cách
            </th>
            <th className="text-left text-[9px] font-black text-[#9CA3AF] tracking-[0.18em] uppercase px-6 pb-3">
              Slug
            </th>
            <th className="text-left text-[9px] font-black text-[#9CA3AF] tracking-[0.18em] uppercase px-6 pb-3">
              Bản quyền
            </th>
            <th className="text-right text-[9px] font-black text-[#9CA3AF] tracking-[0.18em] uppercase px-6 pb-3">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonTableRowWithLicense key={i} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
