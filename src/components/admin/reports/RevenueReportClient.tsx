"use client";

import { useEffect, useState, useMemo } from "react";
import { useAdminReportsApi } from "@/hooks";
import { MdCalendarToday, MdDownload, MdRefresh, MdTableChart, MdShowChart } from "react-icons/md";
import RevenueComparison from "@/components/admin/analytics/RevenueComparison";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

function formatVND(n: number) {
  return n.toLocaleString("vi-VN") + " đ";
}

function exportRevenueCSV(
  data: { date: string; revenue: number }[],
  start: string,
  end: string
) {
  const header = ["Ngày", "Doanh thu (VND)"].join(",");
  const rows = data.map((d) => [d.date, d.revenue].join(","));
  const csv = [header, ...rows].join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `revenue_${start}_${end}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function RevenueReportClient() {
  const { loading, revenueData, fetchRevenueReport, error } =
    useAdminReportsApi();

  const [dateRange, setDateRange] = useState({
    startDate: format(
      new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      "yyyy-MM-dd"
    ),
    endDate: format(new Date(), "yyyy-MM-dd"),
  });

  const handleFetch = () => {
    fetchRevenueReport({
      startDate: new Date(dateRange.startDate + "T00:00:00Z").toISOString(),
      endDate: new Date(dateRange.endDate + "T23:59:59Z").toISOString(),
    });
  };

  useEffect(() => {
    handleFetch();
  }, [dateRange, fetchRevenueReport]);

  const kpiStats = useMemo(
    () => [
      {
        label: "Doanh thu tổng kỳ",
        value: (revenueData?.totalRevenue ?? 0).toLocaleString("vi-VN"),
        unit: "VND",
        accent: "#17409A",
        primary: true,
      },
      {
        label: "Lợi nhuận gộp",
        value: (revenueData?.totalProfit ?? 0).toLocaleString("vi-VN"),
        unit: "VND",
        accent: "#4ECDC4",
      },
      {
        label: "Tổng số đơn hàng",
        value: revenueData?.totalOrders ?? 0,
        unit: "đơn",
        accent: "#7C5CFC",
      },
      {
        label: "Giá trị đơn TB",
        value: revenueData?.totalOrders
          ? Math.round(
              (revenueData?.totalRevenue ?? 0) / revenueData.totalOrders
            ).toLocaleString("vi-VN")
          : "0",
        unit: "VND",
        accent: "#FF8C42",
      },
    ],
    [revenueData]
  );

  const chartData = useMemo(() => {
    if (!revenueData?.dailyBreakdown) return [];
    return revenueData.dailyBreakdown.map((d) => d.revenue);
  }, [revenueData]);

  const chartLabels = useMemo(() => {
    if (!revenueData?.dailyBreakdown) return [];
    return revenueData.dailyBreakdown.map((d) =>
      format(new Date(d.date), "dd/MM")
    );
  }, [revenueData]);

  return (
    <div
      className="flex flex-col gap-8 pb-12"
      style={{ fontFamily: "var(--font-nunito), Nunito, sans-serif" }}
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-[#1A1A2E] font-black text-3xl tracking-tight">Báo Cáo Doanh Thu</h1>
          <p className="text-[#9CA3AF] text-sm font-bold mt-1">
            Theo dõi dòng tiền và hiệu quả bán hàng chi tiết
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-white px-4 py-3 rounded-2xl shadow-sm border border-[#F0F0F8]">
            <MdCalendarToday className="text-[#9CA3AF] text-sm shrink-0" />
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) =>
                setDateRange((p) => ({ ...p, startDate: e.target.value }))
              }
              className="text-[11px] font-black text-[#1A1A2E] outline-none bg-transparent tracking-widest"
            />
            <span className="text-[#9CA3AF] text-[10px] font-black uppercase">đến</span>
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
            onClick={handleFetch}
            className="p-3 rounded-2xl bg-white border border-[#F0F0F8] text-[#17409A] hover:bg-[#F4F7FF] transition-all shadow-sm"
          >
            <MdRefresh className={`text-xl ${loading ? "animate-spin" : ""}`} />
          </button>

          {revenueData?.dailyBreakdown?.length ? (
            <button
              onClick={() =>
                exportRevenueCSV(
                  revenueData.dailyBreakdown,
                  dateRange.startDate,
                  dateRange.endDate
                )
              }
              className="flex items-center gap-2 bg-[#17409A] text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-[#0E2A66] transition-all shadow-lg shadow-[#17409A]/20"
            >
              <MdDownload className="text-base" />
              Tải báo cáo
            </button>
          ) : null}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-[24px] text-sm font-bold border border-red-100 shadow-sm">
          Lỗi: {error}
        </div>
      )}

      {/* KPI Cards Strip */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 transition-opacity ${loading ? "opacity-50 pointer-events-none" : ""}`}>
        {kpiStats.map((k) => (
          <div
            key={k.label}
            className={`rounded-[32px] px-8 py-6 flex flex-col justify-between min-h-[140px] relative overflow-hidden shadow-sm border border-[#F0F0F8] hover:shadow-xl transition-all ${k.primary ? "bg-[#17409A] text-white" : "bg-white text-[#1A1A2E]"}`}
          >
            {!k.primary && (
              <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: k.accent }} />
            )}
            <p className={`text-[10px] font-black tracking-[0.25em] uppercase ${k.primary ? "text-white/60" : "text-[#9CA3AF]"}`}>
              {k.label}
            </p>
            <div className="mt-4">
              <div className="flex items-baseline gap-1">
                <span className={`font-black tracking-tight ${k.primary ? "text-3xl" : "text-2xl"}`}>
                  {k.value}
                </span>
                <span className={`text-[10px] font-bold ${k.primary ? "text-white/50" : "text-[#9CA3AF]"}`}>
                  {k.unit}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Revenue Chart Section */}
      <div className={`bg-white rounded-[40px] p-10 shadow-sm border border-[#F0F0F8] transition-opacity ${loading ? "opacity-50 pointer-events-none" : ""}`}>
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-2xl bg-[#17409A10] text-[#17409A] flex items-center justify-center">
            <MdShowChart className="text-xl" />
          </div>
          <h3 className="text-[#1A1A2E] font-black text-xl tracking-tight">Biến động doanh thu thực tế</h3>
        </div>
        <div className="h-[380px]">
          <RevenueComparison
            data={chartData}
            labels={chartLabels}
            title=""
            subtitle=""
            thisYearLabel="Doanh thu"
          />
        </div>
      </div>

      {/* Detailed Data Table Section */}
      <div className="bg-white rounded-[40px] p-10 shadow-sm border border-[#F0F0F8]">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#7C5CFC10] text-[#7C5CFC] flex items-center justify-center">
              <MdTableChart className="text-xl" />
            </div>
            <h3 className="text-[#1A1A2E] font-black text-xl tracking-tight">Kê khai chi tiết theo ngày</h3>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#F4F7FF]">
                <th className="text-left py-6 text-[#9CA3AF] text-[10px] font-black uppercase tracking-[0.25em] px-4">
                  Ngày ghi nhận
                </th>
                <th className="text-right py-6 text-[#9CA3AF] text-[10px] font-black uppercase tracking-[0.25em] px-4">
                  Doanh thu thực
                </th>
                <th className="text-right py-6 text-[#9CA3AF] text-[10px] font-black uppercase tracking-[0.25em] px-4">
                  Trạng thái kinh doanh
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F8F9FF]">
              {loading ? (
                <tr>
                  <td colSpan={3} className="py-24 text-center">
                    <div className="w-10 h-10 border-4 border-[#17409A] border-t-transparent rounded-full animate-spin mx-auto" />
                  </td>
                </tr>
              ) : (
                (revenueData?.dailyBreakdown ?? [])
                  .slice()
                  .reverse()
                  .map((item) => (
                    <tr
                      key={item.date}
                      className="group hover:bg-[#F8FAFF] transition-all"
                    >
                      <td className="py-6 px-4 font-bold text-[#1A1A2E] text-sm">
                        {format(new Date(item.date), "EEEE, dd MMMM yyyy", {
                          locale: vi,
                        })}
                      </td>
                      <td className="py-6 px-4 text-right font-black text-[#17409A] text-base">
                        {item.revenue.toLocaleString("vi-VN")} <span className="text-[10px] text-[#9CA3AF] ml-0.5">VND</span>
                      </td>
                      <td className="py-6 px-4 text-right">
                        <span
                          className={`px-4 py-1.5 rounded-full text-[9px] font-black tracking-widest uppercase ${item.revenue > 0 ? "bg-[#4ECDC415] text-[#4ECDC4]" : "bg-[#9CA3AF]15 text-[#9CA3AF]"}`}
                        >
                          {item.revenue > 0 ? "Phát sinh doanh thu" : "Không có đơn"}
                        </span>
                      </td>
                    </tr>
                  ))
              )}
              {!revenueData?.dailyBreakdown?.length && !loading && (
                <tr>
                  <td colSpan={3} className="py-24 text-center text-[#9CA3AF] font-bold italic text-sm">
                    Không tìm thấy bản ghi nào trong khoảng thời gian này
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
