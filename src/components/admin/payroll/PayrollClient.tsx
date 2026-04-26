"use client";

import { useState } from "react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  MdCalendarToday,
  MdDownload,
  MdRefresh,
  MdExpandMore,
  MdWorkHistory,
  MdAttachMoney,
  MdPeople,
  MdAccountCircle,
} from "react-icons/md";
import { usePayrollApi } from "@/hooks";
import type { StaffPayrollEntry } from "@/hooks/usePayrollApi";

// -- Helpers ------------------------------------------------------------------

function formatVND(n: number) {
  return n.toLocaleString("vi-VN") + " đ";
}

function getRoleCfg(roleName: string) {
  const r = (roleName || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  if (r.includes("craftsman"))
    return { label: "Thợ thủ công", color: "#17409A", bg: "#17409A15" };
  if (r.includes("qualitycontrol") || r.includes("qcinspector") || r === "qc")
    return { label: "Kiểm định viên", color: "#7C5CFC", bg: "#7C5CFC15" };
  if (r.includes("staff"))
    return { label: "Nhân viên", color: "#4ECDC4", bg: "#4ECDC415" };
  return { label: roleName || "Nhân viên", color: "#6B7280", bg: "#6B728015" };
}

function exportCSV(entries: StaffPayrollEntry[], start: string, end: string) {
  const header = [
    "Họ tên",
    "Vai trò",
    "Việc hoàn thành",
    "Hoa hồng Craftsman",
    "Hoa hồng QC",
    "Tổng lương",
  ].join(",");
  const rows = entries.map((e) =>
    [
      `"${e.fullName}"`,
      `"${e.roleName}"`,
      e.completedJobs,
      e.craftsmanCommission,
      e.qcCommission,
      e.totalEarned,
    ].join(","),
  );
  const csv = [header, ...rows].join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `payroll_${start}_${end}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// -- Component ----------------------------------------------------------------

export default function PayrollClient() {
  const [dateRange, setDateRange] = useState({
    startDate: format(
      new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      "yyyy-MM-dd",
    ),
    endDate: format(new Date(), "yyyy-MM-dd"),
  });

  const { loading, entries, error, fetchPayroll } = usePayrollApi(
    dateRange.startDate,
    dateRange.endDate,
  );

  const [expanded, setExpanded] = useState<string | null>(null);

  const handleRefetch = () => {
    fetchPayroll(dateRange.startDate, dateRange.endDate);
  };

  const totalPayout = entries.reduce((s, e) => s + e.totalEarned, 0);
  const totalJobs = entries.reduce((s, e) => s + e.completedJobs, 0);

  const kpis = [
    {
      label: "Tổng quỹ lương kỳ này",
      value: formatVND(totalPayout),
      icon: MdAttachMoney,
      accent: "#17409A",
      primary: true,
    },
    {
      label: "Nhân sự tham gia",
      value: `${entries.length} người`,
      icon: MdPeople,
      accent: "#7C5CFC",
    },
    {
      label: "Công việc hoàn tất",
      value: `${totalJobs} việc`,
      icon: MdWorkHistory,
      accent: "#4ECDC4",
    },
  ];

  return (
    <div
      className="flex flex-col gap-8 pb-12"
      style={{ fontFamily: "var(--font-nunito), Nunito, sans-serif" }}
    >
      {/* Page Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-[#1A1A2E] font-black text-3xl tracking-tight">
            Quản Lý Lương & Hoa Hồng
          </h1>
          <p className="text-[#9CA3AF] text-sm font-bold mt-1">
            Hệ thống tính toán thù lao tự động dựa trên hiệu suất công việc
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Date Selector */}
          <div className="flex items-center gap-2 bg-white px-5 py-3 rounded-2xl shadow-sm border border-[#F0F0F8]">
            <MdCalendarToday className="text-[#9CA3AF] text-sm shrink-0" />
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) =>
                setDateRange((p) => ({ ...p, startDate: e.target.value }))
              }
              className="text-[11px] font-black text-[#1A1A2E] outline-none bg-transparent tracking-widest"
            />
            <span className="text-[#9CA3AF] text-[10px] font-black uppercase">
              đến
            </span>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) =>
                setDateRange((p) => ({ ...p, endDate: e.target.value }))
              }
              className="text-[11px] font-black text-[#1A1A2E] outline-none bg-transparent tracking-widest"
            />
          </div>

          <button
            onClick={handleRefetch}
            className="p-3 rounded-2xl bg-white border border-[#F0F0F8] text-[#17409A] hover:bg-[#F4F7FF] transition-all shadow-sm"
          >
            <MdRefresh className={`text-xl ${loading ? "animate-spin" : ""}`} />
          </button>

          {entries.length > 0 && (
            <button
              onClick={() =>
                exportCSV(entries, dateRange.startDate, dateRange.endDate)
              }
              className="flex items-center gap-2 bg-[#17409A] text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-[#0E2A66] transition-all shadow-lg shadow-[#17409A]/20"
            >
              <MdDownload className="text-base" />
              Xuất bảng lương
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-3xl text-sm font-bold border border-red-100 shadow-sm">
          Lỗi: {error}
        </div>
      )}

      {/* Statistics Cards */}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {kpis.map((kpi, i) => {
            const Icon = kpi.icon;
            return (
              <div
                key={kpi.label}
                className={`rounded-4xl p-8 flex items-start gap-6 shadow-sm border border-[#F0F0F8] transition-all hover:shadow-xl ${kpi.primary ? "bg-[#17409A] text-white shadow-lg shadow-[#17409A]/20" : "bg-white text-[#1A1A2E]"}`}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: kpi.primary
                      ? "rgba(255,255,255,0.15)"
                      : kpi.accent + "15",
                  }}
                >
                  <Icon
                    className="text-2xl"
                    style={{ color: kpi.primary ? "#fff" : kpi.accent }}
                  />
                </div>
                <div>
                  <p
                    className={`text-[10px] font-black tracking-[0.25em] uppercase ${kpi.primary ? "text-white/60" : "text-[#9CA3AF]"}`}
                  >
                    {kpi.label}
                  </p>
                  <p className="font-black text-2xl mt-1 leading-none">
                    {kpi.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Staff Detailed List Section */}
      <div className="bg-white rounded-[40px] shadow-sm border border-[#F0F0F8] overflow-hidden">
        <div className="px-10 py-8 border-b border-[#F4F7FF] flex items-center justify-between">
          <h3 className="text-[#1A1A2E] font-black text-xl tracking-tight">
            Danh sách thù lao nhân viên
          </h3>
          <p className="text-[#9CA3AF] text-[10px] font-black tracking-widest uppercase">
            {entries.length} nhân sự ghi nhận
          </p>
        </div>

        {/* Loading / Empty States */}
        {loading ? (
          <div className="py-32 flex flex-col items-center gap-4 text-[#9CA3AF]">
            <div className="w-12 h-12 border-4 border-[#17409A] border-t-transparent rounded-full animate-spin" />
            <p className="font-black text-sm uppercase tracking-widest">
              Đang kết xuất dữ liệu...
            </p>
          </div>
        ) : entries.length === 0 ? (
          <div className="py-32 flex flex-col items-center gap-4 text-[#9CA3AF]">
            <p className="font-black text-sm uppercase tracking-widest italic">
              Không có dữ liệu trong kỳ này
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#F8F9FF]">
            {/* Table Header Row */}
            <div className="hidden md:grid grid-cols-[4rem_1fr_6rem_10rem_10rem_12rem_3rem] items-center gap-4 px-10 py-4 text-[#9CA3AF] text-[10px] font-black tracking-[0.25em] uppercase">
              <span>STT</span>
              <span>Nhân viên</span>
              <span className="text-center">Công việc</span>
              <span className="text-right">Hoa hồng thợ</span>
              <span className="text-right">Hoa hồng QC</span>
              <span className="text-right">Tổng nhận</span>
              <span />
            </div>

            {entries.map((entry, idx) => {
              const roleCfg = getRoleCfg(entry.roleName);
              const isOpen = expanded === entry.userId;

              return (
                <div key={entry.userId}>
                  <button
                    onClick={() => setExpanded(isOpen ? null : entry.userId)}
                    className="w-full grid grid-cols-[3rem_1fr_auto] md:grid-cols-[4rem_1fr_6rem_10rem_10rem_12rem_3rem] items-center gap-4 px-10 py-6 hover:bg-[#F8FAFF] transition-all text-left group"
                  >
                    <span className="text-[#9CA3AF] text-sm font-black tracking-tight">
                      {idx + 1}
                    </span>

                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-12 h-12 rounded-2xl overflow-hidden bg-[#F4F7FF] shrink-0 flex items-center justify-center border-2 border-transparent group-hover:border-[#17409A20] transition-all">
                        {entry.avatarUrl ? (
                          <img
                            src={entry.avatarUrl}
                            alt={entry.fullName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <MdAccountCircle className="text-3xl text-[#9CA3AF]" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[#1A1A2E] font-black text-sm truncate uppercase tracking-tight">
                          {entry.fullName}
                        </p>
                        <span
                          className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[9px] font-black tracking-widest uppercase"
                          style={{
                            color: roleCfg.color,
                            backgroundColor: roleCfg.bg,
                          }}
                        >
                          {roleCfg.label}
                        </span>
                      </div>
                    </div>

                    <div className="hidden md:block text-center">
                      <p className="text-[#17409A] font-black text-xl">
                        {entry.completedJobs}
                      </p>
                    </div>

                    <div className="hidden md:block text-right">
                      <p className="text-[#1A1A2E] font-bold text-sm">
                        {formatVND(entry.craftsmanCommission)}
                      </p>
                    </div>

                    <div className="hidden md:block text-right">
                      <p className="text-[#1A1A2E] font-bold text-sm">
                        {formatVND(entry.qcCommission)}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-[#17409A] font-black text-base">
                        {formatVND(entry.totalEarned)}
                      </p>
                    </div>

                    <div className="flex justify-end">
                      <MdExpandMore
                        className={`text-[#9CA3AF] text-2xl transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                      />
                    </div>
                  </button>

                  {/* Expanded job sub-table */}
                  {isOpen && (
                    <div className="bg-[#F8FAFF] px-10 py-6 border-t border-[#F0F0F8]">
                      {entry.jobs.length === 0 ? (
                        <p className="text-[#9CA3AF] text-sm font-bold italic py-8 text-center">
                          Không có bản ghi công việc chi tiết.
                        </p>
                      ) : (
                        <div className="overflow-x-auto bg-white rounded-3xl border border-[#F0F0F8] p-4 shadow-sm">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="text-[#9CA3AF] text-[9px] font-black uppercase tracking-[0.25em]">
                                <th className="text-left py-3 px-4">
                                  Mã công việc
                                </th>
                                <th className="text-left py-3 px-4 hidden md:table-cell">
                                  Sản phẩm
                                </th>
                                <th className="text-left py-3 px-4 hidden lg:table-cell">
                                  Ngày hoàn tất
                                </th>
                                <th className="text-right py-3 px-4">Thợ</th>
                                <th className="text-right py-3 px-4">QC</th>
                                <th className="text-right py-3 px-4">
                                  Tổng cộng
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[#F8F9FF]">
                              {entry.jobs.map((job) => (
                                <tr
                                  key={job.jobId}
                                  className="hover:bg-[#F8FAFF] transition-colors"
                                >
                                  <td className="py-4 px-4 font-mono text-[11px] text-[#6B7280]">
                                    {job.jobId.slice(0, 12).toUpperCase()}...
                                  </td>
                                  <td className="py-4 px-4 text-[#1A1A2E] font-bold hidden md:table-cell">
                                    {job.productName || "Gấu Bông"}
                                  </td>
                                  <td className="py-4 px-4 text-[#6B7280] text-xs hidden lg:table-cell">
                                    {job.completedAt
                                      ? format(
                                          new Date(job.completedAt),
                                          "dd/MM/yyyy",
                                          { locale: vi },
                                        )
                                      : "—"}
                                  </td>
                                  <td className="py-4 px-4 text-right font-bold text-[#17409A]">
                                    {formatVND(job.craftsmanCommission || 0)}
                                  </td>
                                  <td className="py-4 px-4 text-right font-bold text-[#7C5CFC]">
                                    {formatVND(job.qcCommission || 0)}
                                  </td>
                                  <td className="py-4 px-4 text-right font-black text-[#1A1A2E]">
                                    {formatVND(
                                      (job.craftsmanCommission || 0) +
                                        (job.qcCommission || 0),
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
